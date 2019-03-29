var PAGE_URLS = {
    GET_BY_ID: contextPath + "/question/getById",
    SAVE_OR_UPDATE: contextPath + "/question/saveOrUpdate"
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

    $.each(constantsEnumData.questionType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#question-type-list'));
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

    if (!params.problem) {
        msg.show("问题不能为空!");
        return;
    }
    if (!params.answer) {
        msg.show("答案不能为空!");
        return;
    }
    if (!params.orderNum) {
        msg.show("排序规则不能为空!");
        return;
    }

    if (!REG_EXPS.INTEGER.test(params.orderNum)) {
        msg.show("排序规则只能为整数!");
        return;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};