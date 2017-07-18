import '../css/public.css';
import '../css/custom.css';
import $ from 'n-zepto';
import {rand,signName,url_search,rmSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

//从哪来回哪去的页面返回
(function(){
    switch(url_search().from){
        case 'index':
            $('.normal>a').attr('href','index.html');
        break;
        case 'custom':
            $('.normal>a').attr('href','custom-list.html');
        break;
        case 'find':
            $('.normal>a').attr('href','find.html');
        break;
        case 'kind':
            $('.normal>a').attr('href','kind-custom.html');
        break;
    }
})();

//初始化商品参数
(function(){
	sessionStorage.setItem('goods-style','');
	sessionStorage.setItem('goods-size','');
	sessionStorage.setItem('goods-material','');
	sessionStorage.setItem('style','');
	sessionStorage.setItem('size','');
	sessionStorage.setItem('material','');
	sessionStorage.setItem('order-money','');
})();

//定制商品布局
(function(){
	var oMaterialCon=$('.material');//材质容器
	var oSizeCon=$('.size');//尺寸容器
	var oNecklace=$('.necklace');//项链按钮
	var oBrooch=$('.brooch');//胸针按钮
	var oEarring=$('.earring');//耳环按钮
	var aStyleImg=$('.style img');//款式的图片
	var sStyle='';
	var sMaterial='';
	var sSize='';
	var goodsStyle='';
	var goodsMaterial='';
	var goodsSize='';
	var oMoney=$('.price>span');
	//点击项链
	oNecklace.on('click',function(){
		sStyle=$(this).get(0).dataset.model;
		goodsStyle=$(this).find('p').text();
		sessionStorage.setItem("style",sStyle);
		sessionStorage.setItem("size",'');
		sessionStorage.setItem("material",'');
		sessionStorage.setItem("goods-style",goodsStyle);

		var type=$(oNecklace).get(0).dataset.type;
		showMaterial(type);
		showSize(type,'silver');
		changeStyle(aStyleImg);
		$(oNecklace).find('img').get(0).src=require('../imgs/necklace-copy.png');
		$(oNecklace).find('p').addClass('active');
		showImgLayer('价格计算中');
		$.ajax({
			url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
			success:function(data){
				if(data.head.code){
					console.log('数据返回错误！');
					return;
				}
				$(oMoney).html(data.body.money);
				sessionStorage.setItem('order-money',data.body.money);
				cancelImgLayer();
			},
			error:function(err){
				console.log(err);
			}
		});
	});
	//点击胸针
	oBrooch.on('click',function(){
		sStyle=$(this).get(0).dataset.model;
		goodsStyle=$(this).find('p').text();
		sessionStorage.setItem("style",sStyle);
		sessionStorage.setItem("size",'');
		sessionStorage.setItem("goods-style",goodsStyle);
		sessionStorage.setItem("material","CZ-YIN-01");

		sessionStorage.setItem('goods-material','925银');
		var type=$(oBrooch).get(0).dataset.type;
		showMaterial(type);
		changeStyle(aStyleImg);
		$(oBrooch).find('img').get(0).src=require('../imgs/brooch-copy.png');
		$(oBrooch).find('p').addClass('active');
		showImgLayer('价格计算中');
		$.ajax({
			url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
			success:function(data){
				if(data.head.code){
					console.log('数据返回错误！');
					return;
				}
				$(oMoney).html(data.body.money);
				sessionStorage.setItem('order-money',data.body.money);
				cancelImgLayer();
			},
			error:function(err){
				console.log(err);
			}
		});
	});
	//点击耳环
	oEarring.on('click',function(){
		sStyle=$(this).get(0).dataset.model;
		goodsStyle=$(this).find('p').text();
		sessionStorage.setItem("style",sStyle);
		sessionStorage.setItem("goods-style",goodsStyle);
		sessionStorage.setItem("material","CZ-YIN-01");
		sessionStorage.setItem("size","CC-S");


		sessionStorage.setItem('goods-size','S 1*1cm');
		sessionStorage.setItem('goods-material','925银');
		var type=$(oEarring).get(0).dataset.type;
		showMaterial(type);
		changeStyle(aStyleImg);
		$(oEarring).find('img').get(0).src=require('../imgs/earring-copy.png');
		$(oEarring).find('p').addClass('active');
		showImgLayer('价格计算中');
		$.ajax({
			url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
			success:function(data){
				if(data.head.code){
					console.log('数据返回错误！');
					return;
				}
				$(oMoney).html(data.body.money);
				sessionStorage.setItem('order-money',data.body.money);
				cancelImgLayer();
			},
			error:function(err){
				console.log(err);
			}
		});
	});

	//显示材质函数
	function showMaterial(type){
		var str='';
		if(type=='necklace'){
			str+='<div class="silver" data-type="'+type+'" data-material="silver" data-model="CZ-YIN-01"><img src='+require('../imgs/block.png')+' alt=""><p>925银</p></div>';
            str+='<div class="gold" data-type="'+type+'" data-material="gold" class="block gold" data-model="CZ-18KJ-01"><img src='+require('../imgs/block.png')+' alt=""><p class="">18k金</p></div>';
            str+='<div></div>';
		}else if(type=='brooch'){
			str+='<div class="silver" data-type="'+type+'" data-material="silver" data-model="CZ-YIN-01"><img src='+require('../imgs/block.png')+' alt=""><p>925银</p></div>';
			str+='<div></div>';
			str+='<div></div>';
		}else if(type=='earring'){
			str+='<div class="silver" data-type="'+type+'" data-material="silver" data-model="CZ-YIN-01"><img src='+require('../imgs/block.png')+' alt=""><p>925银</p></div>';
			str+='<div></div>';
			str+='<div></div>';
		}
		$(oMaterialCon).html(str);

		var oSilver=$('.silver');//银按钮
		var oGold=$('.gold');//金按钮

		//选择银时
		oSilver.on('click',function(){
			sMaterial=$(this).get(0).dataset.model;
			goodsMaterial=$(this).find('p').text();
			sessionStorage.setItem("material",sMaterial);
			sessionStorage.setItem("goods-material",goodsMaterial);
			sessionStorage.setItem('goods-material','925银');
			sessionStorage.setItem("size",'')
			var material=$(oSilver).get(0).dataset.material;
			var aMaterialImg=$('.material img');//材质的图片
			showSize(type,material);
			changeMaterial(aMaterialImg);

			var aSizelImg=$('.size img');//材质的图片
			specialChangeSize(aSizelImg,type,'silver');
			$(oSilver).find('img').get(0).src=require('../imgs/block-copy.png');
			$(oSilver).find('p').addClass('active');
			$('.gold p').text('18k金');
			showImgLayer('价格计算中');
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					sessionStorage.setItem('order-money',data.body.money);
					cancelImgLayer();
				},
				error:function(err){
					console.log(err);
				}
			});
		});

		var oPactity=$('.opacity');
		oGold.on('click',function(){

			sMaterial=$(this).get(0).dataset.model;
			goodsMaterial=$(this).find('p').text();
			sessionStorage.setItem("material",sMaterial);
			sessionStorage.setItem("goods-material",goodsMaterial);
			sessionStorage.setItem('goods-material',$(oGold).find('p').text());
			sessionStorage.setItem("size",""),
			$(oPactity).css('display','block');
			setTimeout(function(){
				$(oPactity).css('opacity',1);
			},50);
			
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					sessionStorage.setItem('order-money',data.body.money);
					
				},
				error:function(err){
					console.log(err);
				}
			});
		});

		//选择项链时的黄金材质时的颜色
		var aColor=$('.opacity-con li');
		aColor.forEach(function(item,index){
			$(item).on('click',function(){
				var oGold=$('.gold');//金按钮
					var material=$(oGold).get(0).dataset.material;
					var aMaterialImg=$('.material img');//材质的图片
					$('.gold p').text($(item).text());
					showSize('necklace',material);
					changeMaterial(aMaterialImg);
					var aSizelImg=$('.size img');//材质的图片
					specialChangeSize(aSizelImg,type,material);
					$(oGold).find('img').get(0).src=require('../imgs/block-copy.png');
					$(oGold).find('p').addClass('active');

				$(oPactity).css('opacity',0);
				setTimeout(function(){
					$(oPactity).css('display','none');
				},500);
			});
		});

		//如果选择款式时是胸针或耳环时直接显示出材质和尺寸项
		if(type=='brooch'){
			showSize('brooch','silver');
			var aMaterialImg=$('.material img');//材质的图片
			
			changeMaterial(aMaterialImg);
			var aSizelImg=$('.size img');//材质的图片
			specialChangeSize(aSizelImg,type,'silver');
			$(oSilver).find('img').get(0).src=require('../imgs/block-copy.png');
			$(oSilver).find('p').addClass('active');
		}else if(type=='earring'){
			showSize('earring','silver');
			var aMaterialImg=$('.material img');//材质的图片
			changeMaterial(aMaterialImg);
			$(oSilver).find('img').get(0).src=require('../imgs/block-copy.png');
			$(oSilver).find('p').addClass('active');
		}
	}
	//显示尺寸函数
	function showSize(type,material){
		var str='';
		if(type=='necklace'&&material=='silver'){
			str+='<div class="small" data-model="CC-S"><img src='+require('../imgs/s.png')+' alt=""><p>2*1.2cm</p></div>';
            str+='<div class="middle" data-model="CC-M"><img src='+require('../imgs/m.png')+' alt=""><p>3*1.9cm</p></div>';
            str+='<div class="large" data-model="CC-L"><img src='+require('../imgs/l.png')+' alt=""><p>3.5*2.2cm</p></div>';
            console.log(type);
		}else if(type=='necklace'&&material=='gold'){
			str+='<div class="small" data-model="CC-S"><img src='+require('../imgs/s.png')+' alt=""><p>1.5*1cm</p></div>';
            str+='<div class="large" data-model="CC-L"><img src='+require('../imgs/l.png')+' alt=""><p>2*1.5cm</p></div>';
            str+='<div></div>';
		}else if(type=='brooch'&&material=='silver'){
			str+='<div class="small" data-model="CC-S"><img src='+require('../imgs/s.png')+' alt=""><p>3*2.5cm</p></div>';
            str+='<div class="large" data-model="CC-L"><img src='+require('../imgs/l.png')+' alt=""><p>4*3cm</p></div>';
            str+='<div></div>';
		}else if(type=='earring'&&material=='silver'){
			str+='<div class="small" data-model="CC-S"><img src='+require('../imgs/s.png')+' alt=""><p>1*1cm</p></div>';
            str+='<div></div>';
		}
		$(oSizeCon).html(str);
		var aSizelImg=$('.size img');//材质的图片
		var oS=$('.small');//小尺寸按钮
		var oM=$('.middle');//小尺寸按钮
		var oL=$('.large');//小尺寸按钮
		changeSize(aSizelImg);
		if(type=='earring'){
			$(oS).find('img').get(0).src=require('../imgs/s-copy.png');
			$(oS).find('p').addClass('active');
		}

		oS.on('click',function(){

			sSize=$(this).get(0).dataset.model;
			goodsSize=$(this).find('p').text();
			sessionStorage.setItem("size",sSize);
			sessionStorage.setItem("goods-size",'S '+goodsSize);
			specialChangeSize(aSizelImg,type,material);
			$(oS).find('img').get(0).src=require('../imgs/s-copy.png');
			$(oS).find('p').addClass('active');
			showImgLayer('价格计算中');
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					sessionStorage.setItem('order-money',data.body.money);
					cancelImgLayer();
				},
				error:function(err){
					console.log(err);
				}
			});
		});
		oM.on('click',function(){

			sSize=$(this).get(0).dataset.model;
			goodsSize=$(this).find('p').text();
			sessionStorage.setItem("size",sSize);
			sessionStorage.setItem("goods-size",'M '+goodsSize);

			specialChangeSize(aSizelImg,type,material);
			$(oM).find('img').get(0).src=require('../imgs/m-copy.png');
			$(oM).find('p').addClass('active');
			showImgLayer('价格计算中');
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					sessionStorage.setItem('order-money',data.body.money);
					cancelImgLayer();
				},
				error:function(err){
					console.log(err);
				}
			});
		});
		oL.on('click',function(){

			sSize=$(this).get(0).dataset.model;
			goodsSize=$(this).find('p').text();
			sessionStorage.setItem("size",sSize);
			sessionStorage.setItem("goods-size",'L '+goodsSize);

			specialChangeSize(aSizelImg,type,material);
			$(oL).find('img').get(0).src=require('../imgs/l-copy.png');
			$(oL).find('p').addClass('active');
			showImgLayer('价格计算中');
			$.ajax({
				url:apiUrl+'/customization/price?style='+sStyle+'&material='+sessionStorage.getItem("material")+'&size='+sessionStorage.getItem("size"),
				success:function(data){
					if(data.head.code){
						console.log('数据返回错误！');
						return;
					}
					$(oMoney).html(data.body.money);
					sessionStorage.setItem('order-money',data.body.money);
					cancelImgLayer();
				},
				error:function(err){
					console.log(err);
				}
			});
		});
	}

	//选择款式样式
	function changeStyle(aImg){
		aImg[0].src=require('../imgs/necklace.png');
		aImg[1].src=require('../imgs/brooch.png');
		aImg[2].src=require('../imgs/earring.png');
		aImg.forEach(function(item,index){
			$(item).next('p').removeClass('active');
		});
	}
	//选择材质样式
	function changeMaterial(aImg){
		//aImg[0].src=require('../imgs/block.png');
		aImg.forEach(function(item,index){
			aImg[index].src=require('../imgs/block.png');
			$(item).next('p').removeClass('active');
		});
	}
	//选择尺寸样式
	function changeSize(aImg){
		aImg[0].src=require('../imgs/s.png');
		if(aImg[1]){
			aImg[1].src=require('../imgs/m.png');
		}
		if(aImg[2]){
			aImg[2].src=require('../imgs/l.png');
		}
		aImg.forEach(function(item,index){
			$(item).next('p').removeClass('active');
		});
	}
	//项链胸针时的选择尺寸样式
	function specialChangeSize(aImg,type,material){
		if(type=='necklace'&&material=='gold'){
			aImg[0].src=require('../imgs/s.png');
			aImg[1].src=require('../imgs/l.png');
		}else if(type=='brooch'&&material=='silver'){
			aImg[0].src=require('../imgs/s.png');
			aImg[1].src=require('../imgs/l.png');
		}else{
			aImg[0].src=require('../imgs/s.png');
			if(aImg[1]){
				aImg[1].src=require('../imgs/m.png');
			}
			if(aImg[2]){
				aImg[2].src=require('../imgs/l.png');
			}
			aImg.forEach(function(item,index){
				$(item).next('p').removeClass('active');
			});
		}
		aImg.forEach(function(item,index){
			$(item).next('p').removeClass('active');
		});
	}
})();

