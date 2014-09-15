#!/bin/bash
sed -e "s/touchX/mouseX/g" sketch_touch.js > sketch_mouse.js
sed -i -e "s/touchY/mouseY/g" sketch_mouse.js
sed -i -e "s/touchStarted(/mousePressed(/g" sketch_mouse.js
sed -i -e "s/touchEnded(/mouseReleased(/g" sketch_mouse.js
sed -i -e "s/touchMoved(/mouseDragged(/g" sketch_mouse.js
rm sketch_mouse.js-e