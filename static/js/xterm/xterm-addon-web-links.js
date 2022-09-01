!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.WebLinksAddon=t():e.WebLinksAddon=t()}(self,(function(){return(()=>{"use strict";var e={6:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LinkComputer=t.WebLinkProvider=void 0;var r=function(){function e(e,t,r,n){void 0===n&&(n={}),this._terminal=e,this._regex=t,this._handler=r,this._options=n}return e.prototype.provideLinks=function(e,t){var r=n.computeLink(e,this._regex,this._terminal,this._handler);t(this._addCallbacks(r))},e.prototype._addCallbacks=function(e){var t=this;return e.map((function(e){return e.leave=t._options.leave,e.hover=function(r,n){if(t._options.hover){var i=e.range;t._options.hover(r,n,i)}},e}))},e}();t.WebLinkProvider=r;var n=function(){function e(){}return e.computeLink=function(t,r,n,i){for(var o,a=new RegExp(r.source,(r.flags||"")+"g"),s=e._translateBufferLineToStringWithWrap(t-1,!1,n),d=s[0],l=s[1],u=-1,c=[];null!==(o=a.exec(d));){var f=o[1];if(!f){console.log("match found without corresponding matchIndex");break}if(u=d.indexOf(f,u+1),a.lastIndex=u+f.length,u<0)break;for(var p=u+f.length,v=l+1;p>n.cols;)p-=n.cols,v++;for(var h=u+1,_=l+1;h>n.cols;)h-=n.cols,_++;var b={start:{x:h,y:_},end:{x:p,y:v}};c.push({range:b,text:f,activate:i})}return c},e._translateBufferLineToStringWithWrap=function(e,t,r){var n,i,o="";do{if(!(s=r.buffer.active.getLine(e)))break;s.isWrapped&&e--,i=s.isWrapped}while(i);var a=e;do{var s,d=r.buffer.active.getLine(e+1);if(n=!!d&&d.isWrapped,!(s=r.buffer.active.getLine(e)))break;o+=s.translateToString(!n&&t).substring(0,r.cols),e++}while(n);return[o,a]},e}();t.LinkComputer=n}},t={};function r(n){var i=t[n];if(void 0!==i)return i.exports;var o=t[n]={exports:{}};return e[n](o,o.exports,r),o.exports}var n={};return(()=>{var e=n;Object.defineProperty(e,"__esModule",{value:!0}),e.WebLinksAddon=void 0;var t=r(6),i=new RegExp("(?:^|[^\\da-z\\.-]+)((https?:\\/\\/)((([\\da-z\\.-]+)\\.([a-z\\.]{2,18}))|((\\d{1,3}\\.){3}\\d{1,3})|(localhost))(:\\d{1,5})?((\\/[\\/\\w\\.\\-%~:+@]*)*([^:\"'\\s]))?(\\?[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&'*+,:;~\\=\\.\\-]*)?(#[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&'*+,:;~\\=\\.\\-]*)?)($|[^\\/\\w\\.\\-%]+)");function o(e,t){var r=window.open();if(r){try{r.opener=null}catch(e){}r.location.href=t}else console.warn("Opening link blocked as opener could not be cleared")}var a=function(){function e(e,t){void 0===e&&(e=o),void 0===t&&(t={}),this._handler=e,this._options=t}return e.prototype.activate=function(e){this._terminal=e;var r=this._options,n=r.urlRegex||i;this._linkProvider=this._terminal.registerLinkProvider(new t.WebLinkProvider(this._terminal,n,this._handler,r))},e.prototype.dispose=function(){var e;null===(e=this._linkProvider)||void 0===e||e.dispose()},e}();e.WebLinksAddon=a})(),n})()}));
//# sourceMappingURL=xterm-addon-web-links.js.map