;
(function(window, undefined) {
    var qs = function(sel, ctx) {
        ctx = ctx || document;
        return ctx.querySelector(sel);
    };
    var qsa = function(sel, ctx) {
        ctx = ctx || document;
        return ctx.querySelectorAll(sel);
    };
    var utils = window.utils;
    var addEvent = utils.dom.addEvent;
    var eTarget = utils.dom.eTarget;

    var VM = window.MyVM;
    var vm = new VM({
        data: {
            current_search_status: '',
            current_search_type: '',
            engine_toggle_show: false,
            suggestion_list_show: false,
        }
    });
    var default_type_handlers = {
        logo: {
            toggleHandler: function(source, target) {
                target.textContent = '';
                target.setAttribute('data-search-type', source.getAttribute('data-search-type'));
                target.setAttribute('data-search-status', source.getAttribute('data-search-status'));
            }
        },
        text: {
            toggleHandler: function(source, target) {
            		target.setAttribute('data-search-type', source.getAttribute('data-search-type'));
                target.setAttribute('data-search-status', source.getAttribute('data-search-status'));
                target.textContent = source.textContent;
            },
            inputHandler: function() {
            }
        },
    }
    // static variable
    function SearchEngine(option) {
        this.option = option || {};
        _init.call(this, option);
        this.start();
    }

    function _init(option) {
        var self = this;
        var root = this.root = option.root || document;
        var type_handlers = option.typeHandlers || {};
        this.search_engine = qs('.search-engine', root);
        this.eng_logo = qs('.eng-logo', root);
        this.g_toggle = qs('.g-toggle', root);
        this.eng_list = qs('.engine-list', root);
        this.eng_list_items = this.eng_list && qsa('.item', this.eng_list);
        this.input = qs('.input', root);
        this.suggestion_list = qs('.su-list', root);
        this.search_button = qs('.search-btn', root);
        function getTypeHandler(type, handlerType) {
        	var handler = type_handlers[type] && type_handlers[type][handlerType] || default_type_handlers[type] && default_type_handlers[type][handlerType];
          if (!handler) {
              throw new Error('data-search-type: "' + type + '" 没有对应的toggleHandler')
          }
          return handler
        }
        // init status
        this.search_status_list = [];
        var elLen = this.eng_list_items && this.eng_list_items.length || 0;
        for (var i = 0; i < elLen; i++) {
            var status = this.eng_list_items[i].getAttribute('data-search-status');
            this.search_status_list.push(status);
        }
        // init vm on
        vm.on('engine_toggle_show', function(val) {
            self.engineToggleShow(val)
        });
        vm.on('suggestion_list_show', function(val) {
        	self.suggestionListShow(val);
        })
        // init eventListener
        addEvent(this.eng_list, 'click', function(e) {
            var target = eTarget(e);
            var is_item = /\bitem\b/.test(target.getAttribute('class'));
            var search_type;
            if (is_item) {
                search_type = target.getAttribute('data-search-type') || 'logo';
                var toggle_handler = getTypeHandler(search_type, 'toggleHandler');
                toggle_handler.call(self, target, self.eng_logo);
                vm.set('engine_toggle_show', false);
            		vm.set('current_search_type', search_type);
            		vm.set('current_search_status', target.getAttribute('data-search-status'))
            }
        });
        addEvent(this.g_toggle, 'click', function(e) {
            vm.set('engine_toggle_show', !vm.get('engine_toggle_show'))
        });
        addEvent(this.input, 'input', function(e) {
        	var type = vm.get('current_search_type');
        	var input_handler = getTypeHandler(type, 'inputHandler');
        	input_handler.call(self)
        });
        addEvent(this.search_button, 'click', function(e) {
        	var type = vm.get('current_search_type');
        	var search_click_handler = getTypeHandler(type, 'searchClickHandler');
        	search_click_handler.call(self)
        });
        addEvent(this.suggestion_list, 'mousedown', function(e) {
	        var target = utils.dom.eTarget(e);
	        self.input.value = target.textContent;
        });
        addEvent(this.input, 'blur', function(e) {
		    	vm.set('suggestion_list_show', false);
		    });
    };
    SearchEngine.prototype.changeSearchStatus = function(status) {
        if (this.search_status_list.indexOf(status) < 0) {
            throw new Error('data-search-status: ' + status + ' 不存在');
        }
        vm.set('current_search_status', status);
    }
    SearchEngine.prototype.engineToggleShow = function(flag) {
        if (flag) {
            utils.dom.addClass(this.search_engine, 'show');
        } else {
            utils.dom.removeClass(this.search_engine, 'show');
        }
    }
    SearchEngine.prototype.changeSuggestionContent = function(data) {
   		var item, htmlStr = '';
   		for (var i = 0, len = data.length; i < len; i++) {
   			item = data[i];
   			htmlStr += '<li class="item">' + item + '</li>'
   		}
   		this.suggestion_list.innerHTML = htmlStr;
    }
    SearchEngine.prototype.suggestionListShow = function(flag) {
    	var f = flag ? utils.dom.addClass : utils.dom.removeClass
    	f(this.suggestion_list, 'show');
    }
    SearchEngine.prototype.getVm = function() {
    	return vm;
    }
    SearchEngine.prototype.initTypeNth = function(idx) {
    	var elIdx = this.eng_list_items[idx];
    	var el_0;
    	if(elIdx) {
    		elIdx.click();
    	} else {
    		el_0 = this.eng_list_items[0];
    		if(el_0) {
    			el_0.click()
    		} else {
    			throw new Error('至少添加一个搜索引擎')
    		}
    	}
    }
    SearchEngine.prototype.start = function() {
    	this.initTypeNth(2);
    }
    window.SearchEngine = SearchEngine;
})(window)