//弹出选择层
(function(){
	var oProtocol=$('.protocol>p>span');
	var oBtn=$('.order-btn');
	var oClose=$('.close');
	var oWrap=$('.order-wrap');
	var iBtn=true;

	//协议点击判断是否可以到下一步
	// oProtocol.on('click',function(){
	// 	if(iBtn){console.log(1);
	// 		$(oProtocol).css('background','url('+require('../imgs/no-ok.png')+') no-repeat');
	// 	}else{console.log(2);
	// 		$(oProtocol).css('background','url('+require('../imgs/ok.png')+') no-repeat');
	// 	}
	// 	$(oProtocol).css('background-size','contain');
	// 	iBtn=!iBtn;
	// });

	oBtn.on('click',function(){
		if(!iBtn){
			return;
		}
		oWrap.css('display','block');
		setTimeout(function(){
			oWrap.css('opacity',1);
		},50);
	});
	oClose.on('click',function(){
		oWrap.css('opacity',0);
		setTimeout(function(){
			oWrap.css('display','none');
		},600);
	});
})();

//选择照片及显示
(function(){
	var oBtn=$('.upload');
	oBtn.on('change',function(){
		var file =this.files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			$('.upload-photo>.upload-btn>img').attr('src',e.target.result);
			$('.upload-photo>.upload-con>textarea').css('display','block');
			$('.upload-photo>.upload-btn>p').css('display','none');
		} 
		reader.readAsDataURL(file);
	});
})();


