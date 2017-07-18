import '../css/public.css';
import '../css/find-details.css';
import $ from 'jquery';
import apiUrl from '../js/config';
import {rand,signName,reTop,tabBar,url_search,imgLazy,setSto,getSto,cartCount,rmSto,allSto,getLto,noRepeat,setLto,imgLazyForFind} from '../js/config';


var vipNo=sessionStorage.getItem("vipNo");
var ID=localStorage.getItem("deciveID");
var getUrl=apiUrl+'/article/recommended';
var sortId=[];
var styleId=[];
var materialId=[];
var priceId=[];
var targetId=[];
var labelId=[];
var keyVal='';//搜索关键字
var statusBtn=true;
var pageNum=1;
var pageSize=5;
var saleIndex;
var styleIndex;
var materialIndex;
var priceIndex;
var jsonData={
        type:4,
        pageNum:pageNum,
        pageSize:pageSize
    };

var iBtn=true;//控制分页器只布局一次的关


var temp=window.location.search;


(function(){
	//故事详情
	function dataRender(){
		var oWrap=$('.item-content');
		var oT=$('.title');
		var oUser=$('.item-title');
		var str='';

		$.ajax({
			url:apiUrl+'/article/detail',
			data:{
				articleId:url_search().id
			},
			success:function(data){
				var con=data.body.content;
					str=` <div class="wrap-title"><h2>${con.articleName}</h2>
		                        <span class="collect-count">
			                        <em></em>
			                        <i>${con.labelId}</i>
		                        </span> 
		                   </div>
		                   <div class="item-title">
	                          	 <h3>
		                            <img src=${con.avatar} alt="">
		                            <b>${con.nickName}</b>
		                            <em>${con.created}</em>
		                            <a>${con.articleLabel}</a>
	                           	</h3>
		                   </div>`;
	             $(oT).html(str);
	             $(oWrap).html(con.articleInfo);	
			},
			error:function(err){
				console.log(err);
			}
		});
	}
	dataRender();


	// 推荐文章
	var oRecom=$(".right-recommend ul");
    var str='';

    $.ajax({
        type:'get',
        url:getUrl,
        data:{
        	articleId:url_search().id
        },
        success:function(data){
            if(data.head.code){
                console.log(data.head.message);
            }
            var data=data.body;
            console.log(data);
            data.goodsVoList.forEach(function(item,index){
                str+=`<li class="item-recommend">
                            <p><a href="find-details.html?id=${item.id}"><img src=${item.cover}></a></p>
                            <h6>${item.title}</h6>
                            <p><span>${item.publishTime}</span><em>${item.labels}</em></p>
                        </li>`;
            });
            $(oRecom).html(str);

             /////点击推荐文章
            (function(){
                var aLi=$('.right-recommend>ul>li');
                aLi.each(function(index,item){
                    $(item).on('click',function(){
                        keyVal=$(item).text();
                        targetId=[];
                        labelId=[];
                        sortId=[];
                        styleId=[];
                        materialId=[];
                        priceId=[];
                        pageNum=1;
                        jsonData={
                            type:1,
                            pageNum:pageNum,
                            pageSize:pageSize,
                            keyWord:$(item).text()
                        };
                        dataRender();//页面布局
                        //window.location.href=encodeURI(encodeURI('result.html?id='+$(item).get(0).id+'&name='+$(item).text()));
                    });
                });
            })();
        },
        error:function(err){
            console.log(err);
        }
    });

})();















