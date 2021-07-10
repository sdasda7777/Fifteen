let solved = 2;
let orderOfPieces = [];
let xOffset = 0;
let yOffset = 0;

let canvas = document.getElementById('maincanvas');
let ctx = canvas.getContext('2d');
ctx.fillStyle = "black";

const image = new Image(600, 600);
image.onload = drawImageForTheFirstTime;

function initImage(path){
	image.src = path;
}

function drawImageForTheFirstTime(){
	xOffset = (image.naturalWidth-600) * - Math.random();
	yOffset = (image.naturalHeight-600) * - Math.random();
		
	ctx.drawImage(image, xOffset, yOffset);
	solved = 1;
}

function drawScrambledImage(){	
	for(let i = 0; i<16; i++){
		if(orderOfPieces[i]==15){
			ctx.fillRect((i%4)*150,Math.floor(i/4)*150, 150,150);
		}else{
			ctx.drawImage(image, (orderOfPieces[i]%4)*150 - xOffset, Math.floor(orderOfPieces[i]/4)*150 - yOffset, 150,150, (i%4)*150,Math.floor(i/4)*150, 150,150);
		}
	}
}

function scrambleAndDraw(){	
	orderOfPieces = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
	
	for( let i = 0; (Math.random() > 0.009 || i < 200) && i < 500; i++ ){
		let fifteenindex = orderOfPieces.indexOf(15);

		if(Math.random() > 0.5){ //X-move
			let direction = Math.random();
			
			if((direction > 0.5 && (fifteenindex % 4) != 3) || (fifteenindex % 4) == 0){
				let tmp = orderOfPieces[fifteenindex+1];
				orderOfPieces[fifteenindex+1] = 15;
				orderOfPieces[fifteenindex] = tmp;
			}else{
				let tmp = orderOfPieces[fifteenindex-1];
				orderOfPieces[fifteenindex-1] = 15;
				orderOfPieces[fifteenindex] = tmp;
			}
		}else{ //Y-move
			let direction = Math.random();
			
			if((direction > 0.5 && fifteenindex < 12) || fifteenindex < 4){
				let tmp = orderOfPieces[fifteenindex+4];
				orderOfPieces[fifteenindex+4] = 15;
				orderOfPieces[fifteenindex] = tmp;
			}else{
				let tmp = orderOfPieces[fifteenindex-4];
				orderOfPieces[fifteenindex-4] = 15;
				orderOfPieces[fifteenindex] = tmp;
			}
		}
	}
	
	solved = 0;

	drawScrambledImage();
}

function moveNumber15AndDraw(evtargs){
	let tileX = Math.floor(evtargs.clientX/150);
	let tileY = Math.floor(evtargs.clientY/150);

	if((orderOfPieces.indexOf(15)%4 == tileX || Math.floor(orderOfPieces.indexOf(15)/4) == tileY)&& ((orderOfPieces.indexOf(15)%4 == tileX) != (Math.floor(orderOfPieces.indexOf(15)/4) == tileY))){
		let cellOfOrigin = tileY*4+tileX;
		let cellEnd = orderOfPieces.indexOf(15);
	
		if(cellEnd%4 == tileX){
			let temporalTile;
			let direction = Math.floor(cellEnd/4) - tileY;
		
			if(direction < 0){
				for(let i = 0; i >= direction; i--){
					if(temporalTile == undefined){
						temporalTile = orderOfPieces[tileY*4+tileX];
						orderOfPieces[tileY*4+tileX] = 15;
					}else{
						orderOfPieces[(tileY+i)*4+tileX] = [temporalTile, temporalTile = orderOfPieces[(tileY+i)*4+tileX]][0];
					}
				}
			}else{
				for(let i = 0; i <= direction; i++){
					if(temporalTile == undefined){
						temporalTile = orderOfPieces[tileY*4+tileX];
						orderOfPieces[tileY*4+tileX] = 15;
					}else{
						orderOfPieces[(tileY+i)*4+tileX] = [temporalTile, temporalTile = orderOfPieces[(tileY+i)*4+tileX]][0];
					}
				}
			}
		}else{
			let temporalTile;
			let direction = cellEnd%4 - tileX;
			
			if(direction < 0){
				for(let i = 0; i >= direction; i--){
					if(temporalTile == undefined){
						temporalTile = orderOfPieces[tileY*4+tileX];
						orderOfPieces[tileY*4+tileX] = 15;
					}else{
						orderOfPieces[tileY*4+tileX+i] = [temporalTile, temporalTile = orderOfPieces[tileY*4+tileX+i]][0];
					}
				}
			}else{
				for(let i = 0; i <= direction; i++){
					if(temporalTile == undefined){
						temporalTile = orderOfPieces[tileY*4+tileX];
						orderOfPieces[tileY*4+tileX] = 15;
					}else{
						orderOfPieces[tileY*4+tileX+i] = [temporalTile, temporalTile = orderOfPieces[tileY*4+tileX+i]][0];
					}
				}
			}
		}
	
		let arrForCompare = Array.prototype.slice.call(orderOfPieces).sort((a, b)=>{return a-b});
		
		if(arrForCompare.length === orderOfPieces.length && arrForCompare.every((value, index) => value === orderOfPieces[index])){
			solved = 2;
			ctx.drawImage(image, xOffset, yOffset);
		}else{
			drawScrambledImage();
		}
	} 
}

document.getElementById("maincanvas").addEventListener("click", (evtargs)=>{
	if(solved == 2){
		drawImageForTheFirstTime();
	}else if(solved == 1){
		scrambleAndDraw();
	}else{
		moveNumber15AndDraw(evtargs);
	}
});

document.getElementById("backcolor").addEventListener("input", (evtargs) => {
	document.getElementById("documentbody").style.backgroundColor = evtargs.target.value;
});

document.getElementById("sourceimage").addEventListener("change", (evtargs) => {
	if(evtargs.target.value != ""){
		initImage(evtargs.target.value.substr(12));
	}
});

initImage('05.jpg');