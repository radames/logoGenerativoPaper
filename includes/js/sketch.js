/* jslint browser: true */
/* jslint devel: true */
/* global paper:true */
/* global Tool:true */
/* global Point:true */
/* global view:true */
/* global $:true */

var MAX_LAYER = 10;
var MIN_LAYER = 4;
var MIN_ALPHA = 0.2;
var MAX_ALPHA = 0.8;

	//alpha max is 200 = 0.78% de alpah
    //min triangules is 5
	

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
	var canvas3 = document.getElementById('finalCanvas');
	
	var paper1 = new paper.PaperScope();
	var paper2 = new paper.PaperScope();
	var paper3 = new paper.PaperScope();

	paper1.setup(canvas);
	paper2.setup(canvas2);
	paper3.setup(canvas3);


	//alpha max is 200 = 0.78% de alpah
	//min triangules is 5
	
	var pointsLayers = k_combinations([0,1,2,3,4,5],3);
	

    var fileNames = ["fs", "fs-security", "fs-learning", "fs-insurance", "fs-entertainment","fs-company","fs-assistance"];

   	var symDist = {"V":[0.1, 1.15], "H":[1.1, 0.25]};
	
	tool = new paper1.Tool();



	tool.onMouseMove = function (event) {
		mouseX = event.point.x;
		mouseY = event.point.y;
	};	

	
	$("#salvar").on('click', function () {
		   paper3.activate();
		   downloadAsSVG();
    });

	var embedDirRadio = $('input[name=posicao-embed]');
	var selectedEmbed = $('#fs-type-embed');
	
	var saveDirRadio = $('input[name=posicao-download]');
	var selectedSave = $('#fs-type-save');
	
	$("#gerar-aleatorio").on('click', function () {
			simbolGen(paper2);
			loadSVG(paper3, paper2);
		
    });
	
	
	
	$("#gerar-aleatorio").trigger("click"); //first click random in the beginning
	
	saveDirRadio.on('change', function(){

	});
	selectedEmbed.on('change', function(){

	});

	saveDirRadio.on('change', function(){
		loadSVG(paper3, paper2);
	});
	selectedSave.on('change', function(){
		loadSVG(paper3, paper2);
	});
	
	
	$("#gerar-nome").on('click', function () {
			var nameCol = $("#nome-colaborador").val();
			nameCol = noAccents(nameCol); // remove all accents
			nameCol = nameCol.replace(/ /g,''); // clean all white spaces
		
			simbolFromName(paper2, nameCol);
			loadSVG(paper3, paper2);
    });
	
	$("#nome-colaborador").keyup(function(event){
    	if(event.keyCode == 13){
       		 $("#gerar-nome").click();
    	}
	});	
	
	function simbolFromName(scope, name){
		
			var px0 = scope.view.center.x;
			var py0 = scope.view.center.y;
			scope.project.clear();		
		
			drawHexagons(scope, px0, py0, scope.view.size.width*(2-Math.sqrt(3)/2), name);
		
		
	}
	
	function simbolGen(scope){
		
			var px0 = scope.view.center.x;
			var py0 = scope.view.center.y;
			scope.project.clear();		
			drawHexagons(scope, px0, py0, scope.view.size.width*(2-Math.sqrt(3)/2));
		

	}
	
	function loadSVG(scope, toCopy){
		
			toCopy.activate();
			var dataJSON = toCopy.project.exportJSON();	
		
			scope.activate();
			scope.project.clear();
			var p = scope.project.importJSON(dataJSON);
			var globalW = 58.96;
			p[0].fitBounds(new scope.Rectangle(0,0, globalW, globalW));
			p[0].bounds.x = scope.view.bounds.x;
			p[0].bounds.y = scope.view.bounds.y;
			
			var fName = selectedSave.val();
			if(fName !== ""){
				scope.project.importSVG("includes/images/"+ fName + ".svg", 
									 					{ expandShapes: false,
													      onLoad: function (item){
															  var dir = saveDirRadio.filter(':checked').data("dir");
															  
																 item.bounds.x =  p[0].bounds.x + globalW * symDist[dir][0];
																 item.bounds.y =  p[0].bounds.y + globalW * symDist[dir][1];
															  
															  	 scope.view.viewSize = scope.project.activeLayer.bounds;
															  	 scope.view.update();	


															}
				});
			}
			scope.view.viewSize = scope.project.activeLayer.bounds;
			scope.view.update();	
	}
	
	function drawHexagons(scope,px, py,w, name){
			scope.activate();
			path2 = [];
		
	
			var randPos = range(pointsLayers.length);
			if(name == undefined || name === ""){
				//random if names is undefined	
				var maxlayer = random(MIN_LAYER, MAX_LAYER);
				var maxalpha = MIN_ALPHA + Math.random()*(MAX_ALPHA-MIN_ALPHA);

				var rState = 0;
		
				for(var i=0; i < maxlayer; i++){
					var ind = randPos[random(randPos.length)];
					while( pointsLayers[ind].indexOf(rState) === -1 && (rState !== -1)){
						ind = randPos[random(randPos.length)];
					}
					rState = (rState === 0)? 3: -1;

					randPos.splice(ind,1);

					paths2.push( drawTriangle(scope,
											  pointsLayers[ind],
											  i,
											  maxalpha,
											  px,
											  py,
											  w));
				}
	
				
			}else{
				
				var rState = 0;
				var maxLayer = MIN_LAYER + name.length % (MAX_LAYER - MIN_LAYER); // constrain the maxLayer based on the random maxLayer
				var maxalpha = MIN_ALPHA + (maxLayer/MAX_LAYER)*(MAX_ALPHA - MIN_ALPHA);
				
				for(var i=0; i < maxLayer; i++){
					var l = name[i % name.length];
					
					
					var ind = l.charCodeAt(0) % randPos.length;
					
					while( pointsLayers[ind].indexOf(rState) === -1 && (rState !== -1)){
						ind = randPos[random(randPos.length)];
					}
					rState = (rState === 0)? 3: -1;

					randPos.splice(ind,1);

					paths2.push( drawTriangle(scope,
											  pointsLayers[ind],
											  i,
											  maxalpha,
											  px,
											  py,
											  w));
				}
				
	
			}
		


			scope.view.update();

	}
	
	var diff, rTime;
	paper1.view.onFrame = function(event) {
		switch (sState) {
			case STATE.RAND:
				
				paper1.project.activeLayer.removeChildren();
				path1 = [];	
				sState = STATE.ANIMA;
				nLayer = random(MIN_LAYER, MAX_LAYER);
				
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