#!/usr/bin/env bash
echo "Beginning minification..."
echo "Minifying scripts..."
uglifyjs prod/build.src.js > prod/app.js
echo "Minifying stylesheets..."
node prod/condenseStylesheets.js
echo "Minification done!"