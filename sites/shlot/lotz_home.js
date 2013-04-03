
// FLASH 8 OBJECT/EMBED FUNCTIONS
function Flash8Check(src,idname,width,height,bg) {
  //enables alternate content for iPhone and iPod browsers
  if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)))
  {
    document.getElementById('noflash').style.visibility="visible";
    document.getElementById('noflash').style.display="block";
  } else {
    Flash8(src,idname,width,height,bg);
  }
};

function Flash8(src,idname,width,height,bg) {
    document.write('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="' + width + '" height="' + height + '" id="' + idname + '" align="top">');
    document.write('<param name="movie" value="' + src + '" />');
    document.write('<param name="menu" value="true" /><param name="salign" VALUE="lt" />');
    document.write('<param name="quality" value="high" />');
    document.write('<param name="bgcolor" value="' + bg + '" />');
    document.write('<param name="loop" value="true" />');
    if(bg=="transparent"){
    document.write('<param name="wmode" value="transparent" />');
    } else {
    document.write('<param name="bgcolor" value="' + bg + '" />');
    }
    document.write('<param name="allowScriptAccess" value="always" />');
    document.write('<embed src="' + src + '" menu="true" quality="high" swLiveConnect="true" ');
    if(bg=="transparent"){
    document.write('wmode="transparent" '); 
    } else {
    document.write('bgcolor="'+ bg +'" '); 
    }
    document.write('width="' + width + '" height="' + height + '" name="' + idname + '" id="' + idname + '" align="top" loop="false" salign="lt" type="application/x-shockwave-flash" allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer">');
    document.write('</embed>');
    document.write('</object>');
};


// POPUP WINDOW SCRIPT

function popup(url,name,wide,high){
// onClick="popup('url','name',wide,high);return false;"
	if (high=="max") 
		{ high=screen.availHeight };
	if (wide=="max")
		{ wide=screen.availWidth };
	attr="location=yes,toolbar=yes,scrollbars=yes,resizable=yes,statusbar=no,width="+wide+",height="+high;
	doPopUpWindow = window.open(url,name,attr);
	doPopUpWindow.moveTo((screen.availWidth/2)-(wide/2),(screen.availHeight/2)-(high/2)-(screen.availHeight/10));
}




// GENERAL HIDING/REVEALING OF ELEMENTS 

function hide(elid){
	document.getElementById(elid).style.visibility="hidden";
	document.getElementById(elid).style.display="none";
}


function showblock(elid){
	document.getElementById(elid).style.visibility="visible";
	document.getElementById(elid).style.display="block";
}


function showinline(elid){
	document.getElementById(elid).style.visibility="visible";
	document.getElementById(elid).style.display="inline";
}


function hideClass(cName){
var divs=document.getElementsByTagName('div');	
		for (i=0; i < divs.length; i++) {
			if (divs[i].className==cName){
			divs[i].style.visibility="hidden";
			divs[i].style.display="none";
			}
		}
}

function showClass(tag,cName,disp){
var tags=document.getElementsByTagName(tag);	
		for (i=0; i < tags.length; i++) {
			if (tags[i].className==cName){
			tags[i].style.visibility="visible";
			tags[i].style.display=disp;
			}
		}
}



// DEBUGGER

function trace(arg){
document.getElementById('tracebox').value=arg;
}


