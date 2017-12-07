;
(function(window, undefined) {
    var jsonp = window.jsonp;
    var request = jsonp.request;
    var rulers = jsonp.rulers;
    var utils = window.utils;
    var addEvent = utils.dom.addEvent;
    var SearchEngine = window.SearchEngine;
    var VM = window.MyVM;
    var searchHandler = utils.throttle(function() {
        var vm = this.getVm();
        var word = this.input.value;
        var status = vm.get('current_search_status');
        var engineMap = {
            's-baidu': 'baidu',
            's-360': '$360'
        };
        var engine = engineMap[status];
        request(engine, word, 'suCbsMap.' + engine);
        vm.set('suggestion_list_show', true);
    }, 300);
    var searcher = new SearchEngine({
        root: document.querySelector('.search'),
        typeHandlers: {
            'logo': {
                inputHandler: function() {
                    var self = this;
                    searchHandler.call(self);
                },
                searchClickHandler: function() {
                    var status = this.getVm().get('current_search_status');
                    var word = String(this.input.value).trim();
                    if (word) {
                        window.open(geneHref(status, word));
                    }
                }
            },
            'text': {
                searchClickHandler: function() {
                    var word = String(this.input.value).trim();
                    $('body').removeHighlight();
                    word.split(' ').forEach(function(item) {
                        var text = item.trim()
                        text && $('.cool-site').highlight(text);
                    });
                    var highlightItems = $('span.highlight')
                    $('html,body').animate({
                        scrollTop: highlightItems.length && highlightItems.eq(0).offset().top
                    }, 100)
                }
            }
        }
    });

    function geneHref(engine, word) {
        var href = '';
        if (engine === 's-baidu') {
            href = 'https://www.baidu.com/s?wd=' + word;
        } else if (engine === 's-360') {
            href = 'https://www.so.com/s?q=' + word;
        }
        return href;
    }
    window.suCbsMap = {
        'baidu': function(res) {
            var data = rulers.baidu.extract(res);
            searcher.changeSuggestionContent(data);
        },
        '$360': function(res) {
            var data = rulers.$360.extract(res);
            searcher.changeSuggestionContent(data);
        }
    }
})(window)