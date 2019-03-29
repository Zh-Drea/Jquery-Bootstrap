var PAGE_URLS = {
    GET_BY_ID: contextPath + '/dictType/getById',
    SAVE_OR_UPDATE: contextPath + '/dictType/saveOrUpdate'
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

//添加信息
var saveOrUpdate = function () {
    //直接序列化为json数组
    var params = $('#edit-form').serializeJson();

    if (!params.name) {
        msg.show("名称不能为空!");
        return;
    }

    if (!params.code) {
        msg.show("编码不能为空!");
        return;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};