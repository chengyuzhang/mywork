import '../css/public.css';
import '../css/kind-gift.css';
import $ from 'n-zepto';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,findArrIndex,imgLazy,cartCount,setSto,getSto,rmSto,showImgLayer,cancelImgLayer} from '../js/config';
import md5 from 'md5';


//删除商品详情前一面地址的记录
rmSto('goods-prevurl');

//底部导航栏显示隐藏
(function(){
    tabBar();
})();

//购物车数量
cartCount();

var jsonData={
        type:4,
        pageNum:1,
        pageSize:10
    };

var getUrl=apiUrl+'/home/queryHomeGoodsByPage';
var iBtnNum=0;
var sortId=[];
var targetId=[];
var labelId=[];
var labelId1=[];

if(getSto('kind-gife')){
    console.log(12);
    getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
    jsonData={
        pageNum:1,
        pageSize:10,
        labelIds:JSON.parse(getSto('kind-gife')).labelId
    };

}

//弹出送给谁及为了庆祝什么的弹层
(function(){
    var timer=null;

    $('.kind-gife .for-who').get(0).onclick=$('.kind-gife .for-what').get(0).onclick=function(){
        $('.opacity').css('display','block');
        timer=setTimeout(function(){
            $('.opacity').css('opacity',1);
        },50);
    };

    //关闭按钮的点击
    $('.close').get(0).onclick=function(){
        $('.opacity').css('opacity',0);
        timer=setTimeout(function(){
            $('.opacity').css('display','none');
        },550);
    };

    var forWhoUl=$('.for-who-ul');
    var forWhatUl=$('.for-what-ul');
    var forWhoLi=$('.for-who-ul li');
    var forWhatLi=$('.for-what-ul li');
    var forWhatH3=$('.for-what-h');
    var sLabel='';
    showImgLayer('数据请求中...');
    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryLabels',
        data:{},
        success:function(data){
            
            if(data.head.code){
                console.log(data.head.message);
                cancelImgLayer();
                return;
            }
            var data=data.body;

            data.labels.forEach(function(item,index){
                sLabel+=`<li data-id=${item.id}>${item.labelContent}<i></i></li>`;
            });
            $(forWhatUl).html(sLabel);

            var forWhatLi=$('.for-what-ul li');

            //为了庆祝什么的点击选择
            forWhatLi.forEach(function(item,index){
                $(item).attr('data-btn','true');

                $(item).on('click',function(){
                    if($(this).hasClass('active')){//连续点击未选中单个按钮
                        $(item).attr('data-btn','true');
                        $(item).removeClass('active');
                        labelId[0]='';
                    }else{//选中单个按钮
                        forWhatLi.forEach(function(item,index){
                            $(item).attr('data-btn','true');
                            $(item).removeClass('active');
                        });
                        $(this).attr('data-btn','false');
                        $(this).addClass('active');
                        labelId[0]=parseInt(item.dataset.id);
                    }

                    //清除标签
                    var aLi=$('.kind-gife-list>li.kind-gife-item');
                    aLi.forEach(function(item1,index1){
                        $(item1).removeClass('active');
                        item1.iBtn=true;
                    });
                    
                });

            });

            //送给谁的点击选择
            forWhoLi.forEach(function(item,index){
                $(item).attr('data-btn','true');

                $(item).on('click',function(){
                    if($(this).hasClass('active')){//连续点击未选中单个按钮
                        $(item).attr('data-btn','true');
                        $(item).removeClass('active');
                        targetId[0]='';
                    }else{//选中单个按钮
                        forWhoLi.forEach(function(item,index){
                            $(item).attr('data-btn','true');
                            $(item).removeClass('active');
                        });
                        $(this).attr('data-btn','false');
                        $(this).addClass('active');
                        targetId[0]=parseInt(item.dataset.id);
                    }

                    //选择宝爸宝妈时“为了庆祝什么”的显示和隐藏
                    forWhoLi.forEach(function(item1,index1){
                        if($(item1).hasClass('parents')){
                            forWhatLi.forEach(function(item,index){
                                $(item).attr('data-btn','true');
                                $(item).removeClass('active');
                            });

                            if($(item1).attr('data-btn')=='false'){
                                forWhatH3.css('display','none');
                                forWhatUl.css('display','none');
                            }else if($(item1).attr('data-btn')=='true'){
                                forWhatH3.css('display','block');
                                forWhatUl.css('display','block');
                            }

                            labelId[0]='';
                        }
                    });

                    //清除标签
                    var aLi=$('.kind-gife-list>li.kind-gife-item');
                    aLi.forEach(function(item1,index1){
                        $(item1).removeClass('active');
                        item1.iBtn=true;
                    });
                });
            });

            //确定按钮点击
            $('.btn').get(0).onclick=function(){
                $('.opacity').css('opacity',0);
                timer=setTimeout(function(){
                    $('.opacity').css('display','none');
                },550);

                console.log('targetId:',targetId,'-labelId:',labelId);
                showImgLayer('数据请求中...');
                $.ajax({
                    type:'get',
                    url:apiUrl+'/home/list/queryGoodsByParamAndPage',
                    data:{
                        pageNum:1,
                        pageSize:10,
                        targetIds:targetId,
                        labelIds:labelId
                    },
                    success:function(data){
                        console.log('data:',data);
                        if(data.head.code){
                            console.log(data.head.message);
                        }
                        var data=data.body;

                        var oUl=$('.goods-gife-list');//列表外层
                        var str='';
                        init(str,data.goodsVoList,oUl);
                        cancelImgLayer();
                    },
                    error:function(err){
                        console.log(data.head.message);
                        cancelImgLayer();
                        return;
                    }
                });
                
                iBtnNum=0;
                jsonData={
                    pageNum:1,
                    pageSize:10,
                    targetIds:targetId,
                    labelIds:labelId
                };
                getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
            };
            cancelImgLayer();
        },
        error:function(err){
            console.log(err);
            cancelImgLayer();
            return;
        }
    });

    function init(str,arr,obj){
        arr.forEach(function(item,index){
            str+=`<li class="goods-gife-item">
                <img src="" data-src=${item.goodsPicture} alt="">
                <div>
                    <h3>${item.shortName}</h3>
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
})();

//获取选项栏及列表数据
(function(){
    var oCon=$('.kind-gife-list');
    var oUl=$('.goods-gife-list');//列表外层
    var str='';
    var sLabel='';
    //获取标签
    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryLabels',
        data:{},
        success:function(data){
            
            if(data.head.code){
                console.log(data.head.message);
                cancelImgLayer();
                return;
            }
            var data=data.body;

            data.labels.forEach(function(item,index){
                switch(item.id){
                    case 5:
                    sLabel+=`<li class="kind-gife-item" data-id=${item.id}>
                        <img src=${require('../imgs/icon-birthday.png')} alt="">
                        <p>${item.labelContent}</p>
                    </li>`;
                    break;
                    case 6:
                    sLabel+=`<li class="kind-gife-item" data-id=${item.id}>
                        <img src=${require('../imgs/icon-month.png')} alt="">
                        <p>${item.labelContent}</p>
                    </li>`;
                    break;
                    case 7:
                    sLabel+=`<li class="kind-gife-item" data-id=${item.id}>
                        <img src=${require('../imgs/icon-100.png')} alt="">
                        <p>${item.labelContent}</p>
                    </li>`;
                    break;
                    case 8:
                    sLabel+=`<li class="kind-gife-item" data-id=${item.id}>
                        <img src=${require('../imgs/icon-glad.png')} alt="">
                        <p>${item.labelContent}</p>
                    </li>`;
                    break;
                    case 9:
                    sLabel+=`<li class="kind-gife-item" data-id=${item.id}>
                        <img src=${require('../imgs/icon-memery.png')} alt="">
                        <p>${item.labelContent}</p>
                    </li>`;
                    break;
                    case 10:
                    sLabel+=`<li class="kind-gife-item" data-id=${item.id}>
                        <img src=${require('../imgs/icon_children.png')} alt="">
                        <p>${item.labelContent}</p>
                    </li>`;
                    break;
                }
                
            });

            $(oCon).html(sLabel);

            //标签icon对应及点击事件
            var aLi=$('.kind-gife-list>li.kind-gife-item');
            
            aLi.forEach(function(item,index){
                item.iBtn=true;
                $(item).on('click',function(){
                    
                    //清除送给谁和为了什么
                    var forWhatLi=$('.for-what-ul li');
                    var forWhoLi=$('.for-who-ul li');
            
                    forWhatLi.forEach(function(item,index){
                        $(item).attr('data-btn','true');
                        $(item).removeClass('active');
                    });

                    forWhoLi.forEach(function(item,index){
                        $(item).attr('data-btn','true');
                        $(item).removeClass('active');
                    });

                    //以下是标签逻辑
                    if(item.iBtn){
                        aLi.forEach(function(item1,index1){
                            $(item1).removeClass('active');
                            item1.iBtn=true;
                        });
                        $(item).addClass('active');
                        labelId1[0]=parseInt(item.dataset.id);
                    }else{
                        $(item).removeClass('active');
                        //labelId1.splice(findArrIndex(labelId1,parseInt(item.dataset.id)),1);
                        labelId1=[];
                    }
                    item.iBtn=!item.iBtn;
                    console.log(labelId1);

                    setSto('kind-gife',JSON.stringify({
                        labelId:labelId1
                    }));

                    iBtnNum=0;
                    // jsonData={
                    //     pageNum:1,
                    //     pageSize:10,
                    //     labelIds:labelId1
                    // };
                    getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
                    showImgLayer('数据请求中...');
                    $.ajax({
                        type:'get',
                        url:getUrl,
                        data:{
                            pageNum:1,
                            pageSize:10,
                            labelIds:labelId1
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
                        error:function(err){
                            console.log(err);
                            cancelImgLayer();
                            return;
                        }
                    });
                });
            });
        },
        error:function(err){
            console.log(err);
            cancelImgLayer();
            return;
        }
    });

    //列表
    $.ajax({
        type:'get',
        url:getUrl,
        data:jsonData,
        success:function(data){
            //console.log(data);
            if(data.head.code){
                console.log(data.head.message);
                cancelImgLayer();
                return;
            }
            var data=data.body;
            init(str,data.goodsVoList,oUl);

            $('.kind-gife-list>li.kind-gife-item').forEach(function(item,index){
                console.log('x:',jsonData.labelIds[0]);
                console.log(item.dataset.id);
                if(jsonData.labelIds[0]==item.dataset.id){
                    $(item).addClass('active');
                    item.iBtn=false;
                }
            });
        },
        error:function(err){
            console.log(err);
            cancelImgLayer();
            return;
        }
    });


    load(str,$('.kind-gife'));

    function init(str,arr,obj){
        arr.forEach(function(item,index){
            str+=`<li class="goods-gife-item">
                <img src="" data-src=${item.goodsPicture} alt="">
                <div>
                    <h3>${item.shortName}</h3>
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
                    <h3>${item.shortName}</h3>
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

