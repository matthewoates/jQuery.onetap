$(function () {
    $('.stage').on('tapstart', function (e) {
        $(this).css({background: '#555'});
    }).on('tapstop', function (e) {
        $(this).css({background: '#333'});
    }).on('tapdrag', function (e) {
        $('.draggable').css({
            left: e.pageX - $('.draggable').width() / 2,
            top: e.pageY - $('.draggable').height() / 2
        });
    });
});
