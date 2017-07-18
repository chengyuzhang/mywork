import '../css/public.css';
import '../css/ok-order.css';
import $ from 'n-zepto';
import {rand,signName,getSto,setSto,url_search,rmSto,prevUrl,allSto} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';
var vipNo=getSto('vipNo');
console.log(allSto());
//返回前一个页面
(function(){
    console.log('x:d',url_search(prevUrl()));
    if(url_search(prevUrl()).from){console.log(111);//从购物车来
        setSto('prev_url',prevUrl());
        $('header>a').attr('href',prevUrl());
    }else if(url_search(prevUrl()).to){console.log(222);//从修改地址来
        $('header>a').attr('href','cart.html?from=cart');
    }else if(url_search().to=='ok-order'){
        $('header>a').attr('href',prevUrl());
    }
})();

//判断登录与否
if(!vipNo){//未登录
	var oLogCon=$('.opacity1');
	var oImg=$('.login>li>img');
	var ID=getSto("deciveID");
	oLogCon.css('display','block');
    setTimeout(function(){
        oLogCon.css('opacity',1);
        $(oImg).get(0).src=apiUrl+'/pic?t='+Date.now()+'&random='+ID;
    },50);
}else{//登录
    //展示收货地址
    var token=getSto('token');
    var vipNo=getSto('vipNo');
    (function(){
        var oGeter=$('.geter span');
        var oTel=$('.geter em');
        var oAddress=$('.detail-adress p');
        //var temp=window.location.search;
        var addressID='';

        if(!url_search().vipId){
            addressID=getSto("addressID");
            if(!addressID){
                addressID=0;
            }
        }else{
            addressID=url_search().vipId;
        }

        $('.jump').attr('href','manage-address.html?type='+url_search().type+'&f='+url_search().f+'&to=manage-address&jump=true&vipId='+addressID);
        
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

    
    //展示商品列表
    var oGoodsWrap=$('.goods-wrap');//商品列表外层
    var sGoods='';
    var iTotalPrice=0;

    $.ajax({
        type:'post',
        headers:signName(md5,vipNo,token),
        url:apiUrl+'/shoppingcart/settlement',
        contentType:'application/json',
        data:JSON.stringify({
            memberNo:vipNo,
            goodsList:url_search().type=='2'?JSON.parse(getSto('tempOrderCart')):JSON.parse(getSto('tempOrderPay'))//判断数据是从购物车来还是从立即购买来
        }),
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
                location.href='cart.html?from=cart';
                return;
            }

            var data=data.body;
            var len=data.goodsList.length;
            
            if(!data.coupon){
                $('.coupon').css('display','none');
            }

            if(len<3){
                data.goodsList.forEach(function(item,index){
                    sGoods+=`<div class="pic-info">
                        <img src=${item.picture} alt="">
                        <ul>
                            <li class="style"><p>${item.shortName}</p></li>`;
                            if(item.accessoryLength){
                                sGoods+='<li class="ornament"><span>配饰：</span><em>'+item.accessoryLength+'</em></li>';
                            }
                            
                            sGoods+='<li class="price"><span>￥'+parseInt(item.salePrice)+'</span><em><i>x</i>'+item.number+'</em></li>';
                            if(item.comment!=''){
                                sGoods+='<li class="remark"><span>备注：</span><em>'+item.comment+'</em></li>';
                            }
                        sGoods+=`</ul>
                    </div>`;
                    iTotalPrice+=parseFloat(item.salePrice)*item.number;
                });
            }else{
                sGoods+=`<div class="goods-more"><h2>商品信息</h2><ul>`;

                data.goodsList.forEach(function(item,index){
                    sGoods+=`<li><img src=${item.picture}></li>`;
                    iTotalPrice+=parseFloat(item.salePrice)*item.number;
                });

                sGoods+=`</ul>
                    <div>
                        <p>共${len}件</p>
                        <span></span>
                    </div>
                    <a href="goods-info.html?to=goods-info"></a>
                </div>`;
            }
            sGoods+=`<p><span></span><em>顺丰快递</em><em>免运费</em></p>`;

            $(oGoodsWrap).html(sGoods);
            //rmSto('tempOrderCart');
            console.log('iTotalPrice:',iTotalPrice);
            //优惠券
            (function(){
                var oPacity=$('.opacity');
                var oText=$('.coupon input');
                var oCouponPrice1=$('.coupon em');
                var oCouponPrice2=$('.coupon-price em');
                var oGoosPrice=$('li.goods-price>em');
                var oLastPrice=$('.pay span');
                var text='';
                //var iPrice=sessionStorage.getItem("order-money").slice(1);
                $(oGoosPrice).text('￥'+iTotalPrice);
                $(oLastPrice).text('支付金额：￥'+iTotalPrice);

                oText.on('input',function(){
                    var val=$(this).val();
                    if(val.length<9){
                        text=val;
                        $(oCouponPrice1).text('-￥00');
                        $(oCouponPrice2).text('-￥00');
                        $(oLastPrice).text('支付金额：￥'+parseInt(iTotalPrice));
                    }else{
                        $(oText).val(text);
                    }
                    if(val.length==8){
                        $(oText).blur();
                        $.ajax({
                            type:'get',
                            headers:signName(md5,vipNo,token),
                            url:apiUrl+'/order/coupons?coupon='+val,
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
                                    $(oLastPrice).text('支付金额：￥'+iTotalPrice);

                                    return;
                                }
                                var item=data.body.coupons[0];
                                $(oCouponPrice1).text('-￥'+item.couponPrice);
                                $(oCouponPrice2).text('-￥'+item.couponPrice);
                                $(oLastPrice).text('支付金额：￥'+(iTotalPrice-item.couponPrice));
                            },
                            error:function(err){
                                console.log(err);
                            }
                        });
                    }
                });

            })();
        },
        error:function(){}
    });
}

