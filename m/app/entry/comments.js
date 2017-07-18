import '../css/public.css';
import '../css/comments.css';
import $ from 'n-zepto';
import {rand,signName,reTop,prevUrl,getSto,setSto,url_search,imgLazy} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();


//从接口获取数据
(function(){
	
////////////////////////////////////////////////////////////////////////////////////////////////////
	//调用评论
	var oComment=$('.rate-list');//评论内容外层
	var sComment='';

	$.ajax({
		type:'get',
		url:apiUrl+'/goods/detail/queryMessage',
		data:{
			goodsId:url_search().id,
			pageNum:1,
			pageSize:10
		},
		success:function(data){
			if(data.head.code){
                console.log(data.head.message);
            }
            console.log('comment:',data);
            var data=data.body;

            // data.messages.forEach(function(item,index){
            // 	sComment+=`<li data-id=${item.id} data-memberNo=${item.memberNo}>
		          //           <div class="rate-user">
		          //               <img src=${item.avatar} alt="">
		          //               <span>${item.nickName}</span>
		          //               <em>${item.created}</em>
		          //           </div>
		          //           <p>${item.content}</p>
		          //       </li>`;
            // });
            // $(oComment).html(sComment);
            $('.normal>h2>span').text('('+data.messages.length+')');
            init(sComment,data.messages,oComment);
		},
		error:function(){}
	});

	load(sComment,$('.wrap'));

	function init(str,arr,wrap){
        arr.forEach(function(item,index){
            str+=`<li data-id=${item.id} data-member-no=${item.memberNo}>
                    <div class="rate-user">
                        <img src="" data-src=${item.avatar} alt="">
                        <span>${item.nickName}</span>
                        <em>${item.showDate}</em>
                    </div>
                    <p>${item.content}</p>
                </li>`;
        });
        $(wrap).html(str);

        //图片懒加载
        (function(){
            var aImg=$('.rate-list img');
            imgLazy(aImg);
        })();
    }

	function refresh(str,arr,wrap){
        arr.forEach(function(item,index){
            str+=`<li data-id=${item.id} data-member-no=${item.memberNo}>
                    <div class="rate-user">
                        <img src="" data-src=${item.avatar} alt="">
                        <span>${item.nickName}</span>
                        <em>${item.created}</em>
                    </div>
                    <p>${item.content}</p>
                </li>`;
        });
        $(wrap).append(str);

        //图片懒加载
        (function(){
            var aImg=$('.rate-list img');
            imgLazy(aImg);
        })();
    }

    //上滑加载
    function load(str,obj){

        var pageNum=1;
        var pageSize=10;
        var oWrap=$(obj);//获取滚动元素
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
            //document.title=startY-moveY;
        });

        oWrap.on('scroll',function(){
            var oLi=$('.rate-list'+' li:nth-last-of-type(1)');//获取最后一个内容块
            var t=0;//最后一个内容块距离页面最顶部的距离
            
            if(oLi){
                t=oLi.offset().top;
            }else{
                return;
            }

            if((startY-moveY)>=0&&t<iHScreen+100){
                clearTimeout(timer);
                timer=setTimeout(function(){
                    pageNum++;
                    clearTimeout(timer2);
                    $(oRe).html('正在加载中...');
                    $(oRe).css('bottom',0);
                    $.ajax({
                        type:'get',
                        url:apiUrl+'/goods/detail/queryMessage',
                        data:{
                        	goodsId:url_search().id,
                            pageNum:pageNum,
                            pageSize:pageSize
                        },
                        success:function(data){
                            if(data.head.code){
                                console.log('数据返回错误！');
                                return;
                            }
                            var data=data.body;
                            if(!data.end){
                                refresh(str,data.messages,$('.rate-list'));
                                //$(oRe).html('本次加载完成！');
                                timer2=setTimeout(function(){
                                    $(oRe).css('bottom','-1rem');
                                },2000);
                                iBtnNum=0;
                            }else{
                                if(!iBtnNum){
                                    refresh(str,data.messages,$('.rate-list'));
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

                            //图片懒加载
                            (function(){
                                var aImg=$('.rate-list img');
                                imgLazy(aImg);
                            })();
                        }
                    });
                },1000);
            }
        });
    }

})();


//返回前一个页面
(function(){
	$('header>a').attr('href',prevUrl());
})();


