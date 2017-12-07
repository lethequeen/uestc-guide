// ;(function(window, undefined){
// 	var plugins = {};
// 	window.plugins = plugins;

// 	// loading
// 	function loading(opt) {
// 		this.opt = opt || {};
// 		this.init();
// 	}
// 	loading.prototype.init = function() {
// 		var opt = this.opt;
// 		var el = document.createElement('div');
// 		el.className = 'loading';
// 		this.el = el;
// 	}
// 	loading.prototype.show = function() {
// 		this.el.style.display = 'block';
// 	}
// 	loading.prototype.close = function() {
// 		this.el.style.display = 'none';
// 	}
// 	loading.prototype.getEl = function() {
// 		return this.el;
// 	}
// 	plugins.loading = loading;
// })(window);