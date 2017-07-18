import '../css/public.css';
import '../css/manage-address.css';
import $ from 'n-zepto';
import {rand,signName,url_search,prevUrl,getSto,setSto,rmSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

//返回前一个页面
// (function(){
//     $('header>a').attr('href',prevUrl());
// })();

//返回前一个页面
(function(){
	var url=getSto('centerurl');

	if(url_search().f=='center'){
		$('header>a').attr('href','user-center.html');
		
	}else if(url_search().f=='cart'&&!url){
		setSto('centerurl',prevUrl());
		$('header>a').attr('href',prevUrl());
	}else if(url_search().f=='cart'&&url){
		$('header>a').attr('href',getSto('centerurl'));
	}else{
		$('header>a').attr('href','order.html');
	}
})();

//访问展示接口
(function(){
	var oList=$('.list');
	var vipNo=sessionStorage.getItem("vipNo");
	var token=sessionStorage.getItem("token");
	var temp=window.location.search;
	var valObject='';

	if(temp!=''){
		valObject=url2json(temp.split('?')[1]);
	}

	$.ajax({
		url:apiUrl+'/address?memberNo='+vipNo,
		headers:signName(md5,vipNo,token),
		success: function(data){console.log(data);
			// if(data.head.code){
			// 	if(data.head.code==71982){
   //                  rmSto('nickname');
   //                  rmSto('timestamp');
   //                  rmSto('token');
   //                  rmSto('vipNo');
   //                  alert('出现错误，请重新登录！');
   //                  location.href='user-center.html';
   //              }
   //              alert(data.head.message);
   //          }
	    	var arr=data;

	    	if(!arr.length){
	    		$('.wrap').addClass('no');
	    		$('.wrap').append('<p style="margin-top:3rem; color:#999; text-align:center;">暂无收货地址，快去添加吧~</p>');
	    	}

	    	var str='';
	    	arr.forEach(function(item,index){
	    		str+='<li id="'+item.id+'">';
                str+='<div class="people"><span>收货人：'+item.consignee+'</span><em>'+item.mobile+'</em></div>';
                str+='<p>详细地址：'+item.zone+item.detail+'</p>';

                //默认地址
                if(item.defaultAddr){
                	str+='<div class="btn-list"><div class="default"><i class="active"></i><span>设为默认</span></div>';
                }else{
                	str+='<div class="btn-list"><div class="default"><i class=""></i><span>设为默认</span></div>';
                }
                
                str+='<div class="delete"><i></i><span>删除</span></div>';
                str+='<div class="edit" data-default="'+item.defaultAddr+'" data-zone="'+item.zone+'" data-address="'+item.detail+'"><i></i><span>编辑</span></div>';
                if(valObject.jump=="true"){console.log(12345);
                	if(url_search().to=='manage-address'){
	                	str+='</div><a href="ok-order.html?type='+url_search().type+'&from='+url_search().f+'&vipId='+item.id+'&jump=true"></a></li>';
	                }else{
						str+='</div><a href="order.html?vipId='+item.id+'&jump=true"></a></li>';
	                }
                }else{
                	str+='</div><a href="#"></a></li>';
                }
	    	});
	    	oList.html(str);

			//设置默认地址、编辑、删除
			(function(){
				var aItem=$('.list>li');
				var aDefault=$('.list>li .default');
				var aEdit=$('.list>li .edit');
				var aDel=$('.list>li .delete');
				var oWrap=$('.opacity');
				var oBtn=$('.opacity .con li:last-of-type');
				var oCancel=$('.opacity .con li:first-of-type');
				//设置默认地址
				aDefault.forEach(function(item,index){
					$(item).on('click',function(){
						var id=$(aItem).get(index).id;

						aEdit.forEach(function(item1,index1){
							$(item1).get(0).dataset.default='false';
						});

						$.ajax({
							type:'post',
							url:apiUrl+'/address/default',
							headers:signName(md5,vipNo,token),
							data:{
								memberNo:vipNo,
								id:id
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
					   //              alert(data.head.message);
					   //          }
								if(data){
									aDefault.forEach(function(item1,index1){
										$(item1).find('i').removeClass('active');
									});
									$(item).find('i').addClass('active');
									$(aEdit).eq(index).get(0).dataset.default='true';
								}
							},
							error:function(err){
								console.log(err);
								alert('设置默认地址失败！');
							}
						});

					});
				});

				//删除
				aDel.forEach(function(item,index){
					$(item).on('click',function(){
						alertC(index);
					});
				});

				//窗口的确认
				oBtn.on('click',function(){
					$.ajax({
						type:'post',
						url:apiUrl+'/address/'+aItem[$(oBtn).get(0).dataset.index].id+'/delete',
						headers:signName(md5,vipNo,token),
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
				   //              alert(data.head.message);
				   //          }
							if(data){
								cancel();
								aItem[$(oBtn).get(0).dataset.index].remove();
								sessionStorage.setItem("addressID",0);
								window.location.reload();
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
				function alertC(index){
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
			})();

			//编辑地址跳转
			(function(){
				var aBtn=$('.edit');

				aBtn.forEach(function(item,index){
					$(item).on('click',function(){
						var li=$(this).parent().parent();
						var name='';
						var tel='';
						var zone='';
						var address='';
						var id='';
						
						var moveData={
							name:$(li).find('.people span').html().split('：')[1],
							tel:$(li).find('.people em').html(),
							zone:$(this).get(0).dataset.zone,
							address:$(this).get(0).dataset.address,
							id:$(li).get(0).id,
							jump:valObject.jump,
							type:url_search().type,
							vipId:valObject.vipId,
							defaultAddress:$(item).get(0).dataset.default
						}
						
						//window.location.href=encodeURI(encodeURI('edit-address.html?'+json2url(moveData)+'&f='+url_search().f));
						if(url_search().f){
							window.location.href='edit-address.html?'+json2url(moveData)+'&from=ok-order&f='+url_search().f;
						}else{
							window.location.href='edit-address.html?'+json2url(moveData);
						}
					});
				});
			})();

			//添加新地址
			(function(){
				var oBtn=$('.add');
				oBtn.on('click',function(){
					if(url_search().f){
						window.location.href='add-address.html?type='+url_search().type+'&from=ok-order&jump='+valObject.jump+'&vipId='+valObject.vipId+'&f='+url_search().f;
					}else{
						window.location.href='add-address.html?jump='+valObject.jump+'&vipId='+valObject.vipId;
					}
				});
			})();

			//如果从订单结算页面跳转过来的则后退按钮再跳转到订单结算页面
			// (function(){
			// 	var oBtn=$('header>a');
			// 	if(valObject.jump=="true"){
			// 		oBtn.on('click',function(){
			// 			var addressID=sessionStorage.getItem("addressID");
			// 			window.location.href='order.html?vipId='+addressID;
			// 			return false;
			// 		});
			// 	}
			// })();
	  	},
	  	error:function(err){
	  		console.log('err:',err);
        } 
	});
})();

function json2url(json){
	var arr=[];
	for(var name in json){
		arr.push(name+'='+json[name]);
	}
	return arr.join('&');
}

function url2json(str){
	var json={};
	var arr=str.split('&');
	for(var i=0; i<arr.length; i++){
		var arr2=arr[i].split('=');
		json[arr2[0]]=arr2[1];
	}
	return json;
}

