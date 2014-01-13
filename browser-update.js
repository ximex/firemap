var $buoop = {vs:{i:10,f:25,o:11,s:6,n:9}}
$buoop.ol = window.onload;
window.onload=function(){
	try {
		if ($buoop.ol) $buoop.ol();
	}catch (e) {}
		var e = document.createElement("script");
		e.setAttribute("type", "text/javascript");
		e.setAttribute("src", "http://browser-update.org/update.js");
		document.body.appendChild(e);
}