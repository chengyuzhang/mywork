import '../css/public.css';
import '../css/index.css';
import $ from 'n-zepto';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,imgLazy,setSto,getSto,cartCount,rmSto,allSto} from '../js/config';
import md5 from 'md5';

console.log(allSto());
//删除商品详情前一面地址的记录
rmSto('goods-prevurl');

//上滑返回顶部
(function(){
    var oWrap=$('.index-wrap');

    reTop(oWrap);
    
})();

//底部导航栏显示隐藏
(function(){
    tabBar();
})();

//购物车数量
cartCount();

////////////////////////////////////////////////////发现块///////////////////////////////////////////////////////////

//检测IOS的QQ浏览器版本
var phoneType=navigator.userAgent.indexOf('iPhone');
var userA=navigator.userAgent;

if(userA.search(/iPhone/)!=-1){
    var arr=userA.split(' ');
    var browserType='';
    for(var i=0; i<arr.length; i++){
        (function(index){
            if(arr[index].search(/MQQBrowser\//)!=-1){
                browserType=arr[index].split('/')[1].split('.')[1];
                
                if(parseFloat(browserType)<4){
                    alert('请升级最新版本QQ浏览器来体验完整功能~');
                }
            }
        })(i);
    }
}

//页面首次打开的唯一标识
(function(){
    var ID=getSto("deciveID");
    var rnd=rand(rand(1,100),rand(1,10000));
    if(!ID){
        var timestamp=Date.now()+new Date(rnd);
        var md5_timestamp=md5(timestamp);
        
        setSto("deciveID",md5_timestamp);
        $.ajax({
            url:apiUrl+'/random?random='+md5_timestamp,
            success:function(data){
                
            },
            error:function(err){
                console.log(err);
            }
        });
    }else{
        $.ajax({
            url:apiUrl+'/random?random='+ID,
            success:function(data){
                
            },
            error:function(err){
                console.log(err);
            }
        });
    }

})();

//从服务器获取数据
(function(){
    var oLoop=$('.index-loop .swiper-wrapper');//轮播图
    var sLoop='';
    var aSign=$('.goods-type ul li');//标签
    var oKind=$('.kind-wrap');
    var sKind='';

    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryTopicAndLabel',
        success:function(data){
            if(data.head.code){
                console.log(data.head.message);
            }

            var data=data.body;
            
            //展示轮播图
            data.carousels.forEach(function(item,index){
                sLoop+=`<div class="swiper-slide" data-id=${item.id}><img src="" data-src=${item.mainPicture} alt=""><a href="series-topic.html?id=${item.id}"></a></div>`;
            });
            
            oLoop.html(sLoop);

            //首页内容里的轮播
            (function(){
                var swiper3 = new Swiper('#swiper-container3', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay:3000,
                    loop:true,
                    autoplayDisableOnInteraction : false,
                });
                //图片懒加载
                (function(){
                    var aImg=$('.index-loop img');
                    imgLazy(aImg);
                })();
            })();

            //展示标签
            data.labels.forEach(function(item,index){
                $(aSign[index]).attr('data-id',item.id);
                $(aSign[index]).find('p').text(item.labelContent);
            });

            //专题列表展示
            data.topicBody.forEach(function(item0,index){
                if(index==0){
                    $('.recommend-block a').attr('href','series-topic.html?id='+item0.topic.id);
                }else if(index>=1){
                    sKind+=`<div class="gife-kind">`;         
                    sKind+='<h2><img src="" data-src="'+require('../imgs/pic-title'+index+'.png')+'" alt=""></h2>';
                    sKind+=`<div><img src="" data-src=${item0.topic.mainPicture} alt=""><a href="series-topic.html?id=${item0.topic.id}"></a></div><ul>`;
                            if(item0.item){
                                item0.item.forEach(function(item1,index1){
                                sKind+=`<li>
                                        <img src="" data-src=${item1.mainPicture} alt="">
                                        <p>${item1.title}</p>
                                        <em>${item1.subTitle}</em>
                                        <a href="goods-detail.html?id=${item1.goodsId}"></a>
                                    </li>`;
                                });
                            }
                            
                    sKind+=`</ul></div>`;
                }
                
            });
            $(oKind).html(sKind);

            //图片懒加载
            (function(){
                var aImg=$('.gife-kind img');
                imgLazy(aImg);
            })();
        },
        error:function(err){
            console.log(err);
        }
    });
})();

