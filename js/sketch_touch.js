var page_len = 17;
var speed_rate = 0.0;
var page_num = 0;
var tap_start_x;
var tap_start_y;
var page = [];
var file = [];
var data = [];
var img_origin_w = 700;
var img_origin_h = 1020;
var img_w = 0.0;
var resize_rate = 0.0;
var img_h = 0.0;
//var koma_click_num = 0;
//var button_size = 0.0;
var button;
//var userAgent = window.navigator.userAgent.toLowerCase();

function preload() {
	file = loadStrings("./csv/koma_info.csv");
}

function setup() {
	var i, j;
	var tmp = [];

	if(is_iphone5()){
	 	createCanvas(960, 1365);
	}else{
		createCanvas(windowWidth-20, windowHeight);
	}
	button = new Button();
	img_w = width * 3 / 2;
	resize_rate = img_w / img_origin_w;
	img_h = img_origin_h * resize_rate;
	//button_size = width / 7;
	speed_rate = 1/resize_rate;
	frameRate(15);
	textSize(32);
	for (i = 0; i < page_len; i++) {
  	page[i] = new Page("./img/page/page" + i + ".jpg", img_w, img_h, speed_rate);
	}

	for (i = 0; i < file.length; i++) {
		tmp = file[i].split(",");
		data[i] = [];
		for (j = 0; j < tmp.length; j++) {
			data[i][j] = tmp[j];
		}
	}

	for (i = 1; i < file.length; i++) {
		page[parseInt(data[i][0])].koma_add(
				parseInt(data[i][1]),
				Math.floor(parseInt(data[i][2]) * resize_rate), Math.floor(parseInt(data[i][3]) * resize_rate),
				Math.floor(parseInt(data[i][4]) * resize_rate), Math.floor(parseInt(data[i][5]) * resize_rate)
		);
	}
}

function draw() {
	var i, j;
	background(255);
	page[page_num].stop_at_edge();
	page[page_num].display();
	button.display();

	// for testing
	//fill(0);
	//text("W:"+width+", H"+height, 30, 30);
	//text("Speed:"+speed_rate, 30, 60);
	//text("Touch?:"+is_touch_device, 30, 60);
	//text("Page:"+page_num+", Koma:"+koma_click_num, 30, 90);

}

function touchStarted() {
	tap_start_x = touchX;
	tap_start_y = touchY;
}

function touchMoved() {
	page[page_num].move(touchX, touchY, tap_start_x, tap_start_y);
}

function touchEnded() {
	if(is_tap()){
	  if (button.is_left_tapped(touchX, touchY)) {
	    if (page_num !== page_len - 1) {
	      page_num++;
	      page[page_num].init();
	    }
	  // Right Button
	  } else if (button.is_right_tapped(touchX, touchY)) {
	    if (page_num !== 0) {
	      page_num--;
	      page[page_num].init();
	    }
	  } else {
	    page[page_num].clicked_koma_num(touchX, touchY);
	  }
	}

}

function is_tap(){
  return (tap_start_x == touchX && tap_start_y == touchY);
}

function is_iphone5(){
 return displayHeight===568;
}
