#! /usr/bin/env bash

set -e

mkdir -p trace

pnpm i
tsc -b --clean
tsc -b

function run {
  echo Bundling $1
  TEST_NAME=$1 pnpm webpack 2>&1 >/dev/null &
  pnpm esbuild src/$1.ts --tree-shaking=true --bundle --outfile=results/$1.esbuild.min.js --format=esm --platform=node --target=es2022 --minify 2>&1 >/dev/null &
  pnpm esbuild src/$1.ts --tree-shaking=true --bundle --outfile=results/$1.esbuild.js --format=esm --platform=node --target=es2022 2>&1 >/dev/null &
  pnpm tsc ./src/$1.ts --generateTrace trace/$1 --skipLibCheck --noEmit --module NodeNExt --target ESNext --esModuleInterop --moduleResolution NodeNext
}

for file in src/*.ts; do 
  name=$(basename "$file" .ts)
  # if name is speed.ts
  if [[ $name == "speed" ]]; then
    continue
  fi
  run $name
done

wait

ls -lth results | awk '{print "- " $9 " " $5}' | grep -v '^-  $'  | sort > results.md
