let canvas;
let checkGraphics; //偵測用的圖層
let graphics; //使用者畫黑線的地方
let BearBody; //熊身體的黑邊
let colorCanvas; //上色的圖層
let bg; //放white熊白底的圖層

let bearX = 350;
let bearY = 215;

let clearButton;
let checkButton;
let saveButton;

let doodleClassifier;
let resultsDiv;

let cBtn = [];
var col = {
  r : 0,
  g : 0,
  b : 0
}
var colMode = false;

function preload(){
  white = loadImage('white-01.png');
  Bstroke = loadImage('stroke-01.png');
  loadImage('thin.png');
  loadImage('thick.png');
  loadImage('notice.png');
  loadImage('btn.png');
  loadImage('btn2.png');
  loadImage('go-bear.png');
}

function setup() {
  canvas = createCanvas(1700, 1000);
  canvas.parent('canvasForHTML');
  // background(0);

  //先產出隱藏button
  for(let i=0; i<=8; i++){
    cBtn[i] = createButton('');
    cBtn[i].style('font-size','30px');
    cBtn[i].size(40,40);
    cBtn[i].position(1110+i*50, 580);
    cBtn[i].hide();
  }

  //icon & pic
  var s = 0.17;
  //細
  thinIcon = createImg('thin.png');
  thinIcon.position(1120, 510);
  thinIcon.size(247*s, 164*s);
  //粗
  thickIcon = createImg('thick.png');
  thickIcon.position(1500, 510);
  thickIcon.size(247*s, 164*s);
  //提醒上色字
  noticeBlock = createImg('notice.png');
  noticeBlock.position(1133, 375);
  noticeBlock.size(2427 * s * 0.95, 430 * s * 0.95);
  //重整
  clearButton = createImg('btn.png');
  clearButton.position(1150, 300);
  clearButton.size(927 * s * 0.90, 362 * s * 0.90);
  //偵測
  checkButton = createImg('btn2.png');
  checkButton.position(1310, 300);
  checkButton.size(1360 * s * 0.90, 362 * s * 0.90);
  //存檔
  saveButton = createImg('go-bear.png');
  saveButton.position(1380, 900);
  saveButton.size(1443 * s * 0.90, 615 * s * 0.90);

  //筆畫粗細slider
  penWeight = createSlider(1, 30, 5);
  penWeight.position(1180, 515);
  penWeight.addClass("mySlider");

  //按鈕觸發function
  clearButton.mousePressed(clearCanvas);
  checkButton.mousePressed(checkCanvas);
  saveButton.mousePressed(saveImage);

  //先隱藏物件
  noticeBlock.hide();

  clearButton.hide();
  checkButton.hide();
  saveButton.hide();

  thinIcon.hide();
  thickIcon.hide();
  penWeight.hide();

  
  //熊區塊的底
  bg = createGraphics(400*1.5,500*1.5);
  bg.background(white);
  
  //畫黑線區塊
  graphics = createGraphics(970,600);
  // graphics.background(240,20);

  //熊身體的黑邊
  BearBody = createGraphics(400*1.5,500*1.5);
  BearBody.background(Bstroke);
  
  //colorCanvas
  colorCanvas = createGraphics(400*2.5,500*3);
  // colorCanvas.background(240);

  //生成偵測區塊
  checkGraphics = createGraphics(300,300);
  checkGraphics.background(240);
  
  doodleClassifier =ml5.imageClassifier('DoodleNet',modelReady);
  resultsDiv = createDiv('請等等');
  resultsDiv.position(1040, 750);
  resultsDiv.style('font-size','30px');
  // resultsDiv.style('background-color','green');
  resultsDiv.style('width','590px');

}

function modelReady() {
  // console.log('model loaded');
  resultsDiv.html('開始畫吧！');
  // doodleClassifier.classify(canvas, gotResults);
}

