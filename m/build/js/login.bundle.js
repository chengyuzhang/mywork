webpackJsonp([18],{0:function(t,e,o){t.exports=o(27)},27:function(t,e,o){"use strict";function l(t){return t&&t.__esModule?t:{default:t}}o(6),o(43);var a=o(7),n=l(a),c=o(5),r=l(c),u=localStorage.getItem("deciveID"),i=/^((1[0-9]{1})+\d{9})$/;!function(){var t=(0,n.default)(".login>li>button"),e=10,o=null,l=!0;t.on("click",function(){if(l){var a=(0,n.default)(".tel").val();if(!i.test(a))return alert("请输入有效的手机号码"),!1;o=setInterval(function(){e--,t.html(e+"s"),t.css({color:"#999",border:"1px solid #999"}),e<0&&(clearInterval(o),t.html("重新获取"),l=!0,e=10,t.css({color:"#666",border:"1px solid #666"}))},1e3),l=!1}})}(),function(){var t=(0,n.default)(".login-btn");t.on("click",function(){var t=(0,n.default)(".sign").val(),e=(0,n.default)(".tel").val(),o=(0,n.default)(".code").val();""==e||""==o?alert("手机号或验证码不能为空！"):n.default.ajax({type:"post",url:r.default+"/login",data:{mobile:e,captcha:o,captchaNo:t,random:u},success:function(t){console.log(t);var e=t.body.memberNo;sessionStorage.setItem("vipNo",e),alert("注册成功！")},error:function(t){console.log(t)}})})}()},43:6});