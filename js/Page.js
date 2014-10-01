// Page Class
function Page(img_name, imageWidth, imageHeight, speedRate) {
this.img = loadImage(img_name);
this.imageWidth = imageWidth;
this.imageHeight = imageHeight;
this.speedRate = speedRate;
this.x = width - imageWidth;
this.y = 0;
this.komaArray = [];
}

// ページを表示する
Page.prototype.display = function() {
  image(this.img, this.x, this.y, this.imageWidth, this.imageHeight);
};

// スワイプに合わせてページを動かす
Page.prototype.move = function(currentX, currentY, tap_start_x, tap_start_y) {
  this.x += (currentX - tap_start_x) * this.speedRate;
  this.y += (currentY - tap_start_y) * this.speedRate;
};

// ページにコマを追加する
Page.prototype.addKoma = function(komaNum, komaX, komaY, komaWidth, komaHeight) {
  this.komaArray.push(new Koma(komaNum, komaX, komaY, komaWidth, komaHeight));
};

// ページの初期設定を行う
Page.prototype.init = function() {
  this.x = width - this.imageWidth;
  this.y = 0;
};

// ページ端まで移動したらそれ以上行かないように止める
Page.prototype.stopAtEdge = function() {
  if (this.x > 0) {
    this.x = 0;
  }
  if (this.x < width - this.imageWidth) {
    this.x = width - this.imageWidth;
  }
  if (this.y > 0) {
    this.y = 0;
  }
  if (this.y < height - this.imageHeight) {
    this.y = height - this.imageHeight;
  }
};

// ページ内のコマの最初と最後のコマ番号を返す
Page.prototype.getKomaNumFirstLast = function() {
  return {
    'first': this.komaArray[0].komaNum,
    'last': this.komaArray[this.komaArray.length - 1].komaNum
  };
};


Page.prototype.getKomaPosition = function(num) {
  console.log(this.komaArray[num]);
  console.log(num);
  return {
    'posX': this.komaArray[num].x,
    'posY': this.komaArray[num].y,
  };
  console.log();
};

Page.prototype.clickedKomaNum = function(currentX, currentY) {
    var i;
    for (i = 0; i < this.komaArray.length; i++) {
      if (currentX - this.x > this.komaArray[i].x && currentX - this.x < this.komaArray[i].x + this.komaArray[i].w && currentY - this.y > this.komaArray[i].y && currentY - this.y < this.komaArray[i].y + this.komaArray[i].h) {
        console.log("komaNum: " + this.komaArray[i].komaNum + " is clicked!");
        //koma_click_num = this.komaArray[i].komaNum;
      }
    }
};

