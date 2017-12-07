// http://api.jirengu.com/weather.php?callback=getWeather
;(function(window, undefined){
	var weatherApi = 'http://api.jirengu.com/weather.php';

	function weatherDeal(res) {
		var cur_data = res['weather_data'][0];
		var data = {
			city: res['currentCity'] || '',
			dayPictureUrl: cur_data['nightPictureUrl'] || '',
			weather: cur_data['weather'] || '',
			temperature: cur_data['temperature'] || '',
		};
		var htmlStr = render(data);
		document.querySelector('.headerbar .weather').innerHTML = htmlStr;
		// $('.headerbar .wather').html(htmlStr);
	}

	function render(data) {
		var str = 
		'<div class="city">\
				<p class="name">{{city}}</p>\
				<p class="tip">当前城市</p>\
			</div>\
			<div class="condition">\
				<img src="{{dayPictureUrl}}">\
				<span>{{weather}}</span>&nbsp;&nbsp;<span>{{temperature}}</span>\
			</div>'
		var htmlStr = str.replace(/{{(\w+)}}/ig, function(match, p1) {
			return data[p1];
		});
		return htmlStr;
	}

	$.ajax({
		type: 'GET',
		url: weatherApi,
		dataType: 'jsonp',
		jsonp: 'callback',
		success: function(res) {
			weatherDeal(res.results[0]);
		},
		error: function(msg) {
			console.log(msg);
		}
	})
})(window);