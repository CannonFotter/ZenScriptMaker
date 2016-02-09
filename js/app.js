var index;
$(document).ready(function () {
  //Init
  //默认页
  $('#main').load('./app/index.html');
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
