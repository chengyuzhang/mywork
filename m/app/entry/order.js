import '../css/public.css';
import '../css/order.css';
import $ from 'n-zepto';
import {rand,signName,rmSto,getSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

//展示收货地址
(function(){
	var oGeter=$('.geter span');
	var oTel=$('.geter em');
	var oAddress=$('.detail-adress p');
	var temp=window.location.search;
	var valObject={};
	var addressID='';

	if(!temp.length){
		addressID=sessionStorage.getItem("addressID");
		
		if(addressID===null){
			addressID=0;
		}
	}else{
		valObject=url2json(temp.split('?')[1]);
		addressID=valObject.vipId;
	}

	$('.jump').attr('href','manage-address.html?jump=true&vipId='+addressID);
	
	var vipNo=sessionStorage.getItem("vipNo");
	var token=sessionStorage.getItem("token");
	$.ajax({
		type:'get',
		url:apiUrl+'/address/detail/my?memberNo='+vipNo+'&addressId='+addressID,
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
			var data=data.body.address;
			sessionStorage.setItem("addressID",data.id);
			oGeter.html('收货人：'+data.consignee);
			oTel.html(data.mobile);
			oAddress.html('详细地址：'+data.zone+data.detail);
			if($(oAddress).height()<20){
				$(oAddress).css('line-height','.3rem');
			}

			var aID=sessionStorage.getItem("addressID");
			var idString=aID.toString();
			if(idString=='null'){
				$('.address>a').css({
					'background':'#fff',
					'color':'#cb68a4',
					'line-height':'1rem',
					'text-align':'center'
				}).text('点击添加地址');
			}
		},
		error:function(err){
			console.log(err);
		}
	});
})();

//支付方式
(function(){
	var aLi=$('.pay-way li.pay-pub');
	var aEm=$('.pay-way li.pay-pub em');

	aLi.forEach(function(item,index){
		$(item).on('click',function(){
			aLi.forEach(function(item1,index1){
				item1.dataset.btn='false';
				$(aEm[index1]).css('background','url('+require('../imgs/space.png')+') no-repeat');
				$(aEm[index1]).css('background-size','contain');
			});
			this.dataset.btn='true';
			$(aEm[index]).css('background','url('+require('../imgs/no-space.png')+') no-repeat');
			$(aEm[index]).css('background-size','contain');
		});
	});
})();

//结算
(function(){
	var oBtn=$('.pay>button');
	var vipNo=sessionStorage.getItem("vipNo");
	var token=sessionStorage.getItem("token");
	oBtn.on('click',function(){
		var aID=sessionStorage.getItem("addressID");
	
		if(aID.toString()=='null'){
			alert('请添加收货地址！');
			return;
		}
		$.ajax({
			type:'post',
			headers:signName(md5,vipNo,token),
			url:apiUrl+'/order',
			data:{
				memberNo:sessionStorage.getItem("vipNo"),
				addressId:sessionStorage.getItem("addressID"),
				payType:1,
				comment:$('.pay-detail>ul>li.words>p').text(),
				cover:sessionStorage.getItem("picUrl"),
				styleCode:sessionStorage.getItem("style"),
				materialCode:sessionStorage.getItem("material"),
				sizeCode:sessionStorage.getItem("size"),
				style:sessionStorage.getItem("goods-style"),
				material:sessionStorage.getItem("goods-material"),
				size:sessionStorage.getItem("goods-size"),
				lettering:sessionStorage.getItem("letter-words"),
				coupon:$('.coupon input').val()
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

				$.ajax({
					type:'post',
					headers:signName(md5,vipNo,token),
					url:apiUrl+'/customization/order/pay',
					data:{
						orderNo:data.body.orderNo
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
			},
			error:function(err){
				console.log(err);
			}
		});

	});

})();

//展示定制商品详情
(function(){
	var oStyle=$('.pic-info>ul>li:first-of-type>em');
	var oMaterial=$('.pic-info>ul>li:nth-of-type(2)>em');
	var oSize=$('.pic-info>ul>li:nth-of-type(3)>em');
	var oLetter=$('.pic-info>ul>li:last-of-type>em');
	var oImg=$('.pic-info>img');
	var oText=$('.pay-detail>ul>li.words>p');

	oStyle.text(sessionStorage.getItem('goods-style'));
	oMaterial.text(sessionStorage.getItem('goods-material'));
	oSize.text(sessionStorage.getItem('goods-size'));
	oImg.attr('src',sessionStorage.getItem('picUrl'));
	oText.text(sessionStorage.getItem('comment'));
	oLetter.text(sessionStorage.getItem('letter-words'));

	$('.pay-detail>ul>li.goods-price>em').text(sessionStorage.getItem("order-money"));
	$('.pay>span').text('支付金额：'+sessionStorage.getItem("order-money"));
})();

//优惠券
(function(){
	var oPacity=$('.opacity');
	var oText=$('.coupon input');
	var oCouponPrice1=$('.coupon em');
	var oCouponPrice2=$('.coupon-price em');
	var oLastPrice=$('.pay span');
	var text='';
	var iPrice=sessionStorage.getItem("order-money").slice(1);
	
	oText.on('input',function(){
		var val=$(this).val();
		if(val.length<9){
			text=val;
			$(oCouponPrice1).text('-￥00');
			$(oCouponPrice2).text('-￥00');
			$(oLastPrice).text('支付金额：￥'+iPrice);
		}else{
			$(oText).val(text);
		}
		if(val.length==8){
			$(oText).blur();
			$.ajax({
				type:'get',
				headers:signName(md5,getSto('vipNo'),getSto('token')),
				url:apiUrl+'/order/coupons?coupon='+val,
				success:function(data){console.log(data);
					if(!data.body.status){
						$(oPacity).css('display','block');
						setTimeout(function(){
							$(oPacity).css('opacity',1);
						},50);

						setTimeout(function(){
							$(oPacity).css('opacity',0);
						},1100);

						setTimeout(function(){
							$(oPacity).css('display','none');
						},1650);

						$(oCouponPrice1).text('-￥00');
						$(oCouponPrice2).text('-￥00');
						$(oLastPrice).text('支付金额：￥'+iPrice);

						return;
					}
					var item=data.body.coupons[0];
					$(oCouponPrice1).text('-￥'+item.couponPrice);
					$(oCouponPrice2).text('-￥'+item.couponPrice);
					$(oLastPrice).text('支付金额：￥'+(iPrice-item.couponPrice));
				},
				error:function(err){
					console.log(err);
				}
			});
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

function classof(obj){
	if(obj===null){
		return 'Null';
	}
	if(obj===undefined){
		return 'Undefined';
	}
	return Object.prototype.toString.call(obj).slice(8,-1);
}