//选择照片及显示及上传
(function(){
	sessionStorage.setItem("picUrl","");
	var oBtn=$('.upload-photo>.upload-con>input');
	

	oBtn.on('change',function(){
		var oMyForm = new FormData();
		var file =this.files[0];

		var reader = new FileReader();
		reader.onload = function(e){
			$('.list>li>i>img').attr('src',e.target.result);
			//图片上传中显示提示层
			showImgLayer('图片提交中,请耐心等待');

			sessionStorage.removeItem('picUrl');
			oMyForm.append('test',file);
			$.ajax({
				type:'post',
				url:apiUrl+'/pic/upload',
				data:oMyForm,
				processData : false,
	            contentType : false,  
				success:function(data){
					if(!data.head.code){
						sessionStorage.setItem('picUrl',data.body.avatar);
						//图片上传成功后隐藏提示层

						cancelImgLayer();
						return;
					}else{
						cancelImgLayer();
						setTimeout(function(){
							alert(data.head.message);
						},600);
						
					}
				},
				error:function(err){
					cancelImgLayer('连接错误！');
					console.log(err);
				}
			});
		} 
		reader.readAsDataURL(file);
	});
})();

function showImgLayer(str){
	var oImg=$('.circle');	
	$(oImg).find('p').text(str);
	$(oImg).css('display','block');
	setTimeout(function(){
		$(oImg).css('opacity',1);
	},50);
}
function cancelImgLayer(){
	var oImg=$('.circle');	
	$(oImg).css('opacity',0);
	setTimeout(function(){
		$(oImg).css('display','none');
	},500);
}