//商品列表
(function(){
    var oCon=$('.goods-gife-list');
    var str='';
    var pageNum=1;
    var pageSize=10;

    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryHomeGoodsByPage',
        data:{
            type:1,
            pageNum:pageNum,
            pageSize:pageSize
        },
        success:function(data){
            if(data.head.code){
                console.log(data.head.message);
            }
            
            var data=data.body;

            init(str,data.goodsVoList,oCon);
            
        },
        error:function(){

        }
    });

    load(str,$('.index-wrap'));

    function init(str,arr,obj){
        //console.log(arr);
        //console.log('str:',str);
        arr.forEach(function(item,index){
            str+=`<li class="goods-gife-item">`;
            str+=`<img src="" alt="" data-src=${item.goodsPicture}>
                <div>
                    <p>${item.shortName}</p>
                    <em>￥${item.salePrice}</em>
                </div>
                <a href=goods-detail.html?id=${item.id}></a>`;
            str+=`</li>`;
        });
        $(obj).html(str);
        //图片懒加载
        (function(){
            var aImg=$('.guess-like img');
            imgLazy(aImg);
        })();
    }

    function refresh(str,arr,obj){
        //console.log(arr);
        //console.log('str:',str);
        arr.forEach(function(item,index){
            str+=`<li class="goods-gife-item">`;
            str+=`<img src="" alt="" data-src=${item.goodsPicture}>
                <div>
                    <p>${item.shortName}</p>
                    <em>￥${item.salePrice}</em>
                </div>
                <a href=goods-detail.html?id=${item.id}></a>`;
            str+=`</li>`;
        });
        $(obj).append(str);
        //图片懒加载
        (function(){
            var aImg=$('.guess-like img');
            imgLazy(aImg);
        })();
    }

    //上滑加载
    function load(str,obj){
        var oWrap=$(obj);//获取滚动元素
        var oRe=$('.refresh');
        var iHScreen=window.screen.availHeight;//获取屏幕高度

        var iNum=0;//记录第一次到最后一条数据时的页数
        var iBtnNum=0;
        var timer=null;
        var timer1=null;
        var timer2=null;
        var startY=0;
        var moveY=0;

        //判断上滑
        oWrap.on('touchstart',function(ev){
            startY=ev.changedTouches[0].pageY;
        });
        oWrap.on('touchmove',function(ev){
            moveY=ev.changedTouches[0].pageY;
            //document.title=startY-moveY;
        });

        oWrap.on('scroll',function(){
            var oLi=$('.guess-like'+' li:nth-last-of-type(1)');//获取最后一个内容块
            var t=0;//最后一个内容块距离页面最顶部的距离
        
            if(oLi.length){
                t=oLi.offset().top;
            }else{
                return;
            }

            if((startY-moveY)>=0&&t<iHScreen+100){
                clearTimeout(timer);
                timer=setTimeout(function(){
                    pageNum++;
                    clearTimeout(timer2);
                    $(oRe).html('正在加载中...');
                    $(oRe).css('bottom',0);
                    $.ajax({
                        type:'get',
                        url:apiUrl+'/home/queryHomeGoodsByPage',
                        data:{
                            type:1,
                            pageNum:pageNum,
                            pageSize:pageSize
                        },
                        success:function(data){
                            if(data.head.code){
                                console.log('数据返回错误！');
                                return;
                            }
                            var data=data.body;
                            if(!data.end){
                                refresh(str,data.goodsVoList,$('.goods-gife-list'));
                                //$(oRe).html('本次加载完成！');
                                timer2=setTimeout(function(){
                                    $(oRe).css('bottom','-1rem');
                                },2000);
                                iBtnNum=0;
                            }else{
                                if(!iBtnNum){
                                    refresh(str,data.goodsVoList,$('.goods-gife-list'));
                                }
                                iBtnNum++;
                                iNum=pageNum-1;
                                pageNum=iNum;
                                $(oRe).html('已经到末尾咯~');
                                $(oRe).css('bottom',0);
                                clearTimeout(timer1);
                                timer1=setTimeout(function(){
                                    $(oRe).css('bottom','-1rem');
                                },2000);
                            }

                            //图片懒加载
                            (function(){
                                var aImg=$('.guess-like img');
                                imgLazy(aImg);
                            })();
                        }
                    });
                },1000);
            }

        });
    }

})();

