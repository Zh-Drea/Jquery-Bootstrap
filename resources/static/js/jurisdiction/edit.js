var PAGE_URLS = {
    GET_BY_ID: contextPath + "/jurisdiction/getById",
    SAVE_OR_UPDATE: contextPath + "/jurisdiction/saveOrUpdate",
    GET_ALL: contextPath + "/jurisdiction/saveOrUpdate"
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
        msg.show("编码不能为空!");
        return;
    }
    if (!params.name) {
        msg.show("名称不正确!");
        return;
    }

    // var goodsGroupIds = $('#dict-multiple-selected').val();
    //
    // var goodsGroup = [];
    //
    // $.each(goodsGroupIds, function (index, obj) {
    //
    //     goodsGroup.push({'id': obj});
    //
    //     params.goodsGroups = goodsGroup;
    //
    // });

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
