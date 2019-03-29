var PAGE_URLS = {
    GET_BY_ID: contextPath + "/hotKeywords/getById",
    SAVE_OR_UPDATE: contextPath + "/hotKeywords/saveOrUpdate"
};

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
    //修改，获取Id信息
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

    if (!params.keywords) {
        msg.show("关键词不能为空!");
        return;
    }
    if (!REG_EXPS.INTEGER.test(params.orderNum)) {
        msg.show("排序编号格式不正确!");
        return;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

var msg = new Message();