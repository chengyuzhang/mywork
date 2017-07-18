import '../css/public.css';
import '../css/goods-search-result.css';
import $ from 'n-zepto';
import {rand,signName,reTop,prevUrl,imgLazy,url_search,getSto,setSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';


//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();

var jsonData={
        type:1,
        pageNum:1,
        pageSize:10,
        keyWord:url_search().keyword
    };

var getUrl=apiUrl+'/search/result/queryGoodsBykeyWordAndPage';
var iBtnNum=0;
var sortId=[];
var styleId=[];
var materialId=[];
var pricesId=[];
var targetId=[];
var labelId=[];

//从搜索列表点击热词过来后把搜索词填入输入框
$('.search-bar>div>input').val(url_search().keyword)

$('.search-bar>a').on('click',function(ev){
    var val=$('.search-bar>div>input').val();
    if(val==''){
    	alert('搜索字符不能为空！');
    	return;
    }
    window.location.href=encodeURI(encodeURI('goods-search-result.html?keyword='+val));
});

//选项栏的展开和收缩
(function(){
	var aTab=$('.tab-bar>li');
	var oCon=$('.tab-bar-con');
	var iH=$('.tab-bar-con>ul').height();
	//oCon.showStatus=false;

	aTab.forEach(function(item,index){
		
        item.iBtn='false';
		// $(item).on('click',function(){
		// 	if(!item.iBtn){
		// 		oCon.css('height',(iH+5));
		// 		item.iBtn=true;
		// 	}else{
		// 		oCon.css('height',0);

		// 		aTab.forEach(function(item1,index1){
		// 			item1.iBtn=false;
		// 		});
		// 	}
		// });

        $(item).on('click',function(){
            if(item.iBtn=='false'){
                oCon.css('height',(iH+5));
                aTab.forEach(function(item1,index1){
                    item.iBtn='false';
                    $(item1).find('em').css('transform','rotate(180deg)');
                });
                item.iBtn='true';
                $(item).find('em').css('transform','rotate(0deg)');
            }else{
                oCon.css('height',0);
                item.iBtn='false';
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
            }
            var data=data.body;
            //为了保持前一个选项栏的选中状态而对数据进行加工(增加每项active的状态记录)
            for(var name in data){
                data[name].forEach(function(item,index){
                    if(index==0){
                        item.active=true;
                    }else{
                        item.active=false;
                    }
                });
            }

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

                            switch(item1.dataset.type){
                                case 'sorts':
                                    sortId[0]=parseInt(item1.dataset.id);
                                    // styleId='';
                                    // materialId='';
                                    // pricesId='';
                                break;
                                case 'styles':
                                    //sortId='';
                                    styleId[0]=parseInt(item1.dataset.id);
                                    //materialId='';
                                    //pricesId='';
                                break;
                                case 'materials':
                                    //sortId='';
                                    //styleId='';
                                    materialId[0]=parseInt(item1.dataset.id);
                                    //pricesId='';
                                break;
                                case 'prices':
                                    //sortId='';
                                    //styleId='';
                                    //materialId='';
                                    pricesId[0]=parseInt(item1.dataset.id);
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
                                item.iBtn='false';
                                $(item1).find('em').css('transform','rotate(180deg)');
                            });

                            console.log('sortId:',sortId,'-styleId:',styleId,'-materialId:',materialId,'-pricesId:',pricesId);
                            //console.log(classof(sortId));
                            $.ajax({
                                type:'get',
                                url:apiUrl+'/search/result/queryGoodsBykeyWordAndPage',
                                data:{
                                    pageNum:pageNum,
                                    pageSize:pageSize,
                                    sortIds:sortId,
                                    styleIds:styleId,
                                    materialIds:materialId,
                                    priceIds:pricesId,
                                    keyWord:url_search().keyword
                                },
                                success:function(data){
                                    //console.log('data:',data);
                                    if(data.head.code){
                                        console.log(data.head.message);
                                    }
                                    var data=data.body;
                                    // $(oUl).css('display','none');
                                    // $(oUl1).css('display','block');
                                    // $(oUl).html('');
                                    init(str,data.goodsVoList,oUl);
                                },
                                error:function(){}
                            });

                            iBtnNum=0;
                            jsonData={
                                pageNum:1,
                                pageSize:10,
                                sortIds:sortId,
                                styleIds:styleId,
                                materialIds:materialId,
                                priceIds:pricesId,
                                keyWord:url_search().keyword
                            };
                            getUrl=apiUrl+'/search/result/queryGoodsBykeyWordAndPage';

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
                        str+=`<li class="active" data-id=${item.id} data-type=${type}>
                            <span>${item.name}</span>
                            <i></i>
                        </li>`;
                    }else{ 
                        str+=`<li data-id=${item.id} data-type=${type}>
                            <span>${item.name}</span>
                            <i></i>
                        </li>`;
                    }
                });
                $(itemCon).html(str); 
            }

        },
        error:function(){

        }
    });

    //列表
    $.ajax({
        type:'get',
        url:apiUrl+'/search/result/queryGoodsBykeyWordAndPage',
        data:jsonData,
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


    load(str,$('.goods-gife-list'));

    function init(str,arr,obj){
        arr.forEach(function(item,index){
            str+=`<li class="goods-gife-item">
                <img src="" data-src=${item.goodsPicture} alt="">
                <div>
                    <h3>${item.longName}</h3>`;
                    str+='<em>￥'+parseInt(item.salePrice)+'</em>';
                str+=`</div>
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
                    <h3>${item.longName}</h3>`;
                    str+='<em>￥'+parseInt(item.salePrice)+'</em>';
                str+=`</div>
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
                                //console.log('数据返回错误！');
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
                        }
                    });
                },1000);
            }

        });
    }
})();

//返回前一个页面
(function(){
	var url=getSto('searchurl',prevUrl());
	if(url){
		$('header>span>a').attr('href',url);
	}else{
		$('header>span>a').attr('href',prevUrl());
		setSto('searchurl',prevUrl());
	}   
})();
