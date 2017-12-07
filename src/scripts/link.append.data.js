;(function(window){
	var htmlStr = geneLinksHtml();
	$(htmlStr).appendTo($('.main .content'));

	function geneLinksHtml() {
		var data = window.getSiteData();
		var str = '';
		var i =0, j = 0, k =0;
		for(i = 0, d_len = data.length; i < d_len; i++) {
			var d_item = data[i];
			str +='<div id ="id_'+ i +'" class="cool-site">'
					 +	'<div class="cool-site__category">'
					 +		'<a>' + d_item.name + '</a>'
					 +	'</div>'
					 +	'<div class="cool-site__panel">';
			var children = d_item.children;
			for(j = 0, c_len = children.length; j < c_len; j++) {
				var child = children[j];
				str +='<div id="id_' + i + '_' + j + '" class="subTitle">'
						 +	'<a class="link">' + child.name + '</a>'
						 +'</div>'
						 +'<div class="panel-item">'
						 +	'<ul class="cool-site__list">';
				var links = child.links;
				for(k = 0,l_len = links.length; k < l_len; k++) {
					var link = links[k];
					var type = link.type;
					if(String(type) === '2') {
						str += '<li class="cool-site__list-item image-tip" imageUrl="' + link.imageUrl + '">'
								 + (link.href ? '<a href="' + link.href + '">' : '<a>') + link.text + '</a></li>'
					} else {
						str +='<li class="cool-site__list-item">'
								 +'<a href="' + link.href + '">' + link.text + '</a></li>'
					}
				}
				str	+=	'</ul>'
						 +'</div>';
			}
			str	+=	'</div>'
					 +'</div>';
		}
		return str;
	}
})(window);

(function(window, undefined) {
	function showImageTips(url, pLi) {
		var iT = showImageTips.imageTip;
		if(!iT) {
			var el = document.createElement('div');
			el.className = 'show-image-tip';
			el.style.position = 'absolute';
			el.style.top = "150%";
			el.style.left = "-50%";
			el.style.zIndex = '100';
			var img = document.createElement('img');
			img.src = url;
			el.appendChild(img);
			iT = showImageTips.imageTip = el;
		}
		iT.style.display = 'block';
		pLi.append(iT);
		return iT
	}

	function closeImageTips() {
		var iT = showImageTips.imageTip;
		if(iT) {
			iT.style.display = 'none';
		}
	}
	function getAllImageTips() {
		var els = $('.cool-site__list-item.image-tip');
		var eventProxyTargets = $('.cool-site');
		eventProxyTargets.on('mouseenter', '.image-tip a', function(e) {
			var pLi = $(e.target).parent();
			var url = pLi.attr('imageUrl');
			showImageTips(url, pLi)
		}).on('mouseleave','.image-tip a', function(e) {
			closeImageTips()
		})
	}
	getAllImageTips()
})(window);