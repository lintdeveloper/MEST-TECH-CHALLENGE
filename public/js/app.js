$(document).ready(function() {
    $('#openSearch').click(function() {
        $('#searchField').toggleClass('hide slideInDown fadeOutUp');
    });
    $('#searchClose').click(function() {
        $('#searchField').addClass('hide slideInDown fadeOutUp');
    });

    $('#findServices').click(function() {
        $('#searchField').toggleClass('hide slideInDown fadeOutUp');
    });
    // $('#searchClose').click(function() {
    //     $('#searchField').addClass('hide');
    // });
    $('#alert_close').click(function () {
        $("#alert_box").fadeOut("slow", function () {
        });
    });
    $(document).ready(function () {
        $('select').formSelect();
    });
    $('.dropdown-trigger').dropdown();
});