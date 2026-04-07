#!/bin/bash
# Théorea — Complete Setup & Deploy
# Run from inside the theorea-app directory:
#   chmod +x scripts/setup-and-deploy.sh
#   ./scripts/setup-and-deploy.sh

set -e

echo ""
echo "  Théorea — Setup & Deploy"
echo "  ========================"
echo ""

# Step 1: Check for icon
echo "Step 1: App Icon"
if [ ! -f "scripts/icon-source.png" ] && [ ! -f "scripts/icon-source.jpg" ]; then
  echo "  No icon found at scripts/icon-source.png"
  echo ""
  echo "  Please save your icon image first:"
  echo "  1. Right-click the icon in our chat and save it"
  echo "  2. Or: open your Canva design, go to page 5, download as PNG"
  echo "  3. Save as: scripts/icon-source.png"
  echo ""
  read -p "  Press Enter once you've saved the icon (or 's' to skip): " skip_icon
  if [ "$skip_icon" != "s" ] && [ ! -f "scripts/icon-source.png" ] && [ ! -f "scripts/icon-source.jpg" ]; then
    echo "  Still no icon found. Using existing placeholder icons."
  fi
fi

if [ -f "scripts/icon-source.png" ] || [ -f "scripts/icon-source.jpg" ]; then
  echo "  Icon found. Generating all sizes..."
  pip3 install Pillow --quiet 2>/dev/null || pip install Pillow --quiet 2>/dev/null
  python3 scripts/generate-icons.py || python scripts/generate-icons.py
  echo "  Done."
else
  echo "  Skipping icon generation — using existing placeholders."
fi

# Step 2: Install dependencies
echo ""
echo "Step 2: Installing dependencies..."
npm install
echo "  Done."

# Step 3: Build
echo ""
echo "Step 3: Building the app..."
npm run build
if [ $? -eq 0 ]; then
  echo "  Build successful."
else
  echo "  Build failed. Please fix the errors above and try again."
  exit 1
fi

# Step 4: Deploy to Vercel
echo ""
echo "Step 4: Deploying to Vercel..."
if ! command -v vercel &> /dev/null; then
  echo "  Installing Vercel CLI..."
  npm install -g vercel
fi

echo ""
echo "  About to deploy. When prompted:"
echo "  - Set up and deploy? → Yes"
echo "  - Which scope? → Select your account"
echo "  - Link to existing project? → No"
echo "  - Project name? → theorea-app"
echo "  - Directory? → ./ (press Enter)"
echo "  - Override settings? → No"
echo ""
read -p "  Ready to deploy? (y/n): " deploy_confirm
if [ "$deploy_confirm" = "y" ] || [ "$deploy_confirm" = "Y" ]; then
  # First do a preview deploy to get the URL
  DEPLOY_URL=$(vercel 2>&1 | grep -o 'https://[^ ]*\.vercel\.app' | head -1)

  if [ -n "$DEPLOY_URL" ]; then
    echo ""
    echo "  Preview deployed to: $DEPLOY_URL"
    echo ""
    echo "  Now adding environment variables..."
    vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://lqzwgjcdbcnlojnmfheb.supabase.co" 2>/dev/null || true
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxendnamNkYmNubG9qbm1maGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzYzMTYsImV4cCI6MjA5MDk1MjMxNn0.lZWOuvKoR5sfaqp66MnCUozVoyQeOW8PpqRuQKRrs4U" 2>/dev/null || true

    echo ""
    echo "  Redeploying to production with environment variables..."
    PROD_URL=$(vercel --prod 2>&1 | grep -o 'https://[^ ]*\.vercel\.app' | head -1)
    echo ""
    echo "  Production URL: $PROD_URL"
  else
    echo "  Could not detect deploy URL. Check the output above."
    echo "  You may need to add env vars manually in the Vercel dashboard."
  fi
else
  echo "  Skipping deployment. You can deploy later with: vercel --prod"
fi

echo ""
echo "  ========================"
echo "  Setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Add your Vercel URL to Supabase:"
echo "     Dashboard → Authentication → URL Configuration"
echo "     Add: https://YOUR-URL.vercel.app/auth/callback"
echo ""
echo "  2. Install on your iPhone:"
echo "     Open the URL in Safari → Share → Add to Home Screen"
echo ""
echo "  3. To run locally: npm run dev"
echo ""
