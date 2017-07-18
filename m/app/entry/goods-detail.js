import '../css/public.css';
import '../css/goods-detail.css';
import $ from 'n-zepto';
import {rand,signName,reTop,prevUrl,getSto,setSto,rmSto,url_search,imgLazy,cartCount,allSto,showImgLayer,cancelImgLayer} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();


//返回前一个页面
(function(){
	var url=getSto('goods-prevurl',prevUrl());
	if(url){
		$('header>a').attr('href',url);
	}else{
		$('header>a').attr('href',prevUrl());
		setSto('goods-prevurl',prevUrl());
	}
    
})();

//购物车数量
cartCount($('.shopping-car .car b'));

//评论跳转上加id
$('.rate>button>a').attr('href','comments.html?id='+url_search().id);

//顶部导航栏显示效果
(function(){
	var oBar=$('header');
	var oCon=$('.goods-detail');
	var iH=$('.goods-detail .swiper-slide>img').height();
    var disT=0;
    var timer=null;
    var timer1=null;
    var timer2=null;
	var val=0;
	
    $('body').on('touchmove',function(ev){
    	clearInterval(timer);
    	clearInterval(timer1);
    	clearInterval(timer2);
        var touch=ev.changedTouches[0];
        timer=setInterval(function(){
			disT=Math.abs(oCon.get(0).getBoundingClientRect().top);
			val=(disT<=iH)?disT/iH:1;
        	oBar.css('background','rgba(255,255,255,'+val+')');
        	oBar.css('border-bottom','1px solid rgba(240,240,240,'+val+')');
        },50);

        timer1=setInterval(function(){
	    	if(val==1){
	    		clearInterval(timer);
	    		clearInterval(timer1);
	    	}
	    },500);
    });

    $('body').on('touchend',function(ev){
        timer2=setTimeout(function(){
        	clearInterval(timer);
        	clearInterval(timer1);
        },1500);
    });
})();

