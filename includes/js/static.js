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
	var pointsLayers;
	var paths = [];
	var paths2 = [];
	
	var mouseX;
	var mouseY;

	firstMillis = new Date().getTime();
		// Get a reference to the canvas object

	var canvas2 = document.getElementById('logoCanvas1');
	var canvas3 = document.getElementById('finalCanvas');
	
	var paper2 = new paper.PaperScope();
	var paper3 = new paper.PaperScope();

	paper2.setup(canvas2);
	paper3.setup(canvas3);


	//alpha max is 200 = 0.78% de alpah
	//min triangules is 5
	
	pointsLayers = k_combinations([0,1,2,3,4,5],3);
	

    var fileNames = ["fs", "fs-security", "fs-learning", "fs-insurance", "fs-entertainment","fs-company","fs-assistance"];

   	var symDist = {"V":[0.1, 1.15], "H":[1.1, 0.25]};
	var symWidths = {"V" : {"fs" : 0.839,
					 	   "fs-company": 1.923},
					 "H" : {"fs" : 0.92,
							"fs-security":2.08, 
							"fs-learning": 2.11,
							"fs-insurance": 2.38,
							"fs-entertainment": 3.38,
							"fs-company": 2.07,
							"fs-assistance": 2.56}};
	
	
	$("#salvar").on('click', function () {
		   paper3.activate();
		   downloadAsSVG();
    });

	var embedDirRadio = $('input[name=posicao-embed]');
	var selectedEmbed = $('#fs-type-embed');
	var logoWidth = $("#logoWidth");

	var saveDirRadio = $('input[name=posicao-download]');
	var selectedSave = $('#fs-type-save');
	
	$("#gerar-aleatorio").on('click', function () {
			simbolGen(paper2);
			loadSVG(paper3, paper2);
		
    });
	
	$("#gerar-aleatorio").trigger("click"); //first click random in the beginning
	
	
	$("#embed-result").val(getEmbedURL());

	embedDirRadio.on('change', function(){
			$("#embed-result").val(getEmbedURL());

	});
	selectedEmbed.on('change', function(){
			$("#embed-result").val(getEmbedURL());
	});
	logoWidth.on('change', function(){
			$("#embed-result").val(getEmbedURL());
	});

	function getEmbedURL(){
		var localURL = $(location).attr('href');
		localURL = localURL.trim();
		localURL = localURL.replace(/#/, '');
		var dir = embedDirRadio.filter(':checked').data("dir");
		var fName = selectedEmbed.val();
		var lWidth = logoWidth.val();
		
		return localURL + "embed.html?width=" + lWidth + "&type=" + fName + "&pos=" + dir

	}
	
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

															  	 var scale = item.bounds.width;
															  	 item.bounds.width = symWidths[dir][fName] * globalW;
															     scale = scale / item.bounds.width; 
															  	 item.bounds.height = item.bounds.height * (2-scale);

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
			var path2 = [];
		
			var maxlayer, maxalpha, rState;
		
			var randPos = range(pointsLayers.length);
			if(name === undefined || name === ""){
				//random if names is undefined	
				maxlayer = random(MIN_LAYER, MAX_LAYER);
				maxalpha = MIN_ALPHA + Math.random()*(MAX_ALPHA-MIN_ALPHA);

				rState = 0;
		
				for(var i = 0; i < maxlayer; i++){
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
				
				maxLayer = MIN_LAYER + name.length % (MAX_LAYER - MIN_LAYER); // constrain the maxLayer based on the random maxLayer
				maxalpha = MIN_ALPHA + (maxLayer/MAX_LAYER)*(MAX_ALPHA - MIN_ALPHA);
				rState = 0;
				
				for(var i = 0; i < maxLayer; i++){
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