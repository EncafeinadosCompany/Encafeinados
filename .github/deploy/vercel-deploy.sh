if [ "$VERCEL_GIT_BRANCH" = "main" ] || [ "$VERCEL_GIT_BRANCH" = "QA" ]; then
  echo "✅ Build allowed for $VERCEL_GIT_BRANCH"
  exit 1 
fi

echo "🚫 Ignoring build for branch $VERCEL_GIT_BRANCH"
exit 0  