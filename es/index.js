var x=Object.create,m=Object.defineProperty,I=Object.getPrototypeOf,O=Object.prototype.hasOwnProperty,P=Object.getOwnPropertyNames,U=Object.getOwnPropertyDescriptor;var j=e=>m(e,"__esModule",{value:!0});var M=(e,t)=>()=>(t||(t={exports:{}},e(t.exports,t)),t.exports);var F=(e,t,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of P(t))!O.call(e,r)&&r!=="default"&&m(e,r,{get:()=>t[r],enumerable:!(s=U(t,r))||s.enumerable});return e},W=e=>F(j(m(e!=null?x(I(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var k=M((w,R)=>{(function(e,t){typeof w=="object"&&typeof R!="undefined"?t(w):typeof define=="function"&&define.amd?define(["exports"],t):t((e=e||self).queryString={})})(w,function(e){"use strict";function t(o){try{return decodeURIComponent(o.replace(/\+/g," "))}catch(a){return null}}function s(o){try{return encodeURIComponent(o)}catch(a){return null}}function r(o,a){if(!o)return null;for(var n,i=/([^=?&]+)=?([^&]*)/g,c={};n=i.exec(o);){var p=t(n[1]),d=t(n[2]);if(!(p===null||d===null||p in c))if(a||typeof d!="string")c[p]=d;else{var E=Number(d),v=isNaN(E)?d:E;c[p]=d==v.toString()?v:d}}return c}function f(o,a){a===void 0&&(a="");var n,i,c=[];for(i in typeof a!="string"&&(a="?"),o)if(Object.prototype.hasOwnProperty.call(o,i)){if((n=o[i])||n!=null&&!isNaN(n)||(n=""),i=encodeURIComponent(i),n=encodeURIComponent(n),i===null||n===null)continue;c.push(i+"="+n)}return c.length?a+c.join("&"):""}var g={parse:r,stringify:f,decode:t,encode:s};e.decode=t,e.default=g,e.encode=s,e.parse=r,e.stringify=f,Object.defineProperty(e,"__esModule",{value:!0})})});var h=W(k()),A=navigator.userAgent,L=/(?:iphone)/.test(A),$=/MicroMessenger/.test(A),T=$&&L,y={},C=[];["popstate","pushState","replaceState","backState"].forEach(e=>{window.addEventListener(e,()=>{l.state=h.default.parse(location.search),C.forEach(t=>t()),(e==="popstate"||e==="backState")&&delete y[q],e==="popstate"&&u.pop()})});function S(e){let t=document.createElement("span");return t.style.display="none",t.setAttribute("aoife-route",e),t}var N=0,b=!1,q="",u=[],_={},l=({url:e,render:t,preload:s,cache:r})=>{if(typeof t!="function")throw"AoifeRoute.render need a Function";!s&&typeof e=="string"&&(_[e]=t),N+=1;let f=""+N,g=()=>{if(s&&t(),typeof e=="function"){if(!e())return S(f)}else if(h.default.decode(window.location.pathname)!==e)return S(f);if(typeof e=="string"&&y[e]){let n=y[e],i=window.aoife;return i&&i.waitAppend(n).then(()=>{i.next(n)}),n}let o=r&&!b&&typeof e=="string";b=!1;let a=t();if(a.then){let n=S(f);return Promise.resolve(a).then(i=>{if(i.default){let c=document.querySelector(`[aoife-route="${f}"]`);if(!c)return;let p=i.default();p.setAttribute("aoife-route",f),o&&(y[e]=p),c.replaceWith(p)}}),n}return a.setAttribute("aoife-route",f),o&&(y[e]=a),a};return C.push(()=>{let o=document.querySelector(`[aoife-route="${f}"]`);!o||o.replaceWith(g())}),g()};l.preload=e=>{let t=_[e];t&&t()};l.state={};l.queryString=h.default;l.push=(e,t,{ignoreScrollTop:s,ignoreCache:r}={})=>{if(T){l.replace(e,t,{ignoreCache:r,ignoreScrollTop:s});return}u.push({state:t,url:e}),t&&(e+="?"+h.default.stringify(t)),s||window.scrollTo&&window.scrollTo({top:0}),setTimeout(()=>{r&&(b=!0),history.pushState(t,"",e),window.dispatchEvent(new Event("pushState"))})};l.replace=(e,t,{ignoreScrollTop:s,ignoreCache:r}={})=>{u.push({state:t,url:e}),t&&(e+="?"+h.default.stringify(t)),s||window.scrollTo&&window.scrollTo({top:0}),setTimeout(()=>{r&&(b=!0),history.replaceState(t,"",e),window.dispatchEvent(new Event("replaceState"))})};l.back=()=>{if(q=location.pathname,u.length===0){history.replaceState({},"","/"),window.dispatchEvent(new Event("backState"));return}if(T){if(u.pop(),u.length===0)history.replaceState({},"","/");else{let{state:e,url:t}=u[u.length-1];history.replaceState(e,"",t)}window.dispatchEvent(new Event("backState"));return}history.back()};var H=l;export{H as default};
