var PAGE_URLS = {
    GET_BY_ID: contextPath + "/appVersion/getById",
    SAVE_OR_UPDATE: contextPath + "/appVersion/saveOrUpdate"
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

    $.each(constantsEnumData.deviceType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#device-type-select'));
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

    if (!params.deviceType) {
        msg.show("设备类型不能为空!");
        return;
    }
    if (!params.buildVersion) {
        msg.show("构建版本不能为空!");
        return;
    }
    if (!REG_EXPS.INTEGER.test(params.buildVersion)) {
        msg.show("构建版本只能为整数!");
        return;
    }
    
    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
