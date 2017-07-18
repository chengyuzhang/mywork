import '../css/public.css';
import '../css/search.css';
import $ from 'n-zepto';
//接口地址
import apiUrl from '../js/config';
import {rand,signName,reTop,url_search,noRepeat,rmSto} from '../js/config';
import md5 from 'md5';

//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();

//从哪来回哪去的页面返回
// (function(){
//     switch(url_search().from){
        
//         case 'find':
//             $('.search-bar>span>a').attr('href','find.html');
//         break;
//     }
// })();

//清空搜索
(function(){
	var oBtn=$('.search-cancel');
	var oText=$('.search-input');
	oBtn.on('click',function(){
		$(oText).val('');
		$(oText).get(0).focus();
	});
})();

//热门标签
(function(){
	var oWrap=$('.hot>ul');
	var str='';
	$.ajax({
		url:apiUrl+'/article/label',
		success:function(data){
			var arr=data.body.labels;
			
			arr.forEach(function(item,index){
				str+='<li id='+item.id+'>'+item.labelContent+'</li>'
			});
			oWrap.html(str);

			//点击热门标签
			(function(){
				var aLi=$('.hot>ul>li');
				aLi.forEach(function(item,index){
					$(item).on('click',function(){
						window.location.href=encodeURI(encodeURI('result.html?id='+$(item).get(0).id+'&name='+$(item).text()));
					});
				});
			})();
		},
		error:function(err){
			console.log(err);
		}
	});
})();

//推荐文章
(function(){
	var oWrap=$('.recomand-article>ul');
	var str='';
	$.ajax({
		url:apiUrl+'/article/recommended',
		success:function(data){
			
			var arr=data.body.goodsVoList;

			arr.forEach(function(item,index){
				str+='<li id='+item.id+' class="item"><section class="block">';
                //str+='<img class="show-pic" src="'+item.cover+'" alt=""><h2 class="title">'+item.title+'</h2>';
                str+='<a href="detail.html?from=search&id='+item.id+'"><div class="img-wrap"><img class="show-pic" src="'+item.cover+'" ></div>';
                str+='<h2 class="title">'+item.title+'</h2>';
                str+='<div class="item-foot"><span class="time">'+item.publishTime+'</span><em class="kind">'+item.labels+'</em>';
                str+='</div></a></section></li>';
			});

			oWrap.html(str);
			var aImg=$('.show-pic');
			imgPos(aImg);
		},
		error:function(err){
			console.log(err);
		}
	});
})();