//首页开屏
(function(){
    var oTips=$('.tips');
    var oText=$('.tips>span');
    var oJump=$('.img-wrap span');
    var timer=null;
    var timer1=null;
    var timer2=null;
    var timer3=null;
    var num=3;
    var tipSign=getSto("tipSign");
    var ID=getSto("deciveID");

    if(tipSign){
        return;
    }else{
        timer1=setTimeout(function(){
            $(oTips).css('display','block');
        },50);

        $(oTips).css('opacity',1);
    }
    setSto("tipSign","true");
    //自动消失
    timer=setInterval(function(){
        num--;
        $(oText).text('跳过 '+num+'s');
        if(num==0){
            $(oTips).css('opacity',0);
            
            num=3;
            clearInterval(timer);
        }
    },1000);
    timer2=setTimeout(function(){
        $(oTips).css('display','none');
    },4000);

    //点击消失
    $(oText).on('click',function(){
        clearInterval(timer);
        clearTimeout(timer2);
        $(oTips).css('opacity',0);
        setSto("tipSign","true");
        num=3;
        timer3=setTimeout(function(){
            $(oTips).css('display','none');
        },500);
    });
})();

//点击优惠券判断是否登录及登录后续
(function(){
    var oBtn=$('.coupon-block');
    var vipNo=getSto('vipNo');
    var oLogCon=$('.opacity');
    var oImg=$('.login>li>img');
    var ID=getSto("deciveID");
    
    $(oImg).on('click',function(){
        $(this).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
    });

    oBtn.on('click',function(){
        if(vipNo){
            console.log('yes');
        }else{
            oLogCon.css('display','block');
            setTimeout(function(){
                oLogCon.css('opacity',1);
                $(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
            },50);
        }
    });
})();


//验证手机号获取验证码
(function(){
    var oBtn=$('.login>li>button');
    var num=60;
    var timer=null;
    var iBtn=true;
    var reg = /^((1[0-9]{1})+\d{9})$/;

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
    var ID=getSto("deciveID");

    oLogin.on('click',function(){
        var iSign=$('.sign').val();
        var iTel=$('.tel').val();
        var iCode=$('.code').val();
        var oP=$('.opacity');

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
                    setSto("token",data.body.token);
                    setSto("vipNo",vipNo);
                    setSto("nickname",data.body.nickName);

                    $(oBtn).css('display','block');
                    
                    oP.css('opacity',0);
                    setTimeout(function(){
                        oP.css('display','none');
                    },510);

                    cartCount();
                },
                error:function(err){
                    console.log(err);
                }
            });
        }
    });
})();

function imgPos(aImg){
    aImg.forEach(function(item,index){
        var iW='';
        var iH='';
        var iHeight=$('.public li.item>section.block>a>div.img-wrap').height();
        var iWidth=$('.public li.item>section.block>a>div.img-wrap').width();

        $(item).get(0).onload=function(){
            iW=$(item).get(0).offsetWidth;
            iH=$(item).get(0).offsetHeight;
            
            if(iW/iH>1.675){
                $(item).css({
                    'height':iHeight,
                    'left':'50%',
                    'margin-left':-iW*iHeight/iH/2
                });
            }else{
                $(item).css({
                    'width':iWidth,
                    'top':'50%',
                    'margin-top':-iH*iWidth/iW/2
                });
            }
        };
    });
}
