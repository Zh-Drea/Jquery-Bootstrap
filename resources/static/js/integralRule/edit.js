var PAGE_URLS = {
    GET_BY_ID: contextPath + "/integralRule/getById",
    SAVE_OR_UPDATE: contextPath + "/integralRule/saveOrUpdate"
};

var msg = new Message();

var initPage = function (params) {

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

    if (!params.singleOrderMinDeductIntegralNum) {
        msg.show("单笔订单最小抵扣积分数量不能为空!");
        return;
    }

    if (params.singleOrderMinDeductIntegralNum < 0 || !REG_EXPS.PLUS_INTEGER.test(params.singleOrderMinDeductIntegralNum)) {
        msg.show("单笔订单最小抵扣积分数量格式不正确!");
        return;
    }

    if (!params.singleOrderMaxDeductIntegralNum) {
        msg.show("单笔订单最大抵扣积分数量不能为空!");
        return;
    }

    if (params.singleOrderMaxDeductIntegralNum < 0 || !REG_EXPS.PLUS_INTEGER.test(params.singleOrderMaxDeductIntegralNum)) {
        msg.show("单笔订单最大抵扣积分数量格式不正确!");
        return;
    }

    if (parseInt(params.singleOrderMinDeductIntegralNum) > parseInt(params.singleOrderMaxDeductIntegralNum)) {
        msg.show("单笔订单最小抵扣积分数量不能大于最大抵扣积分数量!");
        return;
    }

    if (!params.rmbExchangeToIntegralRate) {
        msg.show("人民币(元)换算成积分比例不能为空!");
        return;
    }

    if (!REG_EXPS.PLUS_MONEY.test(params.rmbExchangeToIntegralRate)) {
        msg.show("人民币换算成积分格式不正确!");
        return;
    }

    if (!params.integralExchangeToRmbRate) {
        msg.show("积分换算成人民币比例(元)不能为空!");
        return;
    }

    if (!REG_EXPS.PLUS_MONEY.test(params.integralExchangeToRmbRate)) {
        msg.show("积分换算成人民币比例(元)格式不正确!");
        return;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
