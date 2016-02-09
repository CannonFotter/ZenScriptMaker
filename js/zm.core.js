function getRealCraft(input) {
  /* 原理说明：
   * 先确定合成表的实际大小，然后重新转换成定长数组
   */
  //横向距离
  var hStart = 0,
    hEnd = 0,
    isFirstValidSlot = 1,
    h = 0;
  for (var i = 0; i < input.length; i++) {
    for (var j = 0; j < input[i].length; j++) {
      if (input[i][j] != '') {
        //如果开始位置或许比真正第一个不是空的位置小，要修正并锁定
        if (isFirstValidSlot != 0 && j < hStart) {
          hStart = j;
          //是第一个不是null的槽么？
          isFirstValidSlot = 0;
        }

        //如果默认的结束位置，比现在的位置大，那么应该修正结束位置
        //首尾算法不一样的原因，是因为循环顺序，离首位越来越远，离末尾越来越近
        if (hEnd < j) {
          hEnd = j;
        }
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
        if (vEnd < j) {
          vEnd = j;
        }
      }
      v = (v < vEnd - vStart) ? vEnd - vStart : v;
    }
    isFirstValidSlot = 1;
  }
  //console.log('h:' + h + ';v:' + v);
  //console.log('hStart:' + hStart);
  //console.log('vStart:' + vStart);
  var arr = [];
  for (i = 0; i <= v; i++) {
    arr[i] = [];
    for (j = 0; j <= h; j++) {
      //vStart,hStart可以理解为纵横偏离值
      //console.log('i:' + i + ' , j:' + j);
      arr[i][j] = input[i + vStart][j + hStart];
      //arr[i].push([]);
    }
  }
  //console.log(arr);
  return arr;
  //然后就要重新组合，送给generate()生成脚本了
}
//把基础参数和高级参数组合到一起
function preBuild() {
  var slots = $('input[name=i]'),
    result = [];
  $.each(slots, function (k, v) {
    var base = $(v).data('val'),
      adv = $(v).data('adv'),
      fix = '';
    if (adv != '') {
      $.each($.parseJSON(adv), function (p, q) {
        if (typeof(q) == 'string') {
          fix += '.' + p + '(' + q + ')';
        } else {
          //专门为多参数准备的
          var temp = '';
          $.each(q, function (k, v) {
            temp += v + ', ';
          });
          temp = temp.substring(0, temp.length - 2);
          fix += '.' + p + '(' + temp + ')';
        }
      });
    }
    result[k] = base+fix;
  });
  console.log(result);
  return result;
}
//按行组合输入数据
function generate(template, input, opt) {

}
var a = [
  ['minecraft:stone', 'minecraft:stone', 'minecraft:stone'],
  ['null', 'minecraft:stone', 'null'],
  ['null', 'null', 'null']
];
