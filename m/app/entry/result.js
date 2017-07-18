import '../css/public.css';
import '../css/result.css';
import $ from 'n-zepto';

import apiUrl from '../js/config';
import {reTop} from '../js/config';
import md5 from 'md5';
var temp=window.location.search;
var valObject=url2json(decodeURI(decodeURI(temp)).split('?')[1]);//如果才登录

//上滑返回顶部
(function(){
	var oResult=$('.result');

	reTop(oResult);
	
})();

$('header>h2').text(valObject.name);
//显示
(function(){
	var pageNum=1;//第几页
	var pageSize=5;//每页几条
	var str='';

	$.ajax({
		url:apiUrl+'/article/list?pageNum='+pageNum+'&pageSize='+pageSize+'&labelId='+valObject.id,
		success:function(data){
			if(data.head.code){
				console.log('数据返回错误！');
				return;
			}
			init(data.body.articles,data.body.subjectList);
		},
		error:function(err){
			console.log(err);
		}
	});
	load();
	//页面初始化
	function init(arrShow,arrSpec){
		var oUl=$('.result ul');
		//首页商品展示前3条
		arrShow.forEach(function(item,index){
			str+='<li class="item"><section class="block">';
			str+='<a href="detail.html?id='+item.id+'"><div class="item-head"><img class="avater" src="'+item.avatar+'" ><span class="name">'+item.nickName+'</span><i class="time">'+item.publishTime+'</i></div>';
			str+='<div class="img-wrap"><img class="show-pic" src="'+item.cover+'" ></div>';
			str+='<h2 class="title">'+item.title+'</h2>';
			str+='<p class="text">'+item.content+'</p>';
			//str+='<div class="item-foot"><span class="words">留言 '+item.messageNum+'</span><i></i><span class="good">点赞 '+item.interestedNum+'</span>';
			str+='<div class="item-foot"><span class="words"><em></em><b> '+item.messageNum+'</b></span><i></i><span class="good"><em></em><b> '+item.interestedNum+'</b></span>';
			if(item.labels){
				item.labels.split(',').forEach(function(item1,index1){
					str+='<em class="kind">'+item1+'</em>';
				});
			}
			str+='</div></a></section></li>';
		});

		oUl.html(str);
		var aImg=$('.show-pic');
		imgPos(aImg);
	}

	function refresh(arrShow){
		var oUl=$('.result ul');
		//首页商品展示前3条
		arrShow.forEach(function(item,index){
			str+='<li class="item"><section class="block">';
			str+='<a href="detail.html?id='+item.id+'"><div class="item-head"><img class="avater" src="'+item.avatar+'" ><span class="name">'+item.nickName+'</span><i class="time">'+item.publishTime+'</i></div>';
			str+='<div class="img-wrap"><img class="show-pic" src="'+item.cover+'" ></div>';
			str+='<h2 class="title">'+item.title+'</h2>';
			str+='<p class="text">'+item.content+'</p>';
			//str+='<div class="item-foot"><span class="words">留言 '+item.messageNum+'</span><i></i><span class="good">点赞 '+item.interestedNum+'</span>';
			str+='<div class="item-foot"><span class="words"><em></em><b> '+item.messageNum+'</b></span><i></i><span class="good"><em></em><b> '+item.interestedNum+'</b></span>';
			if(item.labels){
				item.labels.split(',').forEach(function(item1,index1){
					str+='<em class="kind">'+item1+'</em>';
				});
			}
			str+='</div></a></section></li>';
		});
		
		oUl.html(str);
		var aImg=$('.show-pic');
		imgPos(aImg);
	}

	//上拉加载
	function load(){
		var oUl=$('.result ul');
		var oWrap=$('.result');//获取滚动元素
		var oRe=$('.refresh');
		var iHScreen=window.screen.availHeight;//获取屏幕高度

		var iNum=0;//记录第一次到最后一条数据时的页数
		var iBtnNum=0;
		var timer=null;
		var timer1=null;
		var timer2=null;
		var startY=0;
		var moveY=0;

		//判断上滑
		oWrap.on('touchstart',function(ev){
			startY=ev.changedTouches[0].pageY;
		});
		oWrap.on('touchmove',function(ev){
			moveY=ev.changedTouches[0].pageY;
		});

		oWrap.on('scroll',function(){
			var oLi=$('.result li:nth-last-of-type(1)');//获取最后一个内容块
			var t=oLi.offset().top;//最后一个内容块距离页面最顶部的距离

			if((startY-moveY)>=0&&t<iHScreen+100){
				clearTimeout(timer);
				timer=setTimeout(function(){
					pageNum++;
					clearTimeout(timer2);
					$(oRe).html('正在加载中...');
					$(oRe).css('bottom',0);
					$.ajax({
						url:apiUrl+'/article/list?pageNum='+pageNum+'&pageSize='+pageSize+'&labelId=0',
						success:function(data){
							if(data.head.code){
								console.log('数据返回错误！');
								return;
							}
							if(!data.body.end){
								refresh(data.body.articles);
								$(oRe).html('本次加载完成！');
								timer2=setTimeout(function(){
									$(oRe).css('bottom','-1rem');
								},2000);
								iBtnNum=0;
							}else{
								if(!iBtnNum){
									refresh(data.body.articles);
								}
								iBtnNum++;
								iNum=pageNum-1;
								pageNum=iNum;
								$(oRe).html('已经到末尾咯~');
								$(oRe).css('bottom',0);
								clearTimeout(timer1);
								timer1=setTimeout(function(){
									$(oRe).css('bottom','-1rem');
								},2000);
							}
						}
					});
				},1000);
			}

		});
	}
})();

function imgPos(aImg){
	aImg.forEach(function(item,index){
		var iW='';
		var iH='';
		var iHeight=$('.public li.item>section.block>a>div.img-wrap').height();
		var iWidth=$('.public li.item>section.block>a>div.img-wrap').width();

		$(item).get(0).onload=function(){
			iW=$(item).get(0).offsetWidth;
			iH=$(item).get(0).offsetHeight;
			
			if(iW/iH>1.675){
				$(item).css({
					'height':iHeight,
					'left':'50%',
					'margin-left':-iW*iHeight/iH/2
				});
			}else{
				$(item).css({
					'width':iWidth,
					'top':'50%',
					'margin-top':-iH*iWidth/iW/2
				});
			}
		};
	});
}

function rand(m,n){
	return parseInt(Math.random()*(n-m)+m);
}
function url2json(str){
	var json={};
	var arr=str.split('&');
	for(var i=0; i<arr.length; i++){
		var arr2=arr[i].split('=');
		json[arr2[0]]=arr2[1];
	}
	return json;
};
