/**
 * コマに表示するアイコンオブジェクト
 * @param {string} category 表示するアイコンの種類
 * @param {string} imageName  画像の名前
 * @param {string} des      説明文
 */
function Icon(category, imageName, des) {
    this.x = 0;
    this.y = 0;
    this.w = width/10;
    this.h = this.w;
    this.tooltip_w = 1000;
    this.tooltip_h = 250;
    this.img = loadImage('./img/icon/' + category + '.png');
    this.info = loadImage('./img/' + category + '/' + imageName + '.jpg');
    this.des = des;
    this.touchFlag = false;
}

/**
 * アイコン位置を指定するための関数
 * @param {number} x アイコンのX座標
 * @param {number} y アイコンのY座標
 */
Icon.prototype.setPosition = function(x, y) {
  this.x = x;
  this.y = y;
};

/**
 * アイコンを表示するための関数
 * @param  {[type]} posX [description]
 * @param  {[type]} posY [description]
 */
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

/**
 * タッチ判定関数
 * @param  {number}  current_x タッチしたX座標
 * @param  {number}  current_y タッチしたX座標
 * @param  {[type]}  posX      [description]
 * @param  {[type]}  posY      [description]
 * @return {Boolean}           タッチ判定
 */
Icon.prototype.isTouch = function(current_x, current_y, posX, posY) {
    return (current_x > this.x && current_x < this.x + this.w + posX && current_y > this.y + posY && current_y < this.y + this.h + posY);
};

/**
 * ツールチップの表示／非表示を管理するフラグ関数
 */
Icon.prototype.setTouchFlag = function() {
    this.touchFlag = !this.touchFlag;
};