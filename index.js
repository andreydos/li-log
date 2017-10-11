(function(a,b){'object'==typeof exports&&'undefined'!=typeof module?module.exports=b(require('format-date-time')):'function'==typeof define&&define.amd?define(['format-date-time'],b):a.LiLog=b(a['format-date-time'])})(this,function(a){'use strict';function b(a){function b(a){for(var c={},e=Object.keys(a),f=e.length;f;){var g=e[f];c[g]='object'===d(a[g])&&null!==a[g]?b(a[g]):a[g],f-=1}return c}for(var c={},e=Object.keys(a),f=e.length;f;){var g=e[f],h=a[g];c[g]=Array.isArray(h)?h.slice(0):'object'===('undefined'==typeof h?'undefined':d(h))?b(h):h,f-=1}return c}function c(a){for(var b=a+'';b.length<2;)b='0'+a;return b}a=a&&a.hasOwnProperty('default')?a['default']:a;var d='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a},e=function(){function a(a){this.value=a}function b(b){function c(e,f){try{var g=b[e](f),h=g.value;h instanceof a?Promise.resolve(h.value).then(function(a){c('next',a)},function(a){c('throw',a)}):d(g.done?'return':'normal',g.value)}catch(a){d('throw',a)}}function d(a,b){'return'===a?e.resolve({value:b,done:!0}):'throw'===a?e.reject(b):e.resolve({value:b,done:!1});e=e.next,e?c(e.key,e.arg):f=null}var e,f;this._invoke=function(a,b){return new Promise(function(d,g){var h={key:a,arg:b,resolve:d,reject:g,next:null};f?f=f.next=h:(e=f=h,c(a,b))})},'function'!=typeof b.return&&(this.return=void 0)}return'function'==typeof Symbol&&Symbol.asyncIterator&&(b.prototype[Symbol.asyncIterator]=function(){return this}),b.prototype.next=function(a){return this._invoke('next',a)},b.prototype.throw=function(a){return this._invoke('throw',a)},b.prototype.return=function(a){return this._invoke('return',a)},{wrap:function(a){return function(){return new b(a.apply(this,arguments))}},await:function(b){return new a(b)}}}(),f=function(){function a(a,b){var c,d=[],e=!0,f=!1;try{for(var g,h=a[Symbol.iterator]();!(e=(g=h.next()).done)&&(d.push(g.value),!(b&&d.length===b));e=!0);}catch(a){f=!0,c=a}finally{try{!e&&h['return']&&h['return']()}finally{if(f)throw c}}return d}return function(b,c){if(Array.isArray(b))return b;if(Symbol.iterator in Object(b))return a(b,c);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}(),g=function(){try{return!!window}catch(a){return!1}}(),h=function(){try{return!!global}catch(a){return!1}}(),i={mergeOptions:function(a,c){for(var d=b(a),e=Object.keys(c),f=e.length;f;){var g=e[f];d[g]=c[g],f-=1}return d},isBrowser:g,isNode:h,getTime:function(){var a=new Date,b=c(a.getHours()),d=c(a.getMinutes()),e=c(a.getSeconds());return b+':'+d+':'+e}},j={debug:'font-browserStyle: italic; color: #1B2B34;',info:'color: #6699CC;',warning:'font-weight: bold; color: #AB7967;',error:'font-weight: bold; color: #E24825;',critical:'font-weight: bold; color: #FAFAFA; padding: 3px; background: linear-gradient(#D33106, #571402);'},k=/at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i,l=/at\s+()(.*):(\d*):(\d*)/i;return function(b){function c(a,b,c){if(!(q||b.level<a.level||a.outputMethodOnly.length&&!a.outputMethodOnly.includes(b.name))){var d,g='',j={method:'',line:'',file:''};if(a.showStackData){var n=new Error().stack.split('\n').slice(3),o=n[0],p=k.exec(o)||l.exec(o);if(p&&5===p.length){var r=f(p,4),s=r[0],t=r[1],u=r[2],v=r[3];j.message=s,j.method=t,j.path=u,j.line=v,j.file=j.path.split(/[\\/]/).pop(),j.stack=n.join('\n')}g=j.method?' | Message from: '+j.file+' at '+j.method+'() line:'+j.line:' | Message from: '+j.file+' at line:'+j.line}d=m?e.now()+' <'+b.name+'> '+c+g:i.getTime()+' <'+b.name+'> '+c+g,a.coloredOutput&&(h?d='%c'+d:m&&(d=''+d));var w={message:d,browserStyle:b.browserStyle,nodeStyle:b.nodeStyle};a.transport.forEach(function(a){if('function'==typeof a)a(w);else throw new Error('Transport item not a function')})}}var e,g=this,h=i.isBrowser,m=i.isNode,n=i.mergeOptions,o={level:1,coloredOutput:!0,outputMethodOnly:[],showStackData:!0,logMethods:[{name:'debug',level:0,browserStyle:j.debug},{name:'info',level:1,browserStyle:j.info},{name:'warning',level:2,browserStyle:j.warning},{name:'error',level:3,browserStyle:j.error},{name:'critical',level:4,browserStyle:j.critical}],transport:[function(a){h?o.coloredOutput?console.log(a.message,a.browserStyle):console.log(a.message):console.log(a.message)}]},p=o,q=!1;m&&(e=new a('HH:mm:ss')),'object'===('undefined'==typeof b?'undefined':d(b))?p=n(o,b):'string'==typeof b&&'no-color'===b&&(o.coloredOutput=!1),p.logMethods.forEach(function(a){g[a.name]=a.level>=p.level?function(){for(var b=arguments.length,d=Array(b),e=0;e<b;e++)d[e]=arguments[e];return c(p,a,d)}:function(){}}),this.setLevel=function(a){if(Number.isInteger(a))p.level=a;else if('string'==typeof a){var b=p.logMethods.filter(function(b){return b.name===a});Array.isArray(b)&&b.length&&(p.level=b[0].level)}else console.log('setLevel() level '+a+' was not found in LiLog instance')},this.disable=function(){q=!0},this.outputOnly=function(a){Array.isArray(a)?p.outputMethodOnly=a:'string'==typeof a&&(p.outputMethodOnly=[a])},this.disableOutputOnlyOption=function(){p.outputMethodOnly=[]}}});
