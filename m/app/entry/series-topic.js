import '../css/public.css';
import '../css/series-topic.css';
import $ from 'n-zepto';
import {rand,signName,reTop,imgLazy,url_search} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';


//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();

//商品列表
(function(){
    var oCon=$('.goods-gife-list');
    var str='';
    var pageNum=1;
    var pageSize=10;

    $.ajax({
        type:'get',
        url:apiUrl+'/home/topic/queryTopicById',
        data:{
            topicId:url_search().id,
            pageNum:pageNum,
            pageSize:pageSize
        },
        success:function(data){
            if(data.head.code){
                console.log(data.head.message);
                return;
            }
            
            var data=data.body;
            console.log(data);
            //document.title=data.topic.title;
            $('.normal>h2').text(data.topic.title);
            $('.custom-entry img').attr('data-src',data.topic.mainPicture);
            //图片懒加载
	        (function(){
	            var aImg=$('.custom-entry img');
	            imgLazy(aImg);
	        })();

            init(str,data.topicGoodsVo,oCon);
        },
        error:function(){

        }
    });

    load(str,$('.wrap'));

    function init(str,arr,obj){
        
        arr.forEach(function(item,index){
            str+=`<li class="goods-gife-item">`;
            str+=`<img src="" alt="" data-src=${item.goodsPicture}>
                <div>
                    <p>${item.name}</p>`;
                    str+='<em>￥'+parseInt(item.salePrice)+'</em>';
                str+=`</div>
                <a href=goods-detail.html?id=${item.id}></a>`;
            str+=`</li>`;
        });
        $(obj).html(str);
        //图片懒加载
        (function(){
            var aImg=$('.goods-gife-list img');
            imgLazy(aImg);
        })();
    }

    function refresh(str,arr,obj){
        arr.forEach(function(item,index){
            str+=`<li class="goods-gife-item">`;
            str+=`<img src="" alt="" data-src=${item.goodsPicture}>
                <div>
                    <p>${item.name}</p>`;
                    str+='<em>￥'+parseInt(item.salePrice)+'</em>';
                str+=`</div>
                <a href=goods-detail.html?id=${item.id}></a>`;
            str+=`</li>`;
        });
        $(obj).append(str);
        //图片懒加载
        (function(){
            var aImg=$('.goods-gife-list img');
            imgLazy(aImg);
        })();
    }

    //上滑加载
    function load(str,obj){
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
            var oLi=$('.goods-gife-list'+' li:nth-last-of-type(1)');//获取最后一个内容块
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
                        url:apiUrl+'/home/topic/queryTopicById',
                        data:{
                            topicId:1,//url_search().id,
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
                                refresh(str,data.topicGoodsVo,$('.goods-gife-list'));
                                //$(oRe).html('本次加载完成！');
                                timer2=setTimeout(function(){
                                    $(oRe).css('bottom','-1rem');
                                },2000);
                                iBtnNum=0;
                            }else{
                                if(!iBtnNum){
                                    refresh(str,data.topicGoodsVo,$('.goods-gife-list'));
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
                                var aImg=$('.guess-like img');
                                imgLazy(aImg);
                            })();
                        }
                    });
                },1000);
            }

        });
    }

})();
