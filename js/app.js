var index;
$(document).ready(function () {
    //Init
    //默认页
    $('#main').load('./app/index.html');
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
//$.event.special.copy.options.trustedDomains = ["*"];
//jQuery(document).ready(function ($) {
//    $("body").on("copy", "#copy", function (/* ClipboardEvent */ e) {
//        // Get the currently selected text
//        //var textToCopy = $.Range.current().toString();  // ** Using the jQuery.Range plugin
//        //
//        //// If there isn't any currently selected text, just ignore this event
//        //if (!textToCopy) {
//        //    return;
//        //}
//        alert('');
//        // Clear out any existing data in the pending clipboard transaction
//        e.clipboardData.clearData();
//
//        // Set your own data into the pending clipboard transaction
//        e.clipboardData.setData("text/plain", $('#output').val());
//        //e.clipboardData.setData("text/html", "<b>" + textToCopy + "</b>");
//        //e.clipboardData.setData("application/rtf", "{\\rtf1\\ansi\n{\\b " + textToCopy + "}}");
//
//        // Prevent the default action of copying the currently selected text into the clipboard
//        e.preventDefault();
//    });
//});