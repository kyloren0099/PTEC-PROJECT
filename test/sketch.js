let selectedTool="";//this indicates what tool is selected

let papers = [];//this is the array with all the sticky papers in it

let drag; //this holds the drag details


//these are the main processing function
function setup(){//this is called at the start
    createCanvas(windowWidth,windowHeight-40);//this determines the canvas size of the board
    

    for(let i=0;i<10;i++){//these are the starting papers
        papers[i]= new paper(120,260,150,150);

    }

     drag=new dragDetails();//this initializes the drag information
}
function draw(){//this is called every frame after the start
  background("#fdeca6");
  for(let i=0;i<papers.length;i++){
      papers[i].draw();
      //draws all the papers on screen
  }

  //this makes the recycling bin visible
  if(drag.isDragging==true){
      fill(0,0,250);
      rect(width-80,height-80,width,height);
  }
  
  
}


//these are the mouse events
function mousePressed(){//this is when mouse starts being pressed
    if(selectedTool=='draw'){//this draws on the notes
        let d=true;
        papers.reverse();
        for(let i=0;i<papers.length;i++){
            if((ptInsidePaper(createVector(mouseX,mouseY),papers[i])||ptInsidePaper(createVector(pmouseX,pmouseY),papers[i]))&&d==true){
                d=false;
                if(mouseButton===LEFT){//the draw tool
                    papers[i].display.stroke(0);
                    papers[i].display.strokeWeight(3);
                }else{//the erase tool
                    papers[i].display.stroke(255,247,64);
                    papers[i].display.strokeWeight(13);
                }
                let px=papers[i].x;
                let py=papers[i].y;
                papers[i].display.line(mouseX-px,mouseY-py,pmouseX-px,pmouseY-py);//this is a line on the paper
            }
        }
        papers.reverse();
    }
    
    if(drag.isDragging==false&&selectedTool=='move'){//this starts dragging the top paper that overlaps the mouse pointer
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
function mouseDragged(){//this is when the mouse is down and gets moved
    if(drag.isDragging==true){
        drag.durringDragging();
    }
    if(selectedTool=='draw'){//this also does drawing on the papers
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
function mouseReleased(){//this is when the mouse is released
    if(drag.isDragging==true){//this ends the dragging
        drag.endDragging();
        if(mouseX>width-80&&mouseY>height-80){
           //this deletes the dragged paper if mouse is in the recycle bin
            papers.pop();
            
        }
    }
}


//these are the toolbar things
function doToolbar(){//this is called after the tool changes

//this disables or enables specific buttons

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
function setTool(toolName){//this allows the html buttons to set the tool
    selectedTool=toolName;
    doToolbar();
}

function createPaper(){//this creates a paper where the mouse is
    if(drag.isDragging==false){
        let newNote=new paper(mouseX,mouseY,150,150);
        drag.startDragging(newNote);
        papers.push(newNote);
    }
}


//these style buttons
function styleButtonNonSelected(buttonId){//this styles the buttons to look not selected
    document.getElementById(buttonId).style = "border-width: 1px; border-style: outset; border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133)); border-radius: 4px;";
}
function styleButtonSelected(buttonId){//this styles th buttons to look selected
    document.getElementById(buttonId).style = "border: 1px solid black; border-radius: 4px;";
}


//these are the classes
class dragDetails{//this is a class that holds drag information

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
class paper{//this is a class that is a paper

    constructor(x,y,w,h){
        this.x=x;
        this.y=y;
        this.width=w;
        this.height=h;
        this.rot=0;
        this.display= createGraphics(this.width,this.height);//this is the image that the paper displays
        this.display.background(255,247,64);
    }

    draw(){//this draws the paper on screen
        fill(240,236,55);
        stroke("#ffca18")
        rect(this.x-2,this.y-2,this.width+2,this.height+2);
        image(this.display,this.x,this.y,this.width,this.height);
    }

}


//this didn't fit in with the other function so i put it here
function ptInsidePaper(pt,ppr){//this determines if a paper intersects the mouse
    let ret=(
        pt.x>= ppr.x
        &&pt.x<=ppr.width+ppr.x
        &&pt.y>= ppr.y
        &&pt.y<=ppr.height+ppr.y);
    return(ret);
}