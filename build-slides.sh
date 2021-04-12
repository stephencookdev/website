#!/bin/bash

TALKS=(
    'mario-kart-css-talk'
    'dodge-the-blue-shell-talk'
    'react-router-talk'
    'professor-oaks-babel-plugin-talk'
)

for TALK in "${TALKS[@]}"; do
    rm -rf __sapper__/export/slides/$TALK
    mkdir -p __sapper__/export/slides/$TALK
    cp -R node_modules/@stephencookdev/$TALK/dist/* __sapper__/export/slides/$TALK
done