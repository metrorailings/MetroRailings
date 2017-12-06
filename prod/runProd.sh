#!/usr/bin/env bash
sh prod/changeConfig.sh
node prod/buildScript.js
sh prod/buildScript.sh
sh prod/minify.sh