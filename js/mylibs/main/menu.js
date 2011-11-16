$(document).ready(function(){
	//Действия при открытии меню:
	primary_menu.init();
	image_buffer.init();
	logo_controll.init();
	scroll_controll.init();
	scroll_menu.init();
	delegate_queue.listen('open',[	                              
		image_buffer.copy,
		image_buffer.display,
		primary_menu.hide,
		image_buffer.hide,
		image_buffer.show,
		scroll_menu.show,
		scroll_controll.select,
		logo_controll.enable,
		url_control.update,
	]);
	//Действия при закрытии меню:
	delegate_queue.listen('close',[
		image_buffer.hide,
		image_buffer.clean,
		scroll_menu.hide,
		primary_menu.show,
		logo_controll.disable,
		url_control.update
	]);
	//
	delegate_queue.listen('change',[
		image_buffer.hide,
		image_buffer.copy,
		scroll_menu.select,
		scroll_controll.select,
		image_buffer.show,
		url_control.update
	]);
	url_control.init();
	
	$('#float_banner hide a').click(function(){
		$('#float_banner').hide();
	})
});

var scroll_menu={
	div:null,
	screen:[],
	init: function(){
		scroll_menu.div=$('#main_scroll');
		var height=0;			
	},
	resize: function(){
		var height=0;
		var width=scroll_menu.div.width();
		var left=0;		
		$('.screen', scroll_menu.div).each(function(){
			scroll_menu.screen[this.id]=$(this).css({
				width:width,
				left:left,
				display:'none'
			});			
			height=Math.max(height, scroll_menu.screen[this.id].height());
		});
		
		$('.screen', scroll_menu.div).css('height', height);
		$('.scroll', scroll_menu.div).css('height', height);
		$('#primary_menus').animate({height:height});
		return height;
	},
	hide: function(event, callback){
		scroll_menu.div.hide();
		callback();
	},
	selectedID:null,
	show: function(event, callback){
		scroll_menu.div.show();
		
		var height=scroll_menu.resize();						
		scroll_menu.selectedID=event.id;
		scroll_menu.screen[event.id].fadeIn(callback);
	},
	select: function(event, callback){
		id=event.id;
		//ge elements:
		$showMe=scroll_menu.screen[id];		
		$hideMe=scroll_menu.screen[scroll_menu.selectedID];
		//get direction:
		var dir=scroll_menu.getDirectionTo(id);
		if (!dir) return;
		var width=$showMe.width();
		var $between;
		var between_width=0;
		if (dir.distance>1){
			$between=$('.between', scroll_menu.div)
			.css({height:scroll_menu.div.height(), display:'block'})
			.addClass(dir.betweenClass);					
			between_width=$between.width();
			width+=between_width;
		}
		$showMe.css({
			left:dir.direction*width, display:'block'
		});		
		//lock:
		animate(function(part){					
			var left=Math.ceil(-1*dir.direction*part*width);			
			$hideMe.css({
				left:left
			});
			$showMe.css({
				left:dir.direction*width+left
			});
			if ($between){
				
				$between.css({
					left:Math.max(0, dir.direction)*width+left-between_width
				});								
			}
			if (part==1){//done
				$hideMe.hide();
				scroll_menu.selectedID=id;					
				if (callback) callback();
			}
			//if (part>0.5) return true;
		},800);
		
	},
	getDirectionTo: function(id){		
		if (id==scroll_menu.selectedID) return null;
		var i=0;
		var betweenClass='';
		for (key in scroll_menu.screen){
			if (key==id){
				showIndex=i++;				
			}
			else if (key==scroll_menu.selectedID){
				hideIndex=i++;
			}
			else {
				i++;
				continue;
			}
			//вычисляем класс связки:
			if (betweenClass) betweenClass+='_';
			betweenClass+=key;
		}		
		var ret=[]
			ret.betweenClass=betweenClass;
			ret.hideIndex=hideIndex;
			ret.showIndex=hideIndex;
			ret.delta=hideIndex-showIndex;		
			ret.distance=Math.abs(ret.delta);
			ret.direction=ret.delta/ret.distance;
		return ret;
	}

}
//scroll controll:
var scroll_controll={
	li:[],	
	ul:null,
	init: function(){
		scroll_controll.ul=$('#main_scroll .buttons');		
		$('a',scroll_controll.ul).each(function(){
			var href=this.hash.substr(2);
			var $me=$(this);
			scroll_controll.li[href]=$me.parent();
			$me.click(function(){				
				delegate_queue.event('change',{id:href});
			});			
		})
	},
	select: function(item, callback){		
		for (key in scroll_controll.li){			
			if (scroll_controll.li[key].addClass){
				if (key==item.id){
					scroll_controll.li[key].addClass('selected');
				}
				else {
					scroll_controll.li[key].removeClass('selected');
				}
			}
		}		
		scroll_controll.ul.css({display:'block'});
		
		callback();
	}
}
//logotip:
var logo_controll={
	logo: null,
	init: function(){
		logo_controll.logo=$('header h1');
		logo_controll.logo.click(function(){
			if (logo_controll.logo.hasClass('clickable')){
				delegate_queue.event('close',[]);
			}
		});
	},
	enable: function(event, callback){
		logo_controll.logo.addClass('clickable');
		callback();
		
	},
	disable:function(event, callback){
		logo_controll.logo.removeClass('clickable');
		callback();
	}
}
//buffer for images on main:
var image_buffer={
	container: null,
	div: null,
	init: function(){
		image_buffer.div=$('#primary_menu_buffer');
		image_buffer.container=$('div', image_buffer.div)[0];
	},
	source:null,
	postition:false,
	copy:function(event, callback){		
		if (image_buffer.lastID) image_buffer.clean(event, function(){});
		image_buffer.lastID=event.id;
		image_buffer.source=$('#primary_menu .'+event.id);
		$('i', image_buffer.source).each(function(){		
			image_buffer.container.appendChild(this);
		});
		callback();
	},
	display: function(event, callback){
		image_buffer.source=$('#primary_menu .'+event.id);
		var position=image_buffer.source.position();
		
		image_buffer.div.css({
			left:position.left,
			top:position.top,
			width:image_buffer.source.width(),
			height:image_buffer.source.height(),			
			display:'block'
		});
		callback();
	},
	clean:function(event, callback){
		if (image_buffer.source){
			while (image_buffer.container.firstChild){
				image_buffer.source[0].appendChild(image_buffer.container.firstChild);
			}
		}
		callback();
	},
	hide:function(event, callback){
		$(image_buffer.div).animate({left:-image_buffer.div.width()},callback);
	},
	show:function(event, callback){
		$(image_buffer.div).animate({left:-100},callback);
	}
}
//visible main menu:
var primary_menu={
	ul:null,
	init: function(){
		primary_menu.ul=$('#primary_menu');
		$('li', this.ul).click(function(e){
			if (safeClick(e)) return true;
			delegate_queue.event('open',{id:this.className});
		});
	},
	hide: function(event, callback){
		primary_menu.ul.parent().css('height',primary_menu.ul.height());//fix top height
		primary_menu.ul.fadeOut(callback);
	},
	show: function(event, callback){
		primary_menu.ul.fadeIn(function(){
			primary_menu.ul.parent().animate({height:primary_menu.ul.height()}, callback)
		});		
	}
}

