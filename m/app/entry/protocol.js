import '../css/public.css';
import '../css/protocol.css';
import $ from 'n-zepto';
import apiUrl from '../js/config';
import {getSto,prevUrl} from '../js/config';

//返回前一个页面
(function(){
	$('header>a').attr('href',prevUrl());
})();