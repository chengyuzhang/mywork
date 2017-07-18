import '../css/public.css';
import '../css/my-order-cancel.css';
import $ from 'n-zepto';
import {rand,signName,reTop,getSto,rmSto,imgLazy,showImgLayer,cancelImgLayer} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

//删除订单详情页面的记录上一个地址
if(getSto('prevurl')){
	rmSto('prevurl');
}

var vipNo=getSto('vipNo');
//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();

//获取列表数据
(function(){
	var oUl=$('.goods-list');
    var pageNum=1;
    var pageSize=10;
	var str='';
	var token=getSto('token');
	showImgLayer('数据请求中...');
	$.ajax({
		type:'post',
		headers:signName(md5,vipNo,token),
		url:apiUrl+'/shoporders',
		data:{
			memberNo:vipNo,
			type:4,
			pageNo:1,
			pageSize:10
		},
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
			var data=data.body;
			cancelImgLayer();

			if(!data.orderList.length){
				$('.no-order').css('display','block');
				return;
			}
			init(str,data.orderList,oUl);
		},
		error:function(){

		}
	});

	load(str,$('.all-order-public'));

	function init(str,arr,obj){
        console.log('xx:::',arr);
        
        arr.forEach(function(item,index){
			if(item.goodsList.length){
				if(item.categoryNum>2){
					str+=`<li class="goods-item more">`;
		                str+='<h2>'+statusCode(item.statusCode)+'</h2>';
		                str+=`<div class="goods-intr">
		                    <div class="goods-intr-wrap">`;
		                        item.goodsList.forEach(function(item1,index1){
		                        	str+=`<div class="goods-imgs">
			                            <img src="" data-src=${item.goodsList[index1].picture} alt="">
			                        </div>`;
		                        });
		                    str+=`</div>
		                    <a href="custom-detail.html?orderNo=${item.orderNo}&statusCode=${item.statusCode}"></a>
		                </div>
		                <div class="goods-price">
		                    <span>共${item.number}件商品</span>
		                    <i>实付款：￥${item.orderPrice}</i>`;
		                    if(statusCodeControl(item.statusCode).length){
			                    for(var i=statusCodeControl(item.statusCode).length-1; i>=0; i--){
			                    	if(statusCodeControl(item.statusCode)[i]=='确认收货'){
			                    		str+='<em  class="ok" data-order='+item.orderNo+' data-index='+index+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}else if(statusCodeControl(item.statusCode)[i]=='查看物流'){
			                    		str+='<em class="check" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}else if('联系客服'){
			                    		str+='<em class="server" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}
			                    }
			                }
		                str+=`</div>
		            </li>`;
				}else{
					str+=`<li class="goods-item one">`;
		                str+='<h2>'+statusCode(item.statusCode)+'</h2>';
		                str+=`<div class="goods-intr">
		                    <div class="goods-imgs">
		                        <img src="" data-src=${item.goodsList[0].picture} alt="">
		                    </div>
		                    <div class="goods-detail">
		                        <h3>${item.goodsList[0].longName}</h3>
		                        <p>`;
		                            if(item.goodsList[0].accessoryName){
		                            	str+=`<span>配件：${item.goodsList[0].accessoryName}</span>`;
		                            }
		                        str+=`</p>
		                        <p>`;
		                            if(item.goodsList[0].comment){
		                            	str+=`<span>备注：${item.goodsList[0].comment}</span>`;
		                            }
		                        str+=`</p>
		                    </div>
		                    <a href="custom-detail.html?orderNo=${item.orderNo}&statusCode=${item.statusCode}"></a>
		                </div>
		                <div class="goods-price">
		                    <span>共${item.number}件商品</span>
		                    <i>实付款：￥${item.orderPrice}</i>`;
		                    if(statusCodeControl(item.statusCode).length){
			                    for(var i=statusCodeControl(item.statusCode).length-1; i>=0; i--){
			                    	if(statusCodeControl(item.statusCode)[i]=='确认收货'){
			                    		str+='<em  class="ok" data-order='+item.orderNo+' data-index='+index+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}else if(statusCodeControl(item.statusCode)[i]=='查看物流'){
			                    		str+='<em class="check" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}else if('联系客服'){
			                    		str+='<em class="server" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}
			                    }
			                }
		                str+=`</div>
		            </li>`;
				}
			}
		});
        $(obj).html(str);

        //图片懒加载
        (function(){
            var aImg=$('.goods-item img');
            imgLazy(aImg);
        })();
        //多个商品框的长度
		$('.more .goods-intr-wrap').forEach(function(item,index){
			$(item).css('width',$(item).find('.goods-imgs').width()*$(item).find('.goods-imgs').length);
		});

		//再次购买
		(function(){
			var aEm=$('.goods-price>em');
			var token=getSto('token');
			aEm.forEach(function(item,index){
				if($(item).text()=='再次购买'){
					$(item).on('click',function(){
						$.ajax({
		                    type:'post',
		                    headers:signName(md5,vipNo,token),
		                    url:apiUrl+'/shoporder/buyagain',
		                    data:{
		                        memberNo:vipNo,
		                        orderNo:$(item).get(0).dataset.order
		                    },
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
		                            return;
		                        }
		                        location.href='cart.html?from=index';
		                    },
		                    error:function(err){
		                        console.log(err);
		                    }
		                });
					});
				}
			});
		})();

		//联系客服
		(function(){
			var aEm=$('.goods-price>em');
			aEm.forEach(function(item,index){
				if($(item).text()=='联系客服'){
					$(item).on('click',function(){
						location.href='jump.html';
					});
				}
			});
		})();
    }

	function refresh(str,arr,obj){
        arr.forEach(function(item,index){
			if(item.goodsList.length){
				if(item.categoryNum>2){
					str+=`<li class="goods-item more">`;
		                str+='<h2>'+statusCode(item.statusCode)+'</h2>';
		                str+=`<div class="goods-intr">
		                    <div class="goods-intr-wrap">`;
		                        item.goodsList.forEach(function(item1,index1){
		                        	str+=`<div class="goods-imgs">
			                            <img src="" data-src=${item.goodsList[index1].picture} alt="">
			                        </div>`;
		                        });
		                    str+=`</div>
		                    <a href="custom-detail.html?orderNo=${item.orderNo}&statusCode=${item.statusCode}"></a>
		                </div>
		                <div class="goods-price">
		                    <span>共${item.number}件商品</span>
		                    <i>实付款：￥${item.orderPrice}</i>`;
		                    if(statusCodeControl(item.statusCode).length){
			                    for(var i=statusCodeControl(item.statusCode).length-1; i>=0; i--){
			                    	if(statusCodeControl(item.statusCode)[i]=='确认收货'){
			                    		str+='<em  class="ok" data-order='+item.orderNo+' data-index='+index+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}else if(statusCodeControl(item.statusCode)[i]=='查看物流'){
			                    		str+='<em class="check" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}else if('联系客服'){
			                    		str+='<em class="server" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}
			                    }
			                }
		                str+=`</div>
		            </li>`;
				}else{
					str+=`<li class="goods-item one">`;
		                str+='<h2>'+statusCode(item.statusCode)+'</h2>';
		                str+=`<div class="goods-intr">
		                    <div class="goods-imgs">
		                        <img src="" data-src=${item.goodsList[0].picture} alt="">
		                    </div>
		                    <div class="goods-detail">
		                        <h3>${item.goodsList[0].longName}</h3>
		                        <p>`;
		                            if(item.goodsList[0].accessoryName){
		                            	str+=`<span>配件：${item.goodsList[0].accessoryName}</span>`;
		                            }
		                        str+=`</p>
		                        <p>`;
		                            if(item.goodsList[0].comment){
		                            	str+=`<span>备注：${item.goodsList[0].comment}</span>`;
		                            }
		                        str+=`</p>
		                    </div>
		                    <a href="custom-detail.html?orderNo=${item.orderNo}&statusCode=${item.statusCode}"></a>
		                </div>
		                <div class="goods-price">
		                    <span>共${item.number}件商品</span>
		                    <i>实付款：￥${item.orderPrice}</i>`;
		                    if(statusCodeControl(item.statusCode).length){
			                    for(var i=statusCodeControl(item.statusCode).length-1; i>=0; i--){
			                    	if(statusCodeControl(item.statusCode)[i]=='确认收货'){
			                    		str+='<em  class="ok" data-order='+item.orderNo+' data-index='+index+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}else if(statusCodeControl(item.statusCode)[i]=='查看物流'){
			                    		str+='<em class="check" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}else if('联系客服'){
			                    		str+='<em class="server" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</em>';
			                    	}
			                    }
			                }
		                str+=`</div>
		            </li>`;
				}
			}
		});
        $(obj).append(str);

        //图片懒加载
        (function(){
            var aImg=$('.goods-item img');
            imgLazy(aImg);
        })();

        $('.more .goods-intr-wrap').forEach(function(item,index){
			$(item).css('width',$(item).find('.goods-imgs').width()*$(item).find('.goods-imgs').length);
		});

		//去支付
		(function(){
			var aEm=$('.goods-price>em');
			aEm.forEach(function(item,index){
				if($(item).text()=='去支付'){
					$(item).on('click',function(){
						var token=getSto('token');
						var vipNo=getSto('vipNo');
						$.ajax({
		                    type:'post',
		                    headers:signName(md5,vipNo,token),
		                    url:apiUrl+'/shoporder/pay',
		                    data:{
		                        memberNo:vipNo,
		                        orderNo:$(item).get(0).dataset.order
		                    },
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
		                            console.log(data.head.message);
		                            return;
		                        }
		                        var form=data.body.form;
		                        _AP.pay(form);
		                    },
		                    error:function(err){
		                        console.log(err);
		                    }
		                });
					});
				}
			});
		})();

		//确认收货
		(function(){
			var aLi=$('.list>li');
			var aBtn=$('.ok');
			var oWrap=$('.opacity');
			var oBtn=$('.opacity .con li:last-of-type');
			var oCancel=$('.opacity .con li:first-of-type');
			var aEm=$('.list .status>em');
			aBtn.forEach(function(item,index){
				$(item).on('click',function(){
					alertC($(item).get(0).dataset.order,$(item).get(0).dataset.index,$(item).get(0).className);
				});
			});

			//点击确认请求接口
			function ok(orderNum,vipNo,index){
				$.ajax({
					type:'post',
					url:apiUrl+'/shoporder/confirm',
					data:{
						orderNo:orderNum,
						memberNo:vipNo
					},
					success:function(data){
						if(data.head.code){
							console.log(data.head.message);
							return;
						}
						
						$(aEm).eq(index).text('已完成');
						$(aLi).eq(index).find('.ok').css('display','none');
						cancel();
					},
					error:function(err){
						console.log(err);
					}
				});
			}

			//弹出窗口函数
			function alertC(s,index,type){
				oBtn.attr('data-order',s);
				oBtn.attr('data-index',index);
				oBtn.attr('data-type',type);
				oWrap.css('display','block');
				setTimeout(function(){
					oWrap.css('opacity',1);
				},50);
			}

			//窗口消失函数
			function cancel(){
				oWrap.css('opacity',0);
				setTimeout(function(){
					oWrap.css('display','none');
					location.reload();
				},500);
			}

			//窗口的确认
			oBtn.on('click',function(){
				var vipNo=sessionStorage.getItem("vipNo");
				if($(this).get(0).dataset.type=='ok'){
					ok($(this).get(0).dataset.order,vipNo,$(this).get(0).dataset.index);
				}
			});

			//点击取消窗口消失
			oCancel.on('click',function(){
				cancel();
			});
		})();

		//联系客服
		(function(){
			var aEm=$('.goods-price>em');
			aEm.forEach(function(item,index){
				if($(item).text()=='联系客服'){
					$(item).on('click',function(){
						location.href='jump.html';
					});
				}
			});
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
        var token=getSto('token');
        //判断上滑
        oWrap.on('touchstart',function(ev){
            startY=ev.changedTouches[0].pageY;
        });
        oWrap.on('touchmove',function(ev){
            moveY=ev.changedTouches[0].pageY;
            //document.title=startY-moveY;
        });

        oWrap.on('scroll',function(){
            var oLi=$('.goods-list'+' li:nth-last-of-type(1)');//获取最后一个内容块
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
                        type:'post',
                        headers:signName(md5,vipNo,token),
                        url:apiUrl+'/shoporders',
                        data:{
                            pageNum:pageNum,
                            pageSize:pageSize,
                            memberNo:vipNo,
							type:4
                        },
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
                                console.log(data.head.message);
                                return;
                            }
                            var data=data.body;
                            if(!data.end){
                                refresh(str,data.orderList,$('.goods-list'));
                                //$(oRe).html('本次加载完成！');
                                timer2=setTimeout(function(){
                                    $(oRe).css('bottom','-1rem');
                                },2000);
                                iBtnNum=0;
                            }else{
                                if(!iBtnNum){
                                    refresh(str,data.orderList,$('.goods-list'));
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
                        }
                    });
                },1000);
            }
        });
    }
    function statusCode(num){
		var str='';

		switch(num){
			case 10: 
				str='等待付款';//已下单
			break;
			case 20: 
				str='正在备货';//已付款
			break;
			case 21: 
				str='已取消';//已取消
			break;
			case 30:
				str='待收货';//已发货
			break;
			case 31: 
				str='待退款';//正在做ui
			break;
			case 40: 
				str='交易成功';//已完成
			break;
			case 41: 
				str='已退款';//正在做ui
			break;
			case 50: 
				str='售后中';//售后审核中（改字段）
			break;
			case 60: 
				str='售后处理中';//售后审核中（改字段）
			break;
			case 61: 
				str='售后不成立';//售后审核中（改字段）
			break;
			case 70: 
				str='售后成功';//售后审核中（改字段）
			break;
		}

		return str;
	}
	//根据不同码返回不同的状态
	function statusCodeControl(num){
		var str=[];

		switch(num){
			case 10: 
				str=['去支付'];
			break;
			case 20: 
				str=[];
			break;
			case 21: 
				str=['联系客服','再次购买'];
			break;
			case 30: 
				str=['查看物流','确认收货'];;
			break;
			case 31: 
				str=[];
			break;
			case 40: 
				str=['再次购买'];
			break;
			case 41: 
				str=[];
			break;
			case 50: 
				str=['联系客服'];
			break;
			case 60: 
				str=['联系客服'];
			break;
			case 61: 
				str=[];
			break;
			case 70: 
				str=[];
			break;
		}

		return str;
	}
})();

 
//联系客服
(function(){
	$('.normal>span').on('click',function(){
		location.href='jump.html';
	});
})();