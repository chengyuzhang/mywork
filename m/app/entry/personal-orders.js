import '../css/public.css';
import '../css/personal-orders.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,findArrIndex,imgLazy,setSto,getSto,cartCount,rmSto,allSto} from '../js/config';
import md5 from 'md5';
// $(".wrap-list-nav ul li").click(function(){
// 	$(this).addClass("active").siblings().removeClass("active");
// })

var vipNo=getSto('vipNo');
var token=getSto('token');
//var vipNo='0000007922';
//获取购物车数量
cartCount($('.func-public em'));
///////////////////////////////列表相关////////////////////////
var getUrl=apiUrl+'/shoporders';
var sortId=[];
var styleId=[];
var materialId=[];
var priceId=[];
var targetId=[];
var labelId=[];
var pageNum=1;
var pageSize=5;
var requestType='post';
var jsonData={
		memberNo:vipNo,
        type:0,
        pageNum:pageNum,
        pageSize:pageSize
    };

var iBtn=true;//控制分页器只布局一次的关

//////////////////////////////////////////////////////////////
if(vipNo){//登录过
	//获取登录后个人信息
	showInfo(vipNo);
	dataRender('order-list',$('.wrap-list-con'));
}else{//未登录过
	//获取图片验证码
	var oImg=$('.login>li>img');
	var ID=getSto("deciveID");

    //弹出登录层
	var oPacity=$('.opacity');
	$(oPacity).css('display','block');
	setTimeout(function(){
		$(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
		$(oPacity).css('opacity',1);
	},50);

	//点击更换验证码
	$(oImg).on('click',function(){
		$(this).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
	});

	var reg = /^((1[0-9]{1})+\d{9})$/; 
	//验证手机号获取验证码
	(function(){
		var oBtn=$('.login>li>button');
		var num=60;
		var timer=null;
		var iBtn=true;

		oBtn.on('click',function(){
			if(!iBtn){return}

			var val=$('.login>li>input.tel').val();
		
			if(!reg.test(val)){ 
			    alert('请输入有效的手机号码'); 
			    return;
			}
			iBtn=false;
			timer=setInterval(function(){
				num--;
				oBtn.html(num+'s');
				oBtn.css({
					'color':'#999',
					'border':'1px solid #999'
				});
				if(num<0){
					clearInterval(timer);
					oBtn.html('重新获取');
					iBtn=true;
					num=60;
					oBtn.css({
						'color':'#666',
						'border':'1px solid #666'
					});
				}
			},1000);
			

			$.ajax({
				type:'post',
				url:apiUrl+'/user/captcha',
				data:{
					mobile:val
				},
				success:function(data){
					
					if(data.head.code){
						alert(data.head.message);
					}
				},
				error:function(err){
					console.log(err);
				}
			});
		});
	})();

	//登录
	(function(){
		var oLogin=$('.login-btn');
		var oImg=$('.login>li>img');
		var oBtn=$('.logout');

		oLogin.on('click',function(){
			var iSign=$('.sign').val();
			var iTel=$('.tel').val();
			var iCode=$('.code').val();
			var oP=$('.opacity');
			//var iBtn=false;//控制刚登录时头像显示开关

			if(iTel==''||iCode==''){
				alert('手机号或验证码不能为空！');
			}else{
				$.ajax({
					type:'post',
					url:apiUrl+'/login',
					data:{
						mobile:iTel,
						captcha:iCode,
						captchaNo:iSign,
						random:ID
					},
					success:function(data){
						if(data.head.code){
							alert(data.head.message);
							$(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
							return;
						}
						var vipNo=data.body.memberNo;
						var token=data.body.token;

						sessionStorage.setItem("token",data.body.token);
						sessionStorage.setItem("vipNo",vipNo);
						sessionStorage.setItem("nickname",data.body.nickName);
						iBtn=true;
						showInfo(vipNo);

						jsonData.memberNo=vipNo;
						dataRender('order-list',$('.wrap-list-con'));
						//alert(data.head.message);
						//获取购物车数量
						cartCount($('.func-public em'));

						$('.user-info .quit-btn').css('display','block');
						//$('.user-center-detail>a').css('display','block');

						$(oPacity).css('opacity',0);
						setTimeout(function(){
							$(oPacity).css('display','none');
						},510);
					},
					error:function(err){
						console.log(err);
					}
				});
			}
		});
	})();	
}

//退出账号	
$('.quit-btn').on('click',function(){
	sessionStorage.clear();
	location.href='index.html';
});

//显示个人信息函数
function showInfo(vipNo){
	var oAvatar=$('.user-info .user-log');//头像
	var oName=$('.user-info span b');//名字
	var oTel=$('.user-info span em');//手机号
	var oQuit=$('.user-info .quit-btn');//退出
	var token=getSto('token');
	$.ajax({
		type:'post',
		headers:signName(md5,vipNo,token),
		url:apiUrl+'/member/center',
		data:{
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
                    //location.href='personal-orders.html';
                }
				console.log(data.head.message);
                return;
			}

			var data=data.body;
			$(oAvatar).attr('src',data.avatar);
			$(oName).text(data.nickname);
			$(oTel).text(data.mobile);
			$(oQuit).css('display','block');
		},
		error:function(err){
			console.log(err);
		}
	});
}
function showPersonalInfo(){
	var oAvatar=$('.edit-img');//头像
	var oName=$('.edit-name');//名字
	var oTel=$('.edit-tel');//手机号
	var oSex=$('.edit-sex');
	$.ajax({
		type:'get',
		headers:signName(md5,vipNo,token),
		url:apiUrl+'/member',
		data:{
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
                    location.href='personal-orders.html';
                }
				console.log(data.head.message);
                return;
			}

			var data=data.body.user;
			$(oAvatar).attr('src',data.avatar);
			$(oName).text(data.nickname);
			$(oTel).text(data.mobile);
			$(oSex).text(data.gender);
		},
		error:function(err){
			console.log(err);
		}
	});
}
//左边栏的切换
var aNavTab=$('.nav-tab');
var aNavCon=$('.nav-con');
var navIndex=0;
var oCustomCon=$('.mycustom-wrap');//定制列表的外层
var oAddressListCon=$('.table-address');

