!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("querystring-number")):"function"==typeof define&&define.amd?define(["querystring-number"],t):(e=e||self).Route=t(e.queryString)}(this,function(p){"use strict";p=p&&Object.prototype.hasOwnProperty.call(p,"default")?p.default:p;var e=navigator.userAgent,t=/(?:iphone)/.test(e),i=/MicroMessenger/.test(e)&&t,f={},n=[];function l(e){var t=document.createElement("span");return t.style.display="none",t.setAttribute("aoife-route",e),t}["popstate","pushState","replaceState","backState"].forEach(function(e){window.addEventListener(e,function(){u.state=p.parse(location.search),n.forEach(function(e){return e()}),"popstate"!==e&&"backState"!==e||delete f[r],"popstate"===e&&a.pop()})});var o=0,d=!1,r="",a=[],u=function(e){var i=e.url,a=e.render,u=e.preload,c=e.cache;if("function"!=typeof a)throw"AoifeRoute.render need a Function";function t(){if(u&&a(),"function"==typeof i){if(!i())return l(s)}else if(p.decode(window.location.pathname)!==i)return l(s);if("string"==typeof i&&f[i]){var e=f[i],t=window.aoife;return t&&t.waitAppend(e).then(function(){t.next(e)}),e}var n=c&&!d&&"string"==typeof i;d=!1;var o=a();if(o.then){var r=l(s);return Promise.resolve(o).then(function(e){var t;!e.default||(t=document.querySelector('[aoife-route="'+s+'"]'))&&((e=e.default()).setAttribute("aoife-route",s),n&&(f[i]=e),t.replaceWith(e))}),r}return o.setAttribute("aoife-route",s),n&&(f[i]=o),o}var s=""+(o+=1);return n.push(function(){var e=document.querySelector('[aoife-route="'+s+'"]');e&&e.replaceWith(t())}),t()};return u.state={},u.queryString=p,u.push=function(e,t,n){var o=void 0===n?{}:n,n=o.ignoreScrollTop,r=o.ignoreCache;i?u.replace(e,t,{ignoreCache:r,ignoreScrollTop:n}):(a.push({state:t,url:e}),t&&(e+="?"+p.stringify(t)),n||window.scrollTo&&window.scrollTo({top:0}),setTimeout(function(){r&&(d=!0),history.pushState(t,"",e),window.dispatchEvent(new Event("pushState"))}))},u.replace=function(e,t,n){var o=void 0===n?{}:n,n=o.ignoreScrollTop,r=o.ignoreCache;a.push({state:t,url:e}),t&&(e+="?"+p.stringify(t)),n||window.scrollTo&&window.scrollTo({top:0}),setTimeout(function(){r&&(d=!0),history.replaceState(t,"",e),window.dispatchEvent(new Event("replaceState"))})},u.back=function(){return r=location.pathname,0===a.length?(history.replaceState({},"","/"),void window.dispatchEvent(new Event("backState"))):i?(a.pop(),0===a.length?history.replaceState({},"","/"):(e=(t=a[a.length-1]).state,t=t.url,history.replaceState(e,"",t)),void window.dispatchEvent(new Event("backState"))):void history.back();var e,t},u});
//# sourceMappingURL=index.js.map
