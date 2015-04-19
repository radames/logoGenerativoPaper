function vertexPermutation(nLayer) {

    var verticeList = [];
    for (var i = 0; i < nLayer; i++) {
        var vertices = [];
        while (vertices.length < 3) {
            var r = random(6);
            if (vertices.indexOf(r) < 0) {
                vertices.push(r);
            }
        }
        verticeList.push(vertices);
    }
    return verticeList;
}




function millis(){
	return new Date().getTime()- firstMillis;	
}

function constrain(val, max, min){
	if(val >= max){ return max;}
	if(val <= min){ return min;}
	return val;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = random(currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function random(arg1, arg2)
{
	if (arg1 === undefined && arg2 === undefined) { return; }
	else if (arg2 === undefined) { return (0 + Math.floor(Math.random() * (arg1 - 0))); }
	else { return (arg1 + Math.floor(Math.random() * (arg2 - arg1))); }
}


/**
 * Copyright 2012 Akseli Palén.
 * Created 2012-07-15.
 * Licensed under the MIT license.
 
 **/
function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	
	if (k > set.length || k <= 0) {
		return [];
	}
	
	if (k == set.length) {
		return [set];
	}
	
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	
	// Assert {1 < k < set.length}
	
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i+1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}


function range(start, stop, step){
    if (typeof stop=='undefined'){
        // one param defined
        stop = start;
        start = 0;
    }
    if (typeof step=='undefined'){
        step = 1;
    }
    if ((step>0 && start>=stop) || (step<0 && start<=stop)){
        return [];
    }
    var result = [];
    for (var i=start; step>0 ? i<stop : i>stop; i+=step){
        result.push(i);
    }
    return result;
}

function noAccents(s){
    var r = s.toLowerCase();
    var non_asciis = {'a': '[àáâãäå]', 'ae': 'æ', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'oe': 'œ', 'u': '[ùúûűü]', 'y': '[ýÿ]'};
    for (var i in non_asciis) { r = r.replace(new RegExp(non_asciis[i], 'g'), i); }
    return r;
}

function getUrlVars() { // Read a page's GET URL variables and return them as an associative array.
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}