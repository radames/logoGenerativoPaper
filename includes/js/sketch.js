/* jslint browser: true */
/* jslint devel: true */
/* global paper:true */
/* global Tool:true */
/* global Point:true */
/* global view:true */
/* global $:true */

var MAX_LAYER = 10;
var MIN_LAYER = 4;
var MIN_ALPHA = 0.3;
var MAX_ALPHA = 0.8;


var firstMillis = 0;
var lastTime = 0;

var coresPrimarias = ["#2DBCB5", "#CE2A1E"];

var STATE = {
    RAND: 0,
    ANIMA: 1,
    GRAD: 2,
	CICLE: 3,
};

var sState = STATE.RAND;

var nLayer, pointsList;
var dAlpha;


var tool;

window.onload = function() {
	var pointsLayers = [];
	var paths = [];
	var paths2 = [];
	
	var mouseX;
	var mouseY;

	firstMillis = new Date().getTime();
		// Get a reference to the canvas object

	var canvas = document.getElementById('logoCanvas0');
	var canvas2 = document.getElementById('logoCanvas1');

	var paper1 = new paper.PaperScope();
	var paper2 = new paper.PaperScope();
	
	paper1.setup(canvas);
	paper2.setup(canvas2);


	//alpha max is 200 = 0.78% de alpah
	//min triangules is 5
	
	var pointsLayers = k_combinations([0,1,2,3,4,5],3);
	

    var fileNames = ["FS_Letters", "FS_Security", "FS_Learning", "FS_Insurance", "FS_Entertainment","FS_Company","FS_Assistance"];

     //alpha max is 200 = 0.78% de alpah
     //min triangules is 5
	
//	paper2.activate();
//	
//	for(var i in fileNames){
//            
//             paper2.project.importSVG("includes/images/"+ fileNames[i]+ ".svg", {
//                                                       expandShapes: true,
//                                                       onLoad: function(node, item) {
//															var p = new paper2.Path();
//														    p = item;
//                                                       }
//             });
//     }
//	
	tool = new paper1.Tool();



	tool.onMouseMove = function (event) {
		mouseX = event.point.x;
		mouseY = event.point.y;
	};	

	
	$("#salvar").on('click', function () {
		   paper2.activate();
		   downloadAsSVG();
    });
	
	
	$("#gerar-aleatorio").on('click', function () {
			var px0 = paper2.view.center.x;
			var py0 = paper2.view.center.y;
			paper2.project.activeLayer.removeChildren();
		
			var nLayerR = random(MIN_LAYER, MAX_LAYER);
			var alphaR = MIN_ALPHA + Math.random() * (MAX_ALPHA-MIN_ALPHA);
			drawHexagons(px0, py0, paper2.view.size.width*(2-Math.sqrt(3)/2), nLayerR, alphaR);
		
//			for(var i=0; i< 10; i++){
//				for(var j=0; j < 4; j++){
//					drawHexagons(25 + i*55,
//								 25+j*55, 50,
//								 MIN_LAYER + j*(MAX_LAYER-MIN_LAYER)/4,
//								 MIN_ALPHA + (10-i)*(MAX_ALPHA-MIN_ALPHA)/10);
//				}
//			}
    });
	
	function drawHexagons(px,py,w, maxlayer, maxalpha){
			paper2.activate();
			path2 = [];	
			var randPos = range(pointsLayers.length);
			var rState = 0;
			for(var i=0; i < maxlayer; i++){
				var ind = randPos[random(randPos.length)];
				while( pointsLayers[ind].indexOf(rState) === -1 && !(rState === -1)){
					ind = randPos[random(randPos.length)];
				}
				rState = (rState == 0)? 3: -1;
				
				randPos.splice(ind,1);

				paths2.push( drawTriangle(paper2,
										  pointsLayers[ind],
										  i,
										  maxalpha,
										  px,
										  py,
										  w));
			}
			paper2.view.update();

	}
	
	var diff, rTime;
	paper1.view.onFrame = function(event) {
		switch (sState) {
			case STATE.RAND:
				
				paper1.project.activeLayer.removeChildren();
				path1 = [];	
				sState = STATE.ANIMA;
				nLayer = random(MIN_LAYER, MAX_LAYER);
				
//				var px0 = paper2.view.center.x;
//				var py0 = paper2.view.center.y;
//
//				drawHexagons(px0, py0, 200);
//				
				lastTime = millis();
				break;

			case STATE.ANIMA:


				diff = millis() - lastTime;
				rTime =100;
				dAlpha = MIN_ALPHA + Math.random()*(MAX_ALPHA - MIN_ALPHA);

				if (diff > rTime) {
					paths.push( drawTriangle(paper1,
											 pointsLayers[nLayer],
											 nLayer,
											 dAlpha,
											 paper1.view.center.x,
											 paper1.view.center.y,
											 paper1.view.size.width*(2-Math.sqrt(3)/2)));

					nLayer--;
					lastTime = millis();
				}
				dAlpha = MAX_ALPHA*diff/rTime;

				if (nLayer <= 0) {
					sState =  STATE.CICLE;					
				}
				break;
			
			case STATE.FADEOUT:
				
				diff = millis() - lastTime;
				rTime = 200;
				

				if (diff > rTime) {	
					if(paths.length  <= 0){
						sState = STATE.RAND;
						break;
					}else{
						var ind = random(paths.length);
						paths[ind].remove();	
						paths.splice(ind,1);

					}
					lastTime = millis();

				}
				break;
				
			case STATE.CICLE:

				diff = millis() - lastTime;
				rTime = 200;
				if (diff > rTime) {				
					dAlpha = MIN_ALPHA + (1-mouseX/paper2.view.size.width)*(MAX_ALPHA - MIN_ALPHA);
					for(var i = 0; i < paths.length; i++){
						var ind = random(paths.length);
						paths[ind].remove();	
						paths.splice(ind,1);
					}
					var randPos = range(pointsLayers.length);
					
					for(var i = 0; i < ((mouseY/paper2.view.size.height)*(MAX_LAYER-MIN_LAYER)); i++){						
						var ind = randPos[random(randPos.length)]; //do not take the same layer twice
						randPos.splice(ind,1);
	
						
						paths.push( drawTriangle(paper1,
												 pointsLayers[ind],
												 ind,
												 dAlpha,
												 paper1.view.center.x,
												 paper1.view.center.y,
												 paper1.view.size.width*(2-Math.sqrt(3)/2)));
					}
					


					lastTime = millis();

				}
				break;

		}
		
	};


};


//currently name doesn't seem to work in some browsers.
//Save SVG from paper.js as a file.
var downloadAsSVG = function (fileName) {

   if(!fileName) {
	   var gTime = new Date();
       fileName = "fslogo-"+ gTime.getHours() + ""+ gTime.getMinutes() + "" + gTime.getSeconds() + ".svg";
   }

   var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));

   var link = document.createElement("a");
   link.download = fileName;
   link.href = url;
   link.click();
};




function drawTriangle(scope, points, nLayer, alpha, px, py, width) {
	scope.activate();
	var path = new paper.Path();
	
	path.fillColor = coresPrimarias[ nLayer%2];
	path.fillColor.alpha = alpha;

	for(var i in points){
		path.add(new paper.Point(px + width/2 * Math.sin(points[i] * Math.PI / 3),
						   		 py + width/2 * Math.cos(points[i] * Math.PI / 3))); 
	}
	
	path.closed = true;
	path.fullySelected = false;
	scope.view.draw();

	return(path);

}