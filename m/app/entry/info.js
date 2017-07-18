import '../css/public.css';
import '../css/info.css';
import $ from 'n-zepto';
import {rand,signName,rmSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';
//个人信息展示
(function(){
	var oImg=$('.list .avatar');
	var oName=$('.list .nickname');
	var oSex=$('.list .sex ');
	var oTel=$('.list .tel ');
	var vipNo=sessionStorage.getItem("vipNo");
	var token=sessionStorage.getItem("token");
	
	$.ajax({
		url:apiUrl+'/member?memberNo='+vipNo,
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
			$(oImg).attr('src',data.body.user.avatar);
			$(oName).val(data.body.user.nickname);
			$(oSex).html(data.body.user.gender);
			$(oTel).html(data.body.user.mobile);
		},
		error:function(err){
			console.log(err);
		}
	});
})();

//保存修改资料
(function(){
	var oBtn=document.querySelector('.save');
	var oCircle=$('.circle');
	var token=sessionStorage.getItem("token");
	oBtn.addEventListener('click',function(){
		
		var oName=$('.nickname').val();
		var oSex=$('.sex').html();
		var vipNo=sessionStorage.getItem("vipNo");

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
					//图片上传成功后隐藏提示层
					$(oCircle).find('p').text('保存成功');
					setTimeout(function(){
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
	},false);
})();

//弹出选择性别层
(function(){
	var oBtn=$('.list>li:nth-of-type(3)');
	var oI=$('.list>li:nth-of-type(3)>i');
	var aLi=$('.opacity>.wrap>ul>li');
	var oWrap=$('.opacity');

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
			$('.list>li>i>img').attr('src',e.target.result);
			
			$.ajax({
				type:'post',
				url:apiUrl+'/pic/upload',
				headers:signName(md5,vipNo,token),
				data:oMyForm,
				processData : false,
	            contentType : false,  
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

					if(!data.head.code){
						window.oAvatar=data1.body.avatar;
						$(oCircle).find('p').text('图片上传成功');
						setTimeout(function(){
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
