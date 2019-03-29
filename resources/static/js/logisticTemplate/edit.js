var PAGE_URLS = {
    GET_BY_ID: contextPath + "/logisticTemplate/getById",
    SAVE_OR_UPDATE: contextPath + "/logisticTemplate/saveOrUpdate"
};

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

    $.each(constantsEnumData.logisticTemplateType, function (index, obj) {
        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#logistic-template-type-select'));
    });
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

    if (!params.name) {
        msg.show("型号编码不能为空!");
        return;
    }
    if (!params.summary) {
        msg.show("说明不能为空!");
        return;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

var msg = new Message();