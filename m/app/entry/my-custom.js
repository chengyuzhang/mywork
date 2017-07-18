import '../css/public.css';
import '../css/my-custom.css';
import $ from 'n-zepto';
import {rand,signName,reTop,rmSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';


//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();

//定制列表展示
(function(){
	var oUl=$('.list');
	var str='';
	var vipNo=sessionStorage.getItem("vipNo");
	var token=sessionStorage.getItem("token");

	$.ajax({
		type:'GET',
		url:apiUrl+'/customization/orders?memberNo='+vipNo,
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
            }
			if(!data.body.orders.length){
	    		$('.wrap').addClass('no');
	    		$('.wrap').append('<p style="margin-top:3.5rem; color:#999; text-align:center;">您还没有订单，快去定制吧~</p><a style="display:block; width:.89rem; margin-left:1.43rem; margin-top:.4rem; border: 1px solid #CB68A4; color:#CB68A4; text-align:center; line-height:.3rem; border-radius:5px; font-size:.14rem;" href=custom.html?from=my-custom>我要定制</a>');
			}

			data.body.orders.forEach(function(item,index){
				str+='<li>';
		        str+='<div class="status"><span>'+item.createTime+'</span><em data-index='+index+'>'+item.statusName+'</em></div>';
		        str+='<div class="goods-detail" data-order="'+item.orderNo+'">';
		        str+='<img src="'+item.cover+'" alt="">';
		        str+='<ol><li>款式：'+item.style+'</li><li>材质：'+item.material+'</li><li>尺寸：'+item.size+'</li></ol></div>';
		        str+='<div class="btn-list"><em>支付金额： ￥'+item.price+'</em>';
		   
		   			switch(item.status){
			        	case 10:
			        		str+=`<a href="jump.html" class="contact" >联系客服</a>`;
			        		str+='<span class="sure" data-order='+item.orderNo+'>立即付款</span>';
			        	break;
						case 20:
			        		str+=`<a href="jump.html" class="contact" >联系客服</a>`;
			        		str+='<span class="refund" data-order='+item.orderNo+' data-index='+index+'>申请退款</span>';
			        	break;
						case 40:
			        		str+=`<a href="jump.html" class="contact" >联系客服</a>`;
			        	break;
						case 60:
			        		str+=`<a href="jump.html" class="contact" >联系客服</a>`;
			        	break;
						case 70:
			        		str+=`<a href="jump.html" class="contact" >联系客服</a>`;
			        		str+='<span class="ok" data-order='+item.orderNo+' data-index='+index+'>确认收货</span>';
			        	break;
						case 80:
			        		str+=`<a href="jump.html" class="contact" >联系客服</a>`;
			        	break;
						case 31:
			        		str+=`<a href="jump.html" class="contact" >联系客服</a>`;
			        		str+='<span class="refund" data-order='+item.orderNo+' data-index='+index+'>申请退款</span>';
			        	break;
						case 41:
			        		str+=`<a href="jump.html" class="contact" >联系客服</a>`;
			        	break;
			        	default:
			        		str+=`<a href="jump.html" class="contact" >联系客服</a>`;
			        	break;
			        }
		        str+='</div></li>';
			});

			oUl.html(str);

			//点击进入定制详情
			(function(){
				var aDetail=$('.goods-detail');

				aDetail.forEach(function(item,index){
					$(item).on('click',function(){
						window.location.href='order-detail.html?orderNo='+$(this).get(0).dataset.order;
					});
				});
			})();

			//结算
			(function(){
				var aBtn=$('.sure');
				aBtn.forEach(function(item,index){
					$(item).on('click',function(){
						order($(item).get(0).dataset.order);
					});
				});

				function order(orderNum){
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/customization/order/pay',
						data:{
							orderNo:orderNum
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
							var form=data.body.form;
							_AP.pay(form);
							//$('body').append(form);
						},
						error:function(err){
							console.log(err);
						}
					});
				}
			})();


			(function(){
				var aBtn=$('.refund');
			})();

			//申请退款
			(function(){
				var aLi=$('.list>li');
				var aBtn=$('.refund');
				var oWrap=$('.opacity');
				var oBtn=$('.opacity .con li:last-of-type');
				var oCancel=$('.opacity .con li:first-of-type');
				var aEm=$('.list .status>em');
				aBtn.forEach(function(item,index){
					$(item).on('click',function(){
						$('.opacity .reason input').css('display','block');
						alertC($(item).get(0).dataset.order,$(item).get(0).dataset.index,$(item).get(0).className);
					});
				});

				function refund(orderNum,vipNo,index,reason){
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
				                alert(data.head.message);
				            }
							if(data.body.status){
								$(aEm).eq(index).text('待退款');
								$(aLi).eq(index).find('.refund').css('display','none');
								cancel();
								
							}
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
					var reason=$('.opacity .reason input').val();
					
					if($(this).get(0).dataset.type=='refund'){
						refund($(this).get(0).dataset.order,vipNo,$(this).get(0).dataset.index,reason);
					}
				});

				//点击取消窗口消失
				oCancel.on('click',function(){
					cancel();
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
						$('.opacity .reason input').css('display','none');
						$('.opacity .reason h2').text('确认收货');
						$('.opacity .reason p').text('是否确认已经收到货品？');
						alertC($(item).get(0).dataset.order,$(item).get(0).dataset.index,$(item).get(0).className);
					});
				});

				//点击确认请求接口
				function ok(orderNum,vipNo,index){
					$.ajax({
						type:'post',
						headers:signName(md5,vipNo,token),
						url:apiUrl+'/customization/order/confirm',
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
				            }
							if(data.body.status){
								$(aEm).eq(index).text('已完成');
								$(aLi).eq(index).find('.ok').css('display','none');
								cancel();

							}
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
		},
		error:function(err){
			console.log(err);
		}
	});
})();

