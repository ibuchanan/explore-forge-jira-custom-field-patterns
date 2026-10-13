#!/usr/bin/env bash
set -euo pipefail

# Only configured uppercase keys in the default profile become Forge variables.
config="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/secretspec.toml"
while IFS= read -r name; do
  [[ "$name" == FORGE* ]] && continue
  if ! value="$(printenv "$name")"; then
    printf 'Missing configured variable: %s\n' "$name" >&2
    exit 1
  fi
  set --
  [[ "$name" == *SECRET* ]] && set -- --encrypt
  if ! forge variables set --environment "$FORGE_ENVIRONMENT" "$@" "$name" "$value" >/dev/null 2>&1; then
    printf 'Failed to push variable: %s\n' "$name" >&2
    exit 1
  fi
done < <(awk '
  /^\[profiles\.default\][[:space:]]*$/ { section=1; next }
  /^\[/ { section=0 }
  section && /^[A-Z][A-Z0-9_]*[[:space:]]*=/ {
    key=$0; sub(/[[:space:]]*=.*/, "", key); print key
  }
' "$config")
