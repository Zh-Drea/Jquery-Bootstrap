var PAGE_SERVICE_URLS = {
    GET_BY_ID: contextPath + "/specialService/getById",
    SAVE_OR_UPDATE: contextPath + "/specialService/saveOrUpdate"
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

    $.each(constantsEnumData.optionsSelectType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#options-select-type'));

        if (index === 'SINGLE') {
            $('#options-select-type').val(obj.value);
        }
    });

};

var initFormData = function (params) {

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };

        var result = $.sendRequest(PAGE_SERVICE_URLS.GET_BY_ID, JSON.stringify(p));

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
        msg.show("特殊服务编码不能为空!");
        return;
    }
    if (!params.name) {
        msg.show("特殊服务名称不能为空!");
        return;
    }

    return $.sendRequest(PAGE_SERVICE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

