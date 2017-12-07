;
(function(window, undefined) {
    function jsonp(url) {
        var script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
    }
    /**
     * 不同搜索网站的匹配规则
     * @type {String}
     */
    // 百度搜索
    var baidu_template_url = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su';
    var baidu_url_ruler = function(word, callback) {
        return baidu_template_url + '?wd=' + encodeURIComponent(word) + '&cb=' + callback;
    };
    var baidu_extractor = function(data) {
        return data.s;
    }
    // 360搜索
    var $360_template_url = 'http://sug.so.360.cn/suggest?encodein=utf-8&caller=hao_home&encodeout=utf-8&t=2486486';
    var $360_url_ruler = function(word, callback) {
        return $360_template_url + '&word=' + encodeURIComponent(word) + '&callback=' + callback;
    }
    var $360_extract = function(data) {
        return data.s;
    }
    // yahoo搜索
    // var yahoo_template_url = 'https://sg.search.yahoo.com/sugg/gossip/gossip-sg-ura/?nresults=10';
    // var yahoo_url_ruler = function(word, callback) {
    // 	return yahoo_template_url + 'command=' + word + '&callback=' + callback;
    // }
    // var yahoo_extract = function(data) {
    // 	return data;
    // }
    // 天气部分
    // var weather_template_url = 'http://cdn.weather.hao.360.cn/sed_api_weather_info.php?code=101270103&v=2&param=weather&app=hao360&_jsonp=__jsonp4__&t=2486636'
    var weather_template_url = 'https://qweather.ssl.dhrest.com/sed_api_weather_info.php?v=2&param=weather&app=hao360&t=2486638'
    var weather_url_ruler = function(area, callback) {
        return weather_template_url + 'code=' + area + '&_jsonp=' + callback;
    }
    var weather_extract = function(data) {
        return data.weather;
    }
    var RULES = {
        baidu: {
            url: baidu_url_ruler,
            extract: baidu_extractor,
        },
        $360: {
            url: $360_url_ruler,
            extract: $360_extract
        },
        weather: {
            url: weather_url_ruler,
            extract: weather_extract
        }
    }

    function jsonRequest(site, wd, cb) {
        if (!RULES[site] || typeof RULES[site].url !== 'function') {
            throw new Error('you need add a right rule named "' + site +'" in RULES');
        }
        var url = RULES[site].url(wd, cb);
        jsonp(url);
    }
    // 调用方法
    function deal_360(data) {
        data = RULES.$360.extract(data);
        alert(JSON.stringify(data))
    }

    function deal_baidu(data) {
        data = RULES.baidu.extract(data);
        alert(JSON.stringify(data))
    }

    function deal_weather(data) {
        data = RULES.weather.extract(data);
        alert(JSON.stringify(data))
    }
    window.jsonp = {
    	request: jsonRequest,
    	rulers: RULES
    };
    // jsonRequest('$360', '关键字', 'deal_360');
    // jsonRequest('baidu', '关键字', 'deal_baidu');
    // jsonRequest('weather', '101100101', 'deal_weather');
})(window);