#!/bin/bash
sed -e "s/mouseX/touchX/g" sketch_mouse.js > sketch_touch.js
sed -i -e "s/mouseY/touchY/g" sketch_touch.js
sed -i -e "s/mousePressed(/touchStarted(/g" sketch_touch.js
sed -i -e "s/mouseReleased(/touchEnded(/g" sketch_touch.js
sed -i -e "s/mouseDragged(/touchMoved(/g" sketch_touch.js
rm sketch_touch.js-e