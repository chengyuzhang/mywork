import '../css/public.css';
import '../css/kind-children.css';
import $ from 'n-zepto';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,imgLazy,cartCount,rmSto,showImgLayer,cancelImgLayer} from '../js/config';
import md5 from 'md5';


//删除商品详情前一面地址的记录
rmSto('goods-prevurl');

//底部导航栏显示隐藏
(function(){
    tabBar();
})();

//购物车数量
cartCount();

//获取列表数据
(function(){
	var oUl=$('.kind-children-list');
    var pageNum=1;
    var pageSize=10;
	var str='';
    showImgLayer('数据请求中...');
	$.ajax({
		type:'get',
		url:apiUrl+'/home/list/queryParentChildByPage',
		data:{
			pageNum:pageNum,
			pageSize:pageSize
		},
		success:function(data){
			if(data.head.code){
				console.log(data.head.message);
                cancelImgLayer();
                return;
			}
			var data=data.body;
			init(str,data.topics,oUl);
            cancelImgLayer();
		},
		error:function(){
            console.log(err);
            cancelImgLayer();
            return;
		}
	});

	load(str,$('.kind-children'));

	function init(str,arr,obj){
        arr.forEach(function(item,index){
            str+=`<li class="kind-children-item">
                    <div class="l">
                        <h3>${item.title}</h3>
                        <p>${item.subtitle}</p>
                    </div>`;
                    if(item.goodsList[0]){
                        str+=`<a href="goods-detail.html?id=${item.goodsList[0].goodsId}"><img src="" data-src=${item.firstPicture} alt=""></a>`;
                    }
                    if(item.goodsList[1]){
                        str+=`<a href="goods-detail.html?id=${item.goodsList[1].goodsId}"><img src="" data-src=${item.secondPicture} alt=""></a>`;
                    }
                str+=`</li>`;
        });
        $(obj).html(str);

        //图片懒加载
        (function(){
            var aImg=$('.kind-children-list img');
            imgLazy(aImg);
        })();
    }

	function refresh(str,arr,obj){
        arr.forEach(function(item,index){
            str+=`<li class="kind-children-item">
                    <div class="l">
                        <h3>${item.title}</h3>
                        <p>${item.subtitle}</p>
                    </div>`;
                        if(item.goodsList[0]){
                            str+=`<a href="goods-detail.html?id=${item.goodsList[0].goodsId}"><img src="" data-src=${item.firstPicture} alt=""></a>`;
                        }
                        if(item.goodsList[1]){
                            str+=`<a href="goods-detail.html?id=${item.goodsList[1].goodsId}"><img src="" data-src=${item.secondPicture} alt=""></a>`;
                        }
                str+=`</li>`;
        });
        $(obj).append(str);

        //图片懒加载
        (function(){
            var aImg=$('.kind-children-list img');
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
            var oLi=$('.kind-children-list'+' li:nth-last-of-type(1)');//获取最后一个内容块
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
                        url:apiUrl+'/home/list/queryParentChildByPage',
                        data:{
                            pageNum:pageNum,
                            pageSize:pageSize
                        },
                        success:function(data){
                            if(data.head.code){
                                console.log(data.head.message);
                                cancelImgLayer();
                                return;
                            }
                            var data=data.body;
                            if(!data.end){
                                refresh(str,data.topics,$('.kind-children-list'));
                                //$(oRe).html('本次加载完成！');
                                timer2=setTimeout(function(){
                                    $(oRe).css('bottom','-1rem');
                                },2000);
                                iBtnNum=0;
                            }else{
                                if(!iBtnNum){
                                    refresh(str,data.topics,$('.kind-children-list'));
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
                                var aImg=$('.goods-gife-list img');
                                imgLazy(aImg);
                            })();
                        },
                        error:function(err){
                            console.log(err);
                            cancelImgLayer();
                            return;
                        }
                    });
                },1000);
            }
        });
    }
})();