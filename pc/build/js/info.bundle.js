webpackJsonp([15],{0:function(t,e,o){t.exports=o(27)},1:function(t,e){"use strict";function o(t){var e=t.width()+200,o=null,a=null;t.on("scroll",function(){clearTimeout(o),clearTimeout(a),$(t).scrollTop()>=parseInt(e)?($("#top").css("display","block"),o=setTimeout(function(){$("#top").css("opacity",1)},50)):($("#top").css("opacity",0),a=setTimeout(function(){$("#top").css("display","none")},550))}),$("#top").on("click",function(){$(t).scrollTop(0)})}Object.defineProperty(e,"__esModule",{value:!0}),e.reTop=o;var a="http://192.168.4.87:8081";e.default=a},2:function(t,e){},27:function(t,e,o){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}o(2),o(43);var n=o(3),s=a(n),i=o(1),u=a(i);!function(){var t=(0,s.default)(".list .avatar"),e=(0,s.default)(".list .nickname"),o=(0,s.default)(".list .sex "),a=(0,s.default)(".list .tel "),n=sessionStorage.getItem("vipNo");s.default.ajax({url:u.default+"/member?memberNo="+n,success:function(n){return n.head.code?void console.log("数据返回错误！"):((0,s.default)(t).attr("src",n.body.user.avatar),(0,s.default)(e).val(n.body.user.nickname),(0,s.default)(o).html(n.body.user.gender),void(0,s.default)(a).html(n.body.user.mobile))},error:function(t){console.log(t)}})}(),function(){var t=document.querySelector(".save"),e=(0,s.default)(".circle");sessionStorage.getItem("token"),t.addEventListener("click",function(){var t=(0,s.default)(".nickname").val(),o=(0,s.default)(".sex").html(),a=sessionStorage.getItem("vipNo");(0,s.default)(e).css("display","block"),setTimeout(function(){(0,s.default)(e).css("opacity",1)},50),s.default.ajax({type:"post",url:u.default+"/member/edit",data:{nickname:t,gender:o,memberNo:a,avatar:window.oAvatar},success:function(t){t&&((0,s.default)(e).find("p").text("保存成功"),setTimeout(function(){(0,s.default)(e).css("opacity",0)},500),setTimeout(function(){(0,s.default)(e).css("display","none")},1e3))},error:function(t){console.log(t)}})},!1)}(),function(){var t=(0,s.default)(".list>li:nth-of-type(3)"),e=(0,s.default)(".list>li:nth-of-type(3)>i"),o=(0,s.default)(".opacity>.wrap>ul>li"),a=(0,s.default)(".opacity");t.on("click",function(){a.css("display","block"),setTimeout(function(){a.css("opacity",1)},50)}),o.on("click",function(){e.text((0,s.default)(this).text()),a.css("opacity",0),setTimeout(function(){a.css("display","none")},500)})}(),function(){var t=(0,s.default)(".upload"),e=(sessionStorage.getItem("vipNo"),sessionStorage.getItem("token"),(0,s.default)(".circle"));t.on("change",function(){var t=this.files[0],o=new FileReader;if("undefined"==typeof t)return void(t="null");var a=new FormData;a.append("test",t),(0,s.default)(e).css("display","block"),setTimeout(function(){(0,s.default)(e).css("opacity",1)},50),o.onload=function(t){(0,s.default)(".list>li>i>img").attr("src",t.target.result),s.default.ajax({type:"post",url:u.default+"/pic/upload",data:a,processData:!1,contentType:!1,success:function(t){t.head.code||(window.oAvatar=t.body.avatar,(0,s.default)(e).find("p").text("图片上传成功"),setTimeout(function(){(0,s.default)(e).css("opacity",0)},500),setTimeout(function(){(0,s.default)(e).css("display","none")},1e3))},error:function(t){console.log(t)}})},o.readAsDataURL(t)})}()},43:2});