// Koma Class
function Koma(num, x, y, w, h) {
    this.num = num;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.foodName = null;
}

Koma.prototype.setFoodName = function(foodName) {
    this.foodName = foodName;
}


