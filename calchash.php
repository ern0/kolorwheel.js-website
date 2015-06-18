<?php      

	echo(":");
	ehash("KolorWheel.js");
	ehash("index.html");
	ehash("style.css");
	ehash("script.js");
	echo("\n");

	function ehash($f) {
	
		$path = realpath(dirname(__FILE__));
		$x = stat($path . "/" . $f);

		echo($x["mtime"]);
		echo(":");
	} // ehash()
?>
