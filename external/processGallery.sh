#!/usr/bin/env bash
mkdir client/images/gallery/desktop
mkdir client/images/gallery/tablet
mkdir client/images/gallery/phone
node external/wipeOutGallery.js
node external/processGallery.js