function vertexPermutation(n){for(var r=[],e=0;n>e;e++){for(var t=[];t.length<3;){var o=random(6);t.indexOf(o)<0&&t.push(o)}r.push(t)}return r}function millis(){return(new Date).getTime()-firstMillis}function constrain(n,r,e){return n>=r?r:e>=n?e:n}function shuffle(n){for(var r,e,t=n.length;0!==t;)e=random(t),t-=1,r=n[t],n[t]=n[e],n[e]=r;return n}function random(n,r){return void 0===n&&void 0===r?void 0:void 0===r?0+Math.floor(Math.random()*(n-0)):n+Math.floor(Math.random()*(r-n))}function k_combinations(n,r){var e,t,o,i,f;if(r>n.length||0>=r)return[];if(r==n.length)return[n];if(1==r){for(o=[],e=0;e<n.length;e++)o.push([n[e]]);return o}for(o=[],e=0;e<n.length-r+1;e++)for(i=n.slice(e,e+1),f=k_combinations(n.slice(e+1),r-1),t=0;t<f.length;t++)o.push(i.concat(f[t]));return o}function range(n,r,e){if("undefined"==typeof r&&(r=n,n=0),"undefined"==typeof e&&(e=1),e>0&&n>=r||0>e&&r>=n)return[];for(var t=[],o=n;e>0?r>o:o>r;o+=e)t.push(o);return t}function noAccents(n){var r=n.toLowerCase(),e={a:"[àáâãäå]",ae:"æ",c:"ç",e:"[èéêë]",i:"[ìíîï]",n:"ñ",o:"[òóôõö]",oe:"œ",u:"[ùúûűü]",y:"[ýÿ]"};for(var t in e)r=r.replace(new RegExp(e[t],"g"),t);return r}function getUrlVars(){for(var n,r=[],e=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),t=0;t<e.length;t++)n=e[t].split("="),r.push(n[0]),r[n[0]]=n[1];return r}