import '../css/public.css';
import '../css/goods-info.css';
import $ from 'n-zepto';
import {rand,signName,getSto,setSto,url_search,rmSto,prevUrl} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';
var vipNo=getSto('vipNo');

//返回前一个页面
(function(){
    $('header>a').attr('href',prevUrl());
})();

//展示商品列表
var oGoodsWrap=$('.goods-wrap');//商品列表外层
var sGoods='';

$.ajax({
    type:'post',
    url:apiUrl+'/shoppingcart/settlement',
    contentType:'application/json',
    data:JSON.stringify({
        memberNo:vipNo,
        goodsList:JSON.parse(getSto('tempOrderCart'))
    }),
    success:function(data){
        if(data.head.code){
            console.log(data.head.message);
            return;
        }
        console.log(data);
        var data=data.body;
        
        data.goodsList.forEach(function(item,index){
            sGoods+=`<div class="pic-info">
                <img src=${item.picture} alt="">
                <ul>
                    <li class="style"><p>${item.shortName}</p></li>`;
                    if(item.accessoryLength){
                        sGoods+=`<li class="ornament"><span>配饰：</span><em>${item.accessoryLength}</em></li>`;
                    }
                    sGoods+='<li class="price"><span>￥'+parseInt(item.salePrice)+'</span><em><i>x</i>'+item.number+'</em></li>';
                    if(item.comment!=''){
                       sGoods+=`<li class="remark"><span>备注：</span><em>${item.comment}</em></li>`;
                    }
                sGoods+=`</ul>
            </div>`;
        });
        $(oGoodsWrap).html(sGoods);
    },
    error:function(){}
});
