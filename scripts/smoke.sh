#!/usr/bin/env bash
set -euo pipefail

echo "[smoke] Starting server smoke"
pushd server > /dev/null
npm run smoke
popd > /dev/null

echo "[smoke] Starting client smoke"
pushd client > /dev/null
npm test

echo "[smoke] Building client for smoke"
npm run build

if [ -f "dist/index.html" ]; then
	echo "[smoke] Client build artifact present: dist/index.html"
else
	echo "[smoke] Client build artifact missing: dist/index.html"
	exit 2
fi
popd > /dev/null

echo "[smoke] All smoke tests passed"
