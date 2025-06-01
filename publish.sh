set -euo pipefail

pnpm build
pnpm publish --access=public --no-git-checks

echo "Done!"