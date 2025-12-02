#!/usr/bin/env bash
set -euo pipefail

echo "[smoke] Starting server smoke"
pushd server > /dev/null
npm run smoke
popd > /dev/null

echo "[smoke] Starting client smoke"
pushd client > /dev/null
npm run smoke
popd > /dev/null

echo "[smoke] All smoke tests passed"
