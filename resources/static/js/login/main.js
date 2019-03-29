function checkOrOut(){

    var check=$('input[type=checkbox]').is(':checked');

    if (check === false) {

        $('#login-tip').css({
            'display':'none'
        });
    }

}

$(function() {

    $('#login-tip').css({
        'color': 'red', 'margin-top': '33px'
    });
});