//搜索//////////////////////////////////////////////////////////////////////////////////
(function(){
	var iLogin=true;//判断登录条件
	var oInput=$('.search-input');
	var oUl=$('.history ul');
	var oSearchBtn=$('.search-bar>a');
	var vipNo=sessionStorage.getItem("vipNo");
	var token=sessionStorage.getItem("token");
	
	if(parseInt(vipNo)){//登录
		//添加搜索记录
		oInput.focus();
		$(oSearchBtn).on('click',function(){
			
				var val=oInput.val();
				if(val!=''){
					
					$.ajax({
						url:apiUrl+'/user/search/add?memberNo='+vipNo+'&searchContent='+val+'&businessCase=1',
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
							window.location.href=encodeURI(encodeURI('search-result.html?keyword='+val));
						},
						error:function(err){
							console.log(err);
						},
					});
					
				}else{
					alert('搜索内容不能为空');
				}
			
		});

		//显示搜索记录
		var str='';
		$.ajax({
			url:apiUrl+'/user/search/get?memberNo='+vipNo+'&businessCase=1',
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
				var arr=data.body.searchs;
				
				arr.forEach(function(item,index){
					str+='<li>';
					str+='<i></i><span>'+item.searchContent+'</span><a id='+item.id+' href="javascript:;"></a>';
			        str+='</li>';
				});
				oUl.html(str);

				var aImg=$('.show-pic');
				imgPos(aImg);

				//点击搜索结果
				(function(){
					var aLi=$('.history>ul>li');

					aLi.forEach(function(item,index){
						$(item).on('click',function(){
							window.location.href=encodeURI(encodeURI('search-result.html?keyword='+$(item).find('span').text()));
						});
					});
				})();

				//如果搜索记录为小于2条时不显示“展开全部”和“清除历史记录”
				if($('.history ul>li').length<=2){
					$('.show-all').css('display','none');
				}

				//如果搜索记录为0时不显示“展开全部”和“清除历史记录”
				if($('.history ul>li').length==0){
					$('.clear-record').css('display','none');
				}

				//如果搜索记录条数大于0，显示“清除历史记录”
				if($('.history ul>li').length>0){
					$('.clear-record').css('display','block');
				}

				//如果搜索记录条数大于2，显示“全部展示”
				if($('.history ul>li').length>2){
					oUl.height('.72rem');
					$('.show-all').css('display','block');
					$('.clear-record').css('display','none');
				}

				//展开全部
				$('.show-all').on('click',function(){
					var h=$('.history ul>li').length*$('.history ul>li').eq(0).height();
					$(this).css('display','none');
					oUl.css('height',h);
					$('.clear-record').css('display','block');
					setTimeout(function(){
						oUl.css('height','auto');
					},300);
				});
				
				//清除历史记录
				$('.clear-record').on('click',function(){
					$.ajax({
						url:apiUrl+'/user/search/delete?searchId=0'+'&memberNo='+vipNo+'&businessCase=1',
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
							if(data.body.status){
								$('.history ul>li').remove();//删除全部列表项
								$('.show-all').css('display','none');
								$('.clear-record').css('display','none');
								oUl.height('auto');
							}
						},
						error:function(err){
							console.log(err);
						}
					});
					
				});

				//删除项
				var aDel=$('.history ul>li>a');
				aDel.forEach(function(item,index){
					$(item).on('click',function(ev){
						$.ajax({
							url:apiUrl+'/user/search/delete?searchId='+item.id+'&memberNo='+vipNo+'&businessCase=1',
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
								if(data.body.status){
									$(item).parent().remove();//删除元素节点
									if($('.history>ul>li').length<=2){
										$('.show-all').css('display','none');
										oUl.css('height','auto');
									}
									if($('.history>ul>li').length==0){
										$('.clear-record').css('display','none');
									}
								}
							},
							error:function(err){
								console.log(err);
							}
						});
						ev.stopPropagation();
					});
				});
			},
			error:function(err){
				console.log(err);
				$('.clear-record').css('display','none');
				$('.show-all').css('display','none');
			}
		});
	}else{//未登录
		var aSearchRecord;
		oInput.focus();
		showRecord();

		oInput.on('focus',function(){
			
			aSearchRecord=JSON.parse(localStorage.getItem('searchRecord'));//获取搜索记录
			showRecord();
		});

		$(oSearchBtn).on('click',function(ev){
			
				var val=oInput.val();
				if(classof(aSearchRecord)=='Null'){
					aSearchRecord=[];
				}
				if(val!=''){
					aSearchRecord.push(val);
					aSearchRecord=noRepeat(aSearchRecord);//去重
					localStorage.setItem('searchRecord',JSON.stringify(aSearchRecord));//存储搜索记录
					window.location.href=encodeURI(encodeURI('search-result.html?keyword='+val));
				}
				
			
		});

		//展示搜索记录列表
		function showRecord(){
			aSearchRecord=JSON.parse(localStorage.getItem('searchRecord'));//获取搜索记录
			if(aSearchRecord){
				createRecordList(aSearchRecord);
			}
		}

		//生成搜索记录列表
		function createRecordList(arr){
			var str='';
			arr.forEach(function(item,index){
				str+='<li>';
				str+='<i></i><span>'+item+'</span><a href="javascript:;"></a>';
		        str+='</li>';
			});
			oUl.html(str);

			//点击搜索结果
			(function(){
				var aLi=$('.history>ul>li');
				
				aLi.forEach(function(item,index){
					$(item).on('click',function(){
						window.location.href=encodeURI(encodeURI('search-result.html?keyword='+$(item).find('span').text()));
					});
				});
			})();

			//如果搜索记录条数大于0，显示“清除历史记录”
			if($('.history ul>li').length>0){
				$('.clear-record').css('display','block');
			}
			//如果搜索记录条数大于2，显示“全部展示”
			if($('.history ul>li').length>2){
				oUl.height('.72rem');
				$('.show-all').css('display','block');
				$('.clear-record').css('display','none');
			}
			del();
		}

		//删除搜索记录
		function del(){
			var aDel=$('.history ul>li>a');
			aDel.forEach(function(item,index){
				$(item).on('click',function(ev){
					$(this).parent().remove();//删除元素节点
					var val=$(this).parent().text();
					aSearchRecord.splice($.inArray(val,aSearchRecord),1);//从数组中删除搜索记录
					if(aSearchRecord.length<=2){
						$('.show-all').css('display','none');
						oUl.css('height','auto');
					}
					if(aSearchRecord.length==0){
						$('.clear-record').css('display','none');
					}
					localStorage.removeItem('searchRecord');//删除localStorage的全部搜索记录
					localStorage.setItem('searchRecord',JSON.stringify(aSearchRecord));//重新添加删除后剩余的搜索记录到localStorage
					ev.stopPropagation();
				});
			});
		}

		//如果搜索记录为小于2条时不显示“展开全部”和“清除历史记录”
		if($('.history ul>li').length<=2){
			$('.show-all').css('display','none');
		}

		//如果搜索记录为0时不显示“展开全部”和“清除历史记录”
		if($('.history ul>li').length==0){
			$('.clear-record').css('display','none');
		}

		//展开全部
		$('.show-all').on('click',function(){
			var h=$('.history ul>li').length*$('.history ul>li').eq(0).height();
			$(this).css('display','none');
			oUl.css('height',h);
			$('.clear-record').css('display','block');
			setTimeout(function(){
				oUl.css('height','auto');
			},300);
		});
		
		//清除历史记录
		$('.clear-record').on('click',function(){
			aSearchRecord=[];//搜索数组清空
			$('.history ul>li').remove();//删除全部列表项
			localStorage.removeItem('searchRecord');//删除localStorage的全部搜索记录
			$('.show-all').css('display','none');
			$(this).css('display','none');
			oUl.height('auto');
		});
	}
})();

