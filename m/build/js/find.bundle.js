webpackJsonp([34],{0:function(e,a,t){e.exports=t(31)},31:function(e,a,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function s(e){e.forEach(function(e,a){var t="",i="",s=(0,n.default)(".public li.item>section.block>a>div.img-wrap").height(),l=(0,n.default)(".public li.item>section.block>a>div.img-wrap").width();(0,n.default)(e).get(0).onload=function(){t=(0,n.default)(e).get(0).offsetWidth,i=(0,n.default)(e).get(0).offsetHeight,t/i>1.675?(0,n.default)(e).css({height:s,left:"50%","margin-left":-t*s/i/2}):(0,n.default)(e).css({width:l,top:"50%","margin-top":-i*l/t/2})}})}t(2),t(74);var l=t(3),n=i(l),o=t(1),c=i(o),d=t(4),r=i(d);!function(){(0,o.tabBar)()}(),(0,o.cartCount)(),function(){var e=(0,n.default)(".recomand"),a=(0,n.default)(".story"),t=(0,n.default)(".fashion"),i=(0,n.default)(".baby");(0,o.reTop)(e),(0,o.reTop)(a),(0,o.reTop)(t),(0,o.reTop)(i)}(),function(){function e(){function e(){(0,n.default)("#swiper-container6 .active-nav").removeClass("active-nav"),(0,n.default)("#swiper-container6 .swiper-slide").eq(t.activeIndex).addClass("active-nav")}var a=new Swiper("#swiper-container6",{slidesPerView:5,onTap:function(){t.slideTo(a.clickedIndex),a.clickedIndex==a.slides.length-1&&a.slideTo(a.slides.length-2),0==a.clickedIndex&&a.slideTo(1)}}),t=new Swiper("#swiper-container7",{slidesPerView:1,onSlideChangeStart:function(){a.slideTo(t.realIndex),t.realIndex==a.slides.length-1&&a.slideTo(a.slides.length-2),0==t.realIndex&&a.slideTo(1),e()}})}function a(e,a,t){var i=(0,n.default)(a).find("ul");t.forEach(function(a,t){e+='<li class="item"><section class="block">',e+='<a href="detail.html?form=find&id='+a.id+'"><div class="item-head"><img class="avater" src="'+a.avatar+'" ><span class="name">'+a.nickName+'</span><i class="time">'+a.publishTime+"</i></div>",e+='<div class="img-wrap"><img class="show-pic" src="'+a.cover+'" ></div>',e+='<h2 class="title">'+a.title+"</h2>",e+='<p class="text">'+a.content+"</p>",e+='<div class="item-foot"><span class="words"><em></em><b> '+a.messageNum+'</b></span><i></i><span class="good"><em></em><b> '+a.interestedNum+"</b></span>",a.labels&&a.labels.split(",").forEach(function(a,t){e+='<em class="kind">'+a+"</em>"}),e+="</div></a></section></li>"}),i.html(e);var l=(0,n.default)(".show-pic");s(l)}function t(e,a,t){var i=(0,n.default)(a).find("ul");t.forEach(function(a,t){e+='<li class="item"><section class="block">',e+='<a href="detail.html?form=find&id='+a.id+'"><div class="item-head"><img class="avater" src="'+a.avatar+'" ><span class="name">'+a.nickName+'</span><i class="time">'+a.publishTime+"</i></div>",e+='<div class="img-wrap"><img class="show-pic" src="'+a.cover+'" ></div>',e+='<h2 class="title">'+a.title+"</h2>",e+='<p class="text">'+a.content+"</p>",e+='<div class="item-foot"><span class="words"><em></em><b> '+a.messageNum+'</b></span><i></i><span class="good"><em></em><b> '+a.interestedNum+"</b></span>",a.labels&&a.labels.split(",").forEach(function(a,t){e+='<em class="kind">'+a+"</em>"}),e+="</div></a></section></li>"}),i.append(e);var l=(0,n.default)(".show-pic");s(l)}function i(e,a,i,s,l){var o=((0,n.default)(s).find("ul"),(0,n.default)(s)),d=(0,n.default)(".refresh"),r=window.screen.availHeight,u=0,f=0,m=null,p=null,v=null,h=0,b=0;o.on("touchstart",function(e){h=e.changedTouches[0].pageY}),o.on("touchmove",function(e){b=e.changedTouches[0].pageY}),o.on("scroll",function(){var o=(0,n.default)(s+" li:nth-last-of-type(1)"),g=o.offset().top;h-b>=0&&g<r+100&&(clearTimeout(m),m=setTimeout(function(){a++,clearTimeout(v),(0,n.default)(d).html("正在加载中..."),(0,n.default)(d).css("bottom",0),n.default.ajax({url:c.default+"/article/list/label?pageNum="+a+"&pageSize="+i+"&labelId="+l,success:function(i){return i.head.code?void console.log("数据返回错误！"):void(i.body.end?(f||t(e,s,i.body.articles),f++,u=a-1,a=u,(0,n.default)(d).html("已经到末尾咯~"),(0,n.default)(d).css("bottom",0),clearTimeout(p),p=setTimeout(function(){(0,n.default)(d).css("bottom","-1rem")},2e3)):(t(e,s,i.body.articles),v=setTimeout(function(){(0,n.default)(d).css("bottom","-1rem")},2e3),f=0))}})},1e3))})}var l=((0,n.default)(".discovery"),document.querySelector("#wrap")),o="";n.default.ajax({url:c.default+"/article/label",success:function(t){var s=t.body.labels;s.forEach(function(e,a){0==a?o+='<div id="'+e.id+'" class="swiper-slide other" data-kind="story">'+e.labelContent+"</div>":1==a?o+='<div id="'+e.id+'" class="swiper-slide other" data-kind="fashion">'+e.labelContent+"</div>":2==a&&(o+='<div id="'+e.id+'" class="swiper-slide other" data-kind="baby">'+e.labelContent+"</div>")}),(0,n.default)(l).append(o),e(),function(){var e=(0,n.default)(".other");e.forEach(function(e,t){var s=1,l=5,o="",d=(0,n.default)(e).get(0).id;sessionStorage.setItem("labelID"+d,""),(0,n.default)(e).on("click",function(){if(sessionStorage.getItem("labelID"+d)!="labelID"+d){var t=(0,n.default)(e).get(0).dataset.kind;n.default.ajax({url:c.default+"/article/list/label?pageNum="+s+"&pageSize="+l+"&labelId="+d,success:function(e){var i=e.body.articles;a(o,"."+t,i)},error:function(e){console.log(e)}}),i(o,s,l,"."+t,d),sessionStorage.setItem("labelID"+d,"labelID"+d)}})})}()},error:function(e){console.log(e)}})}(),function(){var e=localStorage.getItem("deciveID"),a=(0,o.rand)((0,o.rand)(1,100),(0,o.rand)(1,1e4));if(e)n.default.ajax({url:c.default+"/random?random="+e,success:function(e){},error:function(e){console.log(e)}});else{var t=Date.now()+new Date(a),i=(0,r.default)(t);localStorage.setItem("deciveID",i),n.default.ajax({url:c.default+"/random?random="+i,success:function(e){},error:function(e){console.log(e)}})}}(),function(){function e(){n.default.ajax({url:c.default+"/article/list?pageNum="+t+"&pageSize="+i+"&labelId=0",success:function(e){return e.head.code?void console.log("数据返回错误！"):(a(e.body.articles,e.body.subjectList),void sessionStorage.setItem("labelID"+o,"labelID"+o))},error:function(e){console.log(e)}})}function a(e,a){var t=(0,n.default)(".recomand ul");l+='<li class="spec">',l+='<div class="spec-top"><h2>ooh Dear专题</h2><a href="topic.html">查看全部<span></span></a></div>',l+='<div id="swiper-container3" class="spec-con"><div class="swiper-wrapper">',a.forEach(function(e,a){l+='<div class="swiper-slide img-con"">',l+='<img src="'+e.cover+'" alt=""><p>'+e.title+"</p>",l+='<a href="'+e.link+'"></a></div>'}),l+="</div></div>",l+="</li>",e.forEach(function(e,a){l+='<li class="item"><section class="block">',l+='<a href="detail.html?form=find&id='+e.id+'"><div class="item-head"><img class="avater" src="'+e.avatar+'" ><span class="name">'+e.nickName+'</span><i class="time">'+e.publishTime+"</i></div>",l+='<div class="img-wrap"><img class="show-pic" src="'+e.cover+'" ></div>',l+='<h2 class="title">'+e.title+"</h2>",l+='<p class="text">'+e.content+"</p>",l+='<div class="item-foot"><span class="words"><em></em><b> '+e.messageNum+'</b></span><i></i><span class="good"><em></em><b> '+e.interestedNum+"</b></span>",e.labels&&e.labels.split(",").forEach(function(e,a){l+='<em class="kind">'+e+"</em>"}),l+="</div></a></section></li>"}),t.html(l);var i=(0,n.default)(".show-pic");s(i)}var t=1,i=10,l="",o=((0,n.default)(".find"),(0,n.default)(".recommend-tab").get(0).id);sessionStorage.setItem("labelID"+o,""),e(),function(){var e=(0,n.default)(".gife-box"),a=(0,n.default)(".gife-box i"),t=(0,n.default)(".order i"),i=null,s=null,l=null,o=null,c=null;i=setTimeout(function(){e.css({top:".89rem",height:"2.2rem","-webkit-animation":"none","z-index":2})},9e3),s=setTimeout(function(){a.css({height:"1.62rem","-webkit-animation":"none"})},9e3),l=setTimeout(function(){a.css({height:"0"}),e.css({top:".0",opacity:0})},1e4),o=setTimeout(function(){e.css({"z-index":-1})},10500),c=setTimeout(function(){t.css({opacity:1})},10500)}()}()},74:2});