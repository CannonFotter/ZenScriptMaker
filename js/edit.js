var methods;
$(document).ready(function () {
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

    $('button').click(function () {
        //if (!$(this).data('purpose') == 'undefined') {
        switch ($(this).data('purpose')) {
            case 'copy':
                break;
            case 'save':
                var fs = require('fs');
                fs.writeFile('./output/' + new Date().getTime() + '.zs', $('#output').val(), function (err) {
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