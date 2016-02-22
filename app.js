//var index;
//  //Init
//  //默认页
//  $('#main').load('./app/index.html');
//  //加个回调函数
//  $.getJSON('./data/index.json', function (data) {
//    index = $.makeArray(data.menu);
//  });
//  //$('.item-list-head').stickUp();
//  //菜单点击效果
//  $('#nav a').click(function (e) {
//    e.preventDefault();
//    $(this).tab('show');
//    $('#main').load('./app/' + index[0][this.id]);
//  });
var logger = require('log4js').getLogger(),
  fs = require('fs');
var dir = process.cwd();
//插件化不可避
//首先读取data下所有文件夹中的package.json
logger.info("Loading all plugins...");
fs.readdir(dir"", function (err, files) {
  //logger.info(files);
  for (var i = 0; i < files.length; i++) {

  }
});
