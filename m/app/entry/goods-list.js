import '../css/public.css';
import '../css/goods-list.css';
import $ from 'n-zepto';
import {rand,signName,reTop,findArrIndex,rmSto,setSto,getSto,imgLazy,showImgLayer,cancelImgLayer} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';


//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();


//删除商品详情前一面地址的记录
rmSto('goods-prevurl');


//获取选项栏及列表数据
(function(){
    var oOl=$('.tab-bar');//选项栏外层
    var aOlLi=$('.tab-bar li');//选项栏的tab项
    
    var oUl=$('.goods-gife-list');//列表外层
    var oUl1=$('.goods-gife-list1');//列表外层
    var str='';

    var jsonData={
        type:5,
        pageNum:1,
        pageSize:10,
    };
    var getUrl=apiUrl+'/home/queryHomeGoodsByPage';
    if(getSto('goods-list')){
        var jsonGoodsList=JSON.parse(getSto('goods-list'));
        getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
        jsonData={
            pageNum:1,
            pageSize:10,
            sortIds:1,
            styleIds:jsonGoodsList.styleIds,
            materialIds:jsonGoodsList.materialIds,
            priceIds:jsonGoodsList.priceIds
        };
    }

    var iBtnNum=0;

    showImgLayer('数据请求中...');
    //选项栏
    $.ajax({
        type:'get',
        url:apiUrl+'/search/result/queryConfig',
        data:{
        },
        success:function(data){
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
                        item.active=true;
                    }else{
                        item.active=false;
                    }
                });
            }
            var sortId=[1];
            var styleId=[];
            var materialId=[];
            var priceId=[];

            if(getSto('goods-list')){
                var jsonGoodsList=JSON.parse(getSto('goods-list'));
                sortId=[1];
                styleId=jsonGoodsList.styleIds||[];
                materialId=jsonGoodsList.materialIds||[];
                priceId=jsonGoodsList.priceIds||[];
            }
            console.log('-styleId:',styleId,'-materialId:',materialId,'-priceId:',priceId);
            for(var name in data){
            	if(name=='sorts'){
            		continue;
            	}
            	renderTab(data[name],name);
            }
            cancelImgLayer();
            //类型、材质、范围
			(function(){
				var aBtn=$('.tab-bar-item-top');
				var aCon=$('.tab-bar-item ul');
				var aI=$('.tab-bar-item i');
				
				aBtn.forEach(function(item,index){
					show_hidden(item,aCon[index],aI[index]);
				});

				//展开和收缩标签栏
				function show_hidden(btn,wrap,i){
					btn.iBtn=true;
					$(btn).on('click',function(){
						if(btn.iBtn){
							$(wrap).css('height','auto');
							$(i).addClass('active');
						}else{
							$(wrap).css('height','.34rem');
							$(i).removeClass('active');
						}
						btn.iBtn=!btn.iBtn;
					});
                    console.log(':',$(wrap).height());
				}

				var aTypeLi=$('.type li');
				var aMaterialLi=$('.material li');
				var aPriceLi=$('.price li');
				var oTypeP=$('.type p');
				var oMaterialP=$('.material p');
				var oPriceP=$('.price p');
				

				toggleBtn(aTypeLi,oTypeP,'styles');
				toggleBtn(aMaterialLi,oMaterialP,'materials');
				toggleBtn(aPriceLi,oPriceP,'prices');
				

                if(getSto('goods-list')){
                    var jsonGoodsList=JSON.parse(getSto('goods-list'));
                    console.log('d:',jsonGoodsList);
                    for(var name in jsonGoodsList){
                        if(name=='styleIds'){
                            selectStatus($('.styles li'),'styleIds');
                        }
                        if(name=='materialIds'){
                            selectStatus($('.materials li'),'materialIds');
                        }
                        if(name=='priceIds'){
                            selectStatus($('.prices li'),'priceIds');
                        }

                    }

                    function selectStatus(arr,name){//console.log('name:',name);
                        arr.forEach(function(item,index){//console.log('item:',item);
                            jsonGoodsList[name].forEach(function(item1,index1){//console.log('item1:',item1);
                                if(item1){
                                    if(index==(item1-1)){
                                        $(item).addClass('active');
                                        item.iBtn=false;
                                    }
                                }
                            });
                        });
                    }
                }

				//切换选中和未选中状态
				function toggleBtn(aLi,p,type){
					var arr=[];

					aLi.forEach(function(item,index){
						item.iBtn=true;
						$(item).on('click',function(){

							switch(type){
								case 'styles':
									if(item.iBtn){
										$(item).addClass('active');
										p.addClass('active');
										arr.push($(this).text());
										styleId[index]=parseInt(item.dataset.id);
										p.text(arr.join('，'));
									}else{
										$(item).removeClass('active');
										arr.splice(findArrIndex(arr,$(this).text()),1);
										styleId[index]='';
										p.text(arr.join('，'));
										if(arr.length==0){
											p.removeClass('active');
											p.text('全部');
										}
									}
								break;
								case 'materials':
									if(item.iBtn){
										$(item).addClass('active');
										p.addClass('active');
										arr.push($(this).text());
										materialId[index]=parseInt(item.dataset.id);
										p.text(arr.join('，'));
									}else{
										$(item).removeClass('active');
										arr.splice(findArrIndex(arr,$(this).text()),1);
										materialId[index]='';
										p.text(arr.join('，'));
										if(arr.length==0){
											p.removeClass('active');
											p.text('全部');
										}
									}
								break;
								case 'prices':
									if(item.iBtn){
										$(item).addClass('active');
										p.addClass('active');
										arr.push($(this).text());
										priceId[index]=parseInt(item.dataset.id);
										p.text(arr.join('，'));
									}else{
										$(item).removeClass('active');
										arr.splice(findArrIndex(arr,$(this).text()),1);
										priceId[index]='';
										p.text(arr.join('，'));
										if(arr.length==0){
											p.removeClass('active');
											p.text('全部');
										}
									}
								break;
							}
                            setSto('goods-list',JSON.stringify({
                                //sortIds:sortId,
                                styleIds:styleId,
                                materialIds:materialId,
                                priceIds:priceId
                            }));

							console.log('-styleId:',styleId,'-materialId:',materialId,'-priceId:',priceId);
							item.iBtn=!item.iBtn;
                            showImgLayer('数据请求中...');
							$.ajax({
		                        type:'get',
		                        url:apiUrl+'/home/list/queryGoodsByParamAndPage',
		                        data:{
		                            pageNum:1,
		                            pageSize:10,
		                            sortIds:sortId,
		                            styleIds:styleId,
		                            materialIds:materialId,
		                            priceIds:priceId
		                        },
		                        success:function(data){
		                            if(data.head.code){
		                                console.log(data.head.message);
		                            }
		                            var data=data.body;
		                            init(str,data.goodsVoList,oUl);
                                    cancelImgLayer();
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
		                        priceIds:priceId
		                    };
		                    getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
						});
					});
				}
			})();


            function renderTab(arr,type){
            	var str='';
            	var itemCon=$('.'+type).find('ul');
                arr.forEach(function(item,index1){
                    if(item.active){
                        str+=`<li class="" data-id=${item.id} data-type=${type}>
                            ${item.name}
                            <b></b>
                        </li>`;
                    }else{ 
                        str+=`<li data-id=${item.id} data-type=${type}>
                            ${item.name}
                            <b></b>
                        </li>`;
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
        url:getUrl,
        data:jsonData,
        success:function(data){
            console.log(data);
            if(data.head.code){
                console.log(data.head.message);
                cancelImgLayer();
                return;
            }
            var data=data.body;
            init(str,data.goodsVoList,oUl);
        },
        error:function(err){
            console.log(err);
            cancelImgLayer();
            return;
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
                            console.log('xx:',data);
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