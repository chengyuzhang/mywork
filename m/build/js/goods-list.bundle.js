webpackJsonp([31],{0:function(e,t,a){e.exports=a(35)},35:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}a(2),a(78);var s=a(3),o=i(s),l=a(1),d=i(l),n=a(4);i(n),!function(){var e=(0,o.default)(".wrap");(0,l.reTop)(e)}(),(0,l.rmSto)("goods-prevurl"),function(){function e(e,t,a){t.forEach(function(t,a){e+='<li class="goods-gife-item">\n                <img src="" data-src='+t.goodsPicture+' alt="">\n                <div>\n                    <h3>'+t.longName+"</h3>\n                    <em>￥"+t.salePrice+'</em>\n                </div>\n                <a href="goods-detail.html?id='+t.id+'"></a>\n            </li>'}),(0,o.default)(a).html(e),function(){var e=(0,o.default)(".goods-gife-list img");(0,l.imgLazy)(e)}(),function(){var e=(0,o.default)(".goods-gife-list1 img");(0,l.imgLazy)(e)}()}function t(e,t,a){console.log("arr:",t),t.forEach(function(t,a){e+='<li class="goods-gife-item">\n                <img src="" data-src='+t.goodsPicture+' alt="">\n                <div>\n                    <h3>'+t.longName+"</h3>\n                    <em>￥"+t.salePrice+'</em>\n                </div>\n                <a href="goods-detail.html?id='+t.id+'"></a>\n            </li>'}),(0,o.default)(a).append(e),function(){var e=(0,o.default)(".goods-gife-list img");(0,l.imgLazy)(e)}()}function a(e,a){var i=(0,o.default)(a),s=(0,o.default)(".refresh"),d=window.screen.availHeight,c=0,f=null,g=null,m=null,p=0,h=0;i.on("touchstart",function(e){p=e.changedTouches[0].pageY}),i.on("touchmove",function(e){h=e.changedTouches[0].pageY}),i.on("scroll",function(){var a=(0,o.default)(".goods-gife-list li:nth-last-of-type(1)"),i=0;(0,o.default)(".goods-gife-list li").length&&(i=a.offset().top,p-h>=0&&i<d+100&&(clearTimeout(f),f=setTimeout(function(){n.pageNum++,clearTimeout(m),(0,o.default)(s).html("正在加载中..."),(0,o.default)(s).css("bottom",0),o.default.ajax({type:"get",url:r,data:n,success:function(a){if(!a.head.code){console.log("xx:",a);var a=a.body;a.end?(u||t(e,a.goodsVoList,(0,o.default)(".goods-gife-list")),u++,c=n.pageNum-1,n.pageNum=c,(0,o.default)(s).html("已经到末尾咯~"),(0,o.default)(s).css("bottom",0),clearTimeout(g),g=setTimeout(function(){(0,o.default)(s).css("bottom","-1rem")},2e3)):(t(e,a.goodsVoList,(0,o.default)(".goods-gife-list")),m=setTimeout(function(){(0,o.default)(s).css("bottom","-1rem")},2e3),u=0),function(){var e=(0,o.default)(".goods-gife-list img");(0,l.imgLazy)(e)}()}}})},1e3)))})}var i=((0,o.default)(".tab-bar"),(0,o.default)(".tab-bar li"),(0,o.default)(".goods-gife-list")),s=((0,o.default)(".goods-gife-list1"),""),n={type:5,pageNum:1,pageSize:10},r=d.default+"/home/queryHomeGoodsByPage";if((0,l.getSto)("goods-list")){var c=JSON.parse((0,l.getSto)("goods-list"));r=d.default+"/home/list/queryGoodsByParamAndPage",n={pageNum:1,pageSize:10,sortIds:1,styleIds:c.styleIds,materialIds:c.materialIds,priceIds:c.priceIds}}var u=0;(0,l.showImgLayer)("数据请求中..."),o.default.ajax({type:"get",url:d.default+"/search/result/queryConfig",data:{},success:function(t){function a(e,t){var a="",i=(0,o.default)("."+t).find("ul");e.forEach(function(e,i){a+=e.active?'<li class="" data-id='+e.id+" data-type="+t+">\n                            "+e.name+"\n                            <b></b>\n                        </li>":"<li data-id="+e.id+" data-type="+t+">\n                            "+e.name+"\n                            <b></b>\n                        </li>"}),(0,o.default)(i).html(a)}if(t.head.code)return console.log(t.head.message),void(0,l.cancelImgLayer)();var t=t.body;for(var c in t)t[c].forEach(function(e,t){0==t?e.active=!0:e.active=!1});var f=[1],g=[],m=[],p=[];if((0,l.getSto)("goods-list")){var h=JSON.parse((0,l.getSto)("goods-list"));f=[1],g=h.styleIds||[],m=h.materialIds||[],p=h.priceIds||[]}console.log("-styleId:",g,"-materialId:",m,"-priceId:",p);for(var c in t)"sorts"!=c&&a(t[c],c);(0,l.cancelImgLayer)(),function(){function t(e,t,a){e.iBtn=!0,(0,o.default)(e).on("click",function(){e.iBtn?((0,o.default)(t).css("height","auto"),(0,o.default)(a).addClass("active")):((0,o.default)(t).css("height",".34rem"),(0,o.default)(a).removeClass("active")),e.iBtn=!e.iBtn}),console.log(":",(0,o.default)(t).height())}function a(t,a,c){var h=[];t.forEach(function(t,v){t.iBtn=!0,(0,o.default)(t).on("click",function(){switch(c){case"styles":t.iBtn?((0,o.default)(t).addClass("active"),a.addClass("active"),h.push((0,o.default)(this).text()),g[v]=parseInt(t.dataset.id),a.text(h.join("，"))):((0,o.default)(t).removeClass("active"),h.splice((0,l.findArrIndex)(h,(0,o.default)(this).text()),1),g[v]="",a.text(h.join("，")),0==h.length&&(a.removeClass("active"),a.text("全部")));break;case"materials":t.iBtn?((0,o.default)(t).addClass("active"),a.addClass("active"),h.push((0,o.default)(this).text()),m[v]=parseInt(t.dataset.id),a.text(h.join("，"))):((0,o.default)(t).removeClass("active"),h.splice((0,l.findArrIndex)(h,(0,o.default)(this).text()),1),m[v]="",a.text(h.join("，")),0==h.length&&(a.removeClass("active"),a.text("全部")));break;case"prices":t.iBtn?((0,o.default)(t).addClass("active"),a.addClass("active"),h.push((0,o.default)(this).text()),p[v]=parseInt(t.dataset.id),a.text(h.join("，"))):((0,o.default)(t).removeClass("active"),h.splice((0,l.findArrIndex)(h,(0,o.default)(this).text()),1),p[v]="",a.text(h.join("，")),0==h.length&&(a.removeClass("active"),a.text("全部")))}(0,l.setSto)("goods-list",JSON.stringify({styleIds:g,materialIds:m,priceIds:p})),console.log("-styleId:",g,"-materialId:",m,"-priceId:",p),t.iBtn=!t.iBtn,(0,l.showImgLayer)("数据请求中..."),o.default.ajax({type:"get",url:d.default+"/home/list/queryGoodsByParamAndPage",data:{pageNum:1,pageSize:10,sortIds:f,styleIds:g,materialIds:m,priceIds:p},success:function(t){t.head.code&&console.log(t.head.message);var t=t.body;e(s,t.goodsVoList,i),(0,l.cancelImgLayer)()},error:function(){}}),u=0,n={pageNum:1,pageSize:10,sortIds:f,styleIds:g,materialIds:m,priceIds:p},r=d.default+"/home/list/queryGoodsByParamAndPage"})})}var c=(0,o.default)(".tab-bar-item-top"),h=(0,o.default)(".tab-bar-item ul"),v=(0,o.default)(".tab-bar-item i");c.forEach(function(e,a){t(e,h[a],v[a])});var y=(0,o.default)(".type li"),I=(0,o.default)(".material li"),b=(0,o.default)(".price li"),x=(0,o.default)(".type p"),C=(0,o.default)(".material p"),L=(0,o.default)(".price p");if(a(y,x,"styles"),a(I,C,"materials"),a(b,L,"prices"),(0,l.getSto)("goods-list")){var S=function(e,t){e.forEach(function(e,a){B[t].forEach(function(t,i){t&&a==t-1&&((0,o.default)(e).addClass("active"),e.iBtn=!1)})})},B=JSON.parse((0,l.getSto)("goods-list"));console.log("d:",B);for(var N in B)"styleIds"==N&&S((0,o.default)(".styles li"),"styleIds"),"materialIds"==N&&S((0,o.default)(".materials li"),"materialIds"),"priceIds"==N&&S((0,o.default)(".prices li"),"priceIds")}}()},error:function(e){console.log(e),(0,l.cancelImgLayer)()}}),o.default.ajax({type:"get",url:r,data:n,success:function(t){if(console.log(t),t.head.code)return console.log(t.head.message),void(0,l.cancelImgLayer)();var t=t.body;e(s,t.goodsVoList,i)},error:function(e){console.log(e),(0,l.cancelImgLayer)()}}),a(s,(0,o.default)(".wrap"))}()},78:2});