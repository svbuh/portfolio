#!/usr/bin/env bash
# build-bliss-mobile.sh — generate the mobile-sized variant of bliss.jpg.
#
# Why: the original assets/bliss.jpg is 4500x3000 / 1.6 MB, which is
# absurd for a fixed-position backdrop on a 400px-wide phone. iOS Safari
# rasterizes it on every URL-bar transition → frames drop → the URL bar
# pops back mid-scroll. The mobile variant (1200x800, ~120 KB) is what
# <picture><source media="(max-width: 900px)"> serves on phones.
#
# Run this whenever you replace assets/bliss.jpg with a new master.
#
# Requires: python3 (uses a throwaway venv with Pillow so no system
# package install is needed).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/bliss.jpg"
DST="$ROOT/assets/bliss-mobile.jpg"
VENV="${TMPDIR:-/tmp}/svanna-imgvenv"

if [[ ! -f "$SRC" ]]; then
  echo "error: $SRC not found" >&2
  exit 1
fi

if [[ ! -d "$VENV" ]]; then
  echo "Setting up throwaway venv at $VENV …"
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --quiet Pillow
fi

"$VENV/bin/python3" - "$SRC" "$DST" <<'PY'
import os, sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
img = Image.open(src)
img.thumbnail((1200, 1200), Image.LANCZOS)
img.save(dst, "JPEG", quality=82, progressive=True, optimize=True)
src_kb = os.path.getsize(src) / 1024
dst_kb = os.path.getsize(dst) / 1024
print(f"src: {Image.open(src).size}  ({src_kb:.0f} KB)")
print(f"out: {Image.open(dst).size}  ({dst_kb:.0f} KB)")
PY

echo "✓ wrote $DST"