//提交定制
(function(){
	var oBtn=$('.price>button');
	var oFile=$('.upload-photo>.upload-con>input');
	var oText=$('.words>input');
	var oComment=$('.upload-photo>.upload-con>textarea');
	var reg=/^((https|http|ftp|rtsp|mms)?:\/\/)/;
	var reg1=/^[a-zA-Z\u4e00-\u9fa5]{1,20}$/;
	oBtn.on('click',function(){
		var picUrl=sessionStorage.getItem('picUrl');
		if(!reg.test(picUrl)){
			alert('请选择照片！');
			return;
		}

		if(sessionStorage.getItem('style')==''){
			alert('请选择款式');
			return;
		}else if(sessionStorage.getItem('material')==''){
			alert('请选择材质');
			return;
		}else if(sessionStorage.getItem('size')==''){
			alert('请选择尺寸');
			return;
		}

		if(oText.val().length>7){
			alert('请填写7个以内字符！');
			return;
		}

		if(oText.val().length!=0&&!reg1.test(oText.val())){
			alert('不能用特殊字符！');
			return;
		}
		var vipNo=sessionStorage.getItem("vipNo");
		sessionStorage.setItem("letter-words",oText.val());
		sessionStorage.setItem("comment",oComment.val());

		var vipNo=sessionStorage.getItem("vipNo");
		var token=sessionStorage.getItem("token");
		if(parseInt(vipNo)){
			$.ajax({
				url:apiUrl+'/address/detail/my?memberNo='+vipNo+'&addressId=0',
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
					sessionStorage.setItem("addressID",data.body.address.id);
				},
				error:function(err){
					console.log(err);
				}
			});
			window.location.href='order.html';
		}else{
			window.location.href='address.html';
		}
	});
})();

//控制最大字符长度为7
(function(){
	var oBtn=$('.words>input');
	var text='';
	oBtn.on('input',function(){
		if($(oBtn).val().length<8){
			text=$(oBtn).val();
			console.log(1);
		}else{
			$(oBtn).val(text);
		}
	});
})();


