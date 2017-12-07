;
(function(window, undefined) {
    var utils = window.utils;
    var addEvent = utils.dom.addEvent;
    var VM = window.MyVM;
    var qs = function(sel) {
        return document.querySelector(sel);
    };
    var qsa = function(sel) {
        return document.querySelectorAll(sel);
    };
    var list_show_icon = qs('.search .list-show-icon');
    var engine_list_box = qs('.search .engine-list');
    var search_engine = qs('.search-engine');
    var search_input = qs('.search .search-input input');
    var search_btn = qs('.search .search-btn');
    var search_show = qs('.search-show');
    // store vm
    var vm = new VM({
        data: {
            current_search_engine: 's-baidu',
            engine_list_show: false,
            su_list_show: false
        }
    });

    vm.on('current_search_engine', function(val) {
    	search_show.setAttribute('data-engine', val);
    }, function() {
    	vm.set('engine_list_show', false);
    });
    vm.on('engine_list_show', function(val) {
    	if(val) {
    		utils.dom.addClass(search_engine, 'show');
    	} else {
    		utils.dom.removeClass(search_engine, 'show');
    	}
    });
    addEvent(list_show_icon, 'click', function(e) {
    	var flag = utils.dom.hasClass(search_engine, 'show');
    	if(flag) {
    		vm.set('engine_list_show', false);
    	} else {
    		vm.set('engine_list_show', true);
    	}
    });

    addEvent(engine_list_box, 'click', function(e) {
        var target = utils.dom.eTarget(e);
        var engine = target.getAttribute('data-engine');
        vm.set('current_search_engine', engine);
    });

    // search suggestion
    var jsonp = window.jsonp;
    var request = jsonp.request;
    var rulers = jsonp.rulers;
   	var su_list = qs('.search .su-list');
   	function geneSuList(data, elBox) {
   		var item, htmlStr = '';
   		for (var i = 0, len = data.length; i < len; i++) {
   			item = data[i];
   			htmlStr += '<li class="item">' + item + '</li>'
   		}
   		elBox.innerHTML = htmlStr;
   	}

    var engineMap = {
    	's-baidu': 'baidu',
    	's-360': '$360'
    };
    window.suCbsMap = {
    	'baidu': function(res) {
    		var data = rulers.baidu.extract(res);
    		geneSuList(data, su_list);
    	},
    	'$360': function(res) {
    		var data = rulers.$360.extract(res);
    		geneSuList(data, su_list);
    	}
    }
    var search_input_handler = utils.throttle(function() {
    	var word = search_input.value;
    	var engine = engineMap[vm.get('current_search_engine')];
    	request(engine, word, 'suCbsMap.' + engine);
    	vm.set('su_list_show', true);
    }, 300);
    vm.on('su_list_show', function(val) {
    	if(val) {
    		utils.dom.addClass(su_list, 'show');
    	} else {
    		utils.dom.removeClass(su_list, 'show');
    	}
    });
    addEvent(search_input, 'keyup', search_input_handler);
    addEvent(search_input, 'blur', function(e) {
    	vm.set('su_list_show', false);
    });
    addEvent(su_list, 'mousedown', function(e) {
        var target = utils.dom.eTarget(e);
        search_input.value = target.innerText;
    });

    function geneHref(engine, word) {
        var href = '';
        if(engine === 's-baidu') {
            href = 'https://www.baidu.com/s?wd=' + word;
        } else if(engine === 's-360') {
            href = 'https://www.so.com/s?q=' + word;
        }
        return href;
    }

    // 点击搜索
    addEvent(search_btn, 'mousedown', function(e) {
        var word = search_input.value;
        window.open(geneHref(vm.get('current_search_engine'), word));
    });
})(window);