//提交订单
var sName='';//发票抬头
(function(){
    var oBtn=$('.pay>button');//提交订单按钮
    var token=getSto('token');
    $('.pay>button').on('click',function(){
        console.log('memberNo:',vipNo,'-addressId:',getSto('addressID'),'-coupon:',$('.coupon input').val(),'-comment:',$('.pay-detail>ul>li.words>textarea').val(),'-source:',url_search().type+'-goodsList:',JSON.parse(getSto('tempOrderCart')));
        console.log('sname:',sName);

        $.ajax({
            type:'post',
            headers:signName(md5,vipNo,token),
            url:apiUrl+'/shoppingcart/order',
            contentType:'application/json',
            data:JSON.stringify({
                memberNo:getSto('vipNo'),
                addressId:getSto('addressID'),
                payType:1,
                coupon:$('.coupon input').val(),
                comment:$('.pay-detail>ul>li.words>textarea').val(),//订单评论
                invoiceContent:sName,
                source:url_search().type,
                //goodsList:JSON.parse(getSto('tempOrderCart'))
                goodsList:url_search().type=='2'?JSON.parse(getSto('tempOrderCart')):JSON.parse(getSto('tempOrderPay'))
            }),
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
                //调用支付宝
                $.ajax({
                    type:'post',
                    headers:signName(md5,vipNo,token),
                    url:apiUrl+'/shoporder/pay',
                    data:{
                        memberNo:getSto('vipNo'),
                        orderNo:data.body.orderNo
                    },
                    success:function(data){console.log('c:',data);
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
            },
            error:function(){

            }
        });
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
    var ID=getSto("deciveID");

    oLogin.on('click',function(){
        var iSign=$('.sign').val();
        var iTel=$('.tel').val();
        var iCode=$('.code').val();
        var oP=$('.opacity1');

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
                    
                    oP.css('opacity',0);
                    setTimeout(function(){
                        oP.css('display','none');
                    },510);

                    //展示收货地址
                    (function(){
                        var oGeter=$('.geter span');
                        var oTel=$('.geter em');
                        var oAddress=$('.detail-adress p');
                        //var temp=window.location.search;
                        var addressID='';

                        if(!url_search().vipId){
                            addressID=getSto("addressID");
                            if(!addressID){
                                addressID=0;
                            }
                        }else{
                            addressID=url_search().vipId;
                        }

                        $('.jump').attr('href','manage-address.html?type='+url_search().type+'&f='+url_search().f+'&to=manage-address&jump=true&vipId='+addressID);
                        
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
                                    console.log(data.head.message);
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

                    //展示商品列表
                    var oGoodsWrap=$('.goods-wrap');//商品列表外层
                    var sGoods='';
                    var iTotalPrice=0;

                    $.ajax({
                        type:'post',
                        url:apiUrl+'/shoppingcart/settlement',
                        contentType:'application/json',
                        data:JSON.stringify({
                            memberNo:vipNo,
                            goodsList:url_search().type=='2'?JSON.parse(getSto('tempOrderCart')):JSON.parse(getSto('tempOrderPay'))
                        }),
                        success:function(data){
                            if(data.head.code){
                                alert(data.head.message);
                                location.href=prevUrl();
                                return;
                            }
                            console.log('ss:',data);
                            var data=data.body;
                            var len=data.goodsList.length;
                            
                            if(!data.coupon){
                                $('.coupon').css('display','none');
                            }
                            
                            if(len<3){
                                data.goodsList.forEach(function(item,index){
                                    sGoods+=`<div class="pic-info">
                                        <img src=${item.picture} alt="">
                                        <ul>
                                            <li class="style"><p>${item.shortName}</p></li>`;
                                            
                                            if(item.accessoryLength){
                                                sGoods+='<li class="ornament"><span>配饰：</span><em>'+item.accessoryLength+'</em></li>';
                                            }
                                            sGoods+='<li class="price"><span>￥'+parseInt(item.salePrice)+'</span><em><i>x</i>'+item.number+'</em></li>';
                                            if(item.comment!=''){
                                                sGoods+='<li class="remark"><span>备注：</span><em>'+item.comment+'</em></li>';
                                            }
                                        sGoods+=`</ul>
                                    </div>`;
                                    iTotalPrice+=parseFloat(item.salePrice)*item.number;
                                });
                            }else{
                                sGoods+=`<div class="goods-more"><h2>商品信息</h2><ul>`;

                                data.goodsList.forEach(function(item,index){
                                    sGoods+=`<li><img src=${item.picture}></li>`;
                                    iTotalPrice+=parseFloat(item.salePrice)*item.number;
                                });

                                sGoods+=`</ul>
                                    <div>
                                        <p>共${len}件</p>
                                        <span></span>
                                    </div>
                                    <a href="goods-info.html?to=goods-info"></a>
                                </div>`;
                            }
                            sGoods+=`<p><span></span><em>顺丰快递</em><em>免运费</em></p>`;

                            $(oGoodsWrap).html(sGoods);
                            //rmSto('tempOrderCart');
                            console.log('iTotalPrice:',iTotalPrice);
                            //优惠券
                            (function(){
                                var oPacity=$('.opacity');
                                var oText=$('.coupon input');
                                var oCouponPrice1=$('.coupon em');
                                var oCouponPrice2=$('.coupon-price em');
                                var oGoosPrice=$('li.goods-price>em');
                                var oLastPrice=$('.pay span');
                                var text='';
                                //var iPrice=sessionStorage.getItem("order-money").slice(1);
                                $(oGoosPrice).text('￥'+iTotalPrice);
                                $(oLastPrice).text('支付金额：￥'+iTotalPrice);

                                oText.on('input',function(){
                                    var val=$(this).val();
                                    if(val.length<9){
                                        text=val;
                                        $(oCouponPrice1).text('-￥00');
                                        $(oCouponPrice2).text('-￥00');
                                        $(oLastPrice).text('支付金额：￥'+iTotalPrice);
                                    }else{
                                        $(oText).val(text);
                                    }
                                    if(val.length==8){
                                        $(oText).blur();
                                        $.ajax({
                                            type:'get',
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
                                                        $(oPacity).css('display','n one');
                                                    },1650);

                                                    $(oCouponPrice1).text('-￥00');
                                                    $(oCouponPrice2).text('-￥00');
                                                    $(oLastPrice).text('支付金额：￥'+iTotalPrice);

                                                    return;
                                                }
                                                var item=data.body.coupons[0];
                                                $(oCouponPrice1).text('-￥'+item.couponPrice);
                                                $(oCouponPrice2).text('-￥'+item.couponPrice);
                                                $(oLastPrice).text('支付金额：￥'+(iTotalPrice-item.couponPrice));
                                            },
                                            error:function(err){
                                                console.log(err);
                                            }
                                        });
                                    }
                                });

                            })();
                        },
                        error:function(){}
                    });

                },
                error:function(err){
                    console.log(err);
                }
            });
        }
    });
})();

