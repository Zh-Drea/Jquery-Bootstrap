var PAGE_URLS = {
    GET_BY_ID: contextPath + "/applyRefundRefAttachment/getByApplyRefundId"
};

var initPage = function (params) {

    initPageDom(params);
};

var initPageDom = function (params) {

    var res = {
        applyRefundId: params.callParams.applyRefundId
    };

    var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(res));

    $.each(result.data,function (index,obj) {

        var imageDetail = obj.attachment.resourceFullAddress;

        $("<P>").append($('<IMG>').attr('src', imageDetail).addClass('common-show-img')).appendTo($('#image-template'));

    })

};