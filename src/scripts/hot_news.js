;
(function(window, undefined) {
    // 清水河畔api
    // var api_qshp = 'http://bbs.uestc.edu.cn/mobcent/app/web/index.php?r=portal/newslist&moduleId=2';
    var api_qshp = 'http://bbs.stuhome.net/forum.php?mod=forumdisplay&fid=219';
    
    // 成电智讯api
    var api_cdzx = 'http://lightnews.stuhome.net/';
    // 师说api
    // var api_ss = 'https://masterblog.uestc.edu.cn/api/web/blogs/hot';
    var api_ss = 'https://masterblog.uestc.edu.cn/';

    // 博客api
    // var api_bk = '';
    var hotNews1Box = document.querySelector('.hot-news1 .news-content');
    var hotNews2Box = document.querySelector('.hot-news2 .news-content');
    function formatDate(d) {
        return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
    }
    $.ajax({
        type: 'GET',
        url: api_qshp,
        success: function(data) {
            hotNews1Box.insertBefore(getNewsList(dataQSHP(data)),hotNews1Box.firstChild);
        },
        error: function() {
            console.log('调用清水河畔api出现错误');
        }
    });
    $.ajax({
        type: 'GET',
        url: api_cdzx,
        success: function(data) {
            hotNews1Box.insertBefore(getNewsList(dataCDZX(data)),hotNews1Box.firstChild);
        },
        error: function() {
            console.log('调用成电智讯api出现错误');
        }
    });
    $.ajax({
        type: 'GET',
        url: api_ss,
        success: function(data) {
            hotNews2Box.insertBefore(getNewsList(dataSS(data)),hotNews2Box.firstChild);
        },
        error: function() {
            console.log('调用师说api出现错误');
        }
    });
    // 清水河畔数据提取
    function dataQSHP(data) {
    	var list = [];
    	data.list.slice(0,2).forEach(function(item) {
    		list.push({
    			title: item.title,
    			author: item.board_name,
    			p_date: formatDate(new Date(parseInt(item.last_reply_date))),
    			link: item.sourceWebUrl
    		});
    	});
    	return list;
    }
    // 成电智讯数据提取
    function dataCDZX(data) {
        var host = 'http://lightnews.stuhome.net/';
        var list = [];
        data.list.slice(0, 2).forEach(function(item) {
            var content = item.content;
            list.push({
                title: content.title,
                author: content.from,
                p_date: item.time.replace(/-/g,'.'),
                link: host + item.url
            });
        })
        return list;
    }
    // 师说数据提取
    function dataSS(data) {
    	var list = [];
    	data.data.slice(0,4).forEach(function(item) {
    		list.push({
    			title: item.blog.title,
    			author: item.auther.name,
    			p_date: formatDate(new Date(parseInt(item.blog.create_time) * 1000)),
    			// link: item.blog.url
                link: "https://masterblog.uestc.edu.cn/" + item.blog._id
    		});
    	});
    	return list;
    }
    // news list
    function getNewsList(data) {
        var title, p_date, author, htmlStr = '';
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            title = item.title;
            p_date = item.p_date;
            // var d = new Date(item.p_date);
            // p_date = d && d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            author = item.author;
            link = item.link || 'nav.uestc.edu.cn/';
            htmlStr += '<li class="hotNews__item"> \
    			<p class="title"><a href="' + link + '">' + title + '</a></p> \
    			<p class="info"><span class="date">' + p_date + '</span><span class="author">' + author + '</span></p>\
    		</li>';
        }
        var ul = document.createElement('ul');
        ul.innerHTML = htmlStr;
        return ul;
    }
})(window);