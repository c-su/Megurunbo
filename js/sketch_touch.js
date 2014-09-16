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
var sparqlClient = new SPARQLClient();
var icons = [];
var infoFlag = false;

function preload() {
    file = loadStrings("./csv/koma_info.csv");
}

function setup() {
    var i, j;
    var tmp = [];

    if (is_iphone5()) {
        createCanvas(960, 1365);
    } else {
        createCanvas(windowWidth - 20, windowHeight);
    }
    button = new Button();
    img_w = width * 3 / 2;
    resize_rate = img_w / img_origin_w;
    img_h = img_origin_h * resize_rate;
    //button_size = width / 7;
    speed_rate = 1 / resize_rate;
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

    if (infoFlag) {
        for (var i = 0; i < icons.length; i++) {
            icons[i].display(page[page_num].x, page[page_num].y);
        }
    }

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
    if (is_tap()) {
        // Next Button
        if (button.is_next_tapped(touchX, touchY)) {
            if (page_num !== page_len - 1) {
                infoFlag = false;
                page_num++;
                page[page_num].init();
            }
            // Back Button
        } else if (button.is_back_tapped(touchX, touchY)) {
            if (page_num !== 0) {
                infoFlag = false;
                page_num--;
                page[page_num].init();
            }
        } else if (button.is_info_tapped(touchX, touchY)) {
            if (infoFlag) {
                icons = [];
                infoFlag = false;
            } else {
                sparqlClient.setKomaQuery(page[page_num].get_koma_num());
                sparqlClient.request(function(re) {
                    var tmp = re.getJson();
                    var komaObjects = tmp.results.bindings;
                    console.log(komaObjects);

                    var foods = [];
                    var foodsKoma = [];
                    var places = [];
                    var placesKoma = [];
                    for (var i = 0; i < komaObjects.length; i++) {
                        if (typeof komaObjects[i]['food'] !== "undefined") {
                            foods.push(komaObjects[i]['food'].value);
                            for (var j = 0; j < page[page_num].komaArray.length; j++) {
                                if (komaObjects[i]['koma'].value == page[page_num].komaArray[j].koma_num) {
                                    foodsKoma.push(j);
                                }
                            }
                        }
                        if (typeof komaObjects[i]['place'] !== "undefined") {
                            places.push(komaObjects[i]['place'].value);
                            places.push(komaObjects[i]['koma'].value);
                        }
                        komaObjects[i]['koma'].value;
                    }


                    if (foods.length !== 0) {
                        sparqlClient.setFoodQuery(foods);
                        sparqlClient.request(function(re) {
                            var tmp = re.getJson();
                            var foodObjects = tmp.results.bindings;
                            console.log(foodObjects);
                            for (var i = 0; i < foodObjects.length; i++) {
                                var icon = new Icon('food', foodObjects[i]['label'].value, foodObjects[i]['des'].value);
                                var position = page[page_num].get_koma_position(foodsKoma[i]);
                                icon.setPosition(position['posX'], position['posY']);
                                icons.push(icon);
                            }

                            infoFlag = !infoFlag;
                        });
                    }
                    if (places.length !== 0) {
                        sparqlClient.setFoodQuery(places);
                        sparqlClient.request(function(re) {
                            var tmp = re.getJson();
                            console.log(tmp);
                        });
                    }
                });
            }
        } else {
            page[page_num].clicked_koma_num(touchX, touchY);
        }

        if (infoFlag) {
            for (var i = 0; i < icons.length; i++) {
                if (icons[i].isTouch) {
                    icons[i].setTouchFlag();
                }
            }
        }
    }

}

function is_tap() {
    return (tap_start_x == touchX && tap_start_y == touchY);
}

function is_iphone5() {
    return displayHeight === 568;
}
