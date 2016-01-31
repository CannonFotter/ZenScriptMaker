var methods;
$(document).ready(function () {
    $.event.special.copy.options.trustedDomains = ["*"];
    $.getJSON('./data/mods.json', function (data) {
        methods = $.makeArray(data.methods);
        $.each(data.mod, function (k, v) {
            $('#mod-select').append('<option value="' + k + '">' + v + '</option>');
        });
    });
    readCSV('0-mc');
    //$('#item-list-head').stickUp();
    $('#mod-select').change(function () {
        //console.log($(this).val());
        $('#item-list tbody').html('');
        readCSV($(this).val());
    });

    $('.btn-craft-group').change(function () {

    });

    $('#copy').on("copy", function (e) {
        e.clipboardData.clearData();
        e.clipboardData.setData("text/plain", $('#output').val());
        e.preventDefault();
    });
    $('#toolbar2 button').click(function () {
        //if (!$(this).data('purpose') == 'undefined') {
        switch ($(this).data('purpose')) {
            case 'copy':
                //$('#copy').trigger();
                break;
            case 'save':
                var fs = require('fs');
                fs.writeFile('./output/' + new Date().getTime() + '.zs', $('#copyright').val() + $('#output').val(), function (err) {
                    if (err) {
                        alert('写入出错，' + err);
                    } else {
                        alert('写入成功');
                    }
                });
                break;
        }
        // }
    });
    $('#nav-box input').click(function (e) {
        ($(e.target).attr('type') == 'checkbox') ? $($(e.target).data('target')).toggle() : null;
    });
    $('#nav-box input[name="damage"]').click(function (e) {
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
    $('#submit').click(function () {
        var json = {};
        //先判断下改的是哪个槽
        var slot = $('input[name="w"]:checked');
        //再看看都选择改什么了
        var a = $('#nav-box input[name="a"]:checked');
        var arr = [];
        //先循环获取所有purpose到一个数组，然后indexOf(...)
        for(var i =0;i < a.length;i++){
            arr[i] = $(a[i]).data('purpose')
        }
        console.log(arr);
        if (arr.indexOf('damage') != -1) {
            //
            //先获得选中的
            var dchecked = $('input[name="damage"]:checked').data('purpose');
            switch(dchecked){
                case 'transformDamage' :
                case 'withDamage' :
                case 'onlyDamageAtLeast' :
                case 'onlyDamageAtMost' :
                    //此处需要参数1的值来做参数
                    //给选中的槽的data-plus赋值(先存到缓存里)
                    json[dchecked] = $('#dFirst').val();
                    break;
                case 'anyDamage' :
                case 'onlyDamaged' :
                    //此处不需要参数
                    json[dchecked]='';
                    break;
                case 'onlyDamageBetween' :
                    //此处需要参数1和参数2
                    json[dchecked] = $('#dFirst').val()+', '+$('#dSecond').val();
                    break;
            }
            //再看看参数
        }
        if(arr.indexOf('nbt') != -1){
            var nbt = $('#nbt-input').val();
            if(nbt){
                json[$('#nav-box input[name="nbt"]:checked').data('purpose')] = nbt;
            }
        }
        if(arr.indexOf('transformReplace') != -1){
            var transReplace = $('#transR-input').val();
            if(nbt){
                json['transformReplace'] = transReplace;
            }
        }
        console.log(json);
        //明日继续
    });
});
function readCSV(name) {
    var path = './data/' + name + '/itempanel.csv';
    $.get(path, function (result) {
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

function generate(template, input) {
//等等从php核心实现里拿出来
}
/*
 Created by ZenScriptMaker<https://www.github.com/CannonFotter/ZenScriptMaker>
 */