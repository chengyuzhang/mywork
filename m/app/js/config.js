//const apiUrl='http://192.168.30.49:8081';
//const apiUrl='http://192.168.30.66:8081';
const apiUrl='http://192.168.4.87:8081';
//const apiUrl='http://192.168.4.87:9091';
//const apiUrl='http://www.oohdear.com/mobile';
import md5 from 'md5';
export default apiUrl;

//生成随机数
export function rand(m,n){
	return parseInt(Math.random()*(n-m)+m);
}

//签名函数
export function signName(md5,vipNo,token,json){
	var oDate=new Date();
	var timestamp=oDate.getTime();
	oDate=null;
	sessionStorage.setItem("timestamp",timestamp);
	var timestampCopy=sessionStorage.getItem("timestamp");
	
	var ranNum=rand(1000,999999);
	var sign=md5(timestampCopy+ranNum+vipNo+token).toUpperCase();
	var obj={
		timestamp:timestampCopy,
		nonce:ranNum,
		sign:sign,
		memberNo:vipNo
	}
	if(json){
		for(var key in json){
			obj[key]=json[key];
		}
	}
	return obj;
}

//返回到顶部函数
export function reTop(obj){
	var iH=obj.height();
	var timer1=null;
	var timer2=null;
	obj.on('scroll',function(){
		clearTimeout(timer1);
		clearTimeout(timer2);
		
		if(obj.scrollTop()>=parseInt(iH)){
			$('#top').css('display','block');
			timer1=setTimeout(function(){
				$('#top').css('opacity',1);
			},50);
		}else{
			$('#top').css('opacity',0);
			timer2=setTimeout(function(){
				$('#top').css('display','none');
			},550);
		}
	});
	$('#top').on('click',function(){
		obj.scrollTop(0);
	});
}

//底部导航栏显示隐藏函数
export function tabBar(){
    var oBar=$('.index-nav');
    var timer=null;
    var timer1=null;
    var timer2=null;
   
    var sY=0;
    var eY=0;

    $('body').on('touchstart',function(ev){
        var touch=ev.changedTouches[0];
        
        sY=touch.clientY;
    });

    $('body').on('touchmove',function(ev){
        var touch=ev.changedTouches[0];

        eY=touch.clientY;
        if((eY-sY)!=0){
            clearTimeout(timer);
            clearTimeout(timer1);
            clearTimeout(timer2);
            oBar.css('opacity',0);
            timer1=setTimeout(function(){
                oBar.css('display','none');
            },250);
        }
    });

    $('body').on('touchend',function(ev){
        var touch=ev.changedTouches[0];

        eY=touch.clientY;
        clearTimeout(timer1);
        timer=setTimeout(function(){
            
            oBar.css('display','block');
            timer2=setTimeout(function(){
                oBar.css('opacity',1);
            },50);
        },500);
    });
}

//url查询部分转换成对象函数
export function url2json(str){
    var json={};
    var arr=str.split('&');
    for(var i=0; i<arr.length; i++){
        var arr2=arr[i].split('=');
        json[arr2[0]]=arr2[1];
    }
    return json;
};

//获取url查询部分并以对象形式返回
export function url_search(url){
	var search=url||window.location.search;
	var obj={};
	if(search){
	    obj=url2json(decodeURI(decodeURI(search)).split('?')[1]);
	    return obj;
	}
}

//图片懒加载
export function imgLazy(img){
    var timer=null;
    var timer1=null;
    var screenH=window.screen.height;

    img.forEach(function(item,index){
		var iTop=item.getBoundingClientRect().top;
		if(iTop<=screenH){
			$(item).attr('src',$(item).get(0).dataset.src);
			$(item).get(0).onload=function(){
				$(item).css('opacity',1);
			};
		}
	});

	$('body').on('touchmove',function(ev){
		clearInterval(timer);
    	clearInterval(timer1);
        var touch=ev.changedTouches[0];
        timer=setInterval(function(){
			img.forEach(function(item,index){
				var iTop=item.getBoundingClientRect().top;
				if(iTop<=screenH){
					$(item).attr('src',$(item).get(0).dataset.src);
					$(item).get(0).onload=function(){
						$(item).css('opacity',1);
					};
				}
			});

        },50);
	});
	
	$('body').on('touchend',function(ev){
        timer1=setTimeout(function(){
        	clearInterval(timer);
        	clearInterval(timer1);
        },1500);
    });

}

//查找项在数组中的位置
export function findArrIndex(arr,v){
	for(var i=0; i<arr.length; i++){
		if(arr[i]==v){
			return i;
		}
	}
	return -1;
}

