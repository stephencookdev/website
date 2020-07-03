#!/bin/bash

TALKS=(
    'mario-kart-css-talk'
)

for TALK in "${TALKS[@]}"; do
    rm -rf __sapper__/export/slides/$TALK
    mkdir -p __sapper__/export/slides/$TALK
    cp -R node_modules/@stephencookdev/$TALK/dist/* __sapper__/export/slides/$TALK
done