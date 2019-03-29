var PAGE_SERVICE_URLS = {
    GET_BY_ID: contextPath + "/specialServiceOption/getById",
    SAVE_OR_UPDATE: contextPath + "/specialServiceOption/saveOrUpdate",
    GET_ALL_SPECIAL_SERVICE: contextPath + "/specialService/getAll"
};

var msg = new Message();

var goodsModelId;

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    goodsModelId = params.callParams.goodsModelId;

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

    $.sendRequest(PAGE_SERVICE_URLS.GET_ALL_SPECIAL_SERVICE, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#specialService-list'));

            });
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

        $('#specialService-list').val(result.data.goodsModelRefSpecialService.specialService.id);
    }

};


var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    var goodsModelRefSpecialService = {};

    goodsModelRefSpecialService.goodsModel = {
        id: goodsModelId
    };

    goodsModelRefSpecialService.specialService = {
        id: $('#specialService-list').val()
    };

    params.goodsModelRefSpecialService = goodsModelRefSpecialService;

    if (!params.name) {
        msg.show("特殊服务名称不能为空!");
        return;
    }

    if (params.price != 0) {
        if ( !REG_EXPS.PLUS_MONEY.test(params.price)) {
            msg.show("特殊服务价格格式错误!");
            return;
        }
    }


    return $.sendRequest(PAGE_SERVICE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

