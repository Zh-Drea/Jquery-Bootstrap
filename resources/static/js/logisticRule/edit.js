var PAGE_RULE_URLS = {
    GET_BY_ID: contextPath + "/logisticRule/getById",
    SAVE_OR_UPDATE: contextPath + "/logisticRule/saveOrUpdate"
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var logisticTemplateAll;


var initPageDom = function (params) {

    logisticTemplateAll = params.callParams.logisticTemplateAll;

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

    if (logisticTemplateAll.logisticTemplateType === 'WEIGHT') {

        $.each($('SPAN'), function (index, res) {

            var obj = $(res);

            if (index === 0) {
                obj.text("首重重量")
            }
            if (index === 1) {
                obj.text("kg")
            }
            if (index === 2) {
                obj.text("续重重量")
            }
            if (index === 3) {
                obj.text("kg")
            }
            if (index === 4) {
                obj.text("首重费用")
            }
            if (index === 6) {
                obj.text("续重费用")
            }
        });
    }


};

var initFormData = function (params) {

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };

        var result = $.sendRequest(PAGE_RULE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {
            new Message().show(result.errDesc);
            return;
        }
        $('#edit-form').autoFillForm(result.data);
    }

};


var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    params.logisticTemplate = {
        id: logisticTemplateAll.id
    };

    if (logisticTemplateAll.logisticTemplateType === 'PIECE') {

        if (!REG_EXPS.PLUS_INTEGER.test(params.baseUnit)) {
            msg.show("首件数量格式不正确!");
            return;
        }
        if (!REG_EXPS.PLUS_INTEGER.test(params.perAddUnit)) {
            msg.show("续件数量格式不正确!");
            return;
        }
        if (!REG_EXPS.PLUS_MONEY.test(params.baseUnitPrice)) {
            msg.show("首件费用格式不正确!");
            return;
        }
        if (!REG_EXPS.PLUS_MONEY.test(params.perAddUnitPrice)) {
            msg.show("续件费用格式不正确!");
            return;
        }
    } else {
        if (!REG_EXPS.JUST_NUMBER.test(params.baseUnit)) {
            msg.show("首重重量格式不正确!");
            return;
        }
        if (!REG_EXPS.JUST_NUMBER.test(params.perAddUnit)) {
            msg.show("续重重量格式不正确!");
            return;
        }
        if (!REG_EXPS.PLUS_MONEY.test(params.baseUnitPrice)) {
            msg.show("首重费用格式不正确!");
            return;
        }
        if (!REG_EXPS.PLUS_MONEY.test(params.perAddUnitPrice)) {
            msg.show("续重费用格式不正确!");
            return;
        }
    }

    return $.sendRequest(PAGE_RULE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};