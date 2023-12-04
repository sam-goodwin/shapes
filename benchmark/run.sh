#! /usr/bin/env bash

set -e

cd benchmark
pnpm i
tsc -b --clean
tsc -b

function run {
  echo Bundling $1
  TEST_NAME=$1 pnpm webpack 2>&1 >/dev/null &
  pnpm esbuild src/$1.ts --tree-shaking=true --bundle --outfile=results/$1.esbuild.js --format=esm --platform=node --target=es2022 --minify 2>&1 >/dev/null &
}

for file in src/*.ts; do 
  run $(basename "$file" .ts)
done

wait

ls -lth results | awk '{print $9 " " $5}' | sort