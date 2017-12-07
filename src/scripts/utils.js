;
(function(window, undefined) {
    /**
     * 函数节流
     * @param  {number} delay  延迟时间
     * @param  {function} action 关联函数
     * @return {function}        返回客户端调用函数
     */
    function throttle(action, delay) {
        var last;
        return function() {
            var self = this;
            clearTimeout(last);
            last = setTimeout(function() {
                action.apply(self, arguments);
            }, delay || 200);
        }
    }
    var support_classList = document.body.classList != undefined && typeof(document.body.classList.contains) == 'function'
    var hasClass = (function() {
        if (support_classList) {
            return function(el, cls) {
                return el.classList.contains(cls);
            }
        } else {
            return function(el, cls) {
                cls = cls || '';
                if (cls.replace(/\s/g, '').length === 0) return false;
                return new RegExp(' ' + cls + ' ').test(' ' + el.className + ' ');
            }
        }
    })();
    var addClass = (function() {
        if (support_classList) {
            return function(el, cls) {
                el.classList.add(cls);
            }
        } else {
            return function(el, cls) {
                if (!hasClass(el, cls)) {
                    el.className += ' ' + cls;
                }
            }
        }
    })();
    var removeClass = (function() {
        if (support_classList) {
            return function(el, cls) {
                el.classList.remove(cls);
            }
        } else {
            return function(el, cls) {
                if (hasClass(el, cls)) {
                    var newClass = ' ' + el.className.replace(/[\t\r\n]/g, '') + ' ';
                    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                        newClass = newClass.replace(' ' + cls + ' ', ' ');
                    }
                    el.className = newClass.replace(/^\s+|\s+$/g, '');
                }
            }
        }
    })();
    var toggleClass = (function() {
        if (support_classList) {
            return function(el, cls) {
                el.classList.toggle(cls);
            }
        } else {
            return function(el, cls) {
                if (hasClass(el, cls)) {
                    removeClass(el, cls);
                } else {
                    addClass(el, cls);
                }
            }
        }
    })();
    var addEvent = (function() {
        if (window.addEventListener) {
            return function(el, type, handler) {
                el.addEventListener(type, handler, false);
            }
        } else if (window.attachEvent) {
            return function(el, type, handler) {
                el.attachEvent('on' + type, handler);
            }
        } else {
            return function(el, type, handler) {
                el['on' + type] = handler;
            }
        }
    })();
    var removeEvent = (function() {
        if (window.removeEventListener) {
            return function(el, type, handler) {
                el.removeEventListener(type, handler, false);
            }
        } else if (window.detachEvent) {
            return function(el, type, handler) {
                el.detachEvent('on' + type, handler);
            }
        } else {
            return function(el, type) {
                el['on' + type] = null;
            }
        }
    })();
    var eTarget = function(e) {
        e = e || window.e;
        return e.target || e.srcElement;
    };
    // VM
    function VM(store) {
        this.handlers = {};
        this.init(store);
    }
    VM.prototype.init = function(store) {
        store = store || {};
        var data = store.data || {};
        for (var key in data) {
            this.geneHandlers(key, data[key]);
        }
    }
    VM.prototype.geneHandlers = function(key, val) {
        this.handlers[key] = {
            value: val,
            cbs: [],
            finalFn: [],
        }
    }
    VM.prototype.set = function(key, newVal) {
        var hder = this.getHandler(key);
        var val = hder.value;
        var finalFn = hder.finalFn;
        if (val !== newVal) {
            hder.value = newVal;
            var cbs = hder.cbs;
            for (var i = 0, len = cbs.length; i < len; i++) {
                typeof cbs[i] === 'function' && cbs[i].call(this, newVal);
            }
        }
        for (var i = 0, len = finalFn.length; i < len; i++) {
            typeof finalFn[i] === 'function' && finalFn[i].call(this, newVal);
        }
    }
    VM.prototype.get = function(key) {
        var hder = this.getHandler(key);
        return hder.value;
    }
    VM.prototype.getHandler = function(key) {
        var hder = this.handlers[key];
        if (!hder) throw new Error('"' + key + '" has not defined.');
        return hder;
    }
    VM.prototype.on = function(key, fn, finalFn) {
        var hder = this.getHandler(key);
        hder.cbs.push(fn);
        finalFn && hder.finalFn.push(finalFn);
    };
    var utils = {
        throttle: throttle,
        dom: {
            hasClass: hasClass,
            addClass: addClass,
            removeClass: removeClass,
            toggleClass: toggleClass,
            addEvent: addEvent,
            removeEvent: removeEvent,
            eTarget: eTarget
        }
    };
    window.utils = utils;
    window.MyVM = VM;
})(window, undefined);