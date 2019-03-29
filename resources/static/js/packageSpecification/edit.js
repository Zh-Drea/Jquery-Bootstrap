var PAGE_URLS = {
    GET_BY_ID: contextPath + "/packageSpecification/getById",
    SAVE_OR_UPDATE: contextPath + "/packageSpecification/saveOrUpdate"
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }
};

var initFormData = function (params) {

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

    if (!params.code) {
        msg.show("打包规格编码不能为空!");
        return;
    }
    if (!params.name) {
        msg.show("打包规格名称不能为空!");
        return;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

