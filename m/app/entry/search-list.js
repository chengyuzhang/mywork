import '../css/public.css';
import '../css/search-list.css';
import $ from 'n-zepto';
import {rand,signName,reTop,url_search,imgLazy,setSto,getSto,setLto,getLto,allSto,allLto,rmSto,rmLto,noRepeat} from '../js/config';
import md5 from 'md5';

//接口地址
import apiUrl from '../js/config';

console.log(allLto());
//上滑返回顶部
(function(){
	var oWrap=$('.wrap');

	reTop(oWrap);
	
})();

var vipNo=getSto('vipNo');

//从哪来回哪去的页面返回
(function(){
    switch(url_search().from){
        case 'index':
            $('.search-bar>span>a').attr('href','index.html');
        break;
        case 'gife':
            $('.search-bar>span>a').attr('href','gife-list.html');
        break;
        case 'goods':
            $('.search-bar>span>a').attr('href','goods-list.html');
        break;
        case 'children':
            $('.search-bar>span>a').attr('href','children-list.html');
        break;
        case 'custom':
            $('.search-bar>span>a').attr('href','custom-list.html');
        break;
    }
})();

//清空搜索
(function(){
    var oBtn=$('.search-bar>div>i');
    var oText=$('.search-bar>div>input');
    oBtn.on('click',function(ev){
        $(oText).val('');
        $(oText).get(0).focus();
        ev.stopPropagation();
    });
})();

