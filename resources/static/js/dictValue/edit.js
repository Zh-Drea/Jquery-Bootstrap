var PAGE_VALUE_URLS = {
    GET_BY_ID: contextPath + "/dictValue/getById",
    SAVE_OR_UPDATE: contextPath + "/dictValue/saveOrUpdate"
};

var msg = new Message();

var dictTypeId;

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    dictTypeId = params.callParams.dictTypeId;

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

};

var initFormData = function (params) {

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };

        var result = $.sendRequest(PAGE_VALUE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {
            new Message().show(result.errDesc);
            return;
        }
        $('#edit-form').autoFillForm(result.data);
    }

};


var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    params.dictType = {
        id: dictTypeId
    };

    if (!params.value) {
        msg.show("字典内容不能为空!");
        return;
    }
    if (!params.name) {
        msg.show("字典名称不能为空!");
        return;
    }
    return $.sendRequest(PAGE_VALUE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

