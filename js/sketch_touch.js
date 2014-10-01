var pageLength = 17;
var speedRate = 0.0;
var pageNum = 0;
var startedTapX;
var startedTapY;
var page = [];
var file = [];
var data = [];
var imageOriginWidth = 700;
var imageOriginHeight = 1020;
var imageWidth = 0.0;
var resizeRate = 0.0;
var imageHeight = 0.0;
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
    imageWidth = width * 3 / 2;
    resizeRate = imageWidth / imageOriginWidth;
    imageHeight = imageOriginHeight * resizeRate;
    //button_size = width / 7;
    speedRate = 1 / resizeRate;
    frameRate(15);
    textSize(32);
    for (i = 0; i < pageLength; i++) {
        page[i] = new Page("./img/page/page" + i + ".jpg", imageWidth, imageHeight, speedRate);
    }

    for (i = 0; i < file.length; i++) {
        tmp = file[i].split(",");
        data[i] = [];
        for (j = 0; j < tmp.length; j++) {
            data[i][j] = tmp[j];
        }
    }

    for (i = 1; i < file.length; i++) {
        page[parseInt(data[i][0])].addKoma(
            parseInt(data[i][1]),
            Math.floor(parseInt(data[i][2]) * resizeRate), Math.floor(parseInt(data[i][3]) * resizeRate),
            Math.floor(parseInt(data[i][4]) * resizeRate), Math.floor(parseInt(data[i][5]) * resizeRate)
        );
    }
}

function draw() {
    var i, j;
    background(255);
    page[pageNum].stopAtEdge();
    page[pageNum].display();
    button.display();

    if (infoFlag) { /* infoボタンを押したかどうか */
        for (var i = 0; i < icons.length; i++) {
            icons[i].display(page[pageNum].x, page[pageNum].y);
            if (icons[i].isTouch(touchX, touchY)) {
                icons[i].setTouchFlag();
            }
        }
    }

    // for testing
    //fill(0);
    //text("W:"+width+", H"+height, 30, 30);
    //text("Speed:"+speedRate, 30, 60);
    //text("Touch?:"+is_touch_device, 30, 60);
    //text("Page:"+pageNum+", Koma:"+koma_click_num, 30, 90);

}

function touchStarted() {
    startedTapX = touchX;
    startedTapY = touchY;
}

function touchMoved() {
    page[pageNum].move(touchX, touchY, startedTapX, startedTapY);
}

function touchEnded() {
    if (is_tap()) {
        // Next Button
        if (button.is_next_tapped(touchX, touchY)) {
            if (pageNum !== pageLength - 1) {
                infoFlag = false;
                pageNum++;
                page[pageNum].init();
            }
            // Back Button
        } else if (button.is_back_tapped(touchX, touchY)) {
            if (pageNum !== 0) {
                infoFlag = false;
                pageNum--;
                page[pageNum].init();
            }
        } else if (button.is_info_tapped(touchX, touchY)) {
            if (infoFlag) {
                icons = [];
                infoFlag = false;
            } else {
                sparqlClient.setKomaQuery(page[pageNum].getKomaNumFirstLast()); /* コマ情報を取得するSPARQLクエリを生成 */
                /* リクエスト送信 */
                sparqlClient.request(function(req) {
                    var tmp = req.getJson();
                    var komaObjects = tmp.results.bindings;
                    console.log(komaObjects);

                    var foods = []; //食べ物を配列として保存
                    var foodsKoma = [];
                    // var places = [];
                    // var placesKoma = [];
                    /* 各コマに対してマッピング */
                    for (var i = 0; i < komaObjects.length; i++) {
                        if (typeof komaObjects[i]['food'] !== "undefined") { /* 食べ物の情報が存在していれば… */
                            foods.push(komaObjects[i]['food'].value);
                            for (var j = 0; j < page[pageNum].komaArray.length; j++) {
                                if (komaObjects[i]['koma'].value == page[pageNum].komaArray[j].komaNum) {
                                    foodsKoma.push(j);
                                }
                            }
                        }
                        /* 未実装 */
                        // if (typeof komaObjects[i]['place'] !== "undefined") {
                        //     places.push(komaObjects[i]['place'].value);
                        //     places.push(komaObjects[i]['koma'].value);
                        // }
                        komaObjects[i]['koma'].value;
                    }

                    /* 食べ物が一つでも存在すれば，その食べ物に関する情報を取得する */
                    if (foods.length !== 0) {
                        sparqlClient.setFoodQuery(foods);
                        sparqlClient.request(function(req) {
                            var tmp = req.getJson();
                            var foodObjects = tmp.results.bindings;
                            console.log(foodObjects);
                            /* アイコンを作成してコマ上にマッピング */
                            for (var i = 0; i < foodObjects.length; i++) {
                                var icon = new Icon('food', foodObjects[i]['label'].value, foodObjects[i]['des'].value);
                                var position = page[pageNum].getKomaPosition(foodsKoma[i]);
                                icon.setPosition(position['posX'], position['posY']);
                                icons.push(icon);
                            }

                            infoFlag = !infoFlag;
                        });
                    }
                    /* 未実装 */
                    // if (places.length !== 0) {
                    //     sparqlClient.setFoodQuery(places);
                    //     sparqlClient.request(function(req) {
                    //         var tmp = req.getJson();
                    //         console.log(tmp);
                    //     });
                    // }
                });
            }
        } else {
            page[pageNum].clickedKomaNum(touchX, touchY);
        }
    }
}

function is_tap() {
    return (startedTapX == touchX && startedTapY == touchY);
}

function is_iphone5() {
    return displayHeight === 568;
}
