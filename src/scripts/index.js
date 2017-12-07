;
(function(window, undefined) {
    // 常用链接部分
    var utils = window.utils;
    var usual_website = 'uestc_usual_website';
    var website_list = document.querySelector('.website-list');
    var add_website = document.querySelector('.add-website');
    var more_item = document.querySelector('.website-list .more');

    function getStore(key) {
        var store = window.localStorage.getItem(key);
        return JSON.parse(store);
    }

    function setStore(key, val) {
        window.localStorage.setItem(key, JSON.stringify(val));
    }

    function deleteStoreItem(uuid) {
    	var store = getStore(usual_website);
    	delete store[uuid];
    	setStore(usual_website, store);
    }

    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");　
    }

    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function addUsualWebsite(data) {
        var fragment = document.createDocumentFragment();
        for (var key in data) {
            var li = document.createElement('li');
            fragment.appendChild(li);
            li.className = 'item myself';
            var a = document.createElement('a');
            var val = data[key];
            a.setAttribute('href', val['site_link']);
            li.appendChild(a);
            var i_1 = document.createElement('i');
            i_1.className = 'iconfont icon-shoucang';
            var i_2 = document.createElement('i');
            i_2.className = 'iconfont icon-shanchu';
            i_2.setAttribute('data-uuid', key);
            a.appendChild(i_1);
            a.appendChild(i_2);
            var span = document.createElement('span');
            span.className = 'text';
            span.textContent = val['site_name']
            a.appendChild(span);
        }
        return fragment;
    }
    // init
    (function() {
        var store = getStore(usual_website);
        var add_form = document.querySelector('#add-website');
        var add_btn = document.querySelector('.add-website .add-btn');
        var cancel_btn = document.querySelector('.add-website .cancel-btn');
        if (store) {
            var frag = addUsualWebsite(store);
            var items = document.querySelectorAll('.website-list .item');
            website_list.insertBefore(frag, items[items.length - 1]);
        }
        utils.dom.addEvent(more_item, 'click', function(e) {
            var target = utils.dom.eTarget(e);
            if (utils.dom.hasClass(target, 'cancel-btn')) {
                add_website.style.display = 'none';
            } else if (utils.dom.hasClass(target, 'add-btn')) {
            	var key = guid();
                var val = {
                    'site_name': trim(add_form.elements[0].value),
                    'site_link': trim(add_form.elements[1].value),
                };
                if (val.site_link != '' && val.site_name != '') {
                    var store = getStore(usual_website) || {};
                    store[key] = val;
                    setStore(usual_website, store);
                    var _o = {};
                    val['uuid'] = key;
                    _o[key] = val;
                    var one_frag = addUsualWebsite(_o);
                    var items = document.querySelectorAll('.website-list .item');
                    website_list.insertBefore(one_frag, items[items.length - 1]);
                    add_form.reset();
                    add_website.style.display = 'none';
                }
            } else {
                add_website.style.display = 'block';
            }
        });
        utils.dom.addEvent(website_list, 'click', function(e) {
        	var target = utils.dom.eTarget(e);
        	if(utils.dom.hasClass(target,'icon-shanchu')) {
        		deleteStoreItem(target.getAttribute('data-uuid'));
        		var ele = target.parentNode.parentNode;
        		ele.parentNode.removeChild(ele);
        		if(e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
        	}
        })
    })();



    // topbar切换
    var nav_list = $('.topbar__link.f-left .topbar__link-item');
    var site_list = $('.switch-site');
    function setPanelActive(idx) {
    	site_list.eq(idx).addClass('active');
    }
    nav_list.click(function(){
    	var idx = $(this).index();
    	setPanelActive(idx);
    	var hash = 'cs_h' + idx;
        var el = $('#'+hash);
        $('html,body').animate({
            scrollTop: (el.offset().top - 50)
        }, 100)
    });
    // scroll
    $(window).scroll(function() {
        var top = $(window).scrollTop() - 180;
        $('.sider').css({
            paddingTop: (top > 0 ? top : 0) + 'px'
        })
    })
})(window);