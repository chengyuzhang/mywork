webpackJsonp([33],{0:function(t,a,e){t.exports=e(33)},33:function(t,a,e){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}e(2),e(76);var s=e(3),d=o(s),l=e(1),n=o(l),i=e(4),c=o(i);!function(){var t=(0,d.default)(".wrap");(0,l.reTop)(t)}(),function(){var t=(0,l.getSto)("goods-prevurl",(0,l.prevUrl)());t?(0,d.default)("header>a").attr("href",t):((0,d.default)("header>a").attr("href",(0,l.prevUrl)()),(0,l.setSto)("goods-prevurl",(0,l.prevUrl)()))}(),(0,l.cartCount)((0,d.default)(".shopping-car .car b")),(0,d.default)(".rate>button>a").attr("href","comments.html?id="+(0,l.url_search)().id),function(){var t=(0,d.default)("header"),a=(0,d.default)(".goods-detail"),e=(0,d.default)(".goods-detail .swiper-slide>img").height(),o=0,s=null,l=null,n=null,i=0;(0,d.default)("body").on("touchmove",function(d){clearInterval(s),clearInterval(l),clearInterval(n),d.changedTouches[0],s=setInterval(function(){o=Math.abs(a.get(0).getBoundingClientRect().top),i=o<=e?o/e:1,t.css("background","rgba(255,255,255,"+i+")"),t.css("border-bottom","1px solid rgba(240,240,240,"+i+")")},50),l=setInterval(function(){1==i&&(clearInterval(s),clearInterval(l))},500)}),(0,d.default)("body").on("touchend",function(t){n=setTimeout(function(){clearInterval(s),clearInterval(l)},1500)})}(),function(){var t=(0,d.default)(".swiper-wrapper"),a="",e=(0,d.default)(".goods-color-list"),o="",s=(0,d.default)(".goods-detail>span"),i=(0,d.default)(".shopping-car"),r=(0,d.default)(".goods-sign>span>em"),u=(0,d.default)(".goods-about>h2"),f=(0,d.default)(".goods-about>p"),p=(0,d.default)(".goods-sign>p>span"),m=(0,d.default)(".goods-sign"),g="",h=(0,d.default)(".goods-introduce"),y="",v=(0,d.default)(".rate>h2>em"),b=(0,d.default)(".opacity-wrap-top>img"),k=(0,d.default)(".goods-type ul"),I="",w=(0,d.default)(".goods-parts ul"),C="",S=(0,d.default)(".opacity-wrap-top>div>span"),N=(0,d.default)(".opacity-wrap-top>div>p");(0,l.showImgLayer)("数据请求中..."),d.default.ajax({type:"get",url:n.default+"/goods/detail/queryGoodsById",data:{goodsId:(0,l.url_search)().id},success:function(E){if(E.head.code)return alert(E.head.message),void(location.href=(0,l.prevUrl)());var E=E.body.goods;(0,d.default)(v).html(E.messageCount),E.messageCount||(0,d.default)(".rate>button").css("display","none"),(0,d.default)(b).attr("src",E.topPictures[0]);var T=null,P=null,x=0,L=E.custom,J="";E.relationGoods.length&&E.relationGoods.forEach(function(t,a){t.soldout?I+='<li class="saleout" data-btn="false" data-id='+t.id+" data-code="+t.code+">"+t.name+"<span></span></li>":t.mark?(I+='<li class="active" data-default="true" data-btn="true" data-id='+t.id+" data-code="+t.code+">"+t.name+"<span></span></li>",(0,d.default)(".opacity-button").attr("data-id",t.id),d.default.ajax({type:"get",url:n.default+"/goods/detail/queryAccessory",data:{goodsId:t.id},success:function(t){if(t.head.code)return void alert(t.head.message);var t=t.body;(0,d.default)(S).html(t.goods.code),(0,d.default)(N).html("￥"+t.goods.salePrice),L=t.goods.customizationStatus,L?(0,d.default)(".custom-wrap").css("display","block"):(0,d.default)(".custom-wrap").css("display","none"),x=t.accessorys.length,x?(0,d.default)(".goods-parts").css("display","block"):(0,d.default)(".goods-parts").css("display","none"),t.accessorys.forEach(function(t,a){t&&(C+="<li data-id="+t.id+">"+t.length+"<span></span></li>")}),(0,d.default)(w).html(C);var a=(0,d.default)(".goods-parts li"),e=0;a.forEach(function(t,o){(0,d.default)(t).on("click",function(){(0,d.default)(a[e]).removeClass("active"),(0,d.default)(t).addClass("active"),T=parseInt(t.dataset.id),e=o})})},error:function(){}})):I+='<li data-btn="true" data-default="false" data-id='+t.id+" data-code="+t.code+">"+t.name+"<span></span></li>"}),(0,d.default)(k).html(I),(0,d.default)(N).html("￥"+E.salePrice),(0,l.cancelImgLayer)(),function(){function t(t){(0,l.showImgLayer)("数据请求中...");var e=(0,l.getSto)("token");d.default.ajax({type:"post",headers:(0,l.signName)(c.default,a,e),url:n.default+"/shoppingcart/addShoppingCart",data:t,success:function(a){a.head.code&&(71982==a.head.code&&((0,l.rmSto)("nickname"),(0,l.rmSto)("timestamp"),(0,l.rmSto)("token"),(0,l.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),alert(a.head.message)),(0,l.cartCount)((0,d.default)(".shopping-car .car b")),location.href="goods-detail.html?id="+t.goodsId},error:function(){}})}var a=(0,l.getSto)("vipNo"),e=(0,d.default)(".opacity-wrap-top>span"),o=(0,d.default)(".shopping-car>i"),s=(0,d.default)(".shopping-car>b"),i=(0,d.default)(".opacity-button"),r=!0,u=(0,d.default)(".opacity"),f=(0,d.default)(".opacity-con"),p=(0,d.default)(".custom-wrap"),m=(0,d.default)(".goods-count .minus"),g=(0,d.default)(".goods-count .add"),h=(0,d.default)(".goods-type li"),y=(0,d.default)(".goods-count li.count"),v=1,k=0,I=0;h.forEach(function(t,a){"true"==t.dataset.default&&(k=a)}),o.on("click",function(){(0,d.default)(u).css("display","block"),r=!0,L?(0,d.default)(p).css("display","block"):(0,d.default)(p).css("display","none"),setTimeout(function(){(0,d.default)(u).css("opacity",1),(0,d.default)(f).css("top",0)},50)}),s.on("click",function(){(0,d.default)(u).css("display","block"),r=!1,L?(0,d.default)(p).css("display","block"):(0,d.default)(p).css("display","none"),setTimeout(function(){(0,d.default)(u).css("opacity",1),(0,d.default)(f).css("top",0)},50)}),h.forEach(function(t,a){"true"==t.dataset.default&&(P=t.dataset.id),(0,d.default)(t).on("click",function(){"false"!=(0,d.default)(this).get(0).dataset.btn&&((0,d.default)(h[k]).removeClass("active"),(0,d.default)(t).addClass("active"),P=parseInt(t.dataset.id),k=a,C="",T="",(0,l.showImgLayer)("数据请求中..."),d.default.ajax({type:"get",url:n.default+"/goods/detail/queryAccessory",data:{goodsId:t.dataset.id},success:function(a){a.head.code&&alert(a.head.message);var a=a.body;(0,d.default)(b).attr("src",a.goods.mainPicture),(0,d.default)(S).html(a.goods.code),(0,d.default)(N).html("￥"+a.goods.salePrice),L=a.goods.customizationStatus,L?(0,d.default)(".custom-wrap").css("display","block"):(0,d.default)(".custom-wrap").css("display","none"),(0,d.default)(i).attr("data-id",t.dataset.id),x=a.accessorys.length,x?(0,d.default)(".goods-parts").css("display","block"):(0,d.default)(".goods-parts").css("display","none"),a.accessorys.forEach(function(t,a){t&&(C+="<li data-id="+t.id+">"+t.length+"<span></span></li>")}),(0,d.default)(w).html(C);var e=(0,d.default)(".goods-parts li");e.forEach(function(t,a){(0,d.default)(t).on("click",function(){(0,d.default)(e[I]).removeClass("active"),(0,d.default)(t).addClass("active"),T=parseInt(t.dataset.id),I=a})}),(0,l.cancelImgLayer)()},error:function(){}}))})}),m.on("click",function(){v<=1||(v--,(0,d.default)(y).text(v))}),g.on("click",function(){v>=9||(v++,(0,d.default)(y).text(v))});var E=JSON.parse((0,l.getSto)("tempCart"))||[];(0,d.default)(".remark>div>textarea").on("input",function(){J.length<=140?J=(0,d.default)(".remark>div>textarea").val():((0,d.default)(".remark>div>textarea").val(J),alert("最多只能输入140个字符~"))}),i.on("click",function(){var e=[];if(!P)return void alert("有未选择项~");if(E.length>=20)return void alert("购物车里的商品种类已达到上限~");if(x&&!T)return void alert("请选择商品配件~");if(L&&""==J)return void alert("请填写diy备注信息~");if(r)if((0,d.default)(f).css("top","9rem"),setTimeout(function(){(0,d.default)(u).css("opacity",0)},100),setTimeout(function(){(0,d.default)(u).css("display","none")},500),a)t({memberNo:a,goodsId:P,accessoryId:T,number:v,comment:J});else{var o={},s=JSON.parse((0,l.getSto)("tempCart")),n=!1,i=!1;T||(T="null"),s?s.forEach(function(t,a){if(t.goodsId==P.toString()&&t.accessoryId==T.toString()&&t.comment==J)return t.number=parseInt(t.number)+parseInt(v),void(n=!0)}):(o={goodsId:P,accessoryId:T,selected:!1,number:v,comment:J},E.push(o),(0,l.setSto)("tempCart",JSON.stringify(E)),i=!0),n?(0,l.setSto)("tempCart",JSON.stringify(s)):n||i||(o={goodsId:P,accessoryId:T,selected:!1,number:v,comment:J},E.push(o),(0,l.setSto)("tempCart",JSON.stringify(E))),(0,l.cartCount)((0,d.default)(".shopping-car .car b")),location.href="goods-detail.html?id="+P}else e.push({goodsId:P,accessoryId:T,selected:!1,number:v,comment:J}),(0,l.setSto)("tempOrderPay",JSON.stringify(e)),location.href="ok-order.html?type=1&from=cart&to=ok-order"}),e.on("click",function(){(0,d.default)(f).css("top","9rem"),setTimeout(function(){(0,d.default)(u).css("opacity",0)},100),setTimeout(function(){(0,d.default)(u).css("display","none")},500)})}(),E.soldout&&((0,d.default)(s).css("display","block"),(0,d.default)(i).addClass("sale-out")),E.topPictures.forEach(function(t,e){a+='<div class="swiper-slide">\n\t                        <img src="" data-src='+t+' alt="">\n\t                    </div>'}),(0,d.default)(t).html(a),function(){var t=(0,d.default)(".swiper-wrapper img");(0,l.imgLazy)(t)}(),function(){new Swiper(".swiper-container",{pagination:".swiper-pagination",paginationType:"fraction",paginationFractionRender:function(t,a,e){return'<span class="'+a+'"></span><i>/</i><span class="'+e+'"></span>'}})}(),function(){var t=(0,d.default)(".goods-detail .swiper-slide>img"),a=(0,d.default)(".pic-wrap"),e=(0,d.default)(".pic-wrap img");t.forEach(function(t,o){(0,d.default)(t).on("click",function(){(0,d.default)(a).css("display","block"),setTimeout(function(){(0,d.default)(a).css("opacity",1)},50),(0,d.default)(e).attr("src",(0,d.default)(t).attr("src"))})}),(0,d.default)(e).get(0).onload=function(){(0,d.default)(e).css({top:"50%",left:0,width:"100%","margin-top":-(0,d.default)(e).height()/2})},(0,d.default)(a).on("click",function(){(0,d.default)(a).css("opacity",0),setTimeout(function(){(0,d.default)(a).css("display","none")},550)})}(),E.relationGoods.length&&E.relationGoods.forEach(function(t,a){o+=t.mark?"<li data-id="+t.id+" data-code="+t.code+'>\n\t\t                    <div><span class="active"></span><img src="" data-src='+t.goodsPicture+' alt=""></div>\n\t\t                    <p>'+t.name+'</p>\n\t\t                    <a href="goods-detail.html?id='+t.id+'"></a>\n\t\t                </li>':"<li data-id="+t.id+" data-code="+t.code+'>\n\t\t                    <div><span></span><img src="" data-src='+t.goodsPicture+' alt=""></div>\n\t\t                    <p>'+t.name+'</p>\n\t\t                    <a href="goods-detail.html?id='+t.id+'"></a>\n\t\t                </li>'}),(0,d.default)(e).html(o),function(){(0,d.default)(".goods-color-list").css("width",(0,d.default)(".goods-color-list").find("li").width()*(0,d.default)(".goods-color-list").find("li").length+5)}(),function(){var t=(0,d.default)(".goods-color-list img");(0,l.imgLazy)(t)}(),(0,d.default)(r).html(E.salePrice),(0,d.default)(u).html(E.longName),(0,d.default)(f).html(E.subtitle),parseInt(E.labelPrice)&&(0,d.default)(p).html("￥"+E.labelPrice),E.labels[0]&&E.labels.forEach(function(t,a){if(a<3)switch(t.id){case 10:g+='<em class="blue">'+t.labelContent+"</em>";break;case 6:g+='<em class="pink">'+t.labelContent+"</em>";break;case 7:g+='<em class="sea">'+t.labelContent+"</em>";break;case 5:g+='<em class="sky">'+t.labelContent+"</em>";break;case 9:g+='<em class="deep-sea">'+t.labelContent+"</em>";break;case 8:g+='<em class="light-pink">'+t.labelContent+"</em>";break;case 1:g+='<em class="light-red">'+t.labelContent+"</em>";break;case 2:g+='<em class="light-yellow">'+t.labelContent+"</em>";break;case 3:g+='<em class="light-green">'+t.labelContent+"</em>";break;case 4:g+='<em class="deep-blue">'+t.labelContent+"</em>";break;default:g+='<em class="sea">'+t.labelContent+"</em>"}}),(0,d.default)(m).append(g),E.detailPictures.forEach(function(t,a){y+='<img src="" data-src='+t+' alt="">'}),(0,d.default)(h).append(y),function(){var t=(0,d.default)(".goods-introduce img");(0,l.imgLazy)(t)}()},error:function(){}});var E=(0,d.default)(".rate-list"),T="";d.default.ajax({type:"get",url:n.default+"/goods/detail/queryMessage",data:{goodsId:(0,l.url_search)().id,pageNum:1,pageSize:3},success:function(t){t.head.code&&alert(t.head.message);var t=t.body;t.messages.forEach(function(t,a){T+="<li data-id="+t.id+" data-memberNo="+t.memberNo+'>\n\t\t                    <div class="rate-user">\n\t\t                        <img src='+t.avatar+' alt="">\n\t\t                        <span>'+t.nickName+"</span>\n\t\t                        <em>"+t.showDate+"</em>\n\t\t                    </div>\n\t\t                    <p>"+t.content+"</p>\n\t\t                </li>"}),(0,d.default)(E).html(T)},error:function(){}})}(),function(){var t=(0,d.default)(".opacity1"),a=(0,d.default)(".share"),e=(0,d.default)("em.close");a.on("click",function(){(0,d.default)(t).css("display","block"),setTimeout(function(){(0,d.default)(t).css("opacity",1)},50)}),e.on("click",function(){(0,d.default)(t).css("opacity",0),setTimeout(function(){(0,d.default)(t).css("display","none")},500)})}(),function(){(0,d.default)(".server").on("click",function(){location.href="jump.html"})}()},76:2});