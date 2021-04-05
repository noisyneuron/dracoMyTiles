# dracoMyTiles
draco compress b3dm

Code from here : https://github.com/CesiumGS/3d-tiles-validator
and here : https://github.com/Avnerus/3d-tiles-validator/tree/downstream/dracofy

there is a bunch of unused code sitting around
---

To install:

1. cd dracoMyTiles
2. npm i
3. npm install -g .

Then use it anywhere:

dracoMyTiles --input DIRECTORY_PATH --quality 50

NOTE: THIS WILL OVERWRITE FILES, SO BE SURE TO RUN THIS ON A COPY OF THE ORIGINAL

Quality should be between 0 and 100 and defaults to 100. If omitted, webp textures will not be decoded.

On windows, use absolute file paths for DIRECTORY_PATH
