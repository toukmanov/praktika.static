$(document).ready(function(){
	var $li=$('nav.primary li');
	$li.click(function(){
		for (var i=0; i<$li.length; i++){
			if ($li[i]!=this){
				$('i',$li[i]).animate({opacity:0});
			}			
		}		
		var pos=$(this).position();
		var $frame=$('#navigation_frame');
		var $handler=$('div',$frame);
		$frame.css({
			display:'block',
			left:pos.left,
			top:pos.top
		});
		$('i',this).each(function(){			
			$handler[0].appendChild(this);
		});
		$frame.animate({left:-200}, function(){
			$frame.animate({left:-100});
		});
		$('nav.primary ul').hide();
	});
})