#!/usr/bin/env bash

section() {
  echo
  echo -e "\033[1;36m▶▶ $1\033[0m"
  echo
}

set -euo pipefail

trap 'echo "Script failed on line $LINENO"; exit 1' ERR

section "Continuing under the assumption that Supabase is already initialized and Docker is running..."

section "Installing dependencies..."
npm install

section "Starting Supabase..."
npx supabase start

section "Extracting credentials..."
NEXT_PUBLIC_SUPABASE_URL=$(npx supabase status | grep "Project URL" | awk '{print $5}')
NEXT_PUBLIC_SUPABASE_ANON_KEY=$(npx supabase status | grep "Publishable" | awk '{print $4}')
if [[ -z "$NEXT_PUBLIC_SUPABASE_URL" || -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]]; then
  echo "Failed to extract Supabase credentials"
  exit 1
fi

section "Creating .env.local file..."
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
EOF

section "Running migrations..."
npx supabase db reset

section "Setup complete!"
echo "Next steps:"
echo "  1. Create a public bucket named 'profiles' that only allows JPEG, PNG, WEBP, or GIF images and only accepts files < 5MB."
echo "  2. Run 'npm run dev' to start the development server."
echo "  3. Visit http://localhost:3000 to see the app in action."
echo "  4. Sign up for a new account to test authentication."