//搜索//////////////////////////////////////////////////////////////////////////////////
(function(){
    var iLogin=true;//判断登录条件
    var oInput=$('.search-bar>div>input');
    var oUl=$('.goods-history ul');
    var oSearchBtn=$('.search-bar>a');
    //var vipNo=sessionStorage.getItem("vipNo");
    //var token=sessionStorage.getItem("token");
    
    $(document).on('click',function(){
        $('.goods-history').css('display','none');
        
    });

    oInput.on('click',function(ev){
        ev.stopPropagation();
    });

    if(vipNo){//登录
        //添加搜索记录

        $(oSearchBtn).on('click',function(ev){
            var val=oInput.val();
            var token=getSto('token');
            if(val!=''){
                
                $.ajax({
                    type:'get',
                    headers:signName(md5,vipNo,token),
                    url:apiUrl+'/user/search/add',
                    data:{
                        memberNo:vipNo,
                        searchContent:val,
                        businessCase:2
                    },
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
                        window.location.href=encodeURI(encodeURI('goods-search-result.html?keyword='+val));
                    },
                    error:function(err){
                        console.log(err);
                    },
                });
                
            }else{
                alert('搜索内容不能为空');
            } 
        });

        oInput.on('focus',function(ev){
            var str='';
            $.ajax({
                type:'get',
                headers:signName(md5,vipNo,getSto('token')),
                url:apiUrl+'/user/search/get',
                data:{
                    memberNo:vipNo,
                    businessCase:2
                },
                success:function(data){
                    if(data.head.code){
                        cancelImgLayer();
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

                    var arr=data.body.searchs;
                
                    arr.forEach(function(item,index){
                        str+='<li>';
                        str+='<i></i><span>'+item.searchContent+'</span><a id='+item.id+' href="javascript:;"></a>';
                        str+='</li>';
                    });
                    oUl.html(str);

                    var aImg=$('.show-pic');
                    imgPos(aImg);
                    $('.goods-history').css('display','block');

                    //点击搜索结果
                    (function(){
                        var aLi=$('.goods-history>ul>li');

                        aLi.forEach(function(item,index){
                            $(item).on('click',function(ev){
                                window.location.href=encodeURI(encodeURI('goods-search-result.html?keyword='+$(item).find('span').text()));
                                ev.stopPropagation();
                            });
                        });
                    })();

                    //如果搜索记录为小于2条时不显示“展开全部”和“清除历史记录”
                    if($('.goods-history ul>li').length<=2){
                        $('.show-all').css('display','none');
                    }

                    //如果搜索记录为0时不显示“展开全部”和“清除历史记录”
                    if($('.goods-history ul>li').length==0){
                        $('.clear-record').css('display','none');
                    }

                    //如果搜索记录条数大于0，显示“清除历史记录”
                    if($('.goods-history ul>li').length>0){
                        $('.clear-record').css('display','block');
                    }

                    //如果搜索记录条数大于2，显示“全部展示”
                    if($('.goods-history ul>li').length>2){
                        oUl.height('.72rem');
                        $('.show-all').css('display','block');
                        $('.clear-record').css('display','none');
                    }

                    //展开全部
                    $('.show-all').on('click',function(ev){
                        ev.stopPropagation();

                        var h=$('.goods-history ul>li').length*$('.goods-history ul>li').eq(0).height();
                        $(this).css('display','none');
                        oUl.css('height',h);
                        $('.clear-record').css('display','block');
                        setTimeout(function(){
                            oUl.css('height','auto');
                        },300);
                    });
                    
                    //清除历史记录
                    $('.clear-record').on('click',function(ev){
                        ev.stopPropagation();
                        var token=getSto('token');
                        $.ajax({
                            type:'get',
                            url:apiUrl+'/user/search/delete',
                            data:{
                                memberNo:vipNo,
                                searchId:0,
                                businessCase:2
                            },
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
                                    $('.goods-history ul>li').remove();//删除全部列表项
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
                    var aDel=$('.goods-history ul>li>a');
                    aDel.forEach(function(item,index){
                        $(item).on('click',function(ev){
                            ev.stopPropagation();
                            var token=getSto('token');
                            $.ajax({
                                type:'get',
                                url:apiUrl+'/user/search/delete',
                                data:{
                                    memberNo:vipNo,
                                    searchId:item.id,
                                    businessCase:2
                                },
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
                                        if($('.goods-history>ul>li').length<=2){
                                            $('.show-all').css('display','none');
                                            oUl.css('height','auto');
                                        }
                                        if($('.goods-history>ul>li').length==0){
                                            $('.clear-record').css('display','none');
                                        }
                                    }
                                },
                                error:function(err){
                                    console.log(err);
                                }
                            });
                        });
                    });
                },
                error:function(){

                }
            });//获取搜索记录
            //showRecord();
            ev.stopPropagation();
        });

        //location.href='goods-search-result.html?';
    }else{//未登录
        var aSearchRecord;
        //oInput.focus();
        //showRecord();
        oInput.on('focus',function(ev){
            
            aSearchRecord=JSON.parse(getLto('goodsSearchRecord'));//获取搜索记录
            showRecord();
            ev.stopPropagation();
        });

        $(oSearchBtn).on('click',function(){
            
            var val=oInput.val();
            if(!aSearchRecord){
                aSearchRecord=[];
            }
            if(val!=''){
                aSearchRecord.push(val);
                aSearchRecord=noRepeat(aSearchRecord);//去重
                
                setLto('goodsSearchRecord',JSON.stringify(aSearchRecord));//存储搜索记录
                
                window.location.href=encodeURI(encodeURI('goods-search-result.html?keyword='+val));
            }
        });

        //展示搜索记录列表
        function showRecord(){
            aSearchRecord=JSON.parse(getLto('goodsSearchRecord'));//获取搜索记录
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
            $('.goods-history').css('display','block');
            //点击搜索结果
            (function(){
                var aLi=$('.goods-history>ul>li');
                
                aLi.forEach(function(item,index){
                    $(item).on('click',function(){
                        window.location.href=encodeURI(encodeURI('goods-search-result.html?keyword='+$(item).find('span').text()));
                    });
                });
            })();

            //如果搜索记录条数大于0，显示“清除历史记录”
            if($('.goods-history ul>li').length>0){
                $('.clear-record').css('display','block');
            }
            //如果搜索记录条数大于2，显示“全部展示”
            if($('.goods-history ul>li').length>2){
                oUl.height('.72rem');
                $('.show-all').css('display','block');
                $('.clear-record').css('display','none');
            }
            del();
        }

        //删除搜索记录
        function del(){
            var aDel=$('.goods-history ul>li>a');
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
                    rmLto('goodsSearchRecord');//删除localStorage的全部搜索记录
                    setLto('goodsSearchRecord',JSON.stringify(aSearchRecord));//重新添加删除后剩余的搜索记录到localStorage
                    ev.stopPropagation();
                });
            });
        }

        //如果搜索记录为小于2条时不显示“展开全部”和“清除历史记录”
        if($('.goods-history ul>li').length<=2){
            $('.show-all').css('display','none');
        }

        //如果搜索记录为0时不显示“展开全部”和“清除历史记录”
        if($('.goods-history ul>li').length==0){
            $('.clear-record').css('display','none');
        }

        //展开全部
        $('.show-all').on('click',function(){
            var h=$('.goods-history ul>li').length*$('.goods-history ul>li').eq(0).height();
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
            $('.goods-history ul>li').remove();//删除全部列表项
            localStorage.removeItem('goodsSearchRecord');//删除localStorage的全部搜索记录
            $('.show-all').css('display','none');
            $(this).css('display','none');
            oUl.height('auto');
        });
    }
})();

