webpackJsonp([17],{0:function(t,e,o){t.exports=o(21)},1:function(t,e){"use strict";function o(t){var e=t.width()+200,o=null,a=null;t.on("scroll",function(){clearTimeout(o),clearTimeout(a),$(t).scrollTop()>=parseInt(e)?($("#top").css("display","block"),o=setTimeout(function(){$("#top").css("opacity",1)},50)):($("#top").css("opacity",0),a=setTimeout(function(){$("#top").css("display","none")},550))}),$("#top").on("click",function(){$(t).scrollTop(0)})}Object.defineProperty(e,"__esModule",{value:!0}),e.reTop=o;var a="http://192.168.4.87:8081";e.default=a},2:function(t,e){},21:function(t,e,o){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}function n(t,e){var o=(0,i.default)(".detail>img"),a=(0,i.default)(".detail>h3"),n=(0,i.default)(".detail>p");i.default.ajax({type:"post",url:l.default+"/member/center?memberNo="+t,success:function(t){return t.head.code?void console.log("数据返回错误！"):(e&&(0,i.default)(o).attr("src",t.body.avatar),(0,i.default)(a).html(t.body.nickname),void(0,i.default)(n).html(t.body.mobile))},error:function(t){console.log(t)}})}o(2),o(40);var c=o(3),i=a(c),s=o(1),l=a(s),u=localStorage.getItem("deciveID");!function(){var t=!0,e=sessionStorage.getItem("vipNo");parseInt(e)&&n(e,t)}(),function(){var t=(0,i.default)(".detail"),e=(0,i.default)(".custom a"),o=(0,i.default)(".info a"),a=(0,i.default)(".address a"),n=(0,i.default)(".opacity"),c=(0,i.default)(".opacity>header a"),s=(0,i.default)(".login>li>img");(0,i.default)(s).on("click",function(){(0,i.default)(this).get(0).src=l.default+"/pic?t="+Date.now()+"&random="+u}),t.on("click",function(){var t=sessionStorage.getItem("vipNo");parseInt(t)||(n.css("display","block"),setTimeout(function(){n.css("opacity",1),(0,i.default)(s).get(0).src=l.default+"/pic?t="+Date.now()+"&random="+u},50))}),e.on("click",function(){var t=sessionStorage.getItem("vipNo");if(!parseInt(t))return n.css("display","block"),setTimeout(function(){n.css("opacity",1),(0,i.default)(s).get(0).src=l.default+"/pic?t="+Date.now()+"&random="+u},50),!1}),o.on("click",function(){var t=sessionStorage.getItem("vipNo");if(!parseInt(t))return n.css("display","block"),setTimeout(function(){n.css("opacity",1),(0,i.default)(s).get(0).src=l.default+"/pic?t="+Date.now()+"&random="+u},50),!1}),a.on("click",function(){var t=sessionStorage.getItem("vipNo");if(!parseInt(t))return n.css("display","block"),setTimeout(function(){n.css("opacity",1),(0,i.default)(s).get(0).src=l.default+"/pic?t="+Date.now()+"&random="+u},50),!1}),c.on("click",function(){return n.css("opacity",0),setTimeout(function(){n.css("display","none")},500),!1})}();var r=/^((1[0-9]{1})+\d{9})$/;!function(){var t=(0,i.default)(".login>li>button"),e=60,o=null,a=!0;t.on("click",function(){if(a){var n=(0,i.default)(".tel").val();if(!r.test(n))return alert("请输入有效的手机号码"),!1;o=setInterval(function(){e--,t.html(e+"s"),t.css({color:"#999",border:"1px solid #999"}),e<0&&(clearInterval(o),t.html("重新获取"),a=!0,e=60,t.css({color:"#666",border:"1px solid #666"}))},1e3),a=!1,i.default.ajax({type:"post",url:l.default+"/user/captcha",data:{mobile:n},success:function(t){t.body.status},error:function(t){console.log(t)}})}})}(),function(){var t=(0,i.default)(".login-btn"),e=(0,i.default)(".login>li>img"),o=(0,i.default)(".logout");t.on("click",function(){var t=(0,i.default)(".sign").val(),a=(0,i.default)(".tel").val(),c=(0,i.default)(".code").val(),s=(0,i.default)(".opacity");""==a||""==c?alert("手机号或验证码不能为空！"):i.default.ajax({type:"post",url:l.default+"/login",data:{mobile:a,captcha:c,captchaNo:t,random:u},success:function(t){if(t.head.code)return void((0,i.default)(e).get(0).src=l.default+"/pic?t="+Date.now()+"&random="+u);var a=t.body.memberNo;sessionStorage.setItem("vipNo",a),sessionStorage.setItem("nickname",t.body.nickName),n(a),(0,i.default)(o).css("display","block"),s.css("opacity",0),setTimeout(function(){s.css("display","none")},510)},error:function(t){console.log(t)}})})}(),function(){var t=(0,i.default)(".logout"),e=sessionStorage.getItem("vipNo");parseInt(e)&&(0,i.default)(t).css("display","block"),t.on("click",function(){sessionStorage.clear(),localStorage.clear(),sessionStorage.setItem("tipSign","true"),(0,i.default)(t).css("display","none"),window.location.href="index.html"})}()},40:2});