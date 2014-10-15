// Page Class
function Page(img_name, imageWidth, imageHeight, speedRate) {
    this.img = loadImage(img_name);
    this.foodIconImage = loadImage("./img/icon/food.png");
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.speedRate = speedRate;
    this.x = width - imageWidth;
    this.y = 0;
    this.komaArray = [];
    this.foodDetailDict = loadJSON("./js/foodDetail.json");
    this.isShowToolTip = false;
    this.foodImageName = "";
    this.foodDescription = "";
    this.foodImage;
}

// ページを表示する
Page.prototype.display = function() {
    image(this.img, this.x, this.y, this.imageWidth, this.imageHeight);
    for (var i=0; i<this.komaArray.length; i++) {
        var koma = this.komaArray[i];
        if (koma.foodName!=null) {
            push();
            tint(255, 200);
            image(this.foodIconImage, this.x+koma.x, this.y+koma.y, width/7, width/7);
            pop();
        }
    }
    this.showHideToolTip();
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

// ページの位置を初期位置にする
Page.prototype.init = function() {
    this.x = width - this.imageWidth;
    this.y = 0;
    this.isShowToolTip = false;
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
/*
// ページ内のコマの最初と最後のコマ番号を返す
Page.prototype.getKomaNumFirstLast = function() {
  return {
    'first': this.komaArray[0].komaNum,
    'last': this.komaArray[this.komaArray.length - 1].komaNum
  };
};*/

/*
Page.prototype.getKomaPosition = function(num) {
  console.log(this.komaArray[num]);
  console.log(num);
  return {
    'posX': this.komaArray[num].x,
    'posY': this.komaArray[num].y,
  };
  console.log();
};*/

Page.prototype.clickedKomaNum = function(currentX, currentY) {
    var i;
    for (i = 0; i < this.komaArray.length; i++) {
        var koma = this.komaArray[i];
        if (currentX - this.x > koma.x && currentX - this.x < koma.x + koma.w && currentY - this.y > koma.y && currentY - this.y < koma.y + koma.h) {
            console.log("komaNum: " + koma.num + " is clicked!");
            
            if (koma.foodName!=null) {
                //console.log(koma.foodName);
                var foodDict = this.foodDetailDict[koma.foodName];
                //console.log(foodDict);
                this.foodImageName = foodDict['image_name'];
                this.foodImage = loadImage("./img/food/"+this.foodImageName+".jpg");
                this.foodDescription = foodDict['description'];
                this.enterExitToolTipMode();
                //console.log(this.foodImageName);
                //console.log(this.foodDescription);
            }
            else {
                this.exitToolTipMode();
            }
        //koma_click_num = this.komaArray[i].komaNum;
      }
    }
};

Page.prototype.showHideToolTip = function() {
    var i;
    if (this.isShowToolTip) {
        push();
        console.log("OK");
        imageMode(CENTER);
        image(this.foodImage, width/2, height/2-width*3/12, width*3/6, width*3/6);
        rectMode(CENTER);
        fill(255);
        rect(width/2, height/2+width*3/24, width*3/6, width*3/12);
        fill(0);
        textSize(16);
        var foldedFoodDescription = "";
        var lineLength = 16;
        for (i=0; i<this.foodDescription.length; i+=lineLength){
            var slicedFoodDescription = "";
            slicedFoodDescription = this.foodDescription.slice(i, i+lineLength);
            foldedFoodDescription += slicedFoodDescription+" ";
        }
        console.log(foldedFoodDescription);
        rectMode(CORNER);
        text(foldedFoodDescription, width/2-width*3/12+20, height/2+18, width/2+width*3/12-70, height);
        pop();
    }
    else {
        
    }
    
};

Page.prototype.exitToolTipMode = function() {
    if (this.isShowToolTip) {
        this.isShowToolTip = false;
    }
}

Page.prototype.enterExitToolTipMode = function() {
    if (!this.isShowToolTip) {
        this.isShowToolTip = true;
    } else {
        this.isShowToolTip = false;
    }
}
