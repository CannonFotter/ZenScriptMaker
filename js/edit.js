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

    //$('#copy').click(function (){
    //    $.event.special.copy.options.trustedDomains = ["*"];
    //    $(this).zclip({
    //        path: "./js/lib/jquery.zeroclipboard/dist/ZeroClipboard.swf",
    //        copy: function(){
    //            alert('');
    //            return $('#output').val();
    //        },
    //        afterCopy:function(){/* 复制成功后的操作 */
    //            //var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
    //            //$("body").find(".copy-tips").remove().end().append($copysuc);
    //            //$(".copy-tips").fadeOut(3000);
    //        }
    //    });
    //});

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
                    } else {
                        alert("请选择一个物品槽");
                    }
                });
            }
        }, 0.2);
    });
}

//function copyToClipboard(obj) {
//    $.event.special.copy.options.trustedDomains = ["*"];
//    $("#copy").zclip({
//        path: "ZeroClipboard.swf",
//        copy: function () {
//            return $(this).parent().find(".input").val();
//        },
//        afterCopy: function () {/* 复制成功后的操作 */
//            var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
//            $("body").find(".copy-tips").remove().end().append($copysuc);
//            $(".copy-tips").fadeOut(3000);
//        }
//    });
//}