aNavTab.each(function(index,item){
	$(item).on('click',function(){
		$(aNavTab[navIndex]).removeClass('active');
		$(aNavCon[navIndex]).css('display','none');
		$(item).addClass('active');
		$(aNavCon[index]).css('display','block');
		navIndex=index;
		vipNo=getSto('vipNo');
		token=getSto('token');
		//jsonData.pageNum=1;
		switch(index){
			case 0:
				$('.wrap-banner').css('display','block');
				getUrl=apiUrl+'/shoporders'
				iBtn=true;
				requestType='post';
				$('.paging').css('display','block');
				dataRender('order-list',$('.wrap-list-con'));
			break;
			case 1:
				$('.wrap-banner').css('display','block');
				getUrl=apiUrl+'/customization/orders';
				jsonData.pageNum=1;
				requestType='get';
				iBtn=true;
				$('.paging').css('display','block');
				dataRender('custom-list',$('.mycustom-wrap'));
			break;
			case 2:
				$('.wrap-banner').css('display','block');
				$('.paging').css('display','none');
				showPersonalInfo();
			break;
			case 3:
				$('.wrap-banner').css('display','block');
				$('.paging').css('display','none');
				var sAddress='';
				$.ajax({
					type:'get',
					headers:signName(md5,vipNo,token),
					url:apiUrl+'/address',
					data:{
						memberNo:vipNo
					},
					success:function(data){

						sAddress+=`<tr style="height:35px;line-height:35px;">
				                        <th>收件人</th>
				                        <th>详细地址</th>
				                        <th>电话</th>
				                        <th>操作</th>
				                        <th></th>
				                    </tr>`;
	                    data.forEach(function(item,index){
		                    sAddress+=`<tr class="table-list" data-id=${item.id}>
		                        <td class="add-name">${item.consignee}</td>
		                        <td class="add-address" data-zone=${item.zone} data-detail=${item.detail}>详细地址：${item.zone}${item.detail}</td>
		                        <td class="add-tel">${item.mobile}</td>
		                        <td class="add-operate"><a href="javascript:" class="edit-address">编辑</a> <i></i> <a href="javascript:" class="delete-address">删除</a></td>`;
		                        if(item.defaultAddr){//如果是默认地址
		                        	sAddress+='<td class="add-default"><span class="checkbox active"></span><em>默认地址</em></td>';
		                        }else{
									sAddress+='<td class="add-default"><span class="checkbox"></span><em>默认地址</em></td>';
		                        }
		                        
		                    sAddress+=`</tr>`;
	                    });

	                    $(oAddressListCon).html(sAddress);

	                    var aItem=$('.table-list');
	                    var aDefault=$('.table-list .add-default');
	                    var aEdit=$('.add-operate .edit-address');
	                    var oWrap=$('.opacity1');
						var oBtn=$('.opacity1 .con li:last-of-type');
						var oCancel=$('.opacity1 .con li:first-of-type');
						var tempObj=null;//点击删除的那项

						//编辑地址
						aEdit.each(function(index,item){
							$(item).on('click',function(){
								var temp=$(aItem).get(index);
								if(!temp){return}

								$('.add-new-address.edit1 li input.geter').val($(aItem[index]).find('.add-name').text());
								$('.add-new-address.edit1 li input.geter-tel').val($(aItem[index]).find('.add-tel').text());
								$('.add-new-address.edit1 li .geter-zone i').text($(aItem[index]).find('.add-address').get(0).dataset.zone);
								$('.add-new-address.edit1 li .geter-zone-local').val($(aItem[index]).find('.add-address').get(0).dataset.detail);

								$('.add-new-address.edit1 .keep').get(0).dataset.id=$(aItem).get(index).dataset.id;

								$('.add-new-address.add').css('display','none');
								$('.add-new-address.edit1').css('display','block');
							});

						});
						//设置默认地址
						aDefault.each(function(index,item){
							$(item).on('click',function(){

								var temp=$(aItem).get(index);
								if(!temp){return}
								var id=$(aItem).get(index).dataset.id;

								// aEdit.forEach(function(item1,index1){
								// 	$(item1).get(0).dataset.default='false';
								// });

								$.ajax({
									type:'post',
									url:apiUrl+'/address/default',
									headers:signName(md5,vipNo,token),
									data:{
										memberNo:vipNo,
										id:id
									},
									success:function(data){
										
										if(data){
											aDefault.each(function(index1,item1){
												$(item1).find('span').removeClass('active');
											});
											$(item).find('span').addClass('active');
											//$(aEdit).eq(index).get(0).dataset.default='true';
										}
									},
									error:function(err){
										console.log(err);
										alert('设置默认地址失败！');
									}
								});

							});
						});

	                    //删除地址
	                    var aDelAddressBtn=$('.delete-address');

	                    aDelAddressBtn.each(function(index,item){
							$(item).on('click',function(){
								tempObj=$(item);
								alertC(index);
							});
						});

	                    //窗口的确认
						oBtn.on('click',function(){
							var temp=$(tempObj).parent().parent().get(0);
							if(!temp){return}
							$.ajax({
								type:'post',
								url:apiUrl+'/address/'+$(tempObj).parent().parent().get(0).dataset.id+'/delete',
								headers:signName(md5,vipNo,token),
								success:function(data){
									
									if(data){
										cancel();
										$(tempObj).parent().parent().remove();
										//sessionStorage.setItem("addressID",0);
										//window.location.reload();
									}
								},
								error:function(err){
									console.log(err);
								}
							});
						});

	                    //点击取消窗口消失
						oCancel.on('click',function(){
							cancel();
						});

						//弹出窗口函数
						function alertC(index,item){
							oBtn.attr('data-index',index);
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
							},500);
						}
					},
					error:function(err){
						console.log(err);
					}
				});
			break;
			case 4:
				$('.wrap-banner').css('display','none');
				$('.paging').css('display','none');
			break;
		}
	});
});

//订单列表的切换
var listIndex=0;
var listTab=$('.wrap-list-nav ul li');

listTab.each(function(index,item){
	$(item).on('click',function(){
		$(listTab[listIndex]).removeClass('active');
		$(item).addClass('active');
		listIndex=index;

		jsonData.pageNum=1;
		switch(index){
			case 0:
				jsonData.type=0;
				dataRender('order-list',$('.wrap-list-con'));
				iBtn=true;
			break;
			case 1:
				jsonData.type=1;
				dataRender('order-list',$('.wrap-list-con'));
				iBtn=true;
			break;
			case 2:
				jsonData.type=2;
				dataRender('order-list',$('.wrap-list-con'));
				iBtn=true;
			break;
			case 3:
				jsonData.type=3;
				dataRender('order-list',$('.wrap-list-con'));
				iBtn=true;
			break;
			case 4:
				jsonData.type=4;
				dataRender('order-list',$('.wrap-list-con'));
				iBtn=true;
			break;
		}
	});
});

