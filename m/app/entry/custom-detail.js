import '../css/public.css';
import '../css/custom-detail.css';
import $ from 'n-zepto';
import {rand,signName,prevUrl,url_search,getSto,setSto,rmSto,showImgLayer,cancelImgLayer} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

var vipNo=getSto('vipNo');
//返回前一个页面
(function(){
	var url=getSto('prevurl',prevUrl());
	if(url){
		$('header>a').attr('href',url);
	}else{
		$('header>a').attr('href',prevUrl());
		setSto('prevurl',prevUrl());
	}
    
})();

//联系客服
(function(){
	$('.normal>span').on('click',function(){
		location.href='jump.html';
	});
})();

(function(){
	var avatar=$('.order-detail>.goods-detail>img');
	var style=$('.style');
	var material=$('.material');
	var size=$('.size');
	
	var lettering=$('.lettering');
	var orderNum=$('.order-num');
	var dealTime=$('.order-date');
	var geter=$('.geter span');
	var tel=$('.geter em');
	var oAddress=$('.detail-adress p');
	var oTips=$('.tips');//商品正在准备中
	var oExpress=$('.express');//简单的快递信息
	var expressName=$('.express-name');
	var expressNum=$('.express-num');
	var expressWrap=$('.express-step');//快递详情信息的最外层
	var expressCon=$('.express-step ul');//快递详情信息的外层
	var statusCon=$('.status-bar>ul');

	var goodsPrice=$('.goods-price em');//商品总价
	var couponPrice=$('.coupon-price em');//优惠价格
	var payPrice=$('.need-pay em');//支付金额
	var oText=$('.comments li.comments-detail>div >p');//商品备注

	var str='';
	var temp=window.location.search;
	//var valObject=url2json(temp.split('?')[1]);
	var vipNo=sessionStorage.getItem("vipNo");
	var token=sessionStorage.getItem("token");

	var oWrap=$('.goods-wrap');//商品列表用
	var sGoods='';//商品列表用
	var token=getSto('token');
	$.ajax({
		type:'post',
		headers:signName(md5,vipNo,token),
		url:apiUrl+'/shoporder/detail',
		data:{
			memberNo:vipNo,
			orderNo:url_search().orderNo,
			statusCode:url_search().statusCode
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
			var data=data.body; 
			
			var address=data.address;//收货人地址信息
			var express=data.express;//快递信息
			var status=data.statusAxis;//页面上部信息
			var goodsList=data.goodsList;//获取商品列表
			
			// $(avatar).attr('src',order.cover);
			// $(style).text(order.style);
			// $(material).text(order.material);
			// $(size).text(order.size);
			$(couponPrice).text('-￥'+data.creditPrice);
			$(goodsPrice).text('￥'+data.orderPrice);
			$(payPrice).text('￥'+data.payPrice);
			// $(lettering).text(order.lettering);
			$(orderNum).text(data.orderNo);
			$(dealTime).text(data.created);
	
			if(data.orderComment!=''){
				$(oText).html(data.orderComment);//商品备注
			}else{
				$('.comments-detail').css('display','none');
			}

			if(data.invoiceContent){
				$('.invoice-name').html(data.invoiceContent);//商品备注
			}else{
				$('.invoice-detail').css('display','none');
			}

			
			
			$(expressName).text(express.no);
			$(expressNum).html('<a href="tel:95543">95543</a>');

			// if(express.company==''){
			// 	$('.express').css('display','none');
			// }

			//获取地址
			$(geter).text('收货人：'+address.consignee);
			$(tel).text(address.mobile);
			$(oAddress).text(address.detail);
			if(address.consignee==''){
				$('#gater').css('display','none');
				$('#address').css('display','none');
			}

			//商品展示
			goodsList.forEach(function(item,index){
				sGoods+=`<div class="pic-info" data-goodsid=${item.goodsId}>
	                <img src=${item.picture} alt="">
	                <ul>
	                    <li class="style"><p>${item.longName}</p></li>`;
	                    if(item.accessoryName!=''){
	                    	sGoods+=`<li class="ornament"><span>配件：</span><em>${item.accessoryName}</em></li>`;
	                    }
	                   	sGoods+=`<li class="price"><span>￥${item.salePrice}</span><em><i>x</i>${item.goodsNum}</em></li>`;
	                    if(item.comment){
	                    	sGoods+=`<li class="ornament"><span>备注：</span><em>${item.comment}</em></li>`;
	                    }
	                sGoods+=`</ul>
	            </div>`;
			});

			$(oWrap).html(sGoods);
			//快递状态
			if(express.infos.length){
				express.infos.forEach(function(item,index){
					if(index==0){
						str+='<li class="active"><div class="line-dot"><i></i><span></span></div>';
					}else{
						str+='<li><div class="line-dot"><i></i><span></span></div>';
					}
	                str+='<div class="status-detail"><p>'+item.content+'</p><p>'+item.createTime+'</p></div>';
	                str+='</li>';
				});

				expressCon.html(str);
			}else{
				$('.express-step').css({
					'height':'1rem',
					'line-height':'1rem',
					'text-align':'center',
					'color':'#000',
					'font-size':'.14rem'
				});
				$('.express-step').html('暂无物流信息！');
			}
			
			//顶端状态
			str='';
			var len=0;

			if(status){
				len=status.length;
				if(len==2){
					$(statusCon).attr('class','two');
				}else if(len==3){
					$(statusCon).attr('class','three');
				}else if(len==4){
					$(statusCon).attr('class','four');
				}else if(len==5){
					$(statusCon).attr('class','five');
				}else if(len==6){
					$(statusCon).attr('class','six');
				}else if(len==7){
					$(statusCon).attr('class','seven');
				}
				
				for(var i=0; i<len; i++){
					if(status[i][1]=="enable"){
						str+='<li class="active"><span>'+(i+1)+'</span><p>'+status[i][0]+'</p></li>';
					}else{
						str+='<li class=""><span>'+(i+1)+'</span><p>'+status[i][0]+'</p></li>';
					}
				}
				statusCon.html(str);
			}
			
			//根据状态码来判断快递的显示
			if(data.statusCode==10){
				$('.comments').css('display','block');
			}

			if(data.statusCode==20){
				$('.pay-detail>ul>li.need-pay>span').text('实付款：');
			}

			if(data.statusCode==21){
				$('.comments').css('display','block');
			}

			if(data.statusCode==40||data.statusCode==30){
				$(expressWrap).css('display','block');
				$(oExpress).css('display','block');
				$(expressCon).css('display','block');
				$('.pay-detail>ul>li.need-pay>span').text('实付款：');
			}

			if(data.statusCode==41){
				$(oTips).css('display','block');
				$('.tips>h2').text('您的退款已完成，请注意查看付款账户。');
				//$('.bottom-btn').css('display','none');
				$('.wrap').css('bottom',0);
				$('.refund-date').text(data.date);
				$('.pay-detail>ul>li.need-pay>span').text('实付款：');
			}

			if(data.statusCode==31){
				$(oTips).css('display','block');
				$('.tips>h2').text('您的退款申请已发出，请耐心等待。');
				$('.bottom-btn').css('display','none');
				$('.wrap').css('bottom',0);
				$('.refund-date').text(data.date);
				$('.pay-detail>ul>li.need-pay>span').text('实付款：');
			}

			if(data.statusCode==50){
				$('.sold-server').css('display','block');
				$('.sold-server p').text('售后中');
				$('.address').css('display','none');
				$('.status-bar').css('display','none');
				$('.bottom-btn').css('display','none');
				$('.wrap').css('bottom',0);
				$('.order-time span').text('申请时间');
				$('.order-time em').text(data.date);
				$('.pay-detail>ul>li.need-pay>span').text('实付款：');
			}

			if(data.statusCode==60){
				$('.sold-server').css('display','block');
				$('.sold-server p').text('售后处理中');
				$('.address').css('display','none');
				$('.status-bar').css('display','none');
				$('.bottom-btn').css('display','none');
				$('.wrap').css('bottom',0);
				$('.order-time span').text('申请时间');
				$('.order-time em').text(data.date);
				$('.pay-detail>ul>li.need-pay>span').text('实付款：');
			}

			if(data.statusCode==61){
				$('.sold-server').css('display','block');
				$('.sold-server p').text('售后不成立');
				$('.address').css('display','none');
				$('.status-bar').css('display','none');
				//$('.bottom-btn').css('display','none');
				$('.wrap').css('bottom',0);
				$('.order-time span').text('申请时间');
				$('.order-time em').text(data.date);
				$('.pay-detail>ul>li.need-pay>span').text('实付款：');
			}

			if(data.statusCode==70){
				$('.sold-server').css('display','block');
				$('.sold-server p').text('售后成功');
				$('.address').css('display','none');
				$('.status-bar').css('display','none');
				//$('.bottom-btn').css('display','none');
				$('.wrap').css('bottom',0);
				$('.order-time span').text('申请时间');
				$('.order-time em').text(data.date);
				$('.pay-detail>ul>li.need-pay>span').text('实付款：');
			}

			if(!data.invoiceContent&&data.orderComment==''){
				$('.comments').css('display','none');
			}

			str='';
			//底端按钮状态
			var iCode=data.statusCode;
			var oCon=$('.bottom-btn');
			
	        switch(iCode){
	        	case 10://ok
	        		str+=`<a href="javascript:;" data-type="cancel" class="s cancel-order" >取消订单</a><em class="pay-money">去支付</em>`;
	        	break;
				case 20://ok
	        		str+=`<a href="javascript:;" class="s" ></a><em class="refund">申请退款</em>`;
	        		$('.pay-detail>ul>li.need-pay>span').text('实付款：');
	        	break;
				case 21://ok
	        		str+=`<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a><em class="again-buy">再次购买</em>`;
	        	break;
				case 30://ok
	        		str+=`<a href="javascript:;" class="s active" ></a><em class="ok">确认收货</em>`;
	        		$('.pay-detail>ul>li.need-pay>span').text('实付款：');
	        	break;
				case 40://ok
	        		str+=`<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a><em class="again-buy">再次购买</em><em class="server-support">申请售后</em>`;
	        		$('.pay-detail>ul>li.need-pay>span').text('实付款：');
	        	break;
				case 60:
	        		str+=`<a href="javascript:;" class="s active" >联系客服</a>`;
	        		$('.pay-detail>ul>li.need-pay>span').text('实付款：');
	        	break;
				case 61:
	        		str+=`<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a>`;
	        		$('.pay-detail>ul>li.need-pay>span').text('实付款：');
	        	break;
				case 70:
	        		str+=`<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a>`;
	        		$('.pay-detail>ul>li.need-pay>span').text('实付款：');
	        	break;
				case 80:
	        		str+=`<a href="javascript:;" class="s active" >联系客服</a>`;
	        	break;
				case 31:
	        		str+=`<a href="javascript:;" class="s" >联系客服</a><span class="refund">申请退款</span>`;
	        		$('.pay-detail>ul>li.need-pay>span').text('实付款：');
	        	break;
				case 41:
	        		str+=`<a href="javascript:;" data-type="delete" class="s active delete-order" >删除订单</a>`;
	        		$('.pay-detail>ul>li.need-pay>span').text('实付款：');
	        	break;
	        	default:
	        		str+=`<a href="javascript:;" class="s active" >联系客服</a>`;
	        	break;
	        }
	        
	       	$(oCon).html(str);

	       	//判断是否有售后
	       	if(!data.aftersale){
	       		$('.server-support').css('display','block');
	       	}else{
	       		$('.server-support').css('display','none');
	       	}
	       	//立即付款
	       	(function(){
	       		var oBtn=$('.pay-money');
	       		oBtn.on('click',function(event){
	       			var token=getSto('token');
	       			$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/shoporder/pay',
						data:{
							orderNo:url_search().orderNo,
							memberNo:vipNo
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
							
							var form=data.body.form;
							_AP.pay(form);
						},
						error:function(err){
							console.log(err);
						}
					});
	       		});
	       		event.stopPropagation();
	       	})();

	       	//再次购买
			(function(){
				var oEm=$('.again-buy');
				var token=getSto('token');
				$(oEm).on('click',function(){
					$.ajax({
	                    type:'post',
	                    headers:signName(md5,vipNo,token),
	                    url:apiUrl+'/shoporder/buyagain',
	                    data:{
	                        memberNo:vipNo,
	                        orderNo:url_search().orderNo
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
			})();

	       	//取消订单
	       	(function(){
	       		var oCancelBtn=$('.cancel-order');
				var oWrap=$('.opacity');
				var oBtn=$('.opacity .con li:last-of-type');
				var oCancel=$('.opacity .con li:first-of-type');
	       		oCancelBtn.on('click',function(){
	       			//$('.opacity .con').removeClass('reason');
					$('.opacity .con a').css('display','none');
					$('.opacity .con h2').text('取消订单');
					$('.opacity .con p').text('是否确认取消订单？');
	       			$('.opacity .con').addClass('cancel');
					alertC(url_search().orderNo,$(this).get(0).dataset.type);
	       		});

	       		function cancelFn(orderNum,vipNo){
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/shoporder/cancel',
						data:{
							orderNo:orderNum,
							memberNo:vipNo
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
							cancel();
						},
						error:function(err){
							console.log(err);
						}
					});
				}

				//弹出窗口函数
				function alertC(s,type){
					oBtn.attr('data-order',s);
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
					
					if($(this).get(0).dataset.type=='cancel'){
						cancelFn($(this).get(0).dataset.order,vipNo);
					}
					
				});

				//点击取消窗口消失
				oCancel.on('click',function(){
					cancel();
				});
	       	})();

	       	//删除订单
	       	(function(){
	       		var oDeleteBtn=$('.delete-order');
				var oWrap=$('.opacity');
				var oBtn=$('.opacity .con li:last-of-type');
				var oCancel=$('.opacity .con li:first-of-type');
	       		oDeleteBtn.on('click',function(){
	       			//$('.opacity .con').removeClass('reason');
					//$('.opacity .con input').css('display','none');
					$('.opacity .cancel a').css('display','none');
					$('.opacity .con h2').text('删除订单');
					$('.opacity .con p').text('是否确认删除订单？');
	       			$('.opacity .con').addClass('cancel');
					alertC(url_search().orderNo,$(this).get(0).dataset.type);
	       		});

	       		function cancelFn(orderNum,vipNo){
	       			var token=getSto('token');
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/shoporder/delete',
						data:{
							orderNo:orderNum,
							memberNo:vipNo
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
							location.href=$('header>a').attr('href');
							//cancel();
						},
						error:function(err){
							console.log(err);
						}
					});
				}

				//弹出窗口函数
				function alertC(s,type){
					oBtn.attr('data-order',s);
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
					
					if($(this).get(0).dataset.type=='delete'){
						cancelFn($(this).get(0).dataset.order,vipNo);
					}
					
				});

				//点击取消窗口消失
				oCancel.on('click',function(){
					cancel();
				});
	       	})();

			//申请退款
			(function(){
				var oRefund=$('.refund');
				var oWrap=$('.opacity');
				var oBtn=$('.opacity .con li:last-of-type');
				var oCancel=$('.opacity .con li:first-of-type');
				
				oRefund.on('click',function(){
					$('.opacity .con').addClass('reason');
					alertC(url_search().orderNo,$(this).get(0).className);
				});

				function refund(orderNum,vipNo,reason){
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/shoporder/refund',
						data:{
							orderNo:orderNum,
							memberNo:vipNo,
							reason:reason
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
							cancel();
						},
						error:function(err){
							console.log(err);
							alert(err);
						}
					});
				}

				//弹出窗口函数
				function alertC(s,type){
					oBtn.attr('data-order',s);
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
					var reason=$('.opacity .reason input').val();
					if($(this).get(0).dataset.type=='refund'){
						refund($(this).get(0).dataset.order,vipNo,reason);
					}
					
				});

				//字数检查
				var strVal='';
				var valBtn=$('.opacity input');
				$(valBtn).on('input',function(){
					if($(this).val().length>=140){
						$(this).val(strVal);
						alert('字数不能超过140字');
					}else{
						strVal=$(this).val();
					}
				});

				//点击取消窗口消失
				oCancel.on('click',function(){
					cancel();
				});
			})();

			//申请售后
			(function(){
				var oRefund=$('.server-support');
				var oWrap=$('.opacity');
				var oBtn=$('.opacity .con li:last-of-type');
				var oCancel=$('.opacity .con li:first-of-type');
				
				oRefund.on('click',function(){
					$('.opacity .con').addClass('reason');
					$('.opacity .con h2').text('申请售后');
					$('.opacity .con p').text('请在输入框中填写申请售后理由');
					alertC(url_search().orderNo,$(this).get(0).className);
				});

				function refund(orderNum,vipNo,reason){
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/shoporder/aftersale',
						data:{
							orderNo:orderNum,
							memberNo:vipNo,
							reason:reason
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
							
							cancel();
							setTimeout(function(){
								location.reload();
								location.href='jump.html';
							},500);
						},
						error:function(err){
							console.log(err);
						}
					});
				}

				//弹出窗口函数
				function alertC(s,type){
					oBtn.attr('data-order',s);
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
					var reason=$('.opacity .reason input').val();
					if($(this).get(0).dataset.type=='server-support'){
						refund($(this).get(0).dataset.order,vipNo,reason);
					}
					
				});

				//字数检查
				var strVal='';
				var valBtn=$('.opacity input');
				$(valBtn).on('input',function(){
					console.log(56);
					if($(this).val().length>=140){
						$(this).val(strVal);
						alert('字数不能超过140字');
					}else{
						strVal=$(this).val();
					}
				});

				//点击取消窗口消失
				oCancel.on('click',function(){
					cancel();
				});
			})();

			//确认收货
			(function(){
				var oK=$('.ok');
				var oWrap=$('.opacity');
				var oBtn=$('.opacity .con li:last-of-type');
				var oCancel=$('.opacity .con li:first-of-type');
				
				oK.on('click',function(){
					$('.opacity .con').removeClass('reason');
					$('.opacity .con').removeClass('cancel');
					$('.opacity .con input').css('display','none');
					$('.opacity .con h2').text('确认收货');
					$('.opacity .con p').text('是否确认已经收到货品？');
					alertC(url_search().orderNo,$(this).get(0).className);
				});

				//点击确认请求接口
				function ok(orderNum,vipNo){
					var token=getSto('token');
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/shoporder/confirm',
						
						data:{
							orderNo:orderNum,
							memberNo:vipNo
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
							cancel();
						},
						error:function(err){
							console.log(err);
						}
					});
				}

				//弹出窗口函数
				function alertC(s,type){
					oBtn.attr('data-order',s);
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
			
			if(location.hash=='#express'){
				$('.wrap').scrollTop($('#express').offset().top);
			}

		},
		error:function(err){
			console.log(err);
		}
	});
})();


//联系客服
(function(){
	$('.normal>span').on('click',function(){
		location.href='jump.html';
	});
})();

function url2json(str){
	var json={};
	var arr=str.split('&');
	for(var i=0; i<arr.length; i++){
		var arr2=arr[i].split('=');
		json[arr2[0]]=arr2[1];
	}
	return json;
};