import '../css/public.css';
import '../css/custom-list.css';
import $ from 'n-zepto';
import {rand,signName,reTop,imgLazy,rmSto,showImgLayer,cancelImgLayer} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';


//删除商品详情前一面地址的记录
rmSto('goods-prevurl');

//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();

var jsonData={
        type:6,
        pageNum:1,
        pageSize:10
    };

var getUrl=apiUrl+'/home/queryHomeGoodsByPage';
var iBtnNum=0;

//获取选项栏及列表数据
(function(){  
    var oUl=$('.goods-gife-list');//列表外层
    var str='';  
    showImgLayer('数据请求中...');
    //列表
    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryHomeGoodsByPage',
        data:{
            type:6,
            pageNum:1,
            pageSize:10
        },
        success:function(data){
            //console.log(data);
            if(data.head.code){
                console.log(data.head.message);
                cancelImgLayer();
                return;
            }
            var data=data.body;
            init(str,data.goodsVoList,oUl);
            cancelImgLayer();
        },
        error:function(){

        }
    });


    load(str,$('.wrap'));

    function init(str,arr,obj){
        arr.forEach(function(item,index){
            str+=`<li class="goods-gife-item">
                <img src="" data-src=${item.goodsPicture} alt="">
                <div>
                    <h3>${item.longName}</h3>
                    <em>￥${item.salePrice}</em>
                </div>
                <a href="goods-detail.html?id=${item.id}"></a>
            </li>`;
        });
        $(obj).html(str);

        //图片懒加载
        (function(){
            var aImg=$('.goods-gife-list img');
            imgLazy(aImg);
        })();
        //图片懒加载
        (function(){
            var aImg=$('.goods-gife-list1 img');
            imgLazy(aImg);
        })();
    }

    function refresh(str,arr,obj){
        console.log('arr:',arr);
        arr.forEach(function(item,index){
            str+=`<li class="goods-gife-item">
                <img src="" data-src=${item.goodsPicture} alt="">
                <div>
                    <h3>${item.longName}</h3>
                    <em>￥${item.salePrice}</em>
                </div>
                <a href="goods-detail.html?id=${item.id}"></a>
            </li>`;
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

        var pageNum=1;
        var pageSize=10;
        var oWrap=$(obj);//获取滚动元素
        var oRe=$('.refresh');
        var iHScreen=window.screen.availHeight;//获取屏幕高度

        var iNum=0;//记录第一次到最后一条数据时的页数
        
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
            if($('.goods-gife-list li').length){
                t=oLi.offset().top;
            }else{
                return;
            }

            //console.log('page:',jsonData.pageNum);

            if((startY-moveY)>=0&&t<iHScreen+100){
                clearTimeout(timer);
                timer=setTimeout(function(){
                    jsonData.pageNum++;
                    clearTimeout(timer2);
                    $(oRe).html('正在加载中...');
                    $(oRe).css('bottom',0);
                    $.ajax({
                        type:'get',
                        url:getUrl,
                        data:jsonData,
                        success:function(data){
                            if(data.head.code){
                                console.log(data.head.message);
                                cancelImgLayer();
                                return;
                            }
                            var data=data.body;
                            if(!data.end){//未到末尾
                                refresh(str,data.goodsVoList,$('.goods-gife-list'));
                                //$(oRe).html('本次加载完成！');
                                timer2=setTimeout(function(){
                                    $(oRe).css('bottom','-1rem');
                                },2000);
                                iBtnNum=0;
                            }else{//到末尾
                                if(!iBtnNum){
                                    refresh(str,data.goodsVoList,$('.goods-gife-list'));
                                }
                                iBtnNum++;
                                iNum=jsonData.pageNum-1;
                                jsonData.pageNum=iNum;
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