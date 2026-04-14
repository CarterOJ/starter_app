#!/usr/bin/env bash

section() {
  echo
  echo -e "\033[1;36m▶▶ $1\033[0m"
  echo
}

set -euo pipefail

trap 'echo "Script failed on line $LINENO"; exit 1' ERR

section "Continuing under the assumption that prequisites are met..."

section "Installing dependencies..."
npm install

section "Fixing any npm issues..."
if ! npm audit fix; then
  echo "npm audit fix could not fully resolve issues; continuing setup."
fi

section "Adding project ID to supabase config..."
PROJECT_ID=$(basename "$(dirname "$(realpath "$0")")")
sed -i "s|^\(project_id = \"\)[^\"]*\(\"\)|\1${PROJECT_ID}\2|" supabase/config.toml
echo "Project ID set to '${PROJECT_ID}' in supabase/config.toml."

section "Starting Supabase..."
npx supabase@latest start

section "Extracting credentials..."
NEXT_PUBLIC_SUPABASE_URL=$(npx supabase@latest status | grep "Project URL" | awk '{print $5}')
NEXT_PUBLIC_SUPABASE_ANON_KEY=$(npx supabase@latest status | grep "Publishable" | awk '{print $4}')
if [[ -z "$NEXT_PUBLIC_SUPABASE_URL" || -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]]; then
  echo "Failed to extract Supabase credentials"
  exit 1
fi

section "Creating .env.local file..."
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
EOF
echo ".env.local file created with Supabase credentials."

section "Running migrations..."
npx supabase@latest db reset

section "Setup complete!"
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the development server."
echo "  2. Visit http://localhost:3000 to see the app in action."
echo