var PAGE_URLS = {
    GET_BY_ID: contextPath + "/rebateRule/getById",
    SAVE_OR_UPDATE: contextPath + "/rebateRule/updateRemark"
};

var msg = new Message();

var initPage = function (params) {

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };

        var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);

            return;
        }

        $('#edit-form').autoFillForm(result.data);
    }

};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    if (!params.remark) {
        msg.show("备注不能为空!");
        return;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
