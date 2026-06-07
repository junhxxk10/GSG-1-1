#!/usr/bin/env python3
"""Inline CSS and JS into index.html to produce a single standalone StudyMap.html."""
import os, re

BUILD = "build"
html_path = os.path.join(BUILD, "index.html")

with open(html_path, encoding="utf-8") as f:
    html = f.read()

# Inline CSS — replace <link href="./static/...css"> with <style>...</style>
def inline_css(m):
    href = m.group(1)
    path = os.path.join(BUILD, href.lstrip("./"))
    with open(path, encoding="utf-8") as f:
        css = f.read()
    return f"<style>{css}</style>"

html = re.sub(r'<link[^>]+href="(\./static/[^"]+\.css)"[^>]*/?>', inline_css, html)

# Remove the <script src="..."> tags from wherever they are in <head>
# (they had defer, so we'll re-add them before </body> instead)
js_blocks = []
def extract_js(m):
    src = m.group(1)
    path = os.path.join(BUILD, src.lstrip("./"))
    with open(path, encoding="utf-8") as f:
        js = f.read()
    js_blocks.append(f"<script>{js}</script>")
    return ""  # remove from original position

html = re.sub(r'<script[^>]+src="(\./static/[^"]+\.js)"[^>]*></script>', extract_js, html)

# Insert all JS blocks just before </body>
if js_blocks:
    html = html.replace("</body>", "\n".join(js_blocks) + "</body>")

out = "StudyMap.html"
with open(out, "w", encoding="utf-8") as f:
    f.write(html)

size_kb = os.path.getsize(out) / 1024
print(f"Created {out}  ({size_kb:.0f} KB)")

# Verify
has_style = "<style>" in html
has_script = "<script>" in html
has_static = "./static/" in html
print(f"CSS inlined: {has_style}, JS inlined: {has_script}, stray refs: {has_static}")
