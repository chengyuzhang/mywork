webpackJsonp([18],{0:function(e,t,a){e.exports=a(50)},50:function(e,t,a){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}a(2),a(93);var s=a(3),l=o(s),r=a(1),n=o(r),d=a(4),i=o(d),c=(0,r.getSto)("vipNo");if(console.log((0,r.allSto)()),function(){console.log("x:d",(0,r.url_search)((0,r.prevUrl)())),(0,r.url_search)((0,r.prevUrl)()).from?(console.log(111),(0,r.setSto)("prev_url",(0,r.prevUrl)()),(0,l.default)("header>a").attr("href",(0,r.prevUrl)())):(0,r.url_search)((0,r.prevUrl)()).to?(console.log(222),(0,l.default)("header>a").attr("href","cart.html?from=cart")):"ok-order"==(0,r.url_search)().to&&(0,l.default)("header>a").attr("href",(0,r.prevUrl)())}(),c){var u=(0,r.getSto)("token"),c=(0,r.getSto)("vipNo");!function(){var e=(0,l.default)(".geter span"),t=(0,l.default)(".geter em"),a=(0,l.default)(".detail-adress p"),o="";(0,r.url_search)().vipId?o=(0,r.url_search)().vipId:(o=(0,r.getSto)("addressID"),o||(o=0)),(0,l.default)(".jump").attr("href","manage-address.html?type="+(0,r.url_search)().type+"&f="+(0,r.url_search)().f+"&to=manage-address&jump=true&vipId="+o);var s=sessionStorage.getItem("vipNo"),d=sessionStorage.getItem("token");l.default.ajax({type:"get",url:n.default+"/address/detail/my?memberNo="+s+"&addressId="+o,headers:(0,r.signName)(i.default,s,d),success:function(o){if(o.head.code)return 71982==o.head.code&&((0,r.rmSto)("nickname"),(0,r.rmSto)("timestamp"),(0,r.rmSto)("token"),(0,r.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void alert(o.head.message);var o=o.body.address;sessionStorage.setItem("addressID",o.id),e.html("收货人："+o.consignee),t.html(o.mobile),a.html("详细地址："+o.zone+o.detail),(0,l.default)(a).height()<20&&(0,l.default)(a).css("line-height",".3rem");var s=sessionStorage.getItem("addressID"),n=s.toString();"null"==n&&(0,l.default)(".address>a").css({background:"#fff",color:"#cb68a4","line-height":"1rem","text-align":"center"}).text("点击添加地址")},error:function(e){console.log(e)}})}();var f=(0,l.default)(".goods-wrap"),p="",m=0;l.default.ajax({type:"post",headers:(0,r.signName)(i.default,c,u),url:n.default+"/shoppingcart/settlement",contentType:"application/json",data:JSON.stringify({memberNo:c,goodsList:"2"==(0,r.url_search)().type?JSON.parse((0,r.getSto)("tempOrderCart")):JSON.parse((0,r.getSto)("tempOrderPay"))}),success:function(e){if(e.head.code)return 71982==e.head.code&&((0,r.rmSto)("nickname"),(0,r.rmSto)("timestamp"),(0,r.rmSto)("token"),(0,r.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),alert(e.head.message),void(location.href="cart.html?from=cart");var e=e.body,t=e.goodsList.length;e.coupon||(0,l.default)(".coupon").css("display","none"),t<3?e.goodsList.forEach(function(e,t){p+='<div class="pic-info">\n                        <img src='+e.picture+' alt="">\n                        <ul>\n                            <li class="style"><p>'+e.shortName+"</p></li>",e.accessoryLength&&(p+='<li class="ornament"><span>配饰：</span><em>'+e.accessoryLength+"</em></li>"),p+='<li class="price"><span>￥'+parseInt(e.salePrice)+"</span><em><i>x</i>"+e.number+"</em></li>",""!=e.comment&&(p+='<li class="remark"><span>备注：</span><em>'+e.comment+"</em></li>"),p+="</ul>\n                    </div>",m+=parseFloat(e.salePrice)*e.number}):(p+='<div class="goods-more"><h2>商品信息</h2><ul>',e.goodsList.forEach(function(e,t){p+="<li><img src="+e.picture+"></li>",m+=parseFloat(e.salePrice)*e.number}),p+="</ul>\n                    <div>\n                        <p>共"+t+'件</p>\n                        <span></span>\n                    </div>\n                    <a href="goods-info.html?to=goods-info"></a>\n                </div>'),p+="<p><span></span><em>顺丰快递</em><em>免运费</em></p>",(0,l.default)(f).html(p),console.log("iTotalPrice:",m),function(){var e=(0,l.default)(".opacity"),t=(0,l.default)(".coupon input"),a=(0,l.default)(".coupon em"),o=(0,l.default)(".coupon-price em"),s=(0,l.default)("li.goods-price>em"),d=(0,l.default)(".pay span"),f="";(0,l.default)(s).text("￥"+m),(0,l.default)(d).text("支付金额：￥"+m),t.on("input",function(){var s=(0,l.default)(this).val();s.length<9?(f=s,(0,l.default)(a).text("-￥00"),(0,l.default)(o).text("-￥00"),(0,l.default)(d).text("支付金额：￥"+parseInt(m))):(0,l.default)(t).val(f),8==s.length&&((0,l.default)(t).blur(),l.default.ajax({type:"get",headers:(0,r.signName)(i.default,c,u),url:n.default+"/order/coupons?coupon="+s,success:function(t){if(t.head.code)return 71982==t.head.code&&((0,r.rmSto)("nickname"),(0,r.rmSto)("timestamp"),(0,r.rmSto)("token"),(0,r.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void alert(t.head.message);if(!t.body.status)return(0,l.default)(e).css("display","block"),setTimeout(function(){(0,l.default)(e).css("opacity",1)},50),setTimeout(function(){(0,l.default)(e).css("opacity",0)},1100),setTimeout(function(){(0,l.default)(e).css("display","none")},1650),(0,l.default)(a).text("-￥00"),(0,l.default)(o).text("-￥00"),void(0,l.default)(d).text("支付金额：￥"+m);var s=t.body.coupons[0];(0,l.default)(a).text("-￥"+s.couponPrice),(0,l.default)(o).text("-￥"+s.couponPrice),(0,l.default)(d).text("支付金额：￥"+(m-s.couponPrice))},error:function(e){console.log(e)}}))})}()},error:function(){}})}else{var g=(0,l.default)(".opacity1"),h=(0,l.default)(".login>li>img"),v=(0,r.getSto)("deciveID");g.css("display","block"),setTimeout(function(){g.css("opacity",1),(0,l.default)(h).get(0).src=n.default+"/pic?t="+Date.now()+"&random="+v},50)}var y="";!function(){var e=((0,l.default)(".pay>button"),(0,r.getSto)("token"));(0,l.default)(".pay>button").on("click",function(){console.log("memberNo:",c,"-addressId:",(0,r.getSto)("addressID"),"-coupon:",(0,l.default)(".coupon input").val(),"-comment:",(0,l.default)(".pay-detail>ul>li.words>textarea").val(),"-source:",(0,r.url_search)().type+"-goodsList:",JSON.parse((0,r.getSto)("tempOrderCart"))),console.log("sname:",y),l.default.ajax({type:"post",headers:(0,r.signName)(i.default,c,e),url:n.default+"/shoppingcart/order",contentType:"application/json",data:JSON.stringify({memberNo:(0,r.getSto)("vipNo"),addressId:(0,r.getSto)("addressID"),payType:1,coupon:(0,l.default)(".coupon input").val(),comment:(0,l.default)(".pay-detail>ul>li.words>textarea").val(),invoiceContent:y,source:(0,r.url_search)().type,goodsList:"2"==(0,r.url_search)().type?JSON.parse((0,r.getSto)("tempOrderCart")):JSON.parse((0,r.getSto)("tempOrderPay"))}),success:function(t){return t.head.code?(71982==t.head.code&&((0,r.rmSto)("nickname"),(0,r.rmSto)("timestamp"),(0,r.rmSto)("token"),(0,r.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void alert(t.head.message)):void l.default.ajax({type:"post",headers:(0,r.signName)(i.default,c,e),url:n.default+"/shoporder/pay",data:{memberNo:(0,r.getSto)("vipNo"),orderNo:t.body.orderNo},success:function(e){if(console.log("c:",e),e.head.code)return 71982==e.head.code&&((0,r.rmSto)("nickname"),(0,r.rmSto)("timestamp"),(0,r.rmSto)("token"),(0,r.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void console.log(e.head.message);var t=e.body.form;_AP.pay(t)},error:function(e){console.log(e)}})},error:function(){}})})}(),function(){var e=(0,l.default)(".login>li>button"),t=60,a=null,o=!0,s=/^((1[0-9]{1})+\d{9})$/;e.on("click",function(){if(o){var r=(0,l.default)(".tel").val();if(!s.test(r))return alert("请输入有效的手机号码"),!1;o=!1,a=setInterval(function(){t--,e.html(t+"s"),e.css({color:"#999",border:"1px solid #999"}),t<0&&(clearInterval(a),e.html("重新获取"),o=!0,t=60,e.css({color:"#666",border:"1px solid #666"}))},1e3),l.default.ajax({type:"post",url:n.default+"/user/captcha",data:{mobile:r},success:function(e){e.head.code&&alert(e.head.message)},error:function(e){console.log(e)}})}})}(),function(){var e=(0,l.default)(".login-btn"),t=(0,l.default)(".login>li>img"),a=(0,r.getSto)("deciveID");e.on("click",function(){var e=(0,l.default)(".sign").val(),o=(0,l.default)(".tel").val(),s=(0,l.default)(".code").val(),d=(0,l.default)(".opacity1");""==o||""==s?alert("手机号或验证码不能为空！"):l.default.ajax({type:"post",url:n.default+"/login",data:{mobile:o,captcha:s,captchaNo:e,random:a},success:function(e){if(e.head.code)return alert(e.head.message),void((0,l.default)(t).get(0).src=n.default+"/pic?t="+Date.now()+"&random="+a);var o=e.body.memberNo;(0,r.setSto)("token",e.body.token),(0,r.setSto)("vipNo",o),(0,r.setSto)("nickname",e.body.nickName),d.css("opacity",0),setTimeout(function(){d.css("display","none")},510),function(){var e=(0,l.default)(".geter span"),t=(0,l.default)(".geter em"),a=(0,l.default)(".detail-adress p"),o="";(0,r.url_search)().vipId?o=(0,r.url_search)().vipId:(o=(0,r.getSto)("addressID"),o||(o=0)),(0,l.default)(".jump").attr("href","manage-address.html?type="+(0,r.url_search)().type+"&f="+(0,r.url_search)().f+"&to=manage-address&jump=true&vipId="+o);var s=sessionStorage.getItem("vipNo"),d=sessionStorage.getItem("token");l.default.ajax({type:"get",url:n.default+"/address/detail/my?memberNo="+s+"&addressId="+o,headers:(0,r.signName)(i.default,s,d),success:function(o){if(o.head.code)return 71982==o.head.code&&((0,r.rmSto)("nickname"),(0,r.rmSto)("timestamp"),(0,r.rmSto)("token"),(0,r.rmSto)("vipNo"),alert("出现错误，请重新登录！"),location.href="user-center.html"),void console.log(o.head.message);var o=o.body.address;sessionStorage.setItem("addressID",o.id),e.html("收货人："+o.consignee),t.html(o.mobile),a.html("详细地址："+o.zone+o.detail),(0,l.default)(a).height()<20&&(0,l.default)(a).css("line-height",".3rem");var s=sessionStorage.getItem("addressID"),n=s.toString();"null"==n&&(0,l.default)(".address>a").css({background:"#fff",color:"#cb68a4","line-height":"1rem","text-align":"center"}).text("点击添加地址")},error:function(e){console.log(e)}})}();var s=(0,l.default)(".goods-wrap"),c="",u=0;l.default.ajax({type:"post",url:n.default+"/shoppingcart/settlement",contentType:"application/json",data:JSON.stringify({memberNo:o,goodsList:"2"==(0,r.url_search)().type?JSON.parse((0,r.getSto)("tempOrderCart")):JSON.parse((0,r.getSto)("tempOrderPay"))}),success:function(e){if(e.head.code)return alert(e.head.message),void(location.href=(0,r.prevUrl)());console.log("ss:",e);var e=e.body,t=e.goodsList.length;e.coupon||(0,l.default)(".coupon").css("display","none"),t<3?e.goodsList.forEach(function(e,t){c+='<div class="pic-info">\n                                        <img src='+e.picture+' alt="">\n                                        <ul>\n                                            <li class="style"><p>'+e.shortName+"</p></li>",e.accessoryLength&&(c+='<li class="ornament"><span>配饰：</span><em>'+e.accessoryLength+"</em></li>"),c+='<li class="price"><span>￥'+parseInt(e.salePrice)+"</span><em><i>x</i>"+e.number+"</em></li>",""!=e.comment&&(c+='<li class="remark"><span>备注：</span><em>'+e.comment+"</em></li>"),c+="</ul>\n                                    </div>",u+=parseFloat(e.salePrice)*e.number}):(c+='<div class="goods-more"><h2>商品信息</h2><ul>',e.goodsList.forEach(function(e,t){c+="<li><img src="+e.picture+"></li>",u+=parseFloat(e.salePrice)*e.number}),c+="</ul>\n                                    <div>\n                                        <p>共"+t+'件</p>\n                                        <span></span>\n                                    </div>\n                                    <a href="goods-info.html?to=goods-info"></a>\n                                </div>'),c+="<p><span></span><em>顺丰快递</em><em>免运费</em></p>",(0,l.default)(s).html(c),console.log("iTotalPrice:",u),function(){var e=(0,l.default)(".opacity"),t=(0,l.default)(".coupon input"),a=(0,l.default)(".coupon em"),o=(0,l.default)(".coupon-price em"),s=(0,l.default)("li.goods-price>em"),r=(0,l.default)(".pay span"),d="";(0,l.default)(s).text("￥"+u),(0,l.default)(r).text("支付金额：￥"+u),t.on("input",function(){var s=(0,l.default)(this).val();s.length<9?(d=s,(0,l.default)(a).text("-￥00"),(0,l.default)(o).text("-￥00"),(0,l.default)(r).text("支付金额：￥"+u)):(0,l.default)(t).val(d),8==s.length&&((0,l.default)(t).blur(),l.default.ajax({type:"get",url:n.default+"/order/coupons?coupon="+s,success:function(t){if(console.log(t),!t.body.status)return(0,l.default)(e).css("display","block"),setTimeout(function(){(0,l.default)(e).css("opacity",1)},50),setTimeout(function(){(0,l.default)(e).css("opacity",0)},1100),setTimeout(function(){(0,l.default)(e).css("display","n one")},1650),(0,l.default)(a).text("-￥00"),(0,l.default)(o).text("-￥00"),void(0,l.default)(r).text("支付金额：￥"+u);var s=t.body.coupons[0];(0,l.default)(a).text("-￥"+s.couponPrice),(0,l.default)(o).text("-￥"+s.couponPrice),(0,l.default)(r).text("支付金额：￥"+(u-s.couponPrice))},error:function(e){console.log(e)}}))})}()},error:function(){}})},error:function(e){console.log(e)}})})}(),function(){var e=(0,l.default)(".pay-detail .ticket>span"),t=(0,l.default)(".invoice"),a=(0,l.default)(".invoice .con li");(0,l.default)(e).on("click",function(){"false"==this.dataset.btn?((0,l.default)(t).css("display","block"),setTimeout(function(){(0,l.default)(t).css("opacity",1)},50)):((0,l.default)(this).removeClass("active"),this.dataset.btn="false",(0,l.default)(".pay-detail .ticket>div>h2").css("color","#666"),(0,l.default)(".pay-detail .ticket ol").css("display","none"),(0,l.default)(".pay-detail .ticket>div>p").css("display","block"))}),(0,l.default)(a).eq(0).on("click",function(){(0,l.default)(t).css("opacity",0),setTimeout(function(){(0,l.default)(t).css("display","none")},550)}),(0,l.default)(a).eq(1).on("click",function(){(0,l.default)(e).addClass("active"),(0,l.default)(e).get(0).dataset.btn="true",y=(0,l.default)(".invoice .reason input").val(),(0,l.default)(".pay-detail .ticket ol li.invoice-header em").text(y),(0,l.default)(".pay-detail .ticket>div>h2").css("color","#333"),(0,l.default)(".pay-detail .ticket ol").css("display","block"),(0,l.default)(".pay-detail .ticket>div>p").css("display","none"),(0,l.default)(t).css("opacity",0),setTimeout(function(){(0,l.default)(t).css("display","none")},550),console.log(y)})}(),function(){(0,l.default)(".normal>span").on("click",function(){location.href="jump.html"})}()},93:2});