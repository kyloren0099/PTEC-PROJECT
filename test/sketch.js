let selectedTool="";

let papers = [];

let drag;

function setup(){
    createCanvas(windowWidth,windowHeight-40);
    

    for(let i=0;i<10;i++){
        papers[i]= new paper(120,260,150,150);

    }

     drag=new dragDetails();
}
function draw(){
  background("#fdeca6");
  for(let i=0;i<papers.length;i++){
      papers[i].draw();
      
  }
  if(drag.isDragging==true){
      fill(0,0,250);
      rect(width-80,height-80,width,height);
  }
  
  
}

function mousePressed(){
    if(selectedTool=='draw'){
        let d=true;
        papers.reverse();
        for(let i=0;i<papers.length;i++){
            if((ptInsidePaper(createVector(mouseX,mouseY),papers[i])||ptInsidePaper(createVector(pmouseX,pmouseY),papers[i]))&&d==true){
                d=false;
                if(mouseButton===LEFT){
                    papers[i].display.stroke(0);
                    papers[i].display.strokeWeight(3);
                }else{
                    papers[i].display.stroke(255,247,64);
                    papers[i].display.strokeWeight(13);
                }
                let px=papers[i].x;
                let py=papers[i].y;
                papers[i].display.line(mouseX-px,mouseY-py,pmouseX-px,pmouseY-py);
            }
        }
        papers.reverse();
    }
    
    if(drag.isDragging==false&&selectedTool=='move'){
        papers.reverse();
        let newPapersList=[];
        let gotOne=false;
        for(let i=0;i<papers.length;i++){
            if(ptInsidePaper(createVector(mouseX,mouseY),papers[i])&&drag.isDragging==false){
                drag.startDragging(papers[i]);
                gotOne=true;
            }else{
                newPapersList.push(papers[i]);
            }
        }
        if(gotOne==true){
            newPapersList.reverse();
            newPapersList.push(drag.note);
            newPapersList.reverse();
        }
        papers=newPapersList;
        papers.reverse();
    }
}
function mouseDragged(){
    if(drag.isDragging==true){
        drag.durringDragging();
    }
    if(selectedTool=='draw'){
        let d=true;
        papers.reverse();
        for(let i=0;i<papers.length;i++){
            if((ptInsidePaper(createVector(mouseX,mouseY),papers[i])||ptInsidePaper(createVector(pmouseX,pmouseY),papers[i]))&&d==true){
                d=false;
                if(mouseButton===LEFT){
                    papers[i].display.stroke(0);
                    papers[i].display.strokeWeight(3);
                }else{
                    papers[i].display.stroke(255,247,64);
                    papers[i].display.strokeWeight(13);
                }
                let px=papers[i].x;
                let py=papers[i].y;
                papers[i].display.line(mouseX-px,mouseY-py,pmouseX-px,pmouseY-py);
            }
        }
        papers.reverse();
    }
}
function mouseReleased(){
    if(drag.isDragging==true){
        drag.endDragging();
        if(mouseX>width-80&&mouseY>height-80){
           
            papers.pop();
            
        }
    }
}

function doToolbar(){


//xander
    if(selectedTool=="move"){
        document.getElementById("move-tool").disabled = true;
        styleButtonSelected("move-tool");
        document.getElementById("thisistext").textContent = "the move tool is selected"
    }else{
        document.getElementById("move-tool").disabled = false;
        styleButtonNonSelected("move-tool");
        
    }
    if(selectedTool=="draw"){
        document.getElementById("draw-tool").disabled = true;
        styleButtonSelected("draw-tool");
        document.getElementById("thisistext").textContent = "the draw tool is selected"
    }else{
        document.getElementById("draw-tool").disabled = false;
        styleButtonNonSelected("draw-tool");
    }
    
   


}
function setTool(toolName){
    selectedTool=toolName;
    doToolbar();
}

function createPaper(){
    if(drag.isDragging==false){
        let newNote=new paper(mouseX,mouseY,150,150);
        drag.startDragging(newNote);
        papers.push(newNote);
    }
}

function styleButtonNonSelected(buttonId){
    document.getElementById(buttonId).style = "border-width: 1px; border-style: outset; border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133)); border-radius: 4px;";
}
function styleButtonSelected(buttonId){
    document.getElementById(buttonId).style = "border: 1px solid black; border-radius: 4px;";
}

class dragDetails{

    constructor(){
        this.isDragging=false;
        this.relativePos=createVector(0,0);
        this.note;
    }

    startDragging(note){
        this.note=note;
        this.isDragging=true;
        this.relativePos=p5.Vector.sub(createVector(note.x,note.y),createVector(mouseX,mouseY));
        
    }
    durringDragging(){
        let pos=p5.Vector.add(this.relativePos,createVector(mouseX,mouseY));
        if(keyIsPressed&&keyCode===SHIFT){
            pos.x=round(pos.x/this.note.width)*this.note.width;
            pos.y=round(pos.y/this.note.height)*this.note.height;
        }
        this.note.x=constrain(pos.x,0,width-10);
        this.note.y=constrain(pos.y,0,height-10);
    }
    endDragging(){
        this.isDragging=false;
    }

}

class paper{

    constructor(x,y,w,h){
        this.x=x;
        this.y=y;
        this.width=w;
        this.height=h;
        this.rot=0;
        this.display= createGraphics(this.width,this.height);
        this.display.background(255,247,64);
    }

    draw(){
        fill(240,236,55);
        stroke("#ffca18")
        rect(this.x-2,this.y-2,this.width+2,this.height+2);
        image(this.display,this.x,this.y,this.width,this.height);
    }

}
function ptInsidePaper(pt,ppr){
    let ret=(
        pt.x>= ppr.x
        &&pt.x<=ppr.width+ppr.x
        &&pt.y>= ppr.y
        &&pt.y<=ppr.height+ppr.y);
    return(ret);
}