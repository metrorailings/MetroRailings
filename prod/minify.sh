#!/usr/bin/env bash
echo "Beginning minification..."
uglifyjs prod/build.src.js > prod/app.js
echo "Minification done!"