var url_control={
	update:function(item, callback){
		if (item && item.id){
			document.location.hash='~'+item.id;
		}
		else {
			document.location.hash='';
		}
		callback();
	},
	init: function(){
		if (document.location.hash && document.location.hash.substr(0,2)=='#~'){
			delegate_queue.event('open',{id:document.location.hash.substr(2)});
		}
	}
}

function safeClick(e){
	if (e.ctrlKey||e.shiftKey) return true;
	return false;
}
//Цепочка делегатов:
var delegate_queue={
	execute: function(queue, event){
		//lock UI:		
		if (delegate_queue.lock){			
			return false;		
		}
		delegate_queue.lock=event;
		var queue_i= 0;
		var f= function(){
			var callback;			
			if (!queue[queue_i+1]){				
				callback=function(){
					delegate_queue.lock=null;					
					if (event.ready) event.ready();					
				}							
			}
			else {
				callback=f;
			}				
			if (callme=queue[queue_i++]){
				callme(event, callback);
			}			
		};
		f();
	},
	lock:null,
	delegates:[],
	listen: function(event, queue){			
		this.delegates[event]=queue;
	},
	event: function(event, data){
		if (this.delegates[event]){
			return delegate_queue.execute(this.delegates[event], data);
		}
	}
}

function animate(callback, time){
	var step=0;
	var sleep=80;
	var steps=Math.ceil(time/sleep);	
	var f= function(){
		var part=step/steps;
		if (callback(part)||part==1){
			clearInterval(interval);
		}
		step+=1;
	}
	if (!f()){
		var interval=setInterval(f, sleep);
	}
}