//展示商品列表
var jsonData={
        type:2,
        pageNum:1,
        pageSize:10
    };
var getUrl=apiUrl+'/home/queryHomeGoodsByPage';
var iBtnNum=0;
var sortId=[];
var styleId=[];
var materialId=[];
var pricesId=[];
var targetId=[];
var labelId=[];

//弹出送给谁及为了庆祝什么的弹层
(function(){
    var timer=null;

    $('.kind-gife .for-who').get(0).onclick=$('.kind-gife .for-what').get(0).onclick=function(){
        $('.opacity').css('display','block');
        timer=setTimeout(function(){
            $('.opacity').css('opacity',1);
        },50);
    };

    //关闭按钮的点击
    $('.close').get(0).onclick=function(){
        $('.opacity').css('opacity',0);
        timer=setTimeout(function(){
            $('.opacity').css('display','none');
        },550);
    };

    var forWhoUl=$('.for-who-ul');
    var forWhatUl=$('.for-what-ul');
    var forWhoLi=$('.for-who-ul li');
    var forWhatLi=$('.for-what-ul li');
    var forWhatH3=$('.for-what-h');
    var hotCon=$('.kind-gife>ul');
    var sHot='';
    var sLabel='';

    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryLabels',
        data:{},
        success:function(data){
            if(data.head.code){
                console.log(data.head.message);
            }
            var data=data.body;
            
            //热门标签

            data.labels.forEach(function(item,index){
                if(index%2){
                    sHot+=`<li class="active2"><a href="goods-search-result.html?keyword=${item.labelContent}">${item.labelContent}</a></li>`;
                }else{
                    sHot+=`<li class="active1"><a href="goods-search-result.html?keyword=${item.labelContent}">${item.labelContent}</a></li>`;
                }
                
            });
            $(hotCon).html(sHot);

            data.labels.forEach(function(item,index){
                sLabel+=`<li data-id=${item.id}>${item.labelContent}<i></i></li>`;
            });
            $(forWhatUl).html(sLabel);

            var forWhatLi=$('.for-what-ul li');

            //为了庆祝什么的点击选择
            forWhatLi.forEach(function(item,index){
                $(item).attr('data-btn','true');

                $(item).on('click',function(){
                    if($(this).hasClass('active')){//连续点击未选中单个按钮
                        $(item).attr('data-btn','true');
                        $(item).removeClass('active');
                        labelId[0]='';
                        $('.for-what p').text('为了庆祝什么？');
                    }else{//选中单个按钮
                        forWhatLi.forEach(function(item,index){
                            $(item).attr('data-btn','true');
                            $(item).removeClass('active');
                        });
                        $(this).attr('data-btn','false');
                        $(this).addClass('active');
                        labelId[0]=parseInt(item.dataset.id);
                        $('.for-what p').text($(this).text());
                    }
                });
            });

            //送给谁的点击选择
            forWhoLi.forEach(function(item,index){
                $(item).attr('data-btn','true');

                $(item).on('click',function(){
                    if($(this).hasClass('active')){//连续点击未选中单个按钮
                        $(item).attr('data-btn','true');
                        $(item).removeClass('active');
                        targetId[0]='';
                        $('.for-who p').text('送给谁？');
                    }else{//选中单个按钮
                        forWhoLi.forEach(function(item,index){
                            $(item).attr('data-btn','true');
                            $(item).removeClass('active');
                        });
                        $(this).attr('data-btn','false');
                        $(this).addClass('active');
                        targetId[0]=parseInt(item.dataset.id);
                        $('.for-who p').text($(this).text());
                    }

                    //选择宝爸宝妈时“为了庆祝什么”的显示和隐藏
                    forWhoLi.forEach(function(item1,index1){
                        if($(item1).hasClass('parents')){
                            forWhatLi.forEach(function(item,index){
                                $(item).attr('data-btn','true');
                                $(item).removeClass('active');
                                $('.for-what p').text('为了庆祝什么？');
                            });

                            if($(item1).attr('data-btn')=='false'){
                                forWhatH3.css('display','none');
                                forWhatUl.css('display','none');
                            }else if($(item1).attr('data-btn')=='true'){
                                forWhatH3.css('display','block');
                                forWhatUl.css('display','block');
                            }

                            labelId[0]='';
                        }
                    });
                });
            });

            //确定按钮点击
            $('.btn').get(0).onclick=function(){
                $('.opacity').css('opacity',0);
                timer=setTimeout(function(){
                    $('.opacity').css('display','none');
                },550);

                console.log('targetId:',targetId,'-labelId:',labelId);
                
                $.ajax({
                    type:'get',
                    url:apiUrl+'/home/list/queryGoodsByParamAndPage',
                    data:{
                        pageNum:1,
                        pageSize:10,
                        targetIds:targetId,
                        labelIds:labelId,
                        sortIds:sortId,
                        styleIds:styleId,
                        materialIds:materialId,
                        priceIds:pricesId
                    },
                    success:function(data){
                        console.log('data:',data);
                        if(data.head.code){
                            console.log(data.head.message);
                        }

                        var data=data.body;

                        var oUl=$('.goods-gife-list');//列表外层
                        var str='';
                        init(str,data.goodsVoList,oUl);
                        $('.recommend-title').css('display','none');
                    },
                    error:function(){}
                });
                
                iBtnNum=0;
                jsonData={
                    pageNum:1,
                    pageSize:10,
                    targetIds:targetId,
                    labelIds:labelId,
                    sortIds:sortId,
                    styleIds:styleId,
                    materialIds:materialId,
                    priceIds:pricesId
                };
                getUrl=apiUrl+'/home/list/queryGoodsByParamAndPage';
            };
        },
        error:function(){}
    });

    function init(str,arr,obj){
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
            var aImg=$('.goods-gife-list img');
            imgLazy(aImg);
        })();
    }
})();



