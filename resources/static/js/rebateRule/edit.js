var PAGE_URLS = {
    GET_BY_ID: contextPath + "/rebateRule/getById",
    SAVE_OR_UPDATE: contextPath + "/rebateRule/saveOrUpdate",
};

var msg = new Message();

var initPage = function (params) {

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };
        var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {
            msg.show(result.errDesc);
            return;
        }

        $('#edit-form').autoFillForm(result.data);

    }

};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();





    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
