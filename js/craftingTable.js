$(document).ready(function () {
  //初始化
  //$.event.special.copy.options.trustedDomains = ["*"];
  $('#nav-box').load('./app/nav-box.html', function () {
    bind()
  });

  //改变选中的槽
  $('.btn-craft-group').change(function () {
    //改选之后，要先恢复navbox默认的值或读取已有的值
    //恢复navbox的状态
    //局部刷新好了
    $('#nav-box').load('./app/nav-box.html',
      function () {
        //重新绑定事件
        bind();
        //先看看选了什么
        var slot = $('input[name=i]:checked');
        if (slot.data('adv')) {
          //如果之前有，先把数据转换成json对象
          var json = $.parseJSON(slot.data('adv')),
            //reuseDOM = $('#reuse'),
            dN1DOM = $('#dFirst'),
            dN2DOM = $('#dSecond'),
            damageDOM = $('#advanceD'),
            nbtDOM = $('#nbt-s'),
            nbt_iDOM = $('#nbt-input'),
          //trDOM = $('#transReplace'),
            tr_iDOM = $('#transR-input');
          console.log(json);
          //暴力对照
          $.each(json, function (k, v) {
            //给下属选框选中
            $("input[data-purpose='" + k + "']").trigger('click');
            switch (k) {
              //reuse没有下属选项，忽略
              //-----------
              //耐久相关
              case 'anyDamage':
              case 'onlyDamaged':
              case 'transformDamage':
              case 'withDamage':
              case 'onlyDamageAtLeast':
              case 'onlyDamageAtMost':
                //
                damageDOM.trigger('click');
                if (v) dN1DOM.attr('value', v);
                break;
              case 'onlyDamageBetween':
                //
                damageDOM.trigger('click');
                dN1DOM.attr('value', v[0]);
                dN2DOM.attr('value', v[1]);
                break;
              //nbt
              case 'withTag':
              case 'onlyWithTag':
                //
                nbtDOM.trigger('click');
                nbt_iDOM.html(v);
                break;
              case 'transformReplace':
                //
                //trDOM.trigger('click');
                tr_iDOM.html(v);
                break;
            }
          });
        }
      });
  });
});
function readCSV(name) {
  var path = './data/' + name + '/itempanel.csv';
  $.get(path,
    function (result) {
      var r = $.csv.toArrays(result);
      setTimeout(function () {
        for (var i = 1; i < r.length; i++) {
          $('#item-list table').append("<tr><td>" + r[i][1] + "</td><td>" + r[i][2] + "</td><td>" + r[i][4] + "</td><td><a href=\"#\" data-val=\"<" + r[i][0] + ":" + r[i][2] + ">\">追加</a></td></tr>");
        }
        if (i = r.length - 1) {
          $('#item-list a').click(function () {
            if ($('.btn-craft-group.active').length > 0) {
              $('.btn-craft-group.active input').data('val', $(this).data('val'));
            }
          });
        }
      }, 0.2);
    });
}

//绑定事件
function bind() {
  //自动显示/隐藏
  $('input[name="a"]').click(function (e) {
    $($(e.target).data('target')).toggle();
  });

  //修改耐久的数字选框是否可修改
  $('input[name="damage"]').click(function (e) {
    if ($(e.target).attr('type') == 'radio') {
      if ($(e.target).attr('class') == 'oNumber') {
        $('#dFirst').removeAttr('readonly');
        $('#dSecond').attr('readonly', '');
      } else if ($(e.target).attr('class') == 'tNumber') {
        $('#dFirst, #dSecond').removeAttr('readonly');
      } else {
        $('#dFirst, #dSecond').attr('readonly', '');
      }
    }
  });

  //nav-box点击应用的事件
  $('#submit').click(function () {
    console.log(new Date().getTime());
    var json = {};
    //先判断下改的是哪个槽
    var slot = $('input[name=i]:checked');

    //再看看都选择改什么了
    var a = $('input[name="a"]:checked');
    var arr = [];
    //先循环获取所有purpose到一个数组，然后indexOf(...)
    for (var i = 0; i < a.length; i++) {
      arr[i] = $(a[i]).data('purpose');
    }
    //console.log(arr);
    if (arr.indexOf('damage') != -1) {
      //
      //先获得选中的
      var dchecked = $('input[name="damage"]:checked').data('purpose');
      //判断数值是否合法
      var s1 = $('#dFirst').val();
      var s2 = $('#dSecond').val();
      if (!/^\d+$/.test(s1) || !/^\d+$/.test(s2) || s1 < 0 || s2 < 0) {
        alert('参数必须是非负整数');
        return false;
      }
      switch (dchecked) {
        case 'transformDamage':
        case 'withDamage':
        case 'onlyDamageAtLeast':
        case 'onlyDamageAtMost':
          //此处需要参数1的值来做参数
          //给选中的槽的data-adv赋值(先存到缓存里)
          json[dchecked] = s1;
          break;
        case 'anyDamage':
        case 'onlyDamaged':
          //此处不需要参数
          json[dchecked] = '';
          break;
        case 'onlyDamageBetween':
          //此处需要参数1和参数2
          if (s1 > s2) {
            alert('参数1必须小于参数2');
            return false;
          }
          json[dchecked] = {0: s1, 1: s2};
          break;
      }
      //再看看参数
    }
    if (arr.indexOf('nbt') != -1) {
      var nbt = $('#nbt-input').val();
      if (nbt) {
        json[$('input[name="nbt"]:checked').data('purpose')] = nbt;
      }
    }
    if (arr.indexOf('transformReplace') != -1) {
      var transReplace = $('#transR-input').val();
      if (transReplace) {
        json['transformReplace'] = transReplace;
      }
    }
    if (arr.indexOf('reuse') != -1) {
      json['reuse'] = '';
    }
    slot.data('adv', JSON.stringify(json));
  });
}

$.getJSON('./data/mods.json',
  function (data) {
    methods = $.makeArray(data.methods);
    $.each(data.mod,
      function (k, v) {
        $('#mod-select').append('<option value="' + k + '">' + v + '</option>');
      });
  });
readCSV('0-mc');

//修改item列表
$('#mod-select').change(function () {
  //console.log($(this).val());
  $('#item-list tbody').html('');
  readCSV($(this).val());
});

//zeroclipboard复制数据
$('#copy').on("copy",
  function (e) {
    e.clipboardData.clearData();
    e.clipboardData.setData("text/plain", $('#output').val());
    e.preventDefault();
  });

//主要按钮点击事件
$('#toolbar2 button').click(function () {
  if (!$(this).data('purpose')) {
    switch ($(this).data('purpose')) {
      case 'copy':
        //$('#copy').trigger();
        break;
      case 'save':
        var fs = require('fs');
        fs.writeFile('./output/' + new Date().getTime() + '.zs', $('#copyright').val() + $('#output').val(),
          function (err) {
            if (err) {
              alert('写入出错，' + err);
            } else {
              alert('写入成功');
            }
          });
        break;
    }
  }
});
/*
 Created by ZenScriptMaker<https://www.github.com/CannonFotter/ZenScriptMaker>
 */
