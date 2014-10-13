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
var foodListDict;
//var koma_click_num = 0;
//var button_size = 0.0;
var button;
//var userAgent = window.navigator.userAgent.toLowerCase();
//var infoArray = [];;

function preload() {
    file = loadStrings("./csv/koma_info.csv");
    foodListDict = loadJSON("./js/foodList.json");
}

function setup() {
    var i, j;
    var undefined;
    var tmp = [];

    if (isIphone5()) {
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
    for (i=0; i < pageLength; i++) {
        page[i] = new Page("./img/page/page" + i + ".jpg", imageWidth, imageHeight, speedRate);
    }

    for (i=0; i < file.length; i++) {
        tmp = file[i].split(",");
        data[i] = [];
        for (j = 0; j < tmp.length; j++) {
            data[i][j] = tmp[j];
        }
    }

    for (i=1; i < file.length; i++) {
        page[parseInt(data[i][0])].addKoma(
            parseInt(data[i][1]),
            Math.floor(parseInt(data[i][2]) * resizeRate), Math.floor(parseInt(data[i][3]) * resizeRate),
            Math.floor(parseInt(data[i][4]) * resizeRate), Math.floor(parseInt(data[i][5]) * resizeRate)
        );
    }
    
    for (i=0; i < pageLength; i++) {
        for(j=0; j<page[i].komaArray.length; j++){
            var koma = page[i].komaArray[j];
            if(koma.num+'' in foodListDict){
               koma.setFoodName(foodListDict[koma.num+'']);
                console.log(koma.foodName);
            }
        }
    }
}

function draw() {
    var i, j;
    background(255);
    page[pageNum].stopAtEdge();
    page[pageNum].display();

    button.display();

    // for testing
    //fill(0);
    //text("W:"+width+", H"+height, 30, 30);
    //text("Speed:"+speedRate, 30, 60);
    //text("Touch?:"+is_touch_device, 30, 60);
    //text("Page:"+pageNum+", Koma:"+koma_click_num, 30, 90);

}

function mousePressed() {
    startedTapX = mouseX;
    startedTapY = mouseY;
}

function mouseDragged() {
    page[pageNum].move(mouseX, mouseY, startedTapX, startedTapY);
}

function mouseReleased() {
    if (isTap()) {
        // Next Button
        if (button.is_next_tapped(mouseX, mouseY)) {
            if (pageNum !== pageLength - 1) {
                //infoFlag = false;
                pageNum++;
                page[pageNum].init();
            }
            // Back Button
        } else if (button.is_back_tapped(mouseX, mouseY)) {
            if (pageNum !== 0) {
                //infoFlag = false;
                pageNum--;
                page[pageNum].init();
            }
        } else {
            page[pageNum].clickedKomaNum(mouseX, mouseY);
        }
    }
}

function isTap() {
    return (startedTapX == mouseX && startedTapY == mouseY);
}

function isIphone5() {
    return displayHeight === 568;
}