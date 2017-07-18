import '../css/public.css';
import '../css/gife-list.css';
import $ from 'n-zepto';
import {rand,signName,reTop,imgLazy,classof,rmSto,showImgLayer,cancelImgLayer} from '../js/config';
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
        type:4,
        pageNum:1,
        pageSize:10
    };

var getUrl=apiUrl+'/home/queryHomeGoodsByPage';
var iBtnNum=0;
var sortId=[];
var styleId=[];
var materialId=[];
var pricesId=[];
var targetId=[];
var labelId=[];

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
        //$('.for-what p').text('为了庆祝什么？');
        //$('.for-who p').text('送给谁？');
    };

    var forWhoUl=$('.for-who-ul');
    var forWhatUl=$('.for-what-ul');
    var forWhoLi=$('.for-who-ul li');
    var forWhatLi=$('.for-what-ul li');
    var forWhatH3=$('.for-what-h');
    var sLabel='';

    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryLabels',
        data:{},
        success:function(data){
            console.log('data::',data);
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
                        $('.for-what p').text('为了庆祝什么？');
                    }else{//选中单个按钮
                        forWhatLi.forEach(function(item,index){
                            $(item).attr('data-btn','true');
                            $(item).removeClass('active');
                        });
                        $(this).attr('data-btn','false');
                        $(this).addClass('active');
                        labelId[0]=parseInt(item.dataset.id);
                        $('.for-what p').text($(this).text());
                    }
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
                        $('.for-who p').text('送给谁？');
                    }else{//选中单个按钮
                        forWhoLi.forEach(function(item,index){
                            $(item).attr('data-btn','true');
                            $(item).removeClass('active');
                        });
                        $(this).attr('data-btn','false');
                        $(this).addClass('active');
                        targetId[0]=parseInt(item.dataset.id);
                        $('.for-who p').text($(this).text());
                    }

                    //选择宝爸宝妈时“为了庆祝什么”的显示和隐藏
                    forWhoLi.forEach(function(item1,index1){
                        if($(item1).hasClass('parents')){
                            forWhatLi.forEach(function(item,index){
                                $(item).attr('data-btn','true');
                                $(item).removeClass('active');
                                $('.for-what p').text('为了庆祝什么？');
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
                        labelIds:labelId,
                        sortIds:sortId,
                        styleIds:styleId,
                        materialIds:materialId,
                        priceIds:pricesId
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
                        cancelImgLayer('数据请求中...');
                    },
                    error:function(){}
                });
                
                iBtnNum=0;
                jsonData={
                    pageNum:1,
                    pageSize:10,
                    targetIds:targetId,
                    labelIds:labelId,
                    sortIds:sortId,
                    styleIds:styleId,
                    materialIds:materialId,
                    priceIds:pricesId
                };
                getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
            };
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
})();

//选项栏的展开和收缩
(function(){
	var aTab=$('.tab-bar>li');
	var oCon=$('.tab-bar-con');
	var iH=$('.tab-bar-con>ul').height();

	aTab.forEach(function(item,index){
		item.dataset.btn='false';

		$(item).on('click',function(){
			if(item.dataset.btn=='false'){
				oCon.css('height',(iH+5));
                aTab.forEach(function(item1,index1){
                    item1.dataset.btn='false';
                    $(item1).find('em').css('transform','rotate(180deg)');
                });
				item.dataset.btn='true';
                $(item).find('em').css('transform','rotate(0deg)');
			}else{
				oCon.css('height',0);
                item.dataset.btn='false';
                $(item).find('em').css('transform','rotate(180deg)');
			}
		});
	});
})();

