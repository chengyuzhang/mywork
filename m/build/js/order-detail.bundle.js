webpackJsonp([17],{0:function(t,e,a){t.exports=a(51)},51:function(t,e,a){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function s(t){for(var e={},a=t.split("&"),o=0;o<a.length;o++){var s=a[o].split("=");e[s[0]]=s[1]}return e}a(2),a(94);var n=a(3),c=o(n),l=a(1),r=o(l),d=a(4),i=o(d);!function(){var t=(0,c.default)(".order-detail>.goods-detail>img"),e=(0,c.default)(".style"),a=(0,c.default)(".material"),o=(0,c.default)(".size"),n=(0,c.default)(".lettering"),d=(0,c.default)(".order-num"),u=(0,c.default)(".deal-time"),f=(0,c.default)(".geter"),p=(0,c.default)(".tel"),m=(0,c.default)(".address"),y=(0,c.default)(".express-name"),h=(0,c.default)(".express-num"),v=(0,c.default)(".express-step ul"),g=(0,c.default)(".status-bar>ul"),k=(0,c.default)(".goods-price em"),x=(0,c.default)(".coupon-price em"),b=(0,c.default)(".pay-price em"),N=(0,c.default)(".words textarea"),S="",j=window.location.search,T=s(j.split("?")[1]),z=sessionStorage.getItem("vipNo"),w=sessionStorage.getItem("token");c.default.ajax({type:"get",url:r.default+"/customization/order/detail?memberNo="+z+"&orderNo="+T.orderNo,headers:(0,l.signName)(i.default,z,w),success:function(s){if(s.head.code)return 71982==s.head.code&&((0,l.rmSto)("nickname"),(0,l.rmSto)("timestamp"),(0,l.rmSto)("token"),(0,l.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void alert(s.head.message);var j=s.body.order,C=s.body.address,I=s.body.express,A=s.body.statusAxis;(0,c.default)(t).attr("src",j.cover),(0,c.default)(e).text(j.style),(0,c.default)(a).text(j.material),(0,c.default)(o).text(j.size),(0,c.default)(x).text("-￥"+j.creditAmount),(0,c.default)(k).text("￥"+j.orderPrice),(0,c.default)(b).text("￥"+j.payAmount),(0,c.default)(n).text(j.lettering),(0,c.default)(d).text(j.no),(0,c.default)(u).text(j.createTime),(0,c.default)(f).text(C.consignee),(0,c.default)(p).text(C.mobile),(0,c.default)(m).text(C.zone+C.detail),(0,c.default)(N).val(j.comment),(0,c.default)(y).text(I.company),(0,c.default)(h).text(I.no),""==I.company&&(0,c.default)(".express").css("display","none"),""==C.consignee&&((0,c.default)("#gater").css("display","none"),(0,c.default)("#address").css("display","none")),I.infos.forEach(function(t,e){S+=0==e?'<li class="active"><div class="line-dot"><i></i><span></span></div>':'<li><div class="line-dot"><i></i><span></span></div>',S+='<div class="status-detail"><p>'+t.content+"</p><p>"+t.createTime+"</p></div>",S+="</li>"}),v.html(S),S="";var P=A.length;2==P?(0,c.default)(g).attr("class","two"):3==P?(0,c.default)(g).attr("class","three"):4==P?(0,c.default)(g).attr("class","four"):5==P?(0,c.default)(g).attr("class","five"):6==P?(0,c.default)(g).attr("class","six"):7==P&&(0,c.default)(g).attr("class","seven");for(var _=0;_<P;_++)S+="enabled"==A[_][1]?'<li class="active"><span>'+(_+1)+"</span><p>"+A[_][0]+"</p></li>":'<li class=""><span>'+(_+1)+"</span><p>"+A[_][0]+"</p></li>";g.html(S),S="";var E=s.body.order.statusCode,J=(0,c.default)(".bottom-btn");switch(E){case 10:S+='<a href="javascript:;" data-type="cancel" class="s cancel-order" >取消订单</a><span id="pay" class="pay">立即付款</span>';break;case 20:S+='<a href="jump.html" class="s" >联系客服</a><span class="refund">申请退款</span>';break;case 40:S+='<a href="jump.html" class="s active" >联系客服</a>';break;case 60:S+='<a href="jump.html" class="s active" >联系客服</a>';break;case 70:S+='<a href="jump.html" class="s" >联系客服</a><span class="ok">确认收货</span>';break;case 80:S+='<a href="jump.html" class="s active" >联系客服</a>';break;case 31:S+='<a href="jump.html" class="s" >联系客服</a><span class="refund">申请退款</span>';break;case 41:S+='<a href="jump.html" class="s active" >联系客服</a>';break;default:S+='<a href="jump.html" class="s active" >联系客服</a>'}(0,c.default)(J).append(S),function(){var t=(0,c.default)(".pay");t.on("click",function(t){c.default.ajax({type:"post",headers:(0,l.signName)(i.default,z,w),url:r.default+"/customization/order/pay",data:{orderNo:T.orderNo,memberNo:z},success:function(t){if(t.head.code)return 71982==t.head.code&&((0,l.rmSto)("nickname"),(0,l.rmSto)("timestamp"),(0,l.rmSto)("token"),(0,l.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void console.log(t.head.message);var e=t.body.form;_AP.pay(e)},error:function(t){console.log(t)}})}),event.stopPropagation()}(),function(){function t(t,e){c.default.ajax({type:"post",headers:(0,l.signName)(i.default,e,w),url:r.default+"/order/cancel",data:{orderNo:t,memberNo:e},success:function(t){return t.head.code?(71982==t.head.code&&((0,l.rmSto)("nickname"),(0,l.rmSto)("timestamp"),(0,l.rmSto)("token"),(0,l.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void console.log(t.head.message)):void(t.body.status&&a())},error:function(t){console.log(t)}})}function e(t,e){n.attr("data-order",t),n.attr("data-type",e),s.css("display","block"),setTimeout(function(){s.css("opacity",1)},50)}function a(){s.css("opacity",0),setTimeout(function(){s.css("display","none"),location.reload()},500)}var o=(0,c.default)(".cancel-order"),s=(0,c.default)(".opacity"),n=(0,c.default)(".opacity .con li:last-of-type"),d=(0,c.default)(".opacity .con li:first-of-type");o.on("click",function(){(0,c.default)(".opacity .con h2").text("取消订单"),(0,c.default)(".opacity .con p").text("是否确认取消订单？"),(0,c.default)(".opacity .con").addClass("cancel"),e(T.orderNo,(0,c.default)(this).get(0).dataset.type)}),n.on("click",function(){var e=sessionStorage.getItem("vipNo");"cancel"==(0,c.default)(this).get(0).dataset.type&&t((0,c.default)(this).get(0).dataset.order,e)}),d.on("click",function(){a()})}(),function(){function t(t,e,o){c.default.ajax({type:"post",headers:(0,l.signName)(i.default,e,w),url:r.default+"/customization/order/refund",data:{orderNo:t,memberNo:e,reason:o},success:function(t){return t.head.code?(71982==t.head.code&&((0,l.rmSto)("nickname"),(0,l.rmSto)("timestamp"),(0,l.rmSto)("token"),(0,l.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void console.log(t.head.message)):void(t.body.status&&a())},error:function(t){console.log(t)}})}function e(t,e){n.attr("data-order",t),n.attr("data-type",e),s.css("display","block"),setTimeout(function(){s.css("opacity",1)},50)}function a(){s.css("opacity",0),setTimeout(function(){s.css("display","none"),location.reload()},500)}var o=(0,c.default)(".refund"),s=(0,c.default)(".opacity"),n=(0,c.default)(".opacity .con li:last-of-type"),d=(0,c.default)(".opacity .con li:first-of-type");o.on("click",function(){(0,c.default)(".opacity .con").addClass("reason"),e(T.orderNo,(0,c.default)(this).get(0).className)}),n.on("click",function(){var e=sessionStorage.getItem("vipNo"),a=(0,c.default)(".opacity .reason input").val();"refund"==(0,c.default)(this).get(0).dataset.type&&t((0,c.default)(this).get(0).dataset.order,e,a)}),d.on("click",function(){a()})}(),function(){function t(t,e){c.default.ajax({type:"post",url:r.default+"/customization/order/confirm",headers:(0,l.signName)(i.default,e,w),data:{orderNo:t,memberNo:e},success:function(t){return t.head.code?(71982==t.head.code&&((0,l.rmSto)("nickname"),(0,l.rmSto)("timestamp"),(0,l.rmSto)("token"),(0,l.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void console.log(t.head.message)):void(t.body.status&&a())},error:function(t){console.log(t)}})}function e(t,e){n.attr("data-order",t),n.attr("data-type",e),s.css("display","block"),setTimeout(function(){s.css("opacity",1)},50)}function a(){s.css("opacity",0),setTimeout(function(){s.css("display","none"),location.reload()},500)}var o=(0,c.default)(".ok"),s=(0,c.default)(".opacity"),n=(0,c.default)(".opacity .con li:last-of-type"),d=(0,c.default)(".opacity .con li:first-of-type");o.on("click",function(){(0,c.default)(".opacity .con").removeClass("reason"),(0,c.default)(".opacity .con").removeClass("cancel"),(0,c.default)(".opacity .con input").css("display","none"),(0,c.default)(".opacity .con h2").text("确认收货"),(0,c.default)(".opacity .con p").text("是否确认已经收到货品？"),e(T.orderNo,(0,c.default)(this).get(0).className)}),n.on("click",function(){var e=sessionStorage.getItem("vipNo");"ok"==(0,c.default)(this).get(0).dataset.type&&t((0,c.default)(this).get(0).dataset.order,e,(0,c.default)(this).get(0).dataset.index)}),d.on("click",function(){a()})}()},error:function(t){console.log(t)}})}()},94:2});