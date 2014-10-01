function Icon(category, recipe, des) {
    this.x = 0;
    this.y = 0;
    this.w = width/10;
    this.h = this.w;
    this.tooltip_w = 1000;
    this.tooltip_h = 250;
    this.img = loadImage('./img/icon/' + category + '.png');
    this.info = loadImage('./img/' + category + '/' + recipe + '.jpg');
    this.des = des;
    this.touchFlag = false;
}

Icon.prototype.setPosition = function(x, y) {
  this.x = x;
  this.y = y;
};

Icon.prototype.display = function(posX, posY) {
    image(this.img, this.x + posX, this.y + posY, this.w, this.h);

    if (this.touchFlag) {
        fill(255);
        stroke(0);
        rectMode(CENTER);
        //rect(width / 2, height / 3, this.tooltip_w, this.tooltip_h);
        push();
        imageMode(CENTER);
        image(this.info, width / 2, height / 2);
        pop();
    }
};

Icon.prototype.isTouch = function(current_x, current_y, posX, posY) {
    return (current_x > this.x && current_x < this.x + this.w + posX && current_y > this.y + posY && current_y < this.y + this.h + posY);
};

Icon.prototype.setTouchFlag = function() {
    this.touchFlag = !this.touchFlag;
};