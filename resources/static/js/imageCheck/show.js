var initPage = function (params) {

    var res = params.callParams;

    $.each(res,function (index,obj) {

        var imageDetail = obj.frontOrBack;

        $("<P>").append($('<IMG>').attr('src', imageDetail).addClass('common-show-img')).appendTo($('#image-template'));

    })
};