//获取选项栏及列表数据
(function(){
    var oOl=$('.tab-bar');//选项栏外层
    var aOlLi=$('.tab-bar li');//选项栏的tab项
    var itemCon=$('.tab-bar-con ul');
    
    var oUl=$('.goods-gife-list');//列表外层
    var oUl1=$('.goods-gife-list1');//列表外层
    var str='';

    var aTab=$('.tab-bar>li');
    var oCon=$('.tab-bar-con');

    showImgLayer('数据请求中...');
    //选项栏
    $.ajax({
        type:'get',
        url:apiUrl+'/search/result/queryConfig',
        data:{
        },
        success:function(data){
            //console.log(data);
            if(data.head.code){
                console.log(data.head.message);
                cancelImgLayer();
                return;
            }
            var data=data.body;
            //为了保持前一个选项栏的选中状态而对数据进行加工(增加每项active的状态记录)
            for(var name in data){
                data[name].forEach(function(item,index){
                    if(index==0){
                        //item.active=true;
                    }else{
                        item.active=false;
                    }
                });
            }
            cancelImgLayer();
            //切换选项栏数据
            aOlLi.forEach(function(item,index){
                $(item).on('click',function(){
                    var strItem='';
                    
                    switch(index){
                        case 0:
                            renderTab(data.sorts,strItem,'sorts');
                        break;
                        case 1:
                            renderTab(data.styles,strItem,'styles');
                        break;
                        case 2:
                            renderTab(data.materials,strItem,'materials');
                        break;
                        case 3:
                            renderTab(data.prices,strItem,'prices');
                        break;
                    }

                    //点击选项
                    var aItem=$('.tab-bar-con li');//选项栏的内容项
                    
                    //点击选项栏获取不同排序的数据
                    aItem.forEach(function(item1,index1){
                        $(item1).on('click',function(){
                            var pageNum=1;
                            var pageSize=10;
                            showImgLayer('数据请求中...');
                            switch(item1.dataset.type){
                                case 'sorts':
                                    sortId[0]=parseInt(item1.dataset.id);
                                    var sText=$(item1).find('span').text();
                                    if(sText=='价格由高到低'){
                                        sText='价格<i style="background:url('+require('../imgs/down-icon.png')+') no-repeat; background-size:100% 100%;"></i>';
                                    }
                                    if(sText=='价格由低到高'){
                                        sText='价格<i style="background:url('+require('../imgs/up-icon.png')+') no-repeat; background-size:100% 100%;"></i>';
                                    }
                                    $(aOlLi[0]).find('span').html(sText);
                                break;
                                case 'styles':
                                    styleId[0]=parseInt(item1.dataset.id);
                                    $(aOlLi[1]).find('span').text($(item1).find('span').text());
                                break;
                                case 'materials':
                                    materialId[0]=parseInt(item1.dataset.id);
                                    $(aOlLi[2]).find('span').text($(item1).find('span').text());
                                break;
                                case 'prices':
                                    pricesId[0]=parseInt(item1.dataset.id);
                                    $(aOlLi[3]).find('span').text($(item1).find('span').text());
                                break;
                            }

                            //保持前一个选项栏的选中状态
                            data[item1.dataset.type].forEach(function(item2,index2){
                                item2.active=false;
                            });
                            data[item1.dataset.type][index1].active=true;

                            //选中项后折回
                            oCon.css('height',0);
                            aTab.forEach(function(item1,index1){
                                item1.dataset.btn='false';
                                $(item1).find('em').css('transform','rotate(180deg)');
                            });

                            //console.log('sortId:',sortId,'-styleId:',styleId,'-materialId:',materialId,'-pricesId:',pricesId);
                            //console.log(classof(sortId));
                            $.ajax({
                                type:'get',
                                url:apiUrl+'/home/list/queryGoodsByParamAndPage',
                                data:{
                                    pageNum:pageNum,
                                    pageSize:pageSize,
                                    sortIds:sortId,
                                    styleIds:styleId,
                                    materialIds:materialId,
                                    priceIds:pricesId
                                },
                                success:function(data){
                                    //console.log('data:',data);
                                    if(data.head.code){
                                        console.log(data.head.message);
                                        cancelImgLayer();
                                        return;
                                    }
                                    var data=data.body;
                                    // $(oUl).css('display','none');
                                    // $(oUl1).css('display','block');
                                    // $(oUl).html('');
                                    init(str,data.goodsVoList,oUl);
                                    cancelImgLayer();
                                },
                                error:function(err){
                                    console.log(err);
                                    cancelImgLayer();
                                    return;
                                }
                            });

                            iBtnNum=0;
                            jsonData={
                                pageNum:1,
                                pageSize:10,
                                sortIds:sortId,
                                styleIds:styleId,
                                materialIds:materialId,
                                priceIds:pricesId
                            };
                            getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';

                            aItem.forEach(function(item2,index2){
                                $(item2).removeClass('active');
                            });
                            $(item1).addClass('active');
                        });
                    });
                });
            });

            function renderTab(arr,str,type){
                arr.forEach(function(item,index1){
                    if(item.active){
                        if(type=='sorts'&&item.id==3){
                            str+=`<li class="active" data-id=${item.id} data-type=${type}>`;
                                str+='<span>'+item.name+'<em style="background:url('+require('../imgs/down-icon.png')+') no-repeat; background-size:100% 100%;"></em></span>';
                                str+=`<i></i>
                            </li>`;
                        }else if(type=='sorts'&&item.id==4){
                            str+=`<li class="active" data-id=${item.id} data-type=${type}>`;
                                str+='<span>'+item.name+'<em style="background:url('+require('../imgs/up-icon.png')+') no-repeat; background-size:100% 100%;"></em></span>';
                                str+=`<i></i>
                            </li>`;
                        }else{
                            str+=`<li class="active" data-id=${item.id} data-type=${type}>
                                <span>${item.name}</span>
                                <i></i>
                            </li>`;
                        }
                    }else{ 
                        if(type=='sorts'&&item.id==3){
                            str+=`<li class="" data-id=${item.id} data-type=${type}>`;
                                str+='<span>'+item.name+'<em style="background:url('+require('../imgs/down-icon.png')+') no-repeat; background-size:100% 100%;"></em></span>';
                                str+=`<i></i>
                            </li>`;
                        }else if(type=='sorts'&&item.id==4){
                            str+=`<li class="" data-id=${item.id} data-type=${type}>`;
                                str+='<span>'+item.name+'<em style="background:url('+require('../imgs/up-icon.png')+') no-repeat; background-size:100% 100%;"></em></span>';
                                str+=`<i></i>
                            </li>`;
                        }else{
                            str+=`<li class="" data-id=${item.id} data-type=${type}>
                                <span>${item.name}</span>
                                <i></i>
                            </li>`;
                        }
                    }
                });
                $(itemCon).html(str); 
            }
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
        url:apiUrl+'/home/queryHomeGoodsByPage',
        data:{
            type:4,
            pageNum:1,
            pageSize:10
        },
        success:function(data){
            //console.log(data);
            if(data.head.code){
                console.log(data.head.message);
            }
            var data=data.body;
            init(str,data.goodsVoList,oUl);
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
