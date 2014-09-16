// Page Class
function Page(img_name, img_w, img_h, speed_rate) {
this.img = loadImage(img_name);
this.img_w = img_w;
this.img_h = img_h;
this.speed_rate = speed_rate;
this.x = width - img_w;
this.y = 0;
this.komaArray = [];
}


Page.prototype.display = function() {
  image(this.img, this.x, this.y, this.img_w, this.img_h);
};

Page.prototype.move = function(current_x, current_y, tap_start_x, tap_start_y) {
  this.x += (current_x - tap_start_x) * this.speed_rate;
  this.y += (current_y - tap_start_y) * this.speed_rate;
};

Page.prototype.koma_add = function(koma_num, koma_x, koma_y, koma_w, koma_h) {
  this.komaArray.push(new Koma(koma_num, koma_x, koma_y, koma_w, koma_h));
};

Page.prototype.init = function() {
  this.x = width - this.img_w;
  this.y = 0;
};

Page.prototype.stop_at_edge = function() {
  if (this.x > 0) {
    this.x = 0;
  }
  if (this.x < width - this.img_w) {
    this.x = width - this.img_w;
  }
  if (this.y > 0) {
    this.y = 0;
  }
  if (this.y < height - this.img_h) {
    this.y = height - this.img_h;
  }
};

Page.prototype.get_koma_num = function() {
  return {
    'from': this.komaArray[0].koma_num,
    'to': this.komaArray[this.komaArray.length - 1].koma_num
  };
};

Page.prototype.get_koma_position = function(num) {
  console.log(this.komaArray[num]);
  console.log(num);
  return {
    'posX': this.komaArray[num].x,
    'posY': this.komaArray[num].y,
  };
  console.log();
};

Page.prototype.clicked_koma_num = function(current_x, current_y) {
    var i;
    for (i = 0; i < this.komaArray.length; i++) {
      if (current_x - this.x > this.komaArray[i].x && current_x - this.x < this.komaArray[i].x + this.komaArray[i].w && current_y - this.y > this.komaArray[i].y && current_y - this.y < this.komaArray[i].y + this.komaArray[i].h) {
        console.log("koma_num: " + this.komaArray[i].koma_num + " is clicked!");
        //koma_click_num = this.komaArray[i].koma_num;
      }
    }
};

