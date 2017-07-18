import '../css/public.css';
import '../css/center.css';
import $ from 'n-zepto';
import {rand,signName,getSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';
var ID=getSto("deciveID");
//个人中心展示
(function(){
	var iBtn=true;//控制刚登录时头像显示开关
	var vipNo=getSto("vipNo");
	if(parseInt(vipNo)){
		show(vipNo,iBtn);
	}
})();



//判断是否登录点击注册
(function(){
	var oBtn=$('.user-center-info');//头像
	var oBtn2=$('.custom a');//我的定制栏
	var oBtn3=$('.info a');//个人信息栏
	var oBtn4=$('.address a');//收货地址栏
	var oP=$('.opacity');
	var oX=$('.opacity>header a');
	var oImg=$('.login>li>img');

	$(oImg).on('click',function(){
		$(this).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
	});

	oBtn.on('click',function(){
		var vipNo=sessionStorage.getItem("vipNo");
		if(parseInt(vipNo)){return;}
		oP.css('display','block');
		setTimeout(function(){
			oP.css('opacity',1);
			$(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
		},50);
	});

	oBtn2.on('click',function(){
		var vipNo=sessionStorage.getItem("vipNo");
		if(!parseInt(vipNo)){
			oP.css('display','block');
			setTimeout(function(){
				oP.css('opacity',1);
				$(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
			},50);
			return false;
		}
	});

	oBtn3.on('click',function(){
		var vipNo=sessionStorage.getItem("vipNo");
		if(!parseInt(vipNo)){
			oP.css('display','block');
			setTimeout(function(){
				oP.css('opacity',1);
				$(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
			},50);
			return false;
		}
	});
	
	oBtn4.on('click',function(){
		var vipNo=sessionStorage.getItem("vipNo");
		if(!parseInt(vipNo)){
			oP.css('display','block');
			setTimeout(function(){
				oP.css('opacity',1);
				$(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
			},50);
			return false;
		}
	});
	//关闭注册层
	oX.on('click',function(){
		oP.css('opacity',0);
		setTimeout(function(){
			oP.css('display','none');
		},500);
		return false;
	});
})();

var reg = /^((1[0-9]{1})+\d{9})$/; 
//验证手机号获取验证码
(function(){
	var oBtn=$('.login>li>button');
	var num=60;
	var timer=null;
	var iBtn=true;

	oBtn.on('click',function(){
		if(!iBtn){return}

		var val=$('.tel').val();
		if(!reg.test(val)){ 
		    alert('请输入有效的手机号码'); 
		    return false; 
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
		var iBtn=false;//控制刚登录时头像显示开关

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
					sessionStorage.setItem("token",data.body.token);
					sessionStorage.setItem("vipNo",vipNo);
					sessionStorage.setItem("nickname",data.body.nickName);
					show(vipNo);
					//alert(data.head.message);

					
					$(oBtn).css('display','block');
					

					oP.css('opacity',0);
					setTimeout(function(){
						oP.css('display','none');
					},510);
				},
				error:function(err){
					console.log(err);
				}
			});
		}
	});
})();

//退出登录
(function(){
	var oBtn=$('.logout');

	var vipNo=sessionStorage.getItem("vipNo");
	if(parseInt(vipNo)){
		$(oBtn).css('display','block');
	}

	oBtn.on('click',function(){
		sessionStorage.clear();
		localStorage.clear();
		sessionStorage.setItem('tipSign','true');
		$(oBtn).css('display','none');
		window.location.href='index.html';
	});
})();

function show(vipNo,iBtn){
	var oImg=$('.detail>img');
	var oH=$('.detail>h3');
	var oP=$('.detail>p');
	
	$.ajax({
		url:apiUrl+'/member/center?memberNo='+vipNo,
		
		success:function(data){
			if(data.head.code){
				console.log('数据返回错误！');
				return;
			}
			if(iBtn){
				$(oImg).attr('src',data.body.avatar);
			}
			$(oH).html(data.body.nickname);
			$(oP).html(data.body.mobile);
		},
		error:function(err){
			console.log(err);
		}
	});
}