//热门搜索//////////////////////////////////////////////////////////////////////////////////
(function(){
	var hotLabels=[{"id":1,"name":"推荐"},{"id":2,"name":"亲子"},{"id":2,"name":"亲子"},{"id":2,"name":"亲子"},{"id":2,"name":"亲子"}];
	var str='';
	hotLabels.forEach(function(item,index){
		str+='<li>'+item['name']+'</li>';
	});
	$('.hot>ul').html(str);
})();

//推荐文章//////////////////////////////////////////////////////////////////////////////////
(function(){
	var arr=[
		{	
			id:0,
			publishTime:'2017-02-28',
			cover:require('../imgs/000.jpg'),
			title:'漂亮妈妈如何持家？',
			labels:'乐活'
		},
		{	
			id:0,
			publishTime:'2017-02-28',
			cover:require('../imgs/1.jpg'),
			title:'漂亮妈妈如何持家？',
			labels:'乐活'
		},
		{	
			id:0,
			publishTime:'2017-02-28',
			cover:require('../imgs/2.jpg'),
			title:'漂亮妈妈如何持家？',
			labels:'乐活'
		},
		{	
			id:0,
			publishTime:'2017-02-28',
			cover:require('../imgs/3.jpg'),
			title:'漂亮妈妈如何持家？',
			labels:'乐活'
		},
		{	
			id:0,
			publishTime:'2017-02-28',
			cover:require('../imgs/000.jpg'),
			title:'漂亮妈妈如何持家？',
			labels:'乐活'
		}
	];
	var str='';
	arr.forEach(function(item,index){
		str+='<li class="item"><section class="block">';
		str+='<img class="show-pic" src="'+item.cover+'" >';
		str+='<h2 class="title">'+item.title+'</h2>';
		str+='<div class="item-foot"><span class="time">'+item.publishTime+'</span><em class="kind">'+item.labels+'</em></div>';
		str+='</section></li>';
	});
	$('.recomand-article>ul').html(str);
})();

function imgPos(aImg){
	aImg.forEach(function(item,index){
		var iW='';
		var iH='';
		var iHeight=$('.recomand li.item>section.block div.img-wrap').height();
		var iWidth=$('.recomand li.item>section.block div.img-wrap').width();

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

//判断数据类型
function classof(obj){
	if(obj===null){
		return 'Null';
	}
	if(obj===undefined){
		return 'Undefined';
	}
	return Object.prototype.toString.call(obj).slice(8,-1);
}