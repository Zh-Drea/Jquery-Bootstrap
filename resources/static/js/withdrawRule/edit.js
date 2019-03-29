var PAGE_URLS = {
    GET_BY_ID: contextPath + "/withdrawRule/getById",
    SAVE_OR_UPDATE: contextPath + "/withdrawRule/saveOrUpdate"
};

var msg = new Message();

var initPage = function (params) {

    var req = [
        {id:1,name:'星期一'},
        {id:2,name:'星期二'},
        {id:3,name:'星期三'},
        {id:4,name:'星期四'},
        {id:5,name:'星期五'},
        {id:6,name:'星期六'},
        {id:0,name:'星期天'}
    ];

    $.each(req, function (index, row) {

        $('<OPTION>').val(row.id).text(row.name).appendTo($('#goods-group-multiple-selected'));
    });

    $('#goods-group-multiple-selected').multiselect({
        buttonWidth: '337px'  ,
        nonSelectedText: '请选择',
        maxHeight: 200
    });

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };

        var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {
            new Message().show(result.errDesc);
            return;
        }

        $('#goods-group-multiple-selected').multiselect('select', JSON.parse(result.data.withdrawWeekdays));

        $('#edit-form').autoFillForm(result.data);
    }
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    if (!params.singleOrderMinWithdrawAmount) {
        msg.show("单笔订单最小提现金额不能为空!");
        return;
    }
    if (!params.singleOrderMaxWithdrawAmount) {
        msg.show("单笔订单最大提现金额不能为空!");
        return;
    }
    if (!params.bonusCoinExchangeToRmbRate) {
        msg.show("奖金币换算成人民币比例(元)不能为空!");
        return;
    }

    if (!params.singleDayMaxWithdrawTotalAmount) {
        msg.show("单日最大累计提现金额不能为空!");
        return;
    }

    if (!params.singleDayMaxWithdrawNum) {
        msg.show("单日最大提现次数不能为空!");
        return;
    }

    if (!params.withdrawRate) {
        msg.show("提现费率(千分比)不能为空!");
        return;
    }

    params.withdrawWeekdaysList = $('#goods-group-multiple-selected').val();

    if(params.withdrawWeekdaysList.length === 0 ){

        delete params.withdrawWeekdaysList
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};