var PAGE_URLS = {
    GET_BY_ID: contextPath + "/userLevel/getById",
    SAVE_OR_UPDATE: contextPath + "/userLevel/saveOrUpdate"
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    $.each(constantsEnumData.userType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#user-type-select'));
    });

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
        msg.show("编码不能为空!");
        return;
    }

    if (!params.name) {
        msg.show("级别名称不能为空!");
        return;
    }

    if (!REG_EXPS.PLUS_INTEGER.test(params.level)) {
        msg.show("级别格式不正确!");
        return;
    }

    if (params.couponAmount !== "0") {

        if (!REG_EXPS.PLUS_MONEY.test(params.couponAmount)) {
            msg.show("优惠金额格式不正确!");
            return;
        }
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
