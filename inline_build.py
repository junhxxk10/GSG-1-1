#!/usr/bin/env python3
"""Inline CSS and JS into index.html to produce a single standalone StudyMap.html."""
import os, re

BUILD = "build"
html_path = os.path.join(BUILD, "index.html")

with open(html_path, encoding="utf-8") as f:
    html = f.read()

# Inline all <link ... .css ...> tags (with or without self-closing />)
def inline_css(m):
    href = m.group(1)
    path = os.path.join(BUILD, href.lstrip("./"))
    with open(path, encoding="utf-8") as f:
        css = f.read()
    return f"<style>{css}</style>"

html = re.sub(r'<link[^>]+href="(\./static/[^"]+\.css)"[^>]*/?>', inline_css, html)

# Inline all <script src="..."> tags
def inline_js(m):
    src = m.group(1)
    path = os.path.join(BUILD, src.lstrip("./"))
    with open(path, encoding="utf-8") as f:
        js = f.read()
    return f"<script>{js}</script>"

html = re.sub(r'<script[^>]+src="(\./static/[^"]+\.js)"[^>]*></script>', inline_js, html)

out = "StudyMap.html"
with open(out, "w", encoding="utf-8") as f:
    f.write(html)

size_kb = os.path.getsize(out) / 1024
print(f"Created {out}  ({size_kb:.0f} KB)")
