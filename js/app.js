var index,
  log4js = require('log4js'),
  logger = log4js.getLogger();
$(document).ready(function () {
  //Init
  logger.info('init');
  //默认页
  $('#main').load('./app/index.html', function (){

  });
  //加个回调函数
  $.getJSON('./data/index.json', function (data) {
    index = $.makeArray(data.menu);
  });
  //$('.item-list-head').stickUp();
  //菜单点击效果
  $('#nav a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    $('#main').load('./app/' + index[0][this.id]);
  });
});