//从接口获取数据
(function(){
	var topPicCon=$('.swiper-wrapper');//顶部图片外层
	var topStr='';
	var goodsItem=$('.goods-color-list');//关联商品相关项
	var goodsItemStr='';
	var saleoutLogo=$('.goods-detail>span');
	var cartAbout=$('.shopping-car');//购物车相关
	var oPrice=$('.goods-sign>span>em');//展示价格
	var oGoodsName=$('.goods-about>h2');//商品名称
	var oSubName=$('.goods-about>p');//副标题
	var oLabelPrice=$('.goods-sign>p>span');//标签价格
	var oLabelWrap=$('.goods-sign');//价格标签外层
	var sLabel='';
	var oDetailImg=$('.goods-introduce');//图文详情外层
	var sDetailImg='';
	var oCommentNumWrap=$('.rate>h2>em');//评论数量外层
	var oAboutGoodsImg=$('.opacity-wrap-top>img');//关联商品图片
	var oAboutGoodsType=$('.goods-type ul');//关联商品品类外层
	var sAboutGoodsType='';
	var oAboutGoodsPart=$('.goods-parts ul');//关联商品配件外层
	var sAboutGoodsPart='';
	var oGoodsCode=$('.opacity-wrap-top>div>span');//商品编码外层
	var oGoodsPrice=$('.opacity-wrap-top>div>p');//商品价格外层
	

	showImgLayer('数据请求中...');
	$.ajax({
		type:'get',
		url:apiUrl+'/goods/detail/queryGoodsById',
		data:{
			goodsId:url_search().id
		},
		success:function(data){
			if(data.head.code){
                alert(data.head.message);
                location.href=prevUrl();
                return;
            }
            
            var data=data.body.goods;

            //评论信息
            $(oCommentNumWrap).html(data.messageCount);

            if(!data.messageCount){
            	$('.rate>button').css('display','none');
            }
            $(oAboutGoodsImg).attr('src',data.topPictures[0]);//展示关联商品弹层图片
////////////////////////////////////////////////////
			//关联商品弹层
			//data-btn='false':是售罄
			//data-default='true':是默认
            var suidID=null;//配件ID
            var kindID=null;//品类的商品id
            var iAccessoryNum=0;//记录配件个数(判断是否有配件)
            var customOnOff=data.custom;//判断是否是定制商品(false是普通商品)
			var sComment='';//定制商品的留言            
			
            //关联商品弹层的展示
            if(data.relationGoods.length){//如果有联系商品
            	data.relationGoods.forEach(function(item,index){
	            	if(item.soldout){//售罄
		            	sAboutGoodsType+=`<li class="saleout" data-btn="false" data-id=${item.id} data-code=${item.code}>${item.name}<span></span></li>`;
		            }else{//未售罄
		            	if(item.mark){//默认
		            		
				            //$(oGoodsCode).html(item.code);//关联商品弹层编码
			            	sAboutGoodsType+=`<li class="active" data-default="true" data-btn="true" data-id=${item.id} data-code=${item.code}>${item.name}<span></span></li>`;
			            	//在弹层的按钮上绑定goodsid
						    $('.opacity-button').attr('data-id',item.id);

						    //查询默认品类的配件
			            	$.ajax({	
								type:'get',
								url:apiUrl+'/goods/detail/queryAccessory',
								data:{
									goodsId:item.id
								},
								success:function(data){
									if(data.head.code){
						                alert(data.head.message);
						                return;
						            }

						            var data=data.body;
						            
						            $(oGoodsCode).html(data.goods.code);//关联商品弹层编码
						            $(oGoodsPrice).html('￥'+data.goods.salePrice);//关联商品弹层价格

						            customOnOff=data.goods.customizationStatus;

						            if(!customOnOff){//不是定制商品
										$('.custom-wrap').css('display','none');
									}else{
										$('.custom-wrap').css('display','block');
									}

						            //对应的配件
						            iAccessoryNum=data.accessorys.length;

						            //如果没有配件配件项隐藏
						            if(!iAccessoryNum){
						            	$('.goods-parts').css('display','none');
						            }else{
						            	$('.goods-parts').css('display','block');
						            }

						            data.accessorys.forEach(function(item,index){
						            	if(item){
							            	sAboutGoodsPart+=`<li data-id=${item.id}>${item.length}<span></span></li>`;
							            }
						            });
						            $(oAboutGoodsPart).html(sAboutGoodsPart);

						            //点击配件选项
									var aPart=$('.goods-parts li');//配件
									var suidIndex=0;
									
									// if(parseInt($('.opacity-wrap').height())<500){
						   //          	$('.opacity-wrap').css('height',650);
						   //          }
									
									aPart.forEach(function(item,index){
										$(item).on('click',function(){
											$(aPart[suidIndex]).removeClass('active');
											$(item).addClass('active');
											suidID=parseInt(item.dataset.id);
											suidIndex=index;
											
										});
									});
								},
								error:function(){

								}
							});
			            }else{//非默认
			            	sAboutGoodsType+=`<li data-btn="true" data-default="false" data-id=${item.id} data-code=${item.code}>${item.name}<span></span></li>`;
			            }
		            }
		            
	            });
            }
     

            $(oAboutGoodsType).html(sAboutGoodsType);//关联商品弹层品类
            $(oGoodsPrice).html('￥'+data.salePrice);//关联商品弹层价格

            cancelImgLayer();

            //登录或是未登录加入购物车
			(function(){
				var vipNo=getSto('vipNo');
				var oClose=$('.opacity-wrap-top>span');
				var cartBtn=$('.shopping-car>i');//加入购物车按钮
				var payBtn=$('.shopping-car>b');//立即购买按钮
				var oK=$('.opacity-button');//关联商品弹层的确定按钮
				
				var cartOnOff=true;//判断是加入购物车还是立即购买(true加入购物车)
				var oPacity=$('.opacity');
				var oPacityWrap=$('.opacity-con');
				var oCustomWrap=$('.custom-wrap');
				var oMinus=$('.goods-count .minus');
				var oAdd=$('.goods-count .add');
				
				
				var aKind=$('.goods-type li');//品类
				var oCount=$('.goods-count li.count');//个数
				var iCount=1;
				var kindIndex=0;
				var suidIndex=0;
				
				//记录默认选项的index
				aKind.forEach(function(item,index){
					if(item.dataset.default=='true'){
						kindIndex=index;
					}
				});
				//点击"加入购物车"
				cartBtn.on('click',function(){
					$(oPacity).css('display','block');
					cartOnOff=true;

					if(!customOnOff){//不是定制商品
						$(oCustomWrap).css('display','none');
					}else{
						$(oCustomWrap).css('display','block');
					}

					//黑色背影动画 选项板动画
					setTimeout(function(){
						$(oPacity).css('opacity',1);
						$(oPacityWrap).css('top',0);
					},50);
				});

				//点击"立即购买"
				payBtn.on('click',function(){
					$(oPacity).css('display','block');
					cartOnOff=false;

					if(!customOnOff){//不是定制商品
						$(oCustomWrap).css('display','none');
					}else{
						$(oCustomWrap).css('display','block');
					}

					//黑色背影动画 选项板动画
					setTimeout(function(){
						$(oPacity).css('opacity',1);
						$(oPacityWrap).css('top',0);
					},50);
				});

				//点击弹层里的"品类"
				aKind.forEach(function(item,index){
					//获取默认项的id
					if(item.dataset.default=='true'){
						kindID=item.dataset.id;
					}

					$(item).on('click',function(){
						if($(this).get(0).dataset.btn=='false'){
							return;
						}

						$(aKind[kindIndex]).removeClass('active');
						$(item).addClass('active');
						kindID=parseInt(item.dataset.id);
						kindIndex=index;
						sAboutGoodsPart='';
						suidID='';
						showImgLayer('数据请求中...');
						$.ajax({	
							type:'get',
							url:apiUrl+'/goods/detail/queryAccessory',
							data:{
								goodsId:item.dataset.id
							},
							success:function(data){
								if(data.head.code){
					                alert(data.head.message);
					            }
					            var data=data.body;
					            $(oAboutGoodsImg).attr('src',data.goods.mainPicture);//展示关联商品弹层图片
					            $(oGoodsCode).html(data.goods.code);//关联商品弹层编码
					            $(oGoodsPrice).html('￥'+data.goods.salePrice);//关联商品弹层价格

					            customOnOff=data.goods.customizationStatus;

					            if(!customOnOff){//不是定制商品
									$('.custom-wrap').css('display','none');
								}else{
									$('.custom-wrap').css('display','block');
								}

					            //在弹层的按钮上绑定goodsid
					            $(oK).attr('data-id',item.dataset.id);

					            iAccessoryNum=data.accessorys.length;

					            //如果没有配件配件项隐藏
					            if(!iAccessoryNum){
					            	$('.goods-parts').css('display','none');
					            }else{
					            	$('.goods-parts').css('display','block');
					            }

					            //对应的配件
					            data.accessorys.forEach(function(item,index){
					            	if(item){
						            	sAboutGoodsPart+=`<li data-id=${item.id}>${item.length}<span></span></li>`;
						            }
					            });
					            $(oAboutGoodsPart).html(sAboutGoodsPart);

					            //点击配件选项
								var aPart=$('.goods-parts li');//配件
								aPart.forEach(function(item,index){
									$(item).on('click',function(){
										$(aPart[suidIndex]).removeClass('active');
										$(item).addClass('active');
										suidID=parseInt(item.dataset.id);
										suidIndex=index;
										
									});
								});
								cancelImgLayer();
							},
							error:function(){

							}
						});
					});
				});

				//点击加减
				oMinus.on('click',function(){
					if(iCount<=1){
						return;
					}
					iCount--;
					$(oCount).text(iCount);
					
				});
				oAdd.on('click',function(){
					if(iCount>=9){
						return;
					}
					iCount++;
					$(oCount).text(iCount);
					
				});

				function getData(json){
					showImgLayer('数据请求中...');
					var token=getSto('token');
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url: apiUrl+'/shoppingcart/addShoppingCart',
						data:json,
						success:function(data){
							if(data.head.code){
								if(data.head.code==71982){
				                    rmSto('nickname');
				                    rmSto('timestamp');
				                    rmSto('token');
				                    rmSto('vipNo');
				                    alert('出现错误，请重新登录！');
				                    location.href='user-center.html';
				                }
				                alert(data.head.message);
				            }

							//购物车数量
							cartCount($('.shopping-car .car b'));
							location.href='goods-detail.html?id='+json.goodsId;
						},
						error:function(){}
					});
				}

				//点击确定按钮
				var tempArr=JSON.parse(getSto('tempCart'))||[];//获取临时购物车数据
				
				$('.remark>div>textarea').on('input',function(){
					
					if(sComment.length<=140){
						sComment=$('.remark>div>textarea').val();
					}else{
						$('.remark>div>textarea').val(sComment);
						alert('最多只能输入140个字符~');
					}
				});

				oK.on('click',function(){
					var tempPay=[];

					if(!kindID){
						alert('有未选择项~');
						return;
					}

					if(tempArr.length>=20){
						alert('购物车里的商品种类已达到上限~');
						return;
					}

					if(iAccessoryNum&&!suidID){
						alert('请选择商品配件~');
						return;
					}

					

					if(customOnOff&&sComment==''){
						alert('请填写diy备注信息~');
						return;
					}

					if(cartOnOff){//加入购物车
						$(oPacityWrap).css('top','9rem');

						//黑色背影动画
						setTimeout(function(){
							$(oPacity).css('opacity',0);
						},100);

						//选项板动画
						setTimeout(function(){
							$(oPacity).css('display','none');
						},500);

						if(!vipNo){//如果未登录
							var tempJSON={};
							var tempC=JSON.parse(getSto('tempCart'));//获取临时购物车
							
							var isM=false;//不合并状态
							var isBtn=false;//判断如果临时购物车没有数据则不走第二个分的开关
							//判断新选择的商品和购物车已有的是不是一件商品
						
							if(!suidID){
								suidID='null';
							}

							if(tempC){//如果临时购物车有数据
								
								tempC.forEach(function(item,index){
									
									if(item.goodsId==kindID.toString()&&item.accessoryId==suidID.toString()&&item.comment==sComment){//如果商品id不同
									
										item.number=parseInt(item.number)+parseInt(iCount);
										isM=true;
										return;
									}
								});
							}else{//如果临时购物车没有数据
								
								tempJSON={
									goodsId:kindID,
									accessoryId:suidID,
									selected:false,
									number:iCount,
									comment:sComment
								};
								tempArr.push(tempJSON);
								setSto('tempCart',JSON.stringify(tempArr));
								
								isBtn=true;

							}
							
							if(isM){//如果商品id不同的个数和临时购物车相等则合
								setSto('tempCart',JSON.stringify(tempC));
							}else if(!isM&&!isBtn){
								tempJSON={
									goodsId:kindID,
									accessoryId:suidID,
									selected:false,
									number:iCount,
									comment:sComment
								};
								tempArr.push(tempJSON);
								setSto('tempCart',JSON.stringify(tempArr));
							}

							//购物车数量
							cartCount($('.shopping-car .car b'));
							location.href='goods-detail.html?id='+kindID;
						}else{//如果登录
							getData({
								memberNo:vipNo,
								goodsId:kindID,
								accessoryId:suidID,
								number:iCount,
								comment:sComment
							});
						}

					}else{//立即购买
						tempPay.push({
							goodsId:kindID,
							accessoryId:suidID,
							selected:false,
							number:iCount,
							comment:sComment
						});
						setSto('tempOrderPay',JSON.stringify(tempPay));
						location.href='ok-order.html?type=1&from=cart&to=ok-order';
					}
				});

				//点击关闭按钮
				oClose.on('click',function(){	

					$(oPacityWrap).css('top','9rem');

					//黑色背影动画
					setTimeout(function(){
						$(oPacity).css('opacity',0);
					},100);

					//选项板动画
					setTimeout(function(){
						$(oPacity).css('display','none');
					},500);
				});

				
			})();

////////////////////////////////////////////////////
            //是否售罄
            if(data.soldout){//售罄
            	$(saleoutLogo).css('display','block');
            	$(cartAbout).addClass('sale-out');
            }else{//未售罄

            }
////////////////////////////////////////////////////
            //顶部图片列表
            data.topPictures.forEach(function(item,index){
            	topStr+=`<div class="swiper-slide">
	                        <img src="" data-src=${item} alt="">
	                    </div>`;
            });
            $(topPicCon).html(topStr);

            //图片懒加载
	        (function(){
	            var aImg=$('.swiper-wrapper img');
	            imgLazy(aImg);
	        })();

            //图片滑动
			(function(){
				var swiper = new Swiper('.swiper-container', {
				    pagination: '.swiper-pagination',
				    paginationType: 'fraction',
				    paginationFractionRender: function (swiper, currentClassName, totalClassName) {
				      return '<span class="' + currentClassName + '"></span>' +
				             '<i>/</i>'+
				             '<span class="' + totalClassName + '"></span>';
				  	}
				});
			})();

			//点击查看大图
			(function(){
				var aImg=$('.goods-detail .swiper-slide>img');
				var opacity=$('.pic-wrap');
				var oImg=$('.pic-wrap img');
				
				aImg.forEach(function(item,index){
					$(item).on('click',function(){
						$(opacity).css('display','block');
						setTimeout(function(){
							$(opacity).css('opacity',1);
						},50);
						$(oImg).attr('src',$(item).attr('src'));
					});
				});
				$(oImg).get(0).onload=function(){
					$(oImg).css({
						top:'50%',
						left:0,
						width:'100%',
						'margin-top':-$(oImg).height()/2
					});
				};
				$(opacity).on('click',function(){
					$(opacity).css('opacity',0);
					setTimeout(function(){
						$(opacity).css('display','none');
					},550);
					//$(oImg).attr('src',$(item).attr('src'));
				});
			})();
////////////////////////////////////////////////////
			//关联商品
			if(data.relationGoods.length){//如果有关联商品
				data.relationGoods.forEach(function(item,index){
					if(item.mark){
						goodsItemStr+=`<li data-id=${item.id} data-code=${item.code}>
		                    <div><span class="active"></span><img src="" data-src=${item.goodsPicture} alt=""></div>
		                    <p>${item.name}</p>
		                    <a href="goods-detail.html?id=${item.id}"></a>
		                </li>`;
					}else{
						goodsItemStr+=`<li data-id=${item.id} data-code=${item.code}>
		                    <div><span></span><img src="" data-src=${item.goodsPicture} alt=""></div>
		                    <p>${item.name}</p>
		                    <a href="goods-detail.html?id=${item.id}"></a>
		                </li>`;
					}
					
				});
			}
			
			$(goodsItem).html(goodsItemStr);
			//计算商品颜色列的长度
			(function(){
				$('.goods-color-list').css('width',$('.goods-color-list').find('li').width()*$('.goods-color-list').find('li').length+5);
				//console.log('s:',$('.goods-color-list').find('li').length);
			})();
			//图片懒加载
	        (function(){
	            var aImg=$('.goods-color-list img');
	            imgLazy(aImg);
	        })();
////////////////////////////////////////////////////
			//名称 价格相关
			$(oPrice).html(data.salePrice);
			$(oGoodsName).html(data.longName);
			$(oSubName).html(data.subtitle);
			//console.log('zxc:',data.labelPrice);

			if(parseInt(data.labelPrice)){
				$(oLabelPrice).html('￥'+data.labelPrice);
			}
			
			if(data.labels[0]){
				
				data.labels.forEach(function(item,index){
					if(index<3){
						switch(item.id){
							case 10:
								sLabel+=`<em class="blue">${item.labelContent}</em>`;
							break;
							case 6:
								sLabel+=`<em class="pink">${item.labelContent}</em>`;
							break;
							case 7:
								sLabel+=`<em class="sea">${item.labelContent}</em>`;
							break;
							case 5:
								sLabel+=`<em class="sky">${item.labelContent}</em>`;
							break;
							case 9:
								sLabel+=`<em class="deep-sea">${item.labelContent}</em>`;
							break;
							case 8:
								sLabel+=`<em class="light-pink">${item.labelContent}</em>`;
							break;
							case 1:
								sLabel+=`<em class="light-red">${item.labelContent}</em>`;
							break;
							case 2:
								sLabel+=`<em class="light-yellow">${item.labelContent}</em>`;
							break;
							case 3:
								sLabel+=`<em class="light-green">${item.labelContent}</em>`;
							break;
							case 4:
								sLabel+=`<em class="deep-blue">${item.labelContent}</em>`;
							break;
							default:
							sLabel+=`<em class="sea">${item.labelContent}</em>`;
						}
					}
					
					
				});
			}
			$(oLabelWrap).append(sLabel);
			
////////////////////////////////////////////////////
			//图文详情
			//$(oDetailImg)
			data.detailPictures.forEach(function(item,index){
				sDetailImg+=`<img src="" data-src=${item} alt="">`;
			});
			$(oDetailImg).append(sDetailImg);

			//图片懒加载
	        (function(){
	            var aImg=$('.goods-introduce img');
	            imgLazy(aImg);
	        })();
		},
		error:function(){

		}
	});
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
			pageSize:3
		},
		success:function(data){
			if(data.head.code){
                alert(data.head.message);
            }
           
            var data=data.body;

            data.messages.forEach(function(item,index){
            	sComment+=`<li data-id=${item.id} data-memberNo=${item.memberNo}>
		                    <div class="rate-user">
		                        <img src=${item.avatar} alt="">
		                        <span>${item.nickName}</span>
		                        <em>${item.showDate}</em>
		                    </div>
		                    <p>${item.content}</p>
		                </li>`;
            });
            $(oComment).html(sComment);
		},
		error:function(){}
	});
})();

//分享
(function(){
	var oBg=$('.opacity1');
	var oBtn=$('.share');
	var oClose=$('em.close');

	oBtn.on('click',function(){
		$(oBg).css('display','block');
		setTimeout(function(){
			$(oBg).css('opacity',1);
		},50);
	});

	oClose.on('click',function(){
		$(oBg).css('opacity',0);
		setTimeout(function(){
			$(oBg).css('display','none');
		},500);
	});
})();

//联系客服
(function(){
	$('.server').on('click',function(){
		location.href='jump.html';
	});
})();




