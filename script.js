	
	$(document).ready(function() { 

		var sup1 = now();		
		init();
		initAnims();		
		var sup2 = now();
		resize();		
		var sup3 = now();

		$("#sup-init").html(sup2 - sup1);
		$("#sup-resize").html(sup3 - sup2);
		$("#sup-total").html(sup3 - sup1);
		///$("#sup").show();
		
		///initRefresh();

	}); // document.ready


	$(window).resize(function() {
	
		var sup = now();
		resize();
		$("#sup-rot-outer").show();
		$("#sup-rotate").html(now() - sup);
		
	}); // window.resize
	
	
	function now() {
		var d = new Date();
		return d.getTime();
	} // now()
	
	
	function px(x) {
		return Math.round(x * factor) + "px";
	} // px()
	
	
	function resize() {

		var w = $(window).width();
		factor = w / 430;
		
		var tfont = 32;
		var bfont = 5 + tfont;

		$("h1")
			.css("font-size",px(tfont))
			.css("margin-top",px(11))
			.css("margin-bottom",px(8))
		;
		$(".c")
			.css("margin",px(1.4)) 		
			.css("padding",px(3))
		; 		
		$(".ca").css("font-size",px(bfont));	
		$(".j")
			.css("padding-left",px(6))	
			.css("padding-right",px(1))
		;
		
		$("h2")
			.css("font-size",px(12))
			.css("margin-top",px(5))
			.css("margin-left",px(4))
			.css("margin-right",px(2))
			.css("padding-left",px(1))
		;

		$("#thanks")
			.css("font-size",px(8))
			.css("margin-left",px(1))
			.css("margin-right",px(3))
			.css("padding",px(2))
			.css("background","#eeeeee")
			.css("border",px(1) + " solid #dddddd")
			.css("margin-top",px(6))
		;
		
		$("h3")
			.css("font-size",px(11))
			.css("margin-top",px(0))
			.css("margin-left",px(9))
			.css("padding-top",px(2))
		;
		
		$("p")
			.css("font-size",px(10))
			.css("margin-top",px(2))
			.css("margin-left",px(14))
			.css("margin-right",px(13))
			.css("text-indent",px(2))
		;

		$(".caution")
			.css("font-size",px(10))
			.css("margin-top",px(4));
		;

		$(".fig").css("font-size",px(8));

		$(".comment")
			.css("font-size",px(10))
			.css("padding-top",px(1))
			.css("padding-left",px(1));
		;

		$(".b")
			.css("font-size",px(10))
			.css("margin-top",px(1))
			.css("margin-left",px(25))
			.css("text-indent",px(-6))
		;
		
		$(".i").css("font-size",px(8));

		$("code")
			.css("font-size",px(8))
			.css("margin-top",px(2))
			.css("margin-left",px(13))
			.css("margin-right",px(13))
			.css("padding",px(6))
			.css("border-width",px(1))
		;
		
		$(".palette")
			.css("margin-left",px(11))
			.css("margin-right",px(12))
			.css("margin-top",px(4))
			.css("margin-bottom",px(4))
		;

		var b = 32;
		$(".box")
			.css("width",px(b))
			.css("height",px(b))
			.css("margin",px(2))
			.css("font-size",px(6.6))
			.css("padding",px(1))
		;
				
		var scale = w / 600;
		if (scale < 1) scale = 1;
		$(".picker").css("transform","scale(" + scale + ")");
		$(".picker").css("top",px(-6));

	} // resize()


	function init() {

		data = new AvArray();  // AV for AutoVivification
		
		var codeId = 0;
		$("code").each(function() {

			this.id = "code_" + codeId;
			
			var palette = $.create("div","palette_" + codeId);		
			$(this).after(palette);	
			palette.addClass("palette");

			prepareTpl(codeId);			
			repaintCode(codeId);
			repaintPalette(codeId);
			createPickers(codeId);
		
			codeId++;
		});
		
		hidden = $.create("div");
	
	} // init()
	

	function prepareTpl(codeId) {

		var code = $("#code_" + codeId).html();
		var x = code.replace(/}}/g,"{{").split("{{");
	
		var isValue = false;
		var fieldCount = 0;
		for (i in x) {
			var part = x[i];
			data.set(codeId,"tpl",i,part);
			
			if (isValue) fieldCount++;
			isValue = !isValue;
		} // foreach part
		
		data.set(codeId,"fieldcount",fieldCount);
		
		for (var n = 0; n < fieldCount; n++) {
			var index = 1 + (2 * n);
			var value = data.get(codeId,"tpl",index);
			data.set(codeId,"value",n,value);
			data.set(codeId,"length",n,value.length);
			var t = ( value.length == 6 ? "color" : "number" );
			data.set(codeId,"type",n,t);
		} // for fieldCount
	
	} // prepareTpl()


	function resetDefaults(codeId) {

		var fieldCount = data.get(codeId,"fieldcount");

		for (var n = 0; n < fieldCount; n++) {
			var index = 1 + (2 * n);
			var value = data.get(codeId,"tpl",index);
			data.set(codeId,"value",n,value);
		} // for fieldCount
	
	} // resetDefaults()
	
	
	function repaintCode(codeId) { 	
	
		var x = getCode(codeId,true).split("\n");
		var minTab = 99;
		var i;
		var result = "";
		
		for (i in x) {
			var line = x[i];
			
			if (line.trim().length < 2) {
				if (i < 2) continue;
				if (i > (x.length - 3)) continue;
			}
			
			var tab = 0;
			var otherFound = false;
			for (var n = 0; n < line.length; n++) {
				var c = line.substring(n,1 + n);
				if (c == "\t") {
					tab++;
				} else {
					otherFound = true;
					break;
				}
			} // for line
			if (!otherFound) tab = 99;
			
			if (tab < minTab) minTab = tab;				

		} // for lines
		
		for (i in x) {
			var line = x[i];

			if (line.trim().length < 2) {
				if (i < 2) continue;
				if (i > (x.length - 3)) continue;
			}
			
			line = line.substring(minTab);
			result += line + "<br/>";
			
		} // for lines
		
		result = result.replace(/\t/g,"&nbsp;&nbsp;");
		if (false) {
			result = result.replace(/new/g,"<b>new</b>");
			result = result.replace(/var/g,"<b>var</b>");
			result = result.replace(/for/g,"<b>for</b>");
		} // if syntax hilite
		$("#code_" + codeId).html(result);
		
	} // repaintCode()
	
	
	function getCode(codeId,fieldDecor) {
	
		var result = "";
		var tpl = data.get(codeId,"tpl");
		var isValue = false;
		for (i in tpl) {
		
			var part = tpl[i];
			if (isValue) {
				if (fieldDecor) {
					part = toInputField(codeId,i);
				} else {
					var numero = (i - 1) / 2;
					part = data.get(codeId,"value",numero);
				}
			} // if isValue
			result += part;
			
			isValue = !isValue;
		} // foreach part
	
		return result;
	} // getCode()


	function toInputField(codeId,index) {	
	
		var result = "";
		var numero = (index - 1) / 2;
		var value = data.get(codeId,"value",numero);
		var length = data.get(codeId,"length",numero);
		
		var click = "inputClicked(\"" + codeId + "\"," + numero + ")";
		var change = "inputChanged(\"" + codeId + "\"," + numero + ")";
		
		result = "<input";
		result += " id=\"i_" + codeId + "_" + numero + "\"";
		result += " class=\"i\"";
		result += " type=\"text\"";
		result += " spellcheck=\"false\"";
		result += " size=\"" + length + "\"";
		result += " value=\"" + value + "\"";
		result += " onclick='" + click + ";'";
		result += " onchange='" + change + ";'";
		result += " />";
	
		result += "<span class=\"copyhack\">" + value + "</span>";
		
		return result;
	} // toInputField()


	function inputClicked(codeId,numero) {
		// nothing.
	} // inputClicked()


	function inputChanged(codeId,numero) {
	
		var length = data.get(codeId,"length",numero);
		var field = $("#i_" + codeId + "_" + numero);
		var value = field.val();

		var a = value.split(" ");
		for (var n in a) {
			if (a[n] == "") continue;
			value = a[n];
			break;
		} // foreach a	
		value = value.substr(0,length);
		
		data.set(codeId,"value",numero,value);
		
		repaintPalette(codeId);
		repaintPicker(codeId,numero,value);

		value = "      " + value;
		value = value.substr(value.length - length);
		field.val(value);
	
	} // inputChanged()
	
	
	function repaintPicker(codeId,numero,value) {
	
		var picker = $("#pick_" + codeId + "_" + numero);		
		picker.spectrum("set","#" + value);
		
	} // repaintPicker()
	
	
	function repaintPalette(codeId) {	
	
		var result = getCode(codeId,false);
		
		paletteId = codeId;
		boxNumero = 0;
		breakToPaint = "";
		
		result = result.replace(/&lt;/g,"<");
		result = result.replace(/&gt;/g,">");
		
		paintBreak();

		try { eval(result); } catch (e) { 
			alert(e + "\n\n" + result);
		}

		paintSnip("snip",codeId);

	} // repaintPalette()


	function paintSnip(token,codeId) {
	
		var snipId = token + "_" + codeId;
		var snip = $("#" + snipId);

		if (snip.length != 0) return;
		
		snip = $.create("div",snipId);
		snip.css("clear","both");
		$("#palette_" + codeId).append(snip);
		
	} // repaintPalette()
	

	function paintBox(hex,comment) {

		var color = new KolorWheel(hex);
		if (typeof(comment) == "undefined") comment = "";

		var bid = "box_" + paletteId + "_" + boxNumero;
		boxNumero++;
		var x = $("#" + bid);
		if (x.length == 0) {

			if (breakToPaint.length > 0) {
	
				var br = $.create("div");
				$("#palette_" + paletteId).append(br);
				br.addClass("comment");
				br.html(breakToPaint);
	
				breakToPaint = "";			
				
			} // if break to paint
			
			x = $.create("div",bid);
			$("#palette_" + paletteId).append(x);
			x.addClass("box");
			x.css("border-width","1px");
			x.css("border-style","solid");

		} // if create
		x.css("background",hex);
		
		if (color.isDark()) {
			x.css("color","#ffffff");		
		} else {
			x.css("color","#222222");
		}
		x.html(hex + "<br /><br /><div align='center'>" + comment +"</div>"); 		

		bc = new KolorWheel(hex);
		bc.s = 0;
		bc.l -= 10;
		x.css("border-color",bc.getHex());					
		
		return x;
	} // paintBox()
	
	
	function paintBreak(comment) {
		if (typeof(comment) == "undefined") comment = " ";
		breakToPaint = comment;
	} // paintBreak()


	function createPickers(codeId) {
	
		var code = $("#code_" + codeId);
		if (code.length == 0) return;
		
		var pick = $.create("div");
		code.append(pick);
		pick.addClass("picker");
		
		for (var n = 0; n < data.get(codeId,"fieldcount"); n++) {		
			if (data.get(codeId,"type",n) != "color") continue;
			
			var color = data.get(codeId,"value",n);
						
			var p = $.create("input","pick_" + codeId + "_" + n);
			pick.append(p);
			
			var x = $.create("span");
			pick.append(x);
			x.html("&nbsp;");
			
			p.spectrum({
				color: "#" + color,
				change: function(x) {
					var i = this.id.replace("pick","i");
					var v = x.toHexString().substring(1);					
					var a = i.split("_");
					$("#" + i).val(v);
					data.set(a[1],"value",a[2],v);
					repaintPalette(a[1]);
				} // change()
			});						
		
		} // for fields

		var x = $.create("span");
		pick.append(x);
		x.html("&nbsp;");
	
	} // createPickers()
	

	function initAnims() {

		anim = [];
		tickSub(true);
		tickTitle(true);
		tickThanks(true);
		
	} // initAnims()


	function tickSub(init) {
	
		if (init) {		
			anim.sub = $("h2, h3, .unhide");
		
			var baseSaturation = 60;
			var baseLightness = 30;
			anim.sub.each(function() {
				var wheel = new KolorWheel([240,baseSaturation,baseLightness]);
				$(this).data("wheel",wheel);
				baseSaturation -= 8;
				baseLightness -= 1;
			}); // anim.sub.each()
		} // if init		

		anim.sub.each(function() {
			var wheel = $(this).data("wheel");
			$(this).css("color",wheel.getHex());
			wheel.h++;
		}); // anim.sub.each()
		
		setTimeout(function() { tickSub(false); },200);
	
	} // tickSub()


	function tickTitle(init) {
	
		var tempo = 5;
		var gap = 3;
		var sleep = 210;
		
		if (init) {
			anim.title = [];
			anim.title.ptr = -12;                
			anim.title.hue = 270;
			anim.title.gap = 0;
			anim.title.first = true;
		} // if init

		var target = $(".c");
		baseColor = new KolorWheel( $(anim.sub.get(0)).data("wheel") );	
		target.css("border-color",baseColor.getHex());

		baseColor.s = 40;
		baseColor.l = 80;	
		
		var clr = ( (anim.title.ptr % tempo) == (tempo - 1) );
		if (anim.title.first) {
			clr = true;
			anim.title.first = false;
		}
		if (anim.title.gap == (gap - 1)) {
			sleep = sleep / 5;
			clr = false;		
		} 
		if (clr) {
			target.css("background",baseColor.getHex());
			target.css("color","#000000");
		}

		var af = false;
		if ((anim.title.ptr % tempo) == 0) af = true;
		if (anim.title.ptr < -1) af = false;
		if (af) {
			
			var paper = new KolorWheel([anim.title.hue + 0,80,40]);
			var ink = new KolorWheel([anim.title.hue + 0,80,80]);		
			anim.title.hue += 180 + 15;
			
			var letter = target.eq(anim.title.ptr / tempo);
			letter.css("background",paper.getHex());			
			letter.css("color",ink.getHex());
			
		} // if flash
		
		anim.title.ptr++;
		if ((target.length * tempo) == anim.title.ptr) {
			anim.title.gap++;
			if (anim.title.gap == gap) {
				anim.title.gap = 0;				
				anim.title.ptr = -9;
				anim.title.first = true;
				sleep = 2200;
			} else {
				anim.title.ptr = -6;
			}
		} // if round
					
		setTimeout(function() { tickTitle(false); },sleep);
	
	} // tickTitle()


	function tickThanks(init) {
	
		if (init) {		
			anim.thanks = new KolorWheel([180,35,95]);
		} // if init		

		$("#thanks").css("background",anim.thanks.getHex());
		var border = new KolorWheel(anim.thanks);
		border.l -= 10;
		$("#thanks").css("border-color",border.getHex());
		
		anim.thanks.h += 70;
		anim.thanks.s = 45 - anim.thanks.s;
		
		setTimeout(function() { tickThanks(false); },6760);
	
	} // tickSub()


	function initRefresh() {

		return;
		
		refreshHash = "";
		performRefresh();
	
	} // initRefresh()
	
	
	function performRefresh() {
	
		$.ajax({
			"url": "calchash.php",
			"content-type": "html"
		}).done(function(data) {
		
			if (refreshHash == "") {
				refreshHash = data;
			} // if first
			else { 
				if (refreshHash != data) {
					$("body").css("background","#444444");
					setTimeout(function() {	location.reload(); },200);
					return;
				} // if changed
			} // else first
			
			setTimeout(function() { performRefresh(); },458);
		});
	
	} // performRefresh()
