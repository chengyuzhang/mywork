webpackJsonp([6],{0:function(a,t,e){a.exports=e(32)},10:function(a,t){a.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAWBAMAAAAP/cBTAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUdwTDMzMzMzMzMzMzQ0NDQ0NDMzMzMzMzMzMzMzMzU1NTMzMzMzM1RK5dwAAAAMdFJOUwC98R6IDmukT9A0pZQfr1AAAAA5SURBVAjXY+A5wMDAQBYhCCTYTgKJoBNAwkeAgeewzgIGntPHgbJnlEGEA5A4FAAkjgF1MAowMAAAbHEVmP1n6ZsAAAAASUVORK5CYII="},12:function(a,t){a.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAWBAMAAAAP/cBTAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUdwTDMzMzMzMzMzMzQ0NDQ0NDMzMzMzMzMzMzMzMzMzMzU1NTMzM/6d6YoAAAAMdFJOUwDxtWsOiKUev9BPNKeKLJQAAAA3SURBVAjXY2BgYD7DwMDgCCJigAS7DJBgOwYk9ogDiZ6AMwxcBx3OMHAeZjjDwNTAAFJHLqEEAGMjFnYb1jHeAAAAAElFTkSuQmCC"},32:function(a,t,e){"use strict";function o(a){return a&&a.__esModule?a:{default:a}}e(2),e(75);var s=e(3),d=o(s),i=e(1),l=o(i),n=e(4);o(n),(0,i.rmSto)("goods-prevurl"),function(){var a=(0,d.default)(".wrap");(0,i.reTop)(a)}();var c={type:4,pageNum:1,pageSize:10},u=l.default+"/home/queryHomeGoodsByPage",r=0,f=[],g=[],m=[],A=[],h=[],p=[];!function(){function a(a,t,e){t.forEach(function(t,e){a+='<li class="goods-gife-item">\n                <img src="" data-src='+t.goodsPicture+' alt="">\n                <div>\n                    <h3>'+t.longName+"</h3>\n                    <em>￥"+t.salePrice+'</em>\n                </div>\n                <a href="goods-detail.html?id='+t.id+'"></a>\n            </li>'}),(0,d.default)(e).html(a),function(){var a=(0,d.default)(".goods-gife-list img");(0,i.imgLazy)(a)}(),function(){var a=(0,d.default)(".goods-gife-list1 img");(0,i.imgLazy)(a)}()}var t=null;(0,d.default)(".kind-gife .for-who").get(0).onclick=(0,d.default)(".kind-gife .for-what").get(0).onclick=function(){(0,d.default)(".opacity").css("display","block"),t=setTimeout(function(){(0,d.default)(".opacity").css("opacity",1)},50)},(0,d.default)(".close").get(0).onclick=function(){(0,d.default)(".opacity").css("opacity",0),t=setTimeout(function(){(0,d.default)(".opacity").css("display","none")},550)};var e=((0,d.default)(".for-who-ul"),(0,d.default)(".for-what-ul")),o=(0,d.default)(".for-who-ul li"),s=((0,d.default)(".for-what-ul li"),(0,d.default)(".for-what-h")),n="";d.default.ajax({type:"get",url:l.default+"/home/queryLabels",data:{},success:function(y){if(console.log("data::",y),y.head.code)return console.log(y.head.message),void(0,i.cancelImgLayer)();var y=y.body;y.labels.forEach(function(a,t){n+="<li data-id="+a.id+">"+a.labelContent+"<i></i></li>"}),(0,d.default)(e).html(n);var b=(0,d.default)(".for-what-ul li");b.forEach(function(a,t){(0,d.default)(a).attr("data-btn","true"),(0,d.default)(a).on("click",function(){(0,d.default)(this).hasClass("active")?((0,d.default)(a).attr("data-btn","true"),(0,d.default)(a).removeClass("active"),p[0]="",(0,d.default)(".for-what p").text("为了庆祝什么？")):(b.forEach(function(a,t){(0,d.default)(a).attr("data-btn","true"),(0,d.default)(a).removeClass("active")}),(0,d.default)(this).attr("data-btn","false"),(0,d.default)(this).addClass("active"),p[0]=parseInt(a.dataset.id),(0,d.default)(".for-what p").text((0,d.default)(this).text()))})}),o.forEach(function(a,t){(0,d.default)(a).attr("data-btn","true"),(0,d.default)(a).on("click",function(){(0,d.default)(this).hasClass("active")?((0,d.default)(a).attr("data-btn","true"),(0,d.default)(a).removeClass("active"),h[0]="",(0,d.default)(".for-who p").text("送给谁？")):(o.forEach(function(a,t){(0,d.default)(a).attr("data-btn","true"),(0,d.default)(a).removeClass("active")}),(0,d.default)(this).attr("data-btn","false"),(0,d.default)(this).addClass("active"),h[0]=parseInt(a.dataset.id),(0,d.default)(".for-who p").text((0,d.default)(this).text())),o.forEach(function(a,t){(0,d.default)(a).hasClass("parents")&&(b.forEach(function(a,t){(0,d.default)(a).attr("data-btn","true"),(0,d.default)(a).removeClass("active"),(0,d.default)(".for-what p").text("为了庆祝什么？")}),"false"==(0,d.default)(a).attr("data-btn")?(s.css("display","none"),e.css("display","none")):"true"==(0,d.default)(a).attr("data-btn")&&(s.css("display","block"),e.css("display","block")),p[0]="")})})}),(0,d.default)(".btn").get(0).onclick=function(){(0,d.default)(".opacity").css("opacity",0),t=setTimeout(function(){(0,d.default)(".opacity").css("display","none")},550),console.log("targetId:",h,"-labelId:",p),(0,i.showImgLayer)("数据请求中..."),d.default.ajax({type:"get",url:l.default+"/home/list/queryGoodsByParamAndPage",data:{pageNum:1,pageSize:10,targetIds:h,labelIds:p,sortIds:f,styleIds:g,materialIds:m,priceIds:A},success:function(t){console.log("data:",t),t.head.code&&console.log(t.head.message);var t=t.body,e=(0,d.default)(".goods-gife-list"),o="";a(o,t.goodsVoList,e),(0,i.cancelImgLayer)("数据请求中...")},error:function(){}}),r=0,c={pageNum:1,pageSize:10,targetIds:h,labelIds:p,sortIds:f,styleIds:g,materialIds:m,priceIds:A},u=l.default+"/home/list/queryGoodsByParamAndPage"}},error:function(a){console.log(a),(0,i.cancelImgLayer)()}})}(),function(){var a=(0,d.default)(".tab-bar>li"),t=(0,d.default)(".tab-bar-con"),e=(0,d.default)(".tab-bar-con>ul").height();a.forEach(function(o,s){o.dataset.btn="false",(0,d.default)(o).on("click",function(){"false"==o.dataset.btn?(t.css("height",e+5),a.forEach(function(a,t){a.dataset.btn="false",(0,d.default)(a).find("em").css("transform","rotate(180deg)")}),o.dataset.btn="true",(0,d.default)(o).find("em").css("transform","rotate(0deg)")):(t.css("height",0),o.dataset.btn="false",(0,d.default)(o).find("em").css("transform","rotate(180deg)"))})})}(),function(){function a(a,t,e){t.forEach(function(t,e){a+='<li class="goods-gife-item">\n                <img src="" data-src='+t.goodsPicture+' alt="">\n                <div>\n                    <h3>'+t.longName+"</h3>\n                    <em>￥"+t.salePrice+'</em>\n                </div>\n                <a href="goods-detail.html?id='+t.id+'"></a>\n            </li>'}),(0,d.default)(e).html(a),function(){var a=(0,d.default)(".goods-gife-list img");(0,i.imgLazy)(a)}(),function(){var a=(0,d.default)(".goods-gife-list1 img");(0,i.imgLazy)(a)}()}function t(a,t,e){console.log("arr:",t),t.forEach(function(t,e){a+='<li class="goods-gife-item">\n                <img src="" data-src='+t.goodsPicture+' alt="">\n                <div>\n                    <h3>'+t.longName+"</h3>\n                    <em>￥"+t.salePrice+'</em>\n                </div>\n                <a href="goods-detail.html?id='+t.id+'"></a>\n            </li>'}),(0,d.default)(e).append(a),function(){var a=(0,d.default)(".goods-gife-list img");(0,i.imgLazy)(a)}()}function o(a,e){var o=(0,d.default)(e),s=(0,d.default)(".refresh"),l=window.screen.availHeight,n=0,f=null,g=null,m=null,A=0,h=0;o.on("touchstart",function(a){A=a.changedTouches[0].pageY}),o.on("touchmove",function(a){h=a.changedTouches[0].pageY}),o.on("scroll",function(){var e=(0,d.default)(".goods-gife-list li:nth-last-of-type(1)"),o=0;(0,d.default)(".goods-gife-list li").length&&(o=e.offset().top,A-h>=0&&o<l+100&&(clearTimeout(f),f=setTimeout(function(){c.pageNum++,clearTimeout(m),(0,d.default)(s).html("正在加载中..."),(0,d.default)(s).css("bottom",0),d.default.ajax({type:"get",url:u,data:c,success:function(e){if(e.head.code)return console.log(e.head.message),void(0,i.cancelImgLayer)();var e=e.body;e.end?(r||t(a,e.goodsVoList,(0,d.default)(".goods-gife-list")),r++,n=c.pageNum-1,c.pageNum=n,(0,d.default)(s).html("已经到末尾咯~"),(0,d.default)(s).css("bottom",0),clearTimeout(g),g=setTimeout(function(){(0,d.default)(s).css("bottom","-1rem")},2e3)):(t(a,e.goodsVoList,(0,d.default)(".goods-gife-list")),m=setTimeout(function(){(0,d.default)(s).css("bottom","-1rem")},2e3),r=0),function(){var a=(0,d.default)(".goods-gife-list img");(0,i.imgLazy)(a)}()},error:function(a){console.log(a),(0,i.cancelImgLayer)()}})},1e3)))})}var s=((0,d.default)(".tab-bar"),(0,d.default)(".tab-bar li")),n=(0,d.default)(".tab-bar-con ul"),h=(0,d.default)(".goods-gife-list"),p=((0,d.default)(".goods-gife-list1"),""),y=(0,d.default)(".tab-bar>li"),b=(0,d.default)(".tab-bar-con");(0,i.showImgLayer)("数据请求中..."),d.default.ajax({type:"get",url:l.default+"/search/result/queryConfig",data:{},success:function(t){function o(a,t,o){a.forEach(function(a,s){a.active?"sorts"==o&&3==a.id?(t+='<li class="active" data-id='+a.id+" data-type="+o+">",t+="<span>"+a.name+'<em style="background:url('+e(10)+') no-repeat; background-size:100% 100%;"></em></span>',t+="<i></i>\n                            </li>"):"sorts"==o&&4==a.id?(t+='<li class="active" data-id='+a.id+" data-type="+o+">",t+="<span>"+a.name+'<em style="background:url('+e(12)+') no-repeat; background-size:100% 100%;"></em></span>',t+="<i></i>\n                            </li>"):t+='<li class="active" data-id='+a.id+" data-type="+o+">\n                                <span>"+a.name+"</span>\n                                <i></i>\n                            </li>":"sorts"==o&&3==a.id?(t+='<li class="" data-id='+a.id+" data-type="+o+">",t+="<span>"+a.name+'<em style="background:url('+e(10)+') no-repeat; background-size:100% 100%;"></em></span>',t+="<i></i>\n                            </li>"):"sorts"==o&&4==a.id?(t+='<li class="" data-id='+a.id+" data-type="+o+">",t+="<span>"+a.name+'<em style="background:url('+e(12)+') no-repeat; background-size:100% 100%;"></em></span>',t+="<i></i>\n                            </li>"):t+='<li class="" data-id='+a.id+" data-type="+o+">\n                                <span>"+a.name+"</span>\n                                <i></i>\n                            </li>"}),(0,d.default)(n).html(t)}if(t.head.code)return console.log(t.head.message),void(0,i.cancelImgLayer)();var t=t.body;for(var v in t)t[v].forEach(function(a,t){0==t||(a.active=!1)});(0,i.cancelImgLayer)(),s.forEach(function(n,v){(0,d.default)(n).on("click",function(){var n="";switch(v){case 0:o(t.sorts,n,"sorts");break;case 1:o(t.styles,n,"styles");break;case 2:o(t.materials,n,"materials");break;case 3:o(t.prices,n,"prices")}var z=(0,d.default)(".tab-bar-con li");z.forEach(function(o,n){(0,d.default)(o).on("click",function(){var v=1,M=10;switch((0,i.showImgLayer)("数据请求中..."),o.dataset.type){case"sorts":f[0]=parseInt(o.dataset.id);var I=(0,d.default)(o).find("span").text();"价格由高到低"==I&&(I='价格<i style="background:url('+e(10)+') no-repeat; background-size:100% 100%;"></i>'),"价格由低到高"==I&&(I='价格<i style="background:url('+e(12)+') no-repeat; background-size:100% 100%;"></i>'),(0,d.default)(s[0]).find("span").html(I);break;case"styles":g[0]=parseInt(o.dataset.id),(0,d.default)(s[1]).find("span").text((0,d.default)(o).find("span").text());break;case"materials":m[0]=parseInt(o.dataset.id),(0,d.default)(s[2]).find("span").text((0,d.default)(o).find("span").text());break;case"prices":A[0]=parseInt(o.dataset.id),(0,d.default)(s[3]).find("span").text((0,d.default)(o).find("span").text())}t[o.dataset.type].forEach(function(a,t){a.active=!1}),t[o.dataset.type][n].active=!0,b.css("height",0),y.forEach(function(a,t){a.dataset.btn="false",(0,d.default)(a).find("em").css("transform","rotate(180deg)")}),d.default.ajax({type:"get",url:l.default+"/home/list/queryGoodsByParamAndPage",data:{pageNum:v,pageSize:M,sortIds:f,styleIds:g,materialIds:m,priceIds:A},success:function(t){if(t.head.code)return console.log(t.head.message),void(0,i.cancelImgLayer)();var t=t.body;a(p,t.goodsVoList,h),(0,i.cancelImgLayer)()},error:function(a){console.log(a),(0,i.cancelImgLayer)()}}),r=0,c={pageNum:1,pageSize:10,sortIds:f,styleIds:g,materialIds:m,priceIds:A},u=l.default+"/home/list/queryGoodsByParamAndPage",z.forEach(function(a,t){(0,d.default)(a).removeClass("active")}),(0,d.default)(o).addClass("active")})})})})},error:function(a){console.log(a),(0,i.cancelImgLayer)()}}),d.default.ajax({type:"get",url:l.default+"/home/queryHomeGoodsByPage",data:{type:4,pageNum:1,pageSize:10},success:function(t){t.head.code&&console.log(t.head.message);var t=t.body;a(p,t.goodsVoList,h)},error:function(){}}),o(p,(0,d.default)(".wrap"))}()},75:2});