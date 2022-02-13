const board = document.getElementById('drawSvg');
const crlBtn = document.getElementById('circle');
const lneBtn = document.getElementById('line');
const resetBtn = document.querySelector('.reset');
const undoBtn = document.querySelector('.undo');
const redoBtn = document.querySelector('.redo');
const allBtns = document.getElementsByClassName('btn');
const colorInput = document.getElementById('color');
const rectBtn = document.getElementById('rect');
let shapeStack = [];
let activeShape = "circle"; 
let isDrawing = false;
let svgElement;
let startX = 0;
let startY = 0;


[...allBtns].forEach(btn => btn.addEventListener('click', activeBtn))
board.addEventListener('mousedown', drawShape);
resetBtn.addEventListener('click', resetAll);
undoBtn.addEventListener('click', undoDraw);
redoBtn.addEventListener('click', redoDraw);
resetBtn.addEventListener('click', resetAll);
colorInput.addEventListener('change', changeColorTheme);
board.addEventListener('mousemove', resizeShape);
board.addEventListener('contextmenu', assignShape);
board.addEventListener('mouseup', assignShape);


function activeBtn(e){
    if(e.target.classList.contains('active')){
        e.target.classList.remove('active');
        activeShape = undefined;
        return;
    }
    [...allBtns].forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    activeShape = e.target.id;
}

function drawShape(e){
    let color = colorInput.value;
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    if(activeShape === 'circle'){
        svgElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");//WTF
        svgElement.setAttribute('cx', e.offsetX);
        svgElement.setAttribute('cy', e.offsetY);
        svgElement.setAttribute('fill', color);
    }
    else if(activeShape === 'line'){
        svgElement = document.createElementNS("http://www.w3.org/2000/svg", "line");//WTF
        svgElement.setAttribute('x1', e.offsetX);
        svgElement.setAttribute('y1', e.offsetY);
        svgElement.setAttribute('x2', e.offsetX);//to prevent auto line matching to (0,0)
        svgElement.setAttribute('y2', e.offsetY);
        svgElement.setAttribute('stroke', color);
    }
    else if(activeShape === 'rect'){
        svgElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");//WTF
        svgElement.setAttribute('x', e.offsetX);
        svgElement.setAttribute('y', e.offsetY);
        svgElement.setAttribute('width', 0);//to prevent auto line matching to (0,0)
        svgElement.setAttribute('height', 0);
        svgElement.style.fill = color;
    }
    else if(activeShape === 'path'){
        svgElement = document.createElementNS("http://www.w3.org/2000/svg", "path");//WTF
        svgElement.setAttribute('d', `M${e.offsetX} ${e.offsetY} `);
        svgElement.fill = "trasparent";
        svgElement.style.stroke = color;

    }
    else{
        return;//Temporary handling shanon selected shape
    }
    board.appendChild(svgElement);
    svgElement.setAttribute('opacity', '.5');
}

function resizeShape(e){
    if(!isDrawing){
        return;
    }
    if(activeShape === 'circle'){
        let rad = Math.sqrt(Math.abs(startX - e.offsetX)**2 + Math.abs(startY - e.offsetY)**2).toFixed(0);
        svgElement.setAttribute('r', rad);
    }
    else if(activeShape === 'line'){
        svgElement.setAttribute('x2', e.offsetX);
        svgElement.setAttribute('y2', e.offsetY);
    }
    else if(activeShape === 'rect'){
        if(startX > e.offsetX){
            svgElement.setAttribute('x', e.offsetX);
            svgElement.setAttribute('width', startX);
        }
        if(startY > e.offsetY){
        svgElement.setAttribute('y', e.offsetY);
        svgElement.setAttribute('height', startY);
        }
        svgElement.setAttribute('width', Math.abs(e.offsetX - startX));
        svgElement.setAttribute('height', Math.abs(e.offsetY - startY));
    }
    if(activeShape === 'path'){
        let lineTo = `L${e.offsetX} ${e.offsetY} M${e.offsetX} ${e.offsetY} `
        svgElement.setAttribute('d', svgElement.getAttribute('d') + lineTo);
    }
}

function assignShape(e){
    if(!isDrawing){
        return;
    };
    if(!activeShape){
        return;
    }
    svgElement.setAttribute('opacity', `1`);
    startX = 0;
    startY = 0;
    isDrawing = false;
};

function undoDraw(){
    let lastShape = document.getElementById('drawSvg').lastElementChild;
    if(lastShape){
        shapeStack = shapeStack.concat([lastShape])
        lastShape.remove()
    }
}

function redoDraw(){
    if(shapeStack.length){
        board.appendChild(shapeStack.pop());
    }
}

function resetAll(){
    const allSvgs = [...board.children];
    shapeStack = [...allSvgs];
    allSvgs.forEach(svg => svg.remove())
}

function changeColorTheme(){
    console.log('changed')
    const pathLbl = document.getElementById('path-label');
    const lineLbl = document.getElementById('line-label');
    const circleLbl = document.getElementById('circle-label');
    const rectLbl = document.getElementById('rect-label');
    lineLbl.setAttribute('stroke', this.value) 
    pathLbl.setAttribute('stroke', this.value) 
    rectLbl.style.fill = this.value;
    circleLbl.setAttribute('fill', this.value) 
}