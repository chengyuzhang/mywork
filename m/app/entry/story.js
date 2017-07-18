import '../css/public.css';
import '../css/story.css';
import $ from 'n-zepto';
import apiUrl from '../js/config';
import {url_search} from '../js/config';

//从哪来回哪去的页面返回
(function(){
    switch(url_search().from){
        case 'index':
            $('header a').attr('href','index.html');
        break;
        case 'center':
            $('header a').attr('href','user-center.html');
        break;
    }
})();

