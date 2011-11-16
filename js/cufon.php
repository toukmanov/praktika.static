<?php 
readfile('cufon-yui.js');
$dir=opendir('cufon/');
while ($file=readdir($dir)){
	if (substr($file,0,1)=='.') continue;
	readfile('cufon/'.$file);
}
?>
Cufon.replace('header ul li a',{fontFace:'Bliss Pro Medium'});
Cufon.replace('#primary_menu a',{fontFace:'Bliss Pro Medium'});
Cufon.replace('h2',{fontFace:'Bliss Pro Medium'});
Cufon.replace('nav.secondary a',{fontFace:'Bliss Pro Medium'});