function checkCanvas(){
  // image(checkGraphics,900,0,450,450);
  doodleClassifier.classify(checkGraphics, gotResults);

  //進行上色
  paintColor();
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // console.log(results);
  let c = [];
  var bearMode = false;

  for(i=0; i<=2; i++){
    if(results[i].label == 'bear'){

      c[4] = `${results[i].label} 
      ${nf(100 * results[i].confidence, 2, 1)}%`;
      bearMode = true;
      c[i] = `${results[4].label} 
      ${nf(100 * results[4].confidence, 2, 1)}%`;

    } else if(results[i].label != 'bear'){

      c[i] = `${results[i].label} 
      ${nf(100 * results[i].confidence, 2, 1)}%`;
    }
  }
  if(bearMode == true){
    resultsDiv.html('他是一個『'+c[4]+'』「'+c[0]+'」「'+c[1]+' 」「'+c[2]+'」的熊誒！');
  }else{
    resultsDiv.html('他是一個「'+c[0]+'」「'+c[1]+' 」「'+c[2]+'」的熊誒！');
  }
  // doodleClassifier.classify(canvas, gotResults);
}

function paintColor(){
  colMode = true;
  // console.log(colorMode);

  for(let i=0; i<=8; i++){
    cBtn[i].show();
  }

  checkButton.hide();
  noticeBlock.show(); //提醒上色文字出現
  thinIcon.show();
  thickIcon.show();
  penWeight.show(); //筆畫粗細的拉桿

  cBtn[0].style('background-color','#CE8B54');
  cBtn[1].style('background-color','#83502E');
  cBtn[2].style('background-color','#DB3838');
  cBtn[3].style('background-color','#F9A228');
  cBtn[4].style('background-color','#FECC2F');
  cBtn[5].style('background-color','#B2C225');
  cBtn[6].style('background-color','#40A4D8');
  cBtn[7].style('background-color','#A363D9'); 
  cBtn[8].style('background-color','#EE657A'); 

}

function clearCanvas() {
  window.location.reload();
}

function saveImage(){
  saveCanvas(canvas, 'bear.png');
}

function draw() {
    // console.log(colMode);

    if(mouseIsPressed && colMode == false){
      graphics.stroke(col.r, col.g, col.b);
      graphics.strokeWeight(5);
      graphics.line(pmouseX,pmouseY,mouseX,mouseY);

      clearButton.show(); //畫出第一筆就可以清除及準備偵測
      checkButton.show(); //畫出第一筆就可以清除及準備偵測
      
      //for偵測用
      checkGraphics.stroke(0);
      checkGraphics.strokeWeight(16);
      checkGraphics.line(pmouseX-500, pmouseY-200, mouseX-500, mouseY-200);

    } else if(mouseIsPressed && colMode == true){

      colorCanvas.stroke(col.r, col.g, col.b);
      colorCanvas.strokeWeight(penWeight.value());
      colorCanvas.line(pmouseX,pmouseY,mouseX,mouseY);

        //按btn上色
      cBtn[0].mousePressed(function(){
      col.r = 206
      col.g = 139 
      col.b = 84
      saveButton.show(); //上色後就可以存圖送出
      })

      cBtn[1].mousePressed(function(){
      col.r = 131
      col.g = 80
      col.b = 46
      saveButton.show(); //上色後就可以存圖送出
      })

      cBtn[2].mousePressed(function(){
      col.r = 219
      col.g = 56
      col.b = 56
      saveButton.show(); //上色後就可以存圖送出
      })

      cBtn[3].mousePressed(function(){
      col.r = 249
      col.g = 162
      col.b = 40
      saveButton.show(); //上色後就可以存圖送出
      })

      cBtn[4].mousePressed(function(){
      col.r = 254
      col.g = 204
      col.b = 47
      saveButton.show(); //上色後就可以存圖送出
      })

      cBtn[5].mousePressed(function(){
      col.r = 178
      col.g = 194
      col.b = 37
      saveButton.show(); //上色後就可以存圖送出
      })

      cBtn[6].mousePressed(function(){
      col.r = 64
      col.g = 164
      col.b = 216
      saveButton.show(); //上色後就可以存圖送出
      })
  
      cBtn[7].mousePressed(function(){
      col.r = 163
      col.g = 99
      col.b = 217
      saveButton.show(); //上色後就可以存圖送出
      })

      cBtn[8].mousePressed(function(){
      col.r = 238
      col.g = 101
      col.b = 122
      saveButton.show(); //上色後就可以存圖送出
      })

    }

    image(bg,bearX,bearY);
    image(colorCanvas,0,0);
    image(BearBody,bearX,bearY);
    image(graphics,0,0);
    // image(checkGraphics,900,0,450,450);

}