/* jslint browser: true */
/* jslint devel: true */
/* global paper:true */
/* global Tool:true */
/* global Point:true */
/* global view:true */
/* global $:true */
/* global random */
/* global range */
/* global noAccents */
/* global k_combinations */
/* global millis */
/* global getUrlVars */
/* global shuffle */

var MAX_LAYER = 10;
var MIN_LAYER = 4;
var MIN_ALPHA = 0.2;
var MAX_ALPHA = 0.8;
var FADE_TIME = 300;
	//alpha max is 200 = 0.78% de alpah
    //min triangules is 5
	

var firstMillis = 0;
var lastTime = 0;

var coresPrimarias = ["#2DBCB5", "#CE2A1E"];
var coresSecundarias = "";

var STATE = {
    RAND: 0,
    ANIMA: 1,
    GRAD: 2,
	CICLE: 3,
	FADEIN: 4,
	FADEOUT: 5
};

var fileNames = ["fs", "fs-security", "fs-learning", "fs-insurance", "fs-entertainment","fs-company","fs-assistance"];

var symDist = {"V":[0.08360081601, 1.1568374446], "H":[1.0074288131, 0.2467870257]};
var symWidths = {"V" : {"fs" : 0.7245479534,
					   "fs-company": 1.6268051711 },
				 "H" : {"fs" : 0.791,
						"fs-security":1.788, 
						"fs-learning": 1.8146,
						"fs-insurance": 2.0468,
						"fs-entertainment": 2.9068,
						"fs-company": 1.7802,
						"fs-assistance": 2.2016}};



var sState = STATE.RAND;


var tool;

window.onload = function() {
	
	
	var parameters = getUrlVars(); //which leads to:
	
	var gWidth = 70;
	
	var fName = "";
	var pos = "H";
	var parColor = "color";	
	// parsing..
	if(parameters.width !== undefined){
		gWidth = parameters.width;
	}

	if(parameters.type !== undefined && fileNames.indexOf(parameters.type) !== -1){
		fName = parameters.type;
	}
	if(parameters.pos !== undefined && ( parameters.pos === "V" || parameters.pos === "H")  ){
		pos = parameters.pos; 
	}
	if(parameters.color !== undefined && ( parameters.color === "vermelho" || parameters.color === "branco" || parameters.color === "preto") ){
		parColor = parameters.color; 
	}


	switch(parColor){

			case "branco":
			    $('body').css('background', '#999999');
				coresSecundarias = "#FFFFFF";
				break;
			case "vermelho":
				coresSecundarias = "#cd171e";
				break;
			case "preto":
				coresSecundarias = "#000000";
				break;
			case "color":
				coresSecundarias = "";
				break;
	}
	
	var pointsLayers;
	var paths = [];
	  
	firstMillis = new Date().getTime();
		// Get a reference to the canvas object

	var canvas = document.getElementById('logoCanvas0');
	
	var paper1 = new paper.PaperScope();
	
	paper1.setup(canvas);
	paper1.view.viewSize = [gWidth*Math.sqrt(3)/2, gWidth];
	
	loadSVG(paper1, gWidth, fName, pos);

	//alpha max is 200 = 0.78% de alpah
	//min triangules is 5
	
	pointsLayers = shuffle(k_combinations([0,1,2,3,4,5],3));
	

	function loadSVG(scope, gWidth, fName, pos){
		if(fName !== ""){
				scope.project.importSVG("includes/images/"+ fName + ".svg", 
									 					{ expandShapes: false,
													      onLoad: function (item){
															  	 var scale = item.bounds.width;															  									
															  	 item.bounds.width = symWidths[pos][fName] * gWidth;
															     scale = item.bounds.width/scale; 
															     item.bounds.height = item.bounds.height * (scale);
															  
																 item.bounds.x =  gWidth * symDist[pos][0];
																 item.bounds.y =  gWidth * symDist[pos][1];
															   	 if(coresSecundarias !== ""){	   
															  		item.fillColor = coresSecundarias;
																 }
															 	 scope.view.viewSize = [scope.view.bounds.width +
																						item.bounds.width + 
																						item.bounds.x ,
																						scope.view.bounds.height +
																						item.bounds.height +
																						item.bounds.y];
																 scope.view.update();	

															}
				});
			}
			
			//scope.view.viewSize = scope.project.activeLayer.bounds;
			//scope.view.update();	
	}
	
	
	var diff, diffTime, rTime, rPos,indToFade, indToAdd, rangeLayers, dAlpha, nLayer, staticNLayer;
	
	paper1.view.onFrame = function(event) {
		switch (sState) {
			case STATE.RAND:
				
				paper1.project.activeLayer.removeChildren();
		
				
				paths = [];	
				sState = STATE.ANIMA;
				nLayer = random(MIN_LAYER, MAX_LAYER);
				staticNLayer = nLayer;
				
				rangeLayers = range(staticNLayer); // list to ensure not reapete layers
				
				lastTime = millis();
				break;

			case STATE.ANIMA:


				diff = millis() - lastTime;
				rTime =10;
				dAlpha = MIN_ALPHA + Math.random()*(MAX_ALPHA - MIN_ALPHA);

				if (diff > rTime) { 	
					paths.push( drawTriangle(paper1,
											 pointsLayers[nLayer],
											 nLayer,
											 dAlpha,
											 Math.sqrt(3) * 0.5 * gWidth/2,
											 gWidth/2,
											 gWidth));

					nLayer--;
					lastTime = millis();
				}
				dAlpha = MAX_ALPHA*diff/rTime;

				if (nLayer <= 0) {
					sState =  STATE.CICLE;
					indToFade = 0;
					indToAdd = 0 ;
				}
				break;
			

			case STATE.CICLE:

				indToFade = (indToFade + 1) % paths.length; //ycle over paths,  0---> paths.lenght
				indToAdd = (indToAdd + 1) % pointsLayers.length; //cycle over pointsLayer,  0---> pointsLayer.lenght

				dAlpha = MIN_ALPHA + Math.random()*(MAX_ALPHA - MIN_ALPHA);
				//pointsLayers = shuffle(pointsLayers);
				
				//rangeLayers.push(indToAdd);
				//add new and hide it
				paths.push( drawTriangle(paper1,
												 pointsLayers[indToAdd],
												 indToAdd,
												 0,
												 Math.sqrt(3) * 0.5 * gWidth/2,
												 gWidth/2,	
												 gWidth));
				
				

				lastTime = millis();
				sState = STATE.FADEOUT;
				break;
			
			
			case STATE.FADEOUT:

				diffTime = millis()- lastTime;

				var a =  paths[indToFade].fillColor.alpha * (1 - diffTime/FADE_TIME);
				a = (a > 0)? a : 0;
				a = (a < 1.0)? a : 1.0;
				//console.log("out " + a);
				paths[indToFade].fillColor.alpha = a;

				if(diffTime > FADE_TIME){
					paths[indToFade].remove();	
					paths.splice(indToFade,1);
					sState = STATE.FADEIN;
					lastTime = millis();

					//paths[paths.length-1].visible = true;
				}

			break;

			case STATE.FADEIN:
			
				diffTime = millis()- lastTime;
				var a =  dAlpha * (diffTime/FADE_TIME);
				a = (a > 0)? a : 0;
				a = (a < 1.0)? a : 1.0;
				//console.log("in " + a);

				paths[paths.length-1].fillColor.alpha = a;
				
				if(diffTime > FADE_TIME){ 
					sState = STATE.CICLE;
					lastTime = millis();

				}

			break;

			
		}
		
	};


};



function drawTriangle(scope, points, nLayer, alpha, px, py, width) {
	scope.activate();
	var path = new paper.Path();
	
	path.fillColor =  (coresSecundarias === "")?coresPrimarias[ nLayer%2]:coresSecundarias;
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