/**
 * @file myScript.js
 * Script to analyze Facebook feed and make connection with the server
 *  ** Based in FiB, for now.
 * 
 * @author Jett Jones
 * @date winter 2016
 */
(function(document) {
'use strict';
var feeds = new Set();
function text(res) {
	return res.text();
}

/**
 * Http request to fbserve.herokuapp.com.
 *
 * @param url to send to the server.
 * @param the type of information sent
 * @param the location to put the button
 */
function httpGet(input, type, data) {

	var server = ""
	var contents = "?content=";
	var page = (type!="text")? decodeFB(input) : input;
	var theUrl = server + contents + page;
	theUrl = theUrl.replace("&", "^");
	
	console.log("Type: " + type + " : " + page);

	if (type == "text") {
		return
	}
        // Testing that we can extract URLs from various article types
        // In a future version - report externally for fact checking
//	fetch(theUrl)
//		.then(text)
//		.then(function(text) {
	var text = type;
	injectButton(text, data);
//		});	
}

/**
 * Attach a label to data
 *
 * @param text "verified" or otherwise
 * @param data A region to attach the button
 */
function injectButton(text, data) {
	var btn = document.createElement('div'),
		button = Ladda.create(btn);
	btn.style = "font-weight:bold; padding: 3px; position:absolute; top: 4px; right: 30px;background: #3b5998; font-size: 15px;";

        btn.innerHTML = text;
        btn.style.color = "#E77C6C";
	
	// this was commented out before, testing what it does
	btn.addEventListener("mouseover", hoverTooltip.bind(text), false);

	data.appendChild(btn);	
}

/**
 * Display tooltip with more accurate information
 *
 * @param the information to display
 */
function hoverTooltip(info) {
	//console.log("hovering: " + info);
}

/*
 * Parse through Facebook's encoded url for the actual url
 */
function decodeFB(code) {

	var res = "" + code;
	res = res
		.replace("https://l.facebook.com/l.php?u=", "")
		.replace("http://l.facebook.com/l.php?u=", "")
		.replace("https://www.facebook.com/l.php?u=", "")
		.replace(/%3A/gi, ":")
		.replace(/%F/gi, "/")
		.replace(/%2F/gi, "/");

	var end = res.substr(res.indexOf("^h"), res.length);
	res = res.replace(end, "");
	var end2 = res.substr(res.indexOf("&"), res.length);
	res = res.replace(end2, "");

	return res;
}  

/**
 * Receive each Facebook post and analyze texts, urls, pics for validity.
 * Refreshes every second.
 */
setInterval(function() {
	
	var test = document.getElementsByClassName('_4-u2 mbm _5v3q _4-u8');

	for(var i=0; i<test.length; i++) {

		var data = test[i];

		// Check if feed needs to be modified

		if(!feeds.has(data)) {
			feeds.add(data);

			// printing `data` just shows [object HtmlDivElement]
			console.log("feeds " + i)

			// Send server requests

			var statement = "";
			var processed = false;

			var linked = data.querySelector('._6ks a');
			if(!processed && linked != null && linked.href != null) {
				// links here like
				// hmm, links are not expanded until mouseover?
				// we might be able to call the mouseover function.
				console.log('type 1: article link')
				processed = true;
				httpGet(linked.href, "article", data);
			}

			// reshare seems pretty common
			var links = data.querySelectorAll('.fcg a.profileLink')
			if(!processed && links != null && links.length > 2) {
				var last = links[links.length-1];
				if(last.text == "post" || last.text == "album" || last.text == "photo" || last.text == "video"){
					processed = true;
					console.log('type 1a: re-share')
					httpGet(last.href, "reshare", data);
				}
			}

			
			var link = data.querySelector('._150c img');
			if(!processed && link != null && link != null && link.href != null) {
				processed = true;
				console.log('type 2: video');
				httpGet(link.src, "video", data);
			}

			var picComment = data.querySelector('.uiScaledImageContainer._4-ep img');
			if(!processed && picComment != null && picComment.src != null) {
				// it is a picture, see if it's shared from someone else's account
				processed = true;
				console.log('type 3: picture');
				httpGet(picComment.src, "picture", data);
			}

			var picPost = data.querySelector('._46-h._517g');
			if(!processed && picPost != null && picPost.querySelector('img') != undefined && picPost.querySelector('img').src != null) {
				console.log('type 4: profile pic')
				processed = true;
				httpGet(picPost.querySelector('img').src, "profile", data);
			}
			
			var picTagged = data.querySelector('._4-eo._2t9n');
			if(!processed && picTagged != null && picTagged.querySelector('._46-h._4-ep') != null && picTagged.querySelector('._46-h._4-ep').querySelector('img') != null) {

				console.log('type 5')
				processed = true;
				httpGet(picTagged.querySelector('._46-h._4-ep').querySelector('img').src, "tagged", data);
			}

			var picAlbum = data.querySelector('._2a2q');
			if(!processed && picAlbum != null) {
				processed = true;
				console.log('type 6: album');
				// could check the root url, or the first photo
				// each photo might be overkill
				httpGet('', "album", data);
			}

			var adlink = data.querySelector('._3ekx a')
			if (!processed && adlink != null && adlink.href != null) {
				console.log('type 7: story link')
				processed = true;
				httpGet(adlink.href, "story", data);
			}

			var vidlink = data.querySelector('._5pco a')
			if (!processed && vidlink != null && vidlink.href != null) {
				console.log('type 8: video')
				processed = true;
				httpGet(vidlink.href, "video", data);
			}

			// text with a link in it
			var link = data.querySelector('._5pbx.userContent a');
			if(!processed && link != null && link != null && link.href != null) {
				console.log('type 9: hashtag')
				processed = true;
				httpGet(link.href, "hashtag", data);
			}

			var text = data.querySelector('._5pbx.userContent');
			if(!processed && text != null && text.textContent != null) {
				console.log('type 10: text')

				processed = true;
				httpGet(text.textContent, "text", data);
			}

			if(!processed) {
				console.log('type not recognized')
				httpGet('', "unknown", data);
			}
		}
	}

}, 1000);
	
})(document);
