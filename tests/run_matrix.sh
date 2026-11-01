#!/usr/bin/env bash
# Run the test-suite against every supported Anki release in throw-away
# environments. Pass extra pytest arguments after the script name.
set -euo pipefail
cd "$(dirname "$0")/.."
VERSIONS=(${ANKI_VERSIONS:-25.9.5 26.9.3})
status=0
for v in "${VERSIONS[@]}"; do
    echo "=== Anki $v"
    if ! uv run --no-project --python 3.13 --with "anki==$v" --with "aqt[qt]==$v" --with "pytest>=8" \
        python -m pytest "$@"; then
        status=1
    fi
done
exit $status