//存储sessionStorage
export function setSto(name,val){
    return sessionStorage.setItem(name,val);
}

//获取sessionStorage
export function getSto(name){
    return sessionStorage.getItem(name);
}

//删除sessionStorage
export function rmSto(name){
    return sessionStorage.removeItem(name);
}

//删除所有sessionStorage
export function clSto(){
    return sessionStorage.clear();
}
//获取所有sessionStorage
export function allSto(){
    return sessionStorage;
}

//存储localStorage
export function setLto(name,val){
    return localStorage.setItem(name,val);
}

//获取sessionStorage
export function getLto(name){
    return localStorage.getItem(name);
}

//删除sessionStorage
export function rmLto(name){
    return localStorage.removeItem(name);
}

//删除所有sessionStorage
export function clLto(){
    return localStorage.clear();
}
//获取所有sessionStorage
export function allLto(){
    return localStorage;
}

//前一个页面的url
export function prevUrl(){
	return document.referrer;
}

export function classof(obj){
	if(obj===null){
		return 'Null';
	}
	if(obj===undefined){
		return 'Undefined';
	}
	return Object.prototype.toString.call(obj).slice(8,-1);
}

//获取购物车数量
export function cartCount(obj){
    var vipNo=getSto('vipNo');
    //购物车气泡显示
    var oNum=obj||$('.tab-wrap .car b');

    if(!vipNo){//如果未登录
        var tempCart=JSON.parse(getSto('tempCart'));
       
        if(!tempCart){
        	$(oNum).css('display','none');
        	return;
        }
        var num=0;
        tempCart.forEach(function(item,index){
            num+=parseInt(item.number);
        });
        if(tempCart){//有临时购物车
            $(oNum).css('display','block');
            $(oNum).text(num);
            if(num==0){
            	$(oNum).css('display','none');
            }else if(num>9){//如果数量大于9
                $(oNum).addClass('active');
                if(num>99){
                    $(oNum).text('99+');
                }
            }else{
                $(oNum).removeClass('active');
            }
        }else{//无临时购物车
            $(oNum).css('display','none');
        }
    }else{//如果登录
        var vipNo=getSto('vipNo');
        var token=getSto('token');
        $.ajax({
            type:'post',
            headers:signName(md5,vipNo,token),
            url:apiUrl+'/shoppingcart/goodsnum',
            data:{
                memberNo:vipNo
            },
            success:function(data){console.log('x:',data);
                if(data.head.code){
                    if(data.head.code==71982){
                        rmSto('nickname');
                        rmSto('timestamp');
                        rmSto('token');
                        rmSto('vipNo');
                        alert('出现错误，请重新登录！');
                        location.href='user-center.html';
                    }
                    return;
                }

                var len=data.body.number;
	            $(oNum).css('display','block');
	            $(oNum).text(len);

                if(len==0){
            		$(oNum).css('display','none');
	            }else if(len>9){//如果数量大于9
	                $(oNum).addClass('active');
	                if(len>99){
	                    $(oNum).text('99+');
	                }
	            }else{
	                $(oNum).removeClass('active');
	            }
            },
            error:function(err){
                console.log('err:',err);
            }
        });
    }
}

//获取结算数量
export function cartPayCount(arr){
    var vipNo=getSto('vipNo');
    var num=0;

    //购物车气泡显示
    var oNum=$('.cart>.cart-pay .pay-money i');
    
    arr.forEach(function(item,index){
    	if(item.selected){
    		num+=item.number;
    	}
    });
    $(oNum).text('('+num+')');
}

//菊花的显示和隐藏
export function showImgLayer(str){
    var timer=null;
    var oImg=$('.circle');  
    $(oImg).find('p').text(str);
    $(oImg).css('display','block');
    
    clearTimeout(timer);
    timer=setTimeout(function(){
        $(oImg).css('opacity',1);
    },50);
}
export function cancelImgLayer(){
    var timer=null;
    var timer1=null;
    var oImg=$('.circle');

    $(oImg).css('opacity',0);
    timer=setTimeout(function(){
        $(oImg).css('display','none');
    },550);
}

//数组去重
export function noRepeat(arr){
    var json={};
    var newArr=[];
    for(var i=0; i<arr.length; i++){
        
        if(json[arr[i]]){
            json[arr[i]]++;
        }else{
            json[arr[i]]=1;
        }
    }

    for(var name in json){
        newArr.push(name);
    }

    return newArr;
}

try {
    localStorage.setItem('safari','private mode');
}catch(e) {
    alert('请关闭浏览器的无痕模式!'); 
    console.log(e.message, e.name, e.stack);  // 输出错误信息
}