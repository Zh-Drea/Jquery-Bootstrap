var PAGE_URLS = {
    CHANGE_PRO: contextPath + '/applyWithdrawCash/applyWithdrawCashChangeWithdrawProgress'
};

var cashId;

var initPage = function (params) {

    layui.use('laydate', function () {

        var laydate = layui.laydate;

        laydate.render({
            elem: '#transferDatetime',
            type: 'datetime'
        });
    });

    $.each(constantsEnumData.withdrawProgress, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#withdraw-progress-list'));
    });

    if (params.callParams.id) {
        $('#withdraw-progress-list').val(params.callParams.withdrawProgress);
        $('#transfer-amount').val(params.callParams.transferAmount);
        $('#transferDatetime').val(params.callParams.transferDatetime);
    }

    cashId = params.callParams.id
};

//添加信息
var saveOrUpdate = function () {
    //直接序列化为json数组

    var params = {
        id : cashId,
        withdrawProgress : $('#withdraw-progress-list').val(),
        transferDatetimeStr: $('#transferDatetime').val(),
        transferAmount:$('#transfer-amount').val()
    };

    return $.sendRequest(PAGE_URLS.CHANGE_PRO, JSON.stringify(params));
};