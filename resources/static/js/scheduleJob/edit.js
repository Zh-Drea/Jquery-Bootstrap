var PAGE_URLS = {
    GET_BY_ID: contextPath + "/scheduleJob/getById",
    SAVE_OR_UPDATE: contextPath + "/scheduleJob/saveOrUpdate"
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


    $.each(constantsEnumData.scheduleStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#schedule-status-select'));

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

    if (!params.jobName) {
        msg.show("任务名称不能为空!");
        return;
    }
    if (!params.jobGroup) {
        msg.show("任务分组不能为空!");
        return;
    }
    if (!params.serviceUrl) {
        msg.show("服务地址不能为空!");
        return;
    }
    if (!params.interfaceUrl) {
        msg.show("接口地址不能为空!");
        return;
    }
    if (!params.cronExpression) {
        msg.show("定时任务表达式不能为空!");
        return;
    }
    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

