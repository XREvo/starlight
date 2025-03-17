#! /bin/bash

echo "Installing serve globaly"
npm i -g serve

echo "Building the documentation for port 3001"
if [ -d "dist-3001" ]; then
    rm -rf "dist-3001"
fi
npm run build
mv dist dist-3001

echo "Changing the content of the documentation"
sed -i 's/climate impact/climate exchange/' src/content/docs/environmental-impact.md
sed -i '52i\ \t\t\tpagefind: { indexWeight: 2.0, mergeIndex: [{ bundlePath: "http://localhost:3001/pagefind/", indexWeight: 0.5, }] },' astro.config.mjs


echo "Building the documentation for port 3002"
if [ -d "dist-3002" ]; then
    rm -rf "dist-3002"
fi
npm run build
mv dist dist-3002

echo "Serving the 2 sites"
serve -l 3001 --cors ./dist-3001 &
serve -l 3002 --cors ./dist-3002