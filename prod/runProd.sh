#!/usr/bin/env bash
node prod/buildScript.js
sh prod/buildScript.sh
sh prod/minify.sh
sh prod/changeConfig.sh
node app.js