function dataRender(kind,oCon){
	var str='';
    $.ajax({
        type:requestType,
        headers:signName(md5,vipNo,token),
        url:getUrl,
        data:jsonData,
        success:function(data){
            if(data.head.code){
                console.log(data.head.message);
            }
            
            var data=data.body;
			
            if(kind=='order-list'){console.log('order-list');
	        	data.orderList.forEach(function(item,index){
		            if(item.goodsList.length){
						str+=`<div class="wrap-list-item">`;
	              			str+='<h4>'+statusCode(item.statusCode)+'</h4>';

	              			item.goodsList.forEach(function(item1,index1){
	              				str+=`<dl><a href="personal-center.html?orderNo=${item.orderNo}&statusCode=${item.statusCode}"></a>
			                      	<dt><img src="" data-src=${item1.picture} alt=""></dt>
			                      	<dd class="item-name">
			                          	<div><h5>${item1.longName}</h5>`;
			                          	if(item.comment){
			                          		str+=`<em>备注：${item1.comment}</em>`;
			                          	}
			                                
			                          	str+=`</div>`;
			                          	if(item1.accessoryName){
			                            	str+=`<p>配件：${item1.accessoryName}</p>`;
			                            }
			                      	str+=`</dd>
			                  	</dl>`;
	              			});
		                  	
		                  	str+=`<p class="pay-for">
		                    	<span>共<i>${item.number}</i>件商品</span>`;
		                    	
		                    	if(item.statusCode==10){
			                    	str+=`<span>需付款：<i>¥${item.orderPrice}</i></span>`;
			                    }else{
			                    	str+=`<span>实付款：<i>¥${item.orderPrice}</i></span>`;
			                    }
		                    	
		                    	if(statusCodeControl(item.statusCode).length){
				                    for(var i=statusCodeControl(item.statusCode).length-1; i>=0; i--){
				                    	if(statusCodeControl(item.statusCode)[i]=='确认收货'){console.log(1);
				                    		if(i==0){
				                    			str+='<a href="personal-center.html?orderNo='+item.orderNo+'&statusCode='+item.statusCode+'#express">'+statusCodeControl(item.statusCode)[i]+'</a>';
				                    			str+='<a href="" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</a>';
				                    		}else{
				                    			str+='<a href="javascript:;" data-type="ok" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</a>';
				                    		}
				                    		//str+='<a href="javascript:;" data-order='+item.orderNo+' data-index='+index+'>'+statusCodeControl(item.statusCode)[i]+'</a>';
				                    	//}else if(statusCodeControl(item.statusCode)[i]=='查看物流'){console.log(999);
				                    		//str+='<a href="custom-detail.html?orderNo='+item.orderNo+'&statusCode='+item.statusCode+'" data-order='+item.orderNo+' data-index='+index+'>'+statusCodeControl(item.statusCode)[i]+'</a>';
				                    	}else if(statusCodeControl(item.statusCode)[i]=='删除订单'){console.log(3);
				                    		if(i==0){
				                    			str+='<a href="javascript:;" data-type="delete" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</a>';
				                    		}else{
				                    			str+='<a href="javascript:;" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</a>';
				                    		}
				                    	}else if(statusCodeControl(item.statusCode)[i]=='再次购买'){console.log(3);
				                    		str+='<a href="javascript:;" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</a>';
				                    	}else{
				                    		if(statusCodeControl(item.statusCode)[i]=='联系客服'){
				                    			str+='<a href="jump.html" target="_blank" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</a>';
					                    	}else{
					                    		str+='<a href="javascript:;" data-order='+item.orderNo+'>'+statusCodeControl(item.statusCode)[i]+'</a>';

					                    	}
					                    }
				                    }
				                }
		                  	str+=`</p>
	        			</div>`;
					}
		        });
	        }
	        if(kind=='custom-list'){
	        	data.orders.forEach(function(item,index){
		            str+=`<div class="wrap-mycustom" style="">
		                    <div class="custom-list-details">
		                        <p class="list-date"><em>${item.createTime}</em></p>
		                        <div class="list-table">
		                        	<a href="custom-details.html?orderNo=${item.orderNo}"></a>
		                            <ul class="clear">
		                                <li>宝贝</li>
		                                <li>款式</li>
		                                <li>材质</li>
		                                <li>尺寸</li>
		                                <li>刻字</li>
		                            </ul>
		                            <ol class="clear" data-order-num=${item.orderNo}>
		                                <li class="goods-list-pic"><img data-src=${item.cover}></li>
		                                <li>${item.style}</li>
		                                <li>${item.material}</li>
		                                <li>${item.size}</li>
		                                <li>${item.lettering}</li>
		                            </ol>
		                            <p class="pay-for">支付金额：<em>¥${item.price}</em> <strong data-index=${index}>${item.statusName}</strong>`;
		                            //<a href="javascript:">确认发货</a><a href="javascript:">联系客服</a>
		                            switch(item.status){
							        	case 10:
							        		str+='<a href="javascript:" class="custom-pay" data-order='+item.orderNo+'>立即付款</a><a target="_blank" target="_blank" href="jump.html" class="contact">联系客服</a>';
							        	break;
										case 20:
							        		str+='<a href="javascript:" class="custom-refund" data-index='+index+' data-order='+item.orderNo+'>申请退款</a><a target="_blank" href="jump.html" class="contact">联系客服</a>';
							        	break;
										case 40:
							        		str+='<a target="_blank" href="jump.html" class="contact">联系客服</a>';
							        	break;
										case 60:
							        		str+='<a target="_blank" href="jump.html" class="contact">联系客服</a>';
							        	break;
										case 70:
							        		str+='<a href="javascript:" class="custom-ok" data-index='+index+' data-order='+item.orderNo+'>确认收货</a><a target="_blank" href="jump.html" class="contact">联系客服</a>';
							        	break;
										case 80:
							        		str+='<a target="_blank" href="jump.html" class="contact">联系客服</a>';
							        	break;
										case 31:
							        		str+='<a href="javascript:" class="custom-refund" data-index='+index+' data-order='+item.orderNo+'>申请退款</a><a target="_blank" href="jump.html" class="contact">联系客服</a>';
							        	break;
										case 41:
							        		str+='<a target="_blank" href="jump.html" class="contact">联系客服</a>';
							        	break;
							        	default:
							        		str+='<a target="_blank" href="jump.html" class="contact">联系客服</a>';
							        	break;
							        }
		                        str+=`</p></div>
		                    </div>
		                </div>`;
		        });
	        }

	        $(oCon).html(str);

	        if(kind=='order-list'){
	        	var aImg=$('.wrap-list-item dt img');
	        }
	        if(kind=='custom-list'){
	        	var aImg=$('.goods-list-pic img');
	        }
	        //图片懒加载
	        (function(){
	            imgLazy(aImg);
	        })();

	        //我的定制结算
			(function(){
				var aBtn=$('.custom-pay');
				aBtn.each(function(index,item){
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
				                    location.href='personal-orders.html';
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

			//我的定制确认收货
			(function(){
				//var aLi=$('.list>li');
				var aBtn=$('.custom-ok');
				var oWrap=$('.opacity3');
				var oBtn=$('.opacity3 .con li:last-of-type');
				var oCancel=$('.opacity3 .con li:first-of-type');
				var aEm=$('.list .status>em');
				aBtn.each(function(index,item){
					$(item).on('click',function(){
						$('.opacity3 input').css('display','none');
						$('.opacity3 a').css('display','none');
						$('.opacity3 h2').text('确认收货');
						$('.opacity3 p').text('是否确认已经收到货品？');
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
				                    location.href='personal-orders.html';
				                }
				                alert(data.head.message);
				            }
							if(data.body.status){
								//$(aEm).eq(index).text('已完成');
								//$(aLi).eq(index).find('.ok').css('display','none');
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
					if($(this).get(0).dataset.type=='custom-ok'){
						ok($(this).get(0).dataset.order,vipNo,$(this).get(0).dataset.index);
					}
				});

				//点击取消窗口消失
				oCancel.on('click',function(){
					cancel();
				});
			})();

			//我的定制申请退款
			(function(){
				//var aLi=$('.list>li');
				var aBtn=$('.custom-refund');
				var oWrap=$('.opacity3');
				var oBtn=$('.opacity3 .con li:last-of-type');
				var oCancel=$('.opacity3 .con li:first-of-type');
				var aEm=$('.list .status>em');
				aBtn.each(function(index,item){
					$(item).on('click',function(){
						$('.opacity3 input').css('display','block');
						alertC($(item).get(0).dataset.order,$(item).get(0).dataset.index,$(item).get(0).className);
					});
				});

				function refund(orderNum,vipNo,index,reason){
					if(reason==''){
						alert('请填写退款理由');
					}
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
				                    location.href='personal-orders.html';
				                }
				                alert(data.head.message);
				            }
							if(data.body.status){
								//$(aEm).eq(index).text('待退款');
								//$(aLi).eq(index).find('.refund').css('display','none');
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
					var reason=$('.opacity3 .reason input').val();
					
					if($(this).get(0).dataset.type=='custom-refund'){
						refund($(this).get(0).dataset.order,vipNo,$(this).get(0).dataset.index,reason);
					}
				});

				//点击取消窗口消失
				oCancel.on('click',function(){
					cancel();
				});
			})();

	        //再次购买
			(function(){
				var aEm=$('.wrap-list-item .pay-for a');
				var token=getSto('token');
				aEm.each(function(index,item){
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
						                    location.href='personal-orders.html';
						                }
			                            alert(data.head.message);
			                            return;
			                        }
			                        location.href='cart.html?from=order-list';
			                    },
			                    error:function(err){
			                        console.log(err);
			                    }
			                });
						});
					}
				});
			})();

			//去支付
			(function(){
				var aEm=$('.wrap-list-item .pay-for a');
				var token=getSto('token');
				aEm.each(function(index,item){
					if($(item).text()=='去支付'){
						$(item).on('click',function(){
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
						                    location.href='personal-orders.html';
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

			//删除订单
	       	(function(){
	       		var aEm=$('.wrap-list-item .pay-for a');
				var oWrap=$('.opacity3');
				var oBtn=$('.opacity3 .con li:last-of-type');
				var oCancel=$('.opacity3 .con li:first-of-type');
	    
	       		aEm.each(function(index,item){
	       			if($(item).text()=='删除订单'){
	       				$(item).on('click',function(){
	       					$('.opacity3 .con h2').text('删除订单');
							$('.opacity3 .con p').text('是否确认删除订单？');
			       			$('.opacity3 .con').addClass('cancel');
			       			$('.opacity3 .cancel a').css('display','none');
							alertC($(item).get(0).dataset.order,$(item).get(0).dataset.type);
						});
	       			}
					
				});
	       		function cancelFn(orderNum,vipNo){
	       			var token=getSto('token');
					$.ajax({
						type:'post',
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
		                            location.href='personal-orders.html';
		                        }
								alert(data.head.message);
								return;
							}
							cancel(data.body.status);
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
				function cancel(code){
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
					cancel(0);
				});
	       	})();

			//确认收货
			(function(){
				var aLi=$('.list>li');
				var aBtn=$('.wrap-list-item .pay-for a');
				var oWrap=$('.opacity3');
				var oBtn=$('.opacity3 .con li:last-of-type');
				var oCancel=$('.opacity3 .con li:first-of-type');
				var aEm=$('.list .status>em');
				aBtn.each(function(index,item){
					$(item).on('click',function(){
						//如果不是确认收货 弹层不显示
						if($(item).get(0).dataset.type!='ok'){
							return;
						}
						$('.opacity3 .con h2').text('确认收货');
						$('.opacity3 .con p').text('是否确认收货？');
		       			$('.opacity3 .con').addClass('cancel');
		       			$('.opacity3 .cancel a').css('display','none');
						alertC($(item).get(0).dataset.order,$(item).get(0).dataset.type);
					});
				});

				//点击确认请求接口
				function ok(orderNum,vipNo,index){
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
				                    location.href='personal-orders.html';
				                }
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
				function alertC(s,type){
					oBtn.attr('data-order',s);
					//oBtn.attr('data-index',index);
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





	        //console.log('data.page:',data.page/pageSize);
			var pageCount=Math.ceil(data.page/pageSize);
			// 分页器
			if(iBtn){

				if(kind=='order-list'){
		        	pagingRenderDom(pageCount,'order-list',$('.wrap-list-con'));
		        }
		        if(kind=='custom-list'){
		        	pagingRenderDom(pageCount,'custom-list',$('.mycustom-wrap'));
		        }
				
				iBtn=false;
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
						str=['删除订单','再次购买'];
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
            
        },
        error:function(err){
        	console.log(err);
        }
    });
}

function pagingRenderDom(num,kind,oCon){
	var pagingCon=$('.paging');
	var str='';
	var curIndex=0;//当前选中的index
	if(num==1||num==0){
		$('.paging').css('display','none');
	}else{
        $('.paging').css('display','block');
    }

	if(num<9){//如果小于9页

		//以下是布局
		str+=`<span class="to-prev"></span><ul class="page-wrap">`;
		for(var i=0; i<num; i++){
			if(i==curIndex){
				str+='<li class="active">'+(i+1)+'</li>';
			}else{
				str+='<li>'+(i+1)+'</li>';
			}
		}		
		str+=`</ul><span class="to-next"></span>`;
		pagingCon.html(str);

		//以下是点击效果及逻辑
		var oPrev=$('.to-prev');//左按键
		var oNext=$('.to-next');//右按键
		var aBtn=$('.page-wrap li');//每一项

		//点击每项
		for(var i=0; i<aBtn.length; i++){
			(function(index){
				$(aBtn[index]).on('click',function(){
					aBtn[curIndex].className='';
					curIndex=index;
					jsonData.pageNum=index+1;
					if(kind=='order-list'){
						dataRender('order-list',$('.wrap-list-con'));
					}
					if(kind=='custom-list'){
						dataRender('custom-list',$('.mycustom-wrap'));
					}
					$(this).get(0).className='active';
				});
			})(i);
		}

		//向前
		oPrev.on('click',function(){
			if(curIndex==0) return;//如果当前是第一页 则不往下继续
			aBtn[curIndex].className='';
			curIndex--;
			jsonData.pageNum=curIndex+1;
			if(kind=='order-list'){
				dataRender('order-list',$('.wrap-list-con'));
			}
			if(kind=='custom-list'){
				dataRender('custom-list',$('.mycustom-wrap'));
			}
			aBtn[curIndex].className='active';
		});

		//向后
		oNext.on('click',function(){
			if(curIndex==(num-1)) return;//如果当前是最后一页 则不往下继续
			aBtn[curIndex].className='';
			curIndex++;
			jsonData.pageNum=curIndex+1;
			if(kind=='order-list'){
				dataRender('order-list',$('.wrap-list-con'));
			}
			if(kind=='custom-list'){
				dataRender('custom-list',$('.mycustom-wrap'));
			}
			aBtn[curIndex].className='active';
		});
		
	}else{//如果大于等于9页
		renderPage('init',0);
	}

	//分页器布局
	function renderPage(isClass,Index){
		var str='';
		if(isClass=='init'){//初始显示
			str+=`<ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<3){
					if(i==0){
						str+='<li class="active">'+(i+1)+'</li>';
					}else{
						str+='<li>'+(i+1)+'</li>';
					}
				}else if(i>=3&&i<=num-2){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='second'){
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<3){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=3&&i<=num-2){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='third'){
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<4){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=4&&i<=num-2){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='fourth'){
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<5){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=5&&i<=num-2){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='middle'){
			var mid=Math.ceil((num/2));
			var n=Index-mid;
			n++;
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i<1){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=1&&i<mid-2+n){
					str+='<li class="dot">...</li>';
				}else if(i>=mid-2+n&&i<mid+1+n){
					str+='<li>'+(i+1)+'</li>';
				}else if(i>=mid+1+n&&i<num-1){
					str+='<li class="dot2">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='last-4'){
			var mid=Math.ceil((num/2));
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i>=1&&i<num-5){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='last-3'){
			var mid=Math.ceil((num/2));
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i>=1&&i<num-4){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='last-2'){
			var mid=Math.ceil((num/2));
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i>=1&&i<num-3){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul><span class="to-next"></span>`;
			pagingCon.html(str);
			
		}else if(isClass=='last-1'){
			var mid=Math.ceil((num/2));
			str+=`<span class="to-prev"></span><ul class="page-wrap">`;
			for(var i=0; i<num; i++){
				if(i>=1&&i<num-3){
					str+='<li class="dot">...</li>';
				}else{
					str+='<li>'+(i+1)+'</li>';
				}
			}		
			str+=`</ul>`;
			pagingCon.html(str);
			
		}
		var oPrev=$('.to-prev');//左按键
		var oNext=$('.to-next');//右按键
		var aBtn=$('.page-wrap li');//每一项
		var len=aBtn.length;

		//隐藏多余的...
		$('.dot').each(function(index,item){
			if(index>0){
				$(item).css('display','none');
			}
		});
		$('.dot2').each(function(index,item){
			if(index>0){
				$(item).css('display','none');
			}
		});

		//选中项的标识
		if(isClass!='init'){
			$(aBtn[curIndex]).removeClass('active');
		}
		$(aBtn[Index]).addClass('active');
		curIndex=Index;

		//点击每项的重新布局
		$(aBtn).each(function(index,item){
			$(item).on('click',function(){
				getNumToRender(index);
				jsonData.pageNum=index+1;
				if(kind=='order-list'){
					dataRender('order-list',$('.wrap-list-con'));
				}
				if(kind=='custom-list'){
					dataRender('custom-list',$('.mycustom-wrap'));
				}
			});
		});

		//向前
		oPrev.on('click',function(){
			curIndex--;
			getNumToRender(curIndex);
			jsonData.pageNum=curIndex+1;
			dataRender();
		});

		//向后
		oNext.on('click',function(){
			curIndex++;
			getNumToRender(curIndex);
			jsonData.pageNum=curIndex+1;
			//dataRender(curIndex+1);
			if(kind=='order-list'){
				dataRender(curIndex+1,'order-list',$('.wrap-list-con'));
			}
			if(kind=='custom-list'){
				dataRender(curIndex+1,'custom-list',$('.mycustom-wrap'));
			}
		});

		//获取当前页数重新布局
		function getNumToRender(num){
			if(num==0){
				renderPage('init',num);
			}else if(num==1){
				renderPage('second',num);
			}else if(num==2){
				renderPage('third',num);
			}else if(num==3){
				renderPage('fourth',num);
			}else if(num>3&&num<len-4){
				renderPage('middle',num);
			}else if(num==len-4){
				renderPage('last-4',num);
			}else if(num==len-3){
				renderPage('last-3',num);
			}else if(num==len-2){
				renderPage('last-2',num);
			}else if(num==len-1){
				renderPage('last-1',num);
			}
		}
	}
}

//选择地区
var oSelectBtn=$('.add-new-address ul li p');
var oSelectCon=$('.add-new-address ul li p i');


//选择地区
(function(){
	const provinceArray = new Array("北京市","上海市","天津市","重庆市","河北省","山西省","内蒙古自治区","辽宁省","吉林省","黑龙江省","江苏省","浙江省","安徽省","福建省","江西省","山东省","河南省","湖北省","湖南省","广东省","广西壮族自治区","海南省","四川省","贵州省","云南省","西藏自治区","陕西省","甘肃省","宁夏回族自治区","青海省","新疆维吾尔族自治区","香港特别行政区","澳门特别行政区","台湾省");  
	const cityArray = new Array();   
	cityArray[0] = new Array("北京市","东城区|西城区|崇文区|宣武区|朝阳区|丰台区|石景山区|海淀区|门头沟区|房山区|通州区|顺义区|昌平区|大兴区|平谷区|怀柔区|密云区|延庆区");   
	cityArray[1] = new Array("上海市","黄浦区|卢湾区|徐汇区|长宁区|静安区|普陀区|闸北区|虹口区|杨浦区|闵行区|宝山区|嘉定区|浦东区|金山区|松江区|青浦区|南汇区|奉贤区|崇明区");   
	cityArray[2] = new Array("天津市","和平区|东丽区|河东区|西青区|河西区|津南区|南开区|北辰区|河北区|武清区|红挢区|塘沽区|汉沽区|大港区|宁河区|静海区|宝坻区|蓟县");   
	cityArray[3] = new Array("重庆市","万州区|涪陵区|渝中区|大渡口区|江北区|沙坪坝区|九龙坡区|南岸区|北碚区|万盛区|双挢区|渝北区|巴南区|黔江区|长寿区|綦江区|潼南区|铜梁 区|大足区|荣昌区|壁山区|梁平区|城口区|丰都区|垫江区|武隆区|忠县区|开县区|云阳区|奉节区|巫山区|巫溪区|石柱区|秀山区|酉阳区|彭水区|江津区|合川区|永川区|南川区");   
	cityArray[4] = new Array("河北省","石家庄市|邯郸市|邢台市|保定市|张家口市|承德市|廊坊市|唐山市|秦皇岛市|沧州市|衡水市");   
	cityArray[5] = new Array("山西省","太原市|大同市|阳泉市|长治市|晋城市|朔州市|吕梁市|忻州市|晋中市|临汾市|运城市");   
	cityArray[6] = new Array("内蒙古自治区","呼和浩特市|包头市|乌海市|赤峰市|呼伦贝尔盟市|阿拉善盟市|哲里木盟市|兴安盟市|乌兰察布盟市|锡林郭勒盟市|巴彦淖尔盟市|伊克昭盟市");   
	cityArray[7] = new Array("辽宁省","沈阳市|大连市|鞍山市|抚顺市|本溪市|丹东市|锦州市|营口市|阜新市|辽阳市|盘锦市|铁岭市|朝阳市|葫芦岛市");   
	cityArray[8] = new Array("吉林省","长春市|吉林市|四平市|辽源市|通化市|白山市|松原市|白城市|延边市");   
	cityArray[9] = new Array("黑龙江省","哈尔滨市|齐齐哈尔市|牡丹江市|佳木斯市|大庆市|绥化市|鹤岗市|鸡西市|黑河市|双鸭山市|伊春市|七台河市|大兴安岭市");   
	cityArray[10] = new Array("江苏省","南京市|镇江市|苏州市|南通市|扬州市|盐城市|徐州市|连云港市|常州市|无锡市|宿迁市|泰州市|淮安市");   
	cityArray[11] = new Array("浙江省","杭州市|宁波市|温州市|嘉兴市|湖州市|绍兴市|金华市|衢州市|舟山市|台州市|丽水市");   
	cityArray[12] = new Array("安徽省","合肥市|芜湖市|蚌埠市|马鞍山市|淮北市|铜陵市|安庆市|黄山市|滁州市|宿州市|池州市|淮南市|巢湖市|阜阳市|六安市|宣城市|亳州市");   
	cityArray[13] = new Array("福建省","福州市|厦门市|莆田市|三明市|泉州市|漳州市|南平市|龙岩市|宁德市");   
	cityArray[14] = new Array("江西省","南昌市|景德镇市|九江市|鹰潭市|萍乡市|新馀市|赣州市|吉安市|宜春市|抚州市|上饶市");   
	cityArray[15] = new Array("山东省","济南市|青岛市|淄博市|枣庄市|东营市|烟台市|潍坊市|济宁市|泰安市|威海市|日照市|莱芜市|临沂市|德州市|聊城市|滨州市|菏泽市");   
	cityArray[16] = new Array("河南省","郑州市|开封市|洛阳市|平顶山市|安阳市|鹤壁市|新乡市|焦作市|濮阳市|许昌市|漯河市|三门峡市|南阳市|商丘市|信阳市|周口市|驻马店市|济源市");   
	cityArray[17] = new Array("湖北省","武汉市|宜昌市|荆州市|襄樊市|黄石市|荆门市|黄冈市|十堰市|恩施市|潜江市|天门市|仙桃市|随州市|咸宁市|孝感市|鄂州市");  
	cityArray[18] = new Array("湖南省","长沙市|常德市|株洲市|湘潭市|衡阳市|岳阳市|邵阳市|益阳市|娄底市|怀化市|郴州市|永州市|湘西市|张家界市");   
	cityArray[19] = new Array("广东省","广州市|深圳市|珠海市|汕头市|东莞市|中山市|佛山市|韶关市|江门市|湛江市|茂名市|肇庆市|惠州市|梅州市|汕尾市|河源市|阳江市|清远市|潮州市|揭阳市|云浮市");   
	cityArray[20] = new Array("广西壮族自治区","南宁市|柳州市|桂林市|梧州市|北海市|防城港市|钦州市|贵港市|玉林市|南宁地区市|柳州地区市|贺州市|百色市|河池市");   
	cityArray[21] = new Array("海南省","海口市|三亚市|三沙市|儋州市|五指山市|文昌市|琼海市|万宁市|东方市");   
	cityArray[22] = new Array("四川省","成都市|绵阳市|德阳市|自贡市|攀枝花市|广元市|内江市|乐山市|南充市|宜宾市|广安市|达川市|雅安市|眉山市|甘孜市|凉山市|泸州市");   
	cityArray[23] = new Array("贵州省","贵阳市|六盘水市|遵义市|安顺市|铜仁市|黔西南市|毕节市|黔东南市|黔南市");   
	cityArray[24] = new Array("云南省","昆明市|大理市|曲靖市|玉溪市|昭通市|楚雄市|红河市|文山市|思茅市|西双版纳市|保山市|德宏市|丽江市|怒江市|迪庆市|临沧市");  
	cityArray[25] = new Array("西藏自治区","拉萨市|日喀则市|山南市|林芝市|昌都市|阿里市|那曲市");   
	cityArray[26] = new Array("陕西省","西安市|宝鸡市|咸阳市|铜川市|渭南市|延安市|榆林市|汉中市|安康市|商洛市");   
	cityArray[27] = new Array("甘肃省","兰州市|嘉峪关市|金昌市|白银市|天水市|酒泉市|张掖市|武威市|定西市|陇南市|平凉市|庆阳市|临夏市|甘南市");   
	cityArray[28] = new Array("宁夏回族自治区","银川市|石嘴山市|吴忠市|固原市");   
	cityArray[29] = new Array("青海省","西宁市|海东市|海南市|海北市|黄南市|玉树市|果洛市|海西市");   
	cityArray[30] = new Array("新疆维吾尔族自治区","乌鲁木齐市|石河子市|克拉玛依市|伊犁市|巴音郭勒市|昌吉市|克孜勒苏柯尔克孜市|博尔塔拉市|吐鲁番市|哈密市|喀什市|和田市|阿克苏市");   
	cityArray[31] = new Array("香港特别行政区","香港特别行政区");   
	cityArray[32] = new Array("澳门特别行政区","澳门特别行政区");   
	cityArray[33] = new Array("台湾省","台北市|高雄市|台中市|台南市|屏东市|南投市|云林市|新竹市|彰化市|苗栗市|嘉义市|花莲市|桃园市|宜兰市|基隆市|台东市|金门市|马祖市|澎湖市");  

	var oProvWrap=$('.province ul');
	var oCityWrap=$('.city ul');
	var sProv='';
	var sCity='';
	//省份布局
	provinceArray.forEach(function(item,index){
		sProv+='<li>'+item+'</li>';
	});
	oProvWrap.html(sProv);

	//城市布局
	var aProv=$('.province ul li');
	var valProv='北京市';
	var valCity='';
	var oI=$('.add-new-address ul li p i');
	//默认显示北京区的
	cityArray[0][1].split('|').forEach(function(item,index){
		sCity+='<li>'+item+'</li>'
	});
	oCityWrap.html(sCity);
	select();
	//点击省份显示对应的城市布局
	aProv.each(function(index,item){
		$(item).on('click',function(){
			var text=$(this).text();
			sCity='';
			cityArray.forEach(function(item1,index1){
				if(text==item1[0]){
					valProv=item1[0];
					var arrCity=item1[1].split('|');
					arrCity.forEach(function(item2,index2){
						sCity+='<li>'+item2+'</li>'
					});
					oCityWrap.html(sCity);
				}
			});
			select();
		});
	});

	//点击城市选中值
	function select(){
		var aCity=$('.city li');
		aCity.each(function(index,item){
			$(item).on('click',function(){

				aCity.each(function(index1,item1){
					$(item1).removeClass('active');
				});
				$(this).addClass('active');
				
				$(oI).text(valProv+'/'+$(this).text());

				oSelect.css('opacity',0);
				timer=setTimeout(function(){
					oSelect.css('display','none');
				},500);
			});
		});
	}
	//弹层
	var oClose=$('.select-top>span.close');
	var oBtn=$('.add-new-address ul li p');
	var oSelect=$('.select');
	var timer=null;
	var timer1=null;

	//弹出层
	oBtn.on('click',function(){
		oSelect.css('display','block');
		timer=setTimeout(function(){
			oSelect.css('opacity',1);
		},50);
	});

	//弹层消失
	oClose.on('click',function(){
		oSelect.css('opacity',0);
		timer=setTimeout(function(){
			oSelect.css('display','none');
		},500);
	});
})();

//添加地址
var reg = /^((1[0-9]{1})+\d{9})$/; 
var oAddBtn=$('.add-new-address.add .keep');
var oEditBtn=$('.add-new-address.edit1 .keep');
var token=getSto("token");
oAddBtn.on('click',function(){
	var name=$('.add-new-address.add li input.geter').val();
	var tel=$('.add-new-address.add li input.geter-tel').val();
	var zone=$('.add-new-address.add li .geter-zone i').text();
	var address=$('.add-new-address.add li .geter-zone-local').val();
	var vipNo=getSto("vipNo");

	if((name&&tel&&zone&&address)!=''){
		//判断手机号
		if(!reg.test(tel)){ 
		    alert('请输入有效的手机号码'); 
		    return false; 
		}

		$.ajax({
			type:'post',
			headers:signName(md5,vipNo,token),
			url:apiUrl+'/address/save',
			headers:signName(md5,vipNo,token),
			data:{
				consignee:name,
				mobile:tel,
				zone:zone.replace(/\//, ""),
				detail:address,
				memberNo:vipNo,
			},
			success:function(data){
				// if(data.head.code){
				// 	if(data.head.code==71982){
	   //                  rmSto('nickname');
	   //                  rmSto('timestamp');
	   //                  rmSto('token');
	   //                  rmSto('vipNo');
	   //                  alert('出现错误，请重新登录！');
	   //                  location.href='user-center.html';
	   //              }
				// 	alert(data.head.message);
				// 	return;
				// }

				//setSto("addressID",data.body.addressId);

				//清空已填项
				$('.add-new-address.add li input.geter').val('');
				$('.add-new-address.add li input.geter-tel').val('');
				$('.add-new-address.add li .geter-zone i').text('请选择省市');
				$('.add-new-address.add li .geter-zone-local').val('');
				$('.keep').get(0).dataset.id='';
				//重新获取地址列表
				var sAddress='';
				$.ajax({
					type:'get',
					headers:signName(md5,vipNo,token),
					url:apiUrl+'/address',
					data:{
						memberNo:vipNo
					},
					success:function(data){

						sAddress+=`<tr style="height:35px;line-height:35px;">
				                        <th>收件人</th>
				                        <th>详细地址</th>
				                        <th>电话</th>
				                        <th>操作</th>
				                        <th></th>
				                    </tr>`;
	                    data.forEach(function(item,index){
		                    sAddress+=`<tr class="table-list" data-id=${item.id}>
		                        <td class="add-name">${item.consignee}</td>
		                        <td class="add-address" data-zone=${item.zone} data-detail=${item.detail}>详细地址：${item.zone}${item.detail}</td>
		                        <td class="add-tel">${item.mobile}</td>
		                        <td class="add-operate"><a href="javascript:" class="edit-address">编辑</a> <i></i> <a href="javascript:" class="delete-address">删除</a></td>`;
		                        if(item.defaultAddr){//如果是默认地址
		                        	sAddress+='<td class="add-default"><span class="checkbox active"></span><em>默认地址</em></td>';
		                        }else{
									sAddress+='<td class="add-default"><span class="checkbox"></span><em>默认地址</em></td>';
		                        }
		                        
		                    sAddress+=`</tr>`;
	                    });

	                    $(oAddressListCon).html(sAddress);

	                    var aItem=$('.table-list');
	                    var aDefault=$('.table-list .add-default');
	                    var aEdit=$('.add-operate .edit-address');
	                    var oWrap=$('.opacity1');
						var oBtn=$('.opacity1 .con li:last-of-type');
						var oCancel=$('.opacity1 .con li:first-of-type');
						var tempObj=null;//点击删除的那项

						//编辑地址
						aEdit.each(function(index,item){
							$(item).on('click',function(){
								var temp=$(aItem).get(index);
								if(!temp){return}

								$('.add-new-address.edit1 li input.geter').val($(aItem[index]).find('.add-name').text());
								$('.add-new-address.edit1 li input.geter-tel').val($(aItem[index]).find('.add-tel').text());
								$('.add-new-address.edit1 li .geter-zone i').text($(aItem[index]).find('.add-address').get(0).dataset.zone);
								$('.add-new-address.edit1 li .geter-zone-local').val($(aItem[index]).find('.add-address').get(0).dataset.detail);

								$('.add-new-address.edit1 .keep').get(0).dataset.id=$(aItem).get(index).dataset.id;

								$('.add-new-address.add').css('display','none');
								$('.add-new-address.edit1').css('display','block');
							});

						});

						//设置默认地址
						aDefault.each(function(index,item){
							$(item).on('click',function(){

								var temp=$(aItem).get(index);
								if(!temp){return}
								var id=$(aItem).get(index).dataset.id;

								// aEdit.forEach(function(item1,index1){
								// 	$(item1).get(0).dataset.default='false';
								// });

								$.ajax({
									type:'post',
									url:apiUrl+'/address/default',
									headers:signName(md5,vipNo,token),
									data:{
										memberNo:vipNo,
										id:id
									},
									success:function(data){
										
										if(data){
											aDefault.each(function(index1,item1){
												$(item1).find('span').removeClass('active');
											});
											$(item).find('span').addClass('active');
											//$(aEdit).eq(index).get(0).dataset.default='true';
										}
									},
									error:function(err){
										console.log(err);
										alert('设置默认地址失败！');
									}
								});

							});
						});

	                    //删除地址
	                    var aDelAddressBtn=$('.delete-address');

	                    aDelAddressBtn.each(function(index,item){
							$(item).on('click',function(){
								tempObj=$(item);
								alertC(index);
							});
						});

	                    //窗口的确认
						oBtn.on('click',function(){
							var temp1=$(tempObj).parent().parent().get(0);
							if(!temp1){return}
							$.ajax({
								type:'post',
								url:apiUrl+'/address/'+$(tempObj).parent().parent().get(0).dataset.id+'/delete',
								headers:signName(md5,vipNo,token),
								success:function(data){
									
									if(data){
										cancel();
										$(tempObj).parent().parent().remove();
										//sessionStorage.setItem("addressID",0);
										//window.location.reload();
									}
								},
								error:function(err){
									console.log(err);
								}
							});
						});

	                    //点击取消窗口消失
						oCancel.on('click',function(){
							cancel();
						});

						//弹出窗口函数
						function alertC(index,item){
							oBtn.attr('data-index',index);
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
							},500);
						}
					},
					error:function(err){
						console.log(err);
					}
				});
			},
			error:function(err){
				alert('添加失败！');
				console.log(err);
			}
		})
	}else{
		alert('不能有留空项~');	
	}
});

oEditBtn.on('click',function(){
	var name=$('.add-new-address.edit1 li input.geter').val();
	var tel=$('.add-new-address.edit1 li input.geter-tel').val();
	var zone=$('.add-new-address.edit1 li .geter-zone i').text();
	var address=$('.add-new-address.edit1 li .geter-zone-local').val();
	var vipNo=getSto("vipNo");
	var token=getSto('token');
	if((name&&tel&&zone&&address)!=''){
		//判断手机号
		if(!reg.test(tel)){ 
		    alert('请输入有效的手机号码'); 
		    return false; 
		}

		$.ajax({
			type:'post',
			headers:signName(md5,vipNo,token),
			url:apiUrl+'/address/edit',
			headers:signName(md5,vipNo,token),
			data:{
				consignee:name,
				mobile:tel,
				zone:zone.replace(/\//, ""),
				detail:address,
				defaultAddr:false,
				memberNo:vipNo,
				id:$(oEditBtn).get(0).dataset.id
			},
			success:function(data){
				// if(data.head.code){
				// 	if(data.head.code==71982){
	   //                  rmSto('nickname');
	   //                  rmSto('timestamp');
	   //                  rmSto('token');
	   //                  rmSto('vipNo');
	   //                  alert('出现错误，请重新登录！');
	   //                  location.href='user-center.html';
	   //              }
				// 	alert(data.head.message);
				// 	return;
				// }

				//setSto("addressID",data.body.addressId);

				//清空已填项
				$('.add-new-address.edit1 li input.geter').val('');
				$('.add-new-address.edit1 li input.geter-tel').val('');
				$('.add-new-address.edit1 li .geter-zone i').text('请选择省市');
				$('.add-new-address.edit1 li .geter-zone-local').val('');
				$('.keep').get(0).dataset.id='';
				//重新获取地址列表
				var sAddress='';
				$.ajax({
					type:'get',
					headers:signName(md5,vipNo,token),
					url:apiUrl+'/address',
					data:{
						memberNo:vipNo
					},
					success:function(data){

						sAddress+=`<tr style="height:35px;line-height:35px;">
				                        <th>收件人</th>
				                        <th>详细地址</th>
				                        <th>电话</th>
				                        <th>操作</th>
				                        <th></th>
				                    </tr>`;
	                    data.forEach(function(item,index){
		                    sAddress+=`<tr class="table-list" data-id=${item.id}>
		                        <td class="add-name">${item.consignee}</td>
		                        <td class="add-address" data-zone=${item.zone} data-detail=${item.detail}>详细地址：${item.zone}${item.detail}</td>
		                        <td class="add-tel">${item.mobile}</td>
		                        <td class="add-operate"><a href="javascript:" class="edit-address">编辑</a> <i></i> <a href="javascript:" class="delete-address">删除</a></td>`;
		                        if(item.defaultAddr){//如果是默认地址
		                        	sAddress+='<td class="add-default"><span class="checkbox active"></span><em>默认地址</em></td>';
		                        }else{
									sAddress+='<td class="add-default"><span class="checkbox"></span><em>默认地址</em></td>';
		                        }
		                        
		                    sAddress+=`</tr>`;
	                    });

	                    $(oAddressListCon).html(sAddress);

	                    $('.add-new-address.edit1').css('display','none');
	                    $('.add-new-address.add').css('display','block');

	                    var aItem=$('.table-list');
	                    var aDefault=$('.table-list .add-default');
	                    var aEdit=$('.add-operate .edit-address');
	                    var oWrap=$('.opacity1');
						var oBtn=$('.opacity1 .con li:last-of-type');
						var oCancel=$('.opacity1 .con li:first-of-type');
						var tempObj=null;//点击删除的那项

						//编辑地址
						aEdit.each(function(index,item){
							$(item).on('click',function(){
								var temp=$(aItem).get(index);
								if(!temp){return}

								$('.add-new-address.edit1 li input.geter').val($(aItem[index]).find('.add-name').text());
								$('.add-new-address.edit1 li input.geter-tel').val($(aItem[index]).find('.add-tel').text());
								$('.add-new-address.edit1 li .geter-zone i').text($(aItem[index]).find('.add-address').get(0).dataset.zone);
								$('.add-new-address.edit1 li .geter-zone-local').val($(aItem[index]).find('.add-address').get(0).dataset.detail);

								$('.add-new-address.edit1 .keep').get(0).dataset.id=$(aItem).get(index).dataset.id;

								$('.add-new-address.add').css('display','none');
								$('.add-new-address.edit1').css('display','block');
							});

						});

						//设置默认地址
						aDefault.each(function(index,item){
							$(item).on('click',function(){

								var temp=$(aItem).get(index);
								if(!temp){return}
								var id=$(aItem).get(index).dataset.id;

								// aEdit.forEach(function(item1,index1){
								// 	$(item1).get(0).dataset.default='false';
								// });

								$.ajax({
									type:'post',
									headers:signName(md5,vipNo,token),
									url:apiUrl+'/address/default',
									headers:signName(md5,vipNo,token),
									data:{
										memberNo:vipNo,
										id:id
									},
									success:function(data){
										
										if(data){
											aDefault.each(function(index1,item1){
												$(item1).find('span').removeClass('active');
											});
											$(item).find('span').addClass('active');
											//$(aEdit).eq(index).get(0).dataset.default='true';
										}
									},
									error:function(err){
										console.log(err);
										alert('设置默认地址失败！');
									}
								});

							});
						});

	                    //删除地址
	                    var aDelAddressBtn=$('.delete-address');

	                    aDelAddressBtn.each(function(index,item){
							$(item).on('click',function(){
								tempObj=$(item);
								alertC(index);
							});
						});

	                    //窗口的确认
						oBtn.on('click',function(){
							var temp1=$(tempObj).parent().parent().get(0);
							if(!temp1){return}
							$.ajax({
								type:'post',
								headers:signName(md5,vipNo,token),
								url:apiUrl+'/address/'+$(tempObj).parent().parent().get(0).dataset.id+'/delete',
								headers:signName(md5,vipNo,token),
								success:function(data){
									
									if(data){
										cancel();
										$(tempObj).parent().parent().remove();
										//sessionStorage.setItem("addressID",0);
										//window.location.reload();
									}
								},
								error:function(err){
									console.log(err);
								}
							});
						});

	                    //点击取消窗口消失
						oCancel.on('click',function(){
							cancel();
						});

						//弹出窗口函数
						function alertC(index,item){
							oBtn.attr('data-index',index);
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
							},500);
						}
					},
					error:function(err){
						console.log(err);
					}
				});
			},
			error:function(err){
				alert('添加失败！');
				console.log(err);
			}
		})
	}else{
		alert('不能有留空项~');	
	}
});

//个人信息 点击编辑按钮
(function(){
	var oWrap = $('.opacity2');
	var oBtn = $('.edit-btn');

	//打开弹层
	oBtn.on('click',function(){
		oWrap.css('display','block');
		setTimeout(function(){
			oWrap.css('opacity',1);
		},50);

		var oAvatar=$('.edit-img1');//头像
		var oName=$('.edit-name1');//名字
		var oTel=$('.edit-tel1');//手机号
		var oSex=$('.sex-item1 b');
		$.ajax({
			type:'get',
			headers:signName(md5,vipNo,token),
			url:apiUrl+'/member',
			data:{
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
	                    location.href='personal-orders.html';
	                }
					console.log(data.head.message);
	                return;
				}

				var data=data.body.user;
				$(oAvatar).attr('src',data.avatar);
				$(oName).val(data.nickname);
				$(oTel).val(data.mobile);
				$(oSex).text(data.gender);
			},
			error:function(err){
				console.log(err);
			}
		});
	});
})();



//弹出选择性别层
(function(){
	var oBtn=$('.sex-item1>i');
	var oI=$('.sex-item1>i>b');
	var aLi=$('.sex>li');
	var oWrap=$('.sex');

	//打开弹层
	oBtn.on('click',function(){
		oWrap.css('display','block');
		setTimeout(function(){
			oWrap.css('opacity',1);
		},50);
	});

	//选择后关闭弹层
	aLi.on('click',function(){
		oI.text($(this).text());
		oWrap.css('opacity',0);
		setTimeout(function(){
			oWrap.css('display','none');
		},500);
	});
})();

 //选择照片及显示
(function(){
	var oBtn=$('.upload');
	var vipNo=sessionStorage.getItem("vipNo");
	var token=sessionStorage.getItem("token");
	var oCircle=$('.circle');

	oBtn.on('change',function(){
		var file =this.files[0];
		
		var reader = new FileReader();
		if(typeof file=='undefined'){
			file='null';
			return;
		}
		var oMyForm = new FormData();
		oMyForm.append('test',file);

		$(oCircle).css('display','block');
		setTimeout(function(){
			$(oCircle).css('opacity',1);
		},50);

		reader.onload = function(e){
			$('.nav-con2>ul>li>em>img').attr('src',e.target.result);
		
			$.ajax({
				type:'post',
				url:apiUrl+'/pic/upload',
				headers:signName(md5,vipNo,token),
				data:oMyForm,
				processData : false,
	            contentType : false,  
				success:function(data){
					console.log(data)
					if(data.head.code){
						if(data.head.code==71982){
		                    rmSto('nickname');
		                    rmSto('timestamp');
		                    rmSto('token');
		                    rmSto('vipNo');
		                    alert('出现错误，请重新登录！');
		                    location.href='personal-orders.html';
		                }
		                alert(data.head.message);
		            }

					if(!data.head.code){
						window.oAvatar=data.body.avatar;
						$(oCircle).find('p').text('图片上传成功');
						setTimeout(function(){
							console.log(111);
							$(oCircle).css('opacity',0);
						},500);
						
						setTimeout(function(){
							$(oCircle).css('display','none');
						},1000);
					}
					
				},
				error:function(err){
					console.log(err);
				}
			});
		} 
		reader.readAsDataURL(file);
	});
})();

//保存修改资料
(function(){
	var oBtn=document.querySelector('.save');
	var oCircle=$('.circle');
	var oWrap=$('.opacity2');
	var token=sessionStorage.getItem("token");
	oBtn.addEventListener('click',function(){
		
		var oName=$('.edit-name1').val();
		var oTel=$('.edit-tel').val();
		var oSex=$('.sex-item1>i>b').text();
		var vipNo=sessionStorage.getItem("vipNo");
		console.log('NAME:',oName);
		$(oCircle).css('display','block');
		setTimeout(function(){
			$(oCircle).css('opacity',1);
		},50);

		$.ajax({
			type:'post',
			url:apiUrl+'/member/edit',
			headers:signName(md5,vipNo,token),
			data:{
				nickname:oName,
				gender:oSex,
				memberNo:vipNo,
				avatar:window.oAvatar
			},
			success:function(data){
		
				if(data){
					//图片上传成功后隐藏提示层
					$(oCircle).find('p').text('保存成功');
					setTimeout(function(){
						$(oCircle).css('opacity',0);
					},500);
					
					setTimeout(function(){
						$(oCircle).css('display','none');
					},1000);

					$(oWrap).css('display','none');
					setTimeout(function(){
						$(oWrap).css('opacity',0);
					},500);
					showInfo(vipNo);
					showPersonalInfo();
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	},false);

})();