//开具发票
(function(){
    var oInvoiceBtn=$('.pay-detail .ticket>span');//发票按钮
    var oInvoiceWrap=$('.invoice');//发票弹层外层
    var aInvoiceWrapBtn=$('.invoice .con li')//弹层的按钮
    
    //点击发票的按钮
    $(oInvoiceBtn).on('click',function(){
        if(this.dataset.btn=='false'){
            //$(this).addClass('active');
            //this.dataset.btn='true';
            $(oInvoiceWrap).css('display','block');
            setTimeout(function(){
                $(oInvoiceWrap).css('opacity',1);
            },50);

        }else{
            $(this).removeClass('active');
            this.dataset.btn='false';
            $('.pay-detail .ticket>div>h2').css('color','#666');
            $('.pay-detail .ticket ol').css('display','none');
            $('.pay-detail .ticket>div>p').css('display','block');
        }
    });

    //点击取消的按钮
    $(aInvoiceWrapBtn).eq(0).on('click',function(){
        $(oInvoiceWrap).css('opacity',0);
        setTimeout(function(){
            $(oInvoiceWrap).css('display','none');
        },550);
    });
    //点击确认的按钮
    $(aInvoiceWrapBtn).eq(1).on('click',function(){

        $(oInvoiceBtn).addClass('active');
        $(oInvoiceBtn).get(0).dataset.btn='true';
        sName=$('.invoice .reason input').val();//获取发票抬头信息
        $('.pay-detail .ticket ol li.invoice-header em').text(sName);
        $('.pay-detail .ticket>div>h2').css('color','#333');
        $('.pay-detail .ticket ol').css('display','block');
        $('.pay-detail .ticket>div>p').css('display','none');
        $(oInvoiceWrap).css('opacity',0);
        setTimeout(function(){
            $(oInvoiceWrap).css('display','none');
        },550);

        console.log(sName);
    });
})();

//客服
(function(){
    $('.normal>span').on('click',function(){
        location.href='jump.html';
    });
})();

