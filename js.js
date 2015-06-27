(function(){
	var me={
		audios:0,
		query:document.getElementById("s_search")?document.getElementById("s_search").value:''
	};
	var t=window.setInterval(function(){
		//console.info('[VK audio download]loop..');
		path=/\/([\D]*)[\d]*/.exec(window.location.pathname)[1];
		var selectors={
			root:"audio",
			link:"audio_info",
			info:" .title_wrap.fl_l"
		}
		var styles={
			right:"30px",
			zIndex:"100",	
			position:"absolute"
		}
		switch(path){
			case "audios":
				//Check search string changes..
				var newquery=document.getElementById("s_search")?document.getElementById("s_search").value:'';
				if(me.query!=newquery){
					//console.log('Changed',me.query,'=>',newquery);
					me.audios=0;
					me.query=newquery;
				}
				selectors.info=" .info.fl_l";
				styles.zIndex=500;
				styles.marginTop="10px";
				styles.right="60px";
			break;
			default:
				//console.log('unknown path',path);
		}
		if(selectors && document.getElementsByClassName(selectors.root).length!=me.audios){
			//console.log('Changed',me.audios,'=>',document.getElementsByClassName(selectors.root).length);
			me.worker(selectors,styles);
			me.audios=document.getElementsByClassName(selectors.root).length;
		}else{
			//console.log('Not changed.');
		}
	},1987);
	me.interval=t;
	me.worker=function(selectors,styles){
		//console.log('[Vk Audio Download]Worker running..');
		var allfind=document.getElementsByClassName(selectors.root);
		for(i=0;i<allfind.length;i++){
			var num=allfind[i].id.split('audio')[1];
			if(num=="_global")continue;
			//console.log(num);
			var selector="#audio"+num+selectors.info;
			var infos=document.querySelector(selector);
			//console.log(selector,!!infos);
			if(!infos.querySelector('#download_link-'+num)){
				var a=document.createElement('a');
				for(var style in styles)a.style[style]=styles[style];
				a.appendChild(document.createTextNode(' Скачать '));

				var downloadlink=document.getElementById(selectors.link+num).value.split(",")[0];
				//console.log(downloadlink);
				a.href=downloadlink;
				a.id="download_link-"+num;
				//console.log(a);
				var artist=infos.querySelector('b a').innerText;
				var title=(infos.querySelector('.title a')||infos.querySelector('.title')).innerHTML;;
				var trackname=a.trackname=artist+" - "+title;
				//console.log(trackname);

				a.title=trackname;
				//a.download=trackname; Don't works(
				infos.insertBefore(a,infos.childNodes[1]);
				a.onclick=function (){
					//window.open(downloadlink,"",null);
					alert('Правой кнокой мыши-сохранить ссылку как');return false;
				}
				a.oncontextmenu=function (){prompt("Ctrl+C",this.trackname);return true;}
			}else{
				var artist=(infos.querySelector('b a span')||infos.querySelector('b a')).innerHTML;
				var title=(infos.querySelector('.title a')||infos.querySelector('.title')).innerHTML;;
				var trackname=artist+" - "+title;
				//console.log('Already ready',trackname);
			}
		}
		return true;
	}
	//console.info('[VK audio download]Ready.');
	return me;
})();