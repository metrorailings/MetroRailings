#!/usr/bin/env bash
echo "Beginning minification..."
uglifyjs prod/build.src.js > prod/build.min.js
echo "Minification done!"