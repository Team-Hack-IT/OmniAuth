#!/usr/bin/env bash

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ]; then
  exit 0
fi

if [ -f ".husky/_/history" ]; then
  lastHash=$(cat ./.husky/_/history)
  isUpdated=$(git diff $lastHash HEAD -- ./package.json)
  if [ "$isUpdated" != "" ]; then
    echo "\n 'package.json' has changed. Please run 'npm install'! "
  fi
else
  npm install
fi