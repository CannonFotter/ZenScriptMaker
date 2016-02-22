var zm = function () {
};
zm.prototype.format = function (str, params) {
  var reg = /{(\d+)}/gm;
  return str.replace(reg, function (match, name) {
    return params[~~name];
  });
};
zm.prototype.getRealCraft = function (input) {
  /* 原理说明：
   * 先确定合成表的实际大小，然后重新转换成定长数组
   */
  //console.log(input);
  //横向距离
  var hStart = 0,
    hEnd = 0,
    isFirstValidSlot = 1,
    h = 0;
  for (var i = 0; i < input.length; i++) {
    for (var j = 0; j < input[i].length; j++) {
      if (input[i][j] != 'null') {
        //如果开始位置或许比真正第一个不是空的位置小，要修正并锁定
        if (isFirstValidSlot != 0 && j < hStart) {
          hStart = j;
          //是第一个不是null的槽么？
          isFirstValidSlot = 0;
        }

        //如果默认的结束位置，比现在的位置大，那么应该修正结束位置
        //首尾算法不一样的原因，是因为循环顺序，离首位越来越远，离末尾越来越近
        hEnd = (hEnd < j) ? j : hEnd;
      }
      h = (h < hEnd - hStart) ? hEnd - hStart : h;
    }
    isFirstValidSlot = 1;
  }
  //纵向
  var vStart = 0,
    vEnd = 0,
    v = 0;
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      if (input[j][i] != 'null') {
        //如果开始位置或许比真正第一个不是null的位置小，要修正并锁定
        if (isFirstValidSlot != 0) {
          vStart = j;
          //是第一个不是null的槽么？
          isFirstValidSlot = 0;
        }

        //如果默认的结束位置，比现在的位置大，那么应该修正结束位置
        //首尾算法不一样的原因，是因为循环顺序，离首位越来越远，离末尾越来越近
        vEnd = (vEnd < j) ? j : vEnd;
      }
      v = (v < vEnd - vStart) ? vEnd - vStart : v;
    }
    isFirstValidSlot = 1;
  }
  var arr = [];
  for (i = 0; i <= v; i++) {
    arr[i] = [];
    for (j = 0; j <= h; j++) {
      //vStart,hStart可以理解为纵横偏离值
      arr[i][j] = input[i + vStart][j + hStart];
    }
  }
  return arr;
};
zm.prototype.getTemplate = function () {
  var templates = [];
  templates['addShaped'] = 'recipes.addShaped({0}, {1});';
  templates['addShapeless'] = 'recipes.addShapeless({0}, {1});';
  templates['removeShaped'] = 'recipes.removeShaped({0}, {1});';
  templates['removeShapeless'] = 'recipes.removeShapeless({0}, {1});';
  //templates['remove'] = 'recipes.remove({})';
  var a = $('input[name=r1]').val() + $('input[name=r0]').val();
  return templates[a];

};
//把基础参数和高级参数组合到一起
zm.prototype.mix = function (inputObj) {
  console.log(inputObj);
  var base = $(inputObj).data('val'),
    adv = $(inputObj).data('adv'),
    fix = '';
  console.log($(inputObj).data('adv'));
  if (adv != '') {
    $.each($.parseJSON(adv), function (p, q) {
      if (typeof(q) == 'string') {
        fix += '.' + p + '(' + q + ')';
      } else {
        //专门为多参数准备的
        var temp = '';
        $.each(q, function (m, n) {
          temp += n + ', ';
        });
        temp = temp.substring(0, temp.length - 2);
        fix += '.' + p + '(' + temp + ')';
      }
    });
  }
  return base + fix;
};


zm.prototype.preBuild = function (opt) {
  //如果是true，说明是相对位置
  var slots = $('input[name=i]'),
    result = [],
    _this = this;
  $.each(slots, function (k, v) {
    var row = $(v).data('row'),
      num = $(v).data('num');
    //重建二维数组
    //傻逼js,php大法好
    result[row] = (result[row]) ? result[row] : [];
    result[row][num] = _this.mix(v);
  });
  var temp = [];
  result = (opt) ? _this.getRealCraft(result) : result;
  $.each(result, function (k, v) {
    //按行构建
    temp[k] = '[' + v.join(', ') + ']';
  });
  result = '[' + temp.join(', ') + ']';
  return result;
};
//按行组合输入数据
zm.prototype.generate = function (template, opt) {
  //console.log(this); zm
  return this.format(this.getTemplate(), [$('input[name=o]').data('val') + ' * ' + $('#number-select').val(), this.preBuild(opt)]);
};

//测试用
var a = [
  ['minecraft:stone', 'minecraft:stone', 'minecraft:stone'],
  ['null', 'minecraft:stone', 'null'],
  ['null', 'null', 'null']
];
