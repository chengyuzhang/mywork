import '../css/public.css';
import '../css/center-set.css';
import $ from 'n-zepto';
import {rand,signName,reTop,getSto,rmSto,imgLazy} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

//删除订单详情页面的记录上一个地址
if(getSto('prevurl')){
	rmSto('prevurl');
}

var vipNo=getSto('vipNo');

//退出账号
(function(){
	$('.logout-btn').on('click',function(){
		sessionStorage.clear();
		location.href='index.html';
	});
})();

//联系客服
(function(){
	$('.normal>span').on('click',function(){
		location.href='jump.html';
	});
})();