//获取选项栏及列表数据
(function(){
    
    var oUl=$('.goods-gife-list');//列表外层
    var str='';

    //列表
    $.ajax({
        type:'get',
        url:apiUrl+'/home/queryHomeGoodsByPage',
        data:{
            type:2,
            pageNum:1,
            pageSize:10
        },
        success:function(data){
            //console.log(data);
            if(data.head.code){
                console.log(data.head.message);
            }
            var data=data.body;
            init(str,data.goodsVoList,oUl);
        },
        error:function(){

        }
    });


    load(str,$('.wrap'));

    function init(str,arr,obj){
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
            var aImg=$('.goods-gife-list img');
            imgLazy(aImg);
        })();
        //图片懒加载
        (function(){
            var aImg=$('.goods-gife-list1 img');
            imgLazy(aImg);
        })();
    }

    function refresh(str,arr,obj){
        console.log('arr:',arr);
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
            var aImg=$('.goods-gife-list img');
            imgLazy(aImg);
        })();
    }

    //上滑加载
    function load(str,obj){

        var pageNum=1;
        var pageSize=10;
        var oWrap=$(obj);//获取滚动元素
        var oRe=$('.refresh');
        var iHScreen=window.screen.availHeight;//获取屏幕高度

        var iNum=0;//记录第一次到最后一条数据时的页数
        
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
            var oLi=$('.goods-gife-list'+' li:nth-last-of-type(1)');//获取最后一个内容块

            var t=0;//最后一个内容块距离页面最顶部的距离
            if($('.goods-gife-list li').length){
                t=oLi.offset().top;
            }else{
                return;
            }

            //console.log('page:',jsonData.pageNum);

            if((startY-moveY)>=0&&t<iHScreen+100){
                clearTimeout(timer);
                timer=setTimeout(function(){
                    jsonData.pageNum++;
                    clearTimeout(timer2);
                    $(oRe).html('正在加载中...');
                    $(oRe).css('bottom',0);
                    $.ajax({
                        type:'get',
                        url:getUrl,
                        data:jsonData,
                        success:function(data){
                            if(data.head.code){
                                //console.log('数据返回错误！');
                                return;
                            }
                            var data=data.body;
                            if(!data.end){//未到末尾
                                refresh(str,data.goodsVoList,$('.goods-gife-list'));
                                //$(oRe).html('本次加载完成！');
                                timer2=setTimeout(function(){
                                    $(oRe).css('bottom','-1rem');
                                },2000);
                                iBtnNum=0;
                            }else{//到末尾
                                if(!iBtnNum){
                                    refresh(str,data.goodsVoList,$('.goods-gife-list'));
                                }
                                iBtnNum++;
                                iNum=jsonData.pageNum-1;
                                jsonData.pageNum=iNum;
                                $(oRe).html('已经到末尾咯~');
                                $(oRe).css('bottom',0);
                                clearTimeout(timer1);
                                timer1=setTimeout(function(){
                                    $(oRe).css('bottom','-1rem');
                                },2000);
                            }

                            //图片懒加载
                            (function(){
                                var aImg=$('.goods-gife-list img');
                                imgLazy(aImg);
                            })();
                        }
                    });
                },1000);
            }

        });
    }
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