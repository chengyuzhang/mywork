import '../css/public.css';
import '../css/order-detail.css';
import $ from 'n-zepto';
import {rand,signName,rmSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

(function(){
	var avatar=$('.order-detail>.goods-detail>img');
	var style=$('.style');
	var material=$('.material');
	var size=$('.size');
	
	var lettering=$('.lettering');
	var orderNum=$('.order-num');
	var dealTime=$('.deal-time');
	var geter=$('.geter');
	var tel=$('.tel');
	var address=$('.address');
	var expressName=$('.express-name');
	var expressNum=$('.express-num');
	var expressCon=$('.express-step ul');
	var statusCon=$('.status-bar>ul');

	var goodsPrice=$('.goods-price em');
	var couponPrice=$('.coupon-price em');
	var payPrice=$('.pay-price em');
	var oText=$('.words textarea');

	var str='';
	var temp=window.location.search;
	var valObject=url2json(temp.split('?')[1]);
	var vipNo=sessionStorage.getItem("vipNo");
	var token=sessionStorage.getItem("token");
	$.ajax({
		type:'get',
		url:apiUrl+'/customization/order/detail?memberNo='+vipNo+'&orderNo='+valObject.orderNo,
		headers:signName(md5,vipNo,token),
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
			var order=data.body.order;//订单详情
			var address1=data.body.address;//收货人地址信息
			var express=data.body.express;//快递信息
			var status=data.body.statusAxis;//页面上部信息
			
			$(avatar).attr('src',order.cover);
			$(style).text(order.style);
			$(material).text(order.material);
			$(size).text(order.size);
			$(couponPrice).text('-￥'+order.creditAmount);
			$(goodsPrice).text('￥'+order.orderPrice);
			$(payPrice).text('￥'+order.payAmount);
			$(lettering).text(order.lettering);
			$(orderNum).text(order.no);
			$(dealTime).text(order.createTime);

			$(geter).text(address1.consignee);
			$(tel).text(address1.mobile);
			$(address).text(address1.zone+address1.detail);
			$(oText).val(order.comment);

			$(expressName).text(express.company);
			$(expressNum).text(express.no);

			if(express.company==''){
				$('.express').css('display','none');
			}
			if(address1.consignee==''){
				$('#gater').css('display','none');
				$('#address').css('display','none');
			}

			//快递状态
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
			
			//顶端状态
			str='';
			var len=status.length;
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
				if(status[i][1]=="enabled"){
					str+='<li class="active"><span>'+(i+1)+'</span><p>'+status[i][0]+'</p></li>';
				}else{
					str+='<li class=""><span>'+(i+1)+'</span><p>'+status[i][0]+'</p></li>';
				}
			}
			statusCon.html(str);

			str='';
			//底端按钮状态
			var iCode=data.body.order.statusCode;
			var oCon=$('.bottom-btn');
			
	        switch(iCode){
	        	case 10:
	        		str+=`<a href="javascript:;" data-type="cancel" class="s cancel-order" >取消订单</a><span id="pay" class="pay">立即付款</span>`;
	        	break;
				case 20:
	        		str+=`<a href="jump.html" class="s" >联系客服</a><span class="refund">申请退款</span>`;
	        	break;
				case 40:
	        		str+=`<a href="jump.html" class="s active" >联系客服</a>`;
	        	break;
				case 60:
	        		str+=`<a href="jump.html" class="s active" >联系客服</a>`;
	        	break;
				case 70:
	        		str+=`<a href="jump.html" class="s" >联系客服</a><span class="ok">确认收货</span>`;
	        	break;
				case 80:
	        		str+=`<a href="jump.html" class="s active" >联系客服</a>`;
	        	break;
				case 31:
	        		str+=`<a href="jump.html" class="s" >联系客服</a><span class="refund">申请退款</span>`;
	        	break;
				case 41:
	        		str+=`<a href="jump.html" class="s active" >联系客服</a>`;
	        	break;
	        	default:
	        		str+=`<a href="jump.html" class="s active" >联系客服</a>`;
	        	break;
	        }
	        
	       	$(oCon).append(str);

	       	//立即付款
	       	(function(){
	       		var oBtn=$('.pay');
	       		oBtn.on('click',function(event){
	       			$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/customization/order/pay',
						data:{
							orderNo:valObject.orderNo,
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
	       		event.stopPropagation();
	       	})();

	       	//取消订单
	       	(function(){
	       		var oCancelBtn=$('.cancel-order');
				var oWrap=$('.opacity');
				var oBtn=$('.opacity .con li:last-of-type');
				var oCancel=$('.opacity .con li:first-of-type');
	       		oCancelBtn.on('click',function(){
	       			//$('.opacity .con').removeClass('reason');
					//$('.opacity .con input').css('display','none');
					$('.opacity .con h2').text('取消订单');
					$('.opacity .con p').text('是否确认取消订单？');
	       			$('.opacity .con').addClass('cancel');
					alertC(valObject.orderNo,$(this).get(0).dataset.type);
	       		});

	       		function cancelFn(orderNum,vipNo){
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/order/cancel',
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
								console.log(data.head.message);
								return;
							}
							if(data.body.status){
								cancel();
							}
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

			//申请退款
			(function(){
				var oRefund=$('.refund');
				var oWrap=$('.opacity');
				var oBtn=$('.opacity .con li:last-of-type');
				var oCancel=$('.opacity .con li:first-of-type');
				
				oRefund.on('click',function(){
					$('.opacity .con').addClass('reason');
					alertC(valObject.orderNo,$(this).get(0).className);
				});

				function refund(orderNum,vipNo,reason){
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/customization/order/refund',
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
								console.log(data.head.message);
								return;
							}
							if(data.body.status){
								cancel();
							}
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
					if($(this).get(0).dataset.type=='refund'){
						refund($(this).get(0).dataset.order,vipNo,reason);
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
					alertC(valObject.orderNo,$(this).get(0).className);
				});

				//点击确认请求接口
				function ok(orderNum,vipNo){
					$.ajax({
						type:'post',
						url:apiUrl+'/customization/order/confirm',
						headers:signName(md5,vipNo,token),
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
								console.log(data.head.message);
								return;
							}
							if(data.body.status){
								cancel();
							}
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

		},
		error:function(err){
			console.log(err);
		}
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