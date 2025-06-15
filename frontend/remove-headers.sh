#!/bin/bash

# Array of files to process
files=(
  "src/pages/ScanScreen.tsx"
  "src/pages/RequestPickup.tsx"
  "src/pages/BoxDetails.tsx"
  "src/pages/Home.tsx"
  "src/pages/ProfileScreen.tsx"
  "src/pages/Dashboard.tsx"
  "src/pages/Login.tsx"
  "src/pages/MyBoxes.tsx"
  "src/pages/RegisterBox.tsx"
)

# Process each file
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Remove Header import
    sed -i '' -e '/import.*Header.*/d' "$file"
    
    # Remove Header component usage
    sed -i '' -e '/<Header[^>]*>/{N;d;}' "$file"
    
    echo "Processed: $file"
  else
    echo "File not found: $file"
  fi
done

echo "Header cleanup complete!"
