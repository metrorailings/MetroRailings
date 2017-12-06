#!/usr/bin/env bash
echo "Beginning minification..."
uglifyjs prod/build.src.js > prod/app.js
node prod/condenseStylesheets.js
echo "Minification done!"