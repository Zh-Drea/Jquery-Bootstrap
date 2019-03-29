var PAGE_URLS = {
    SAVE_OR_UPDATE: contextPath + "/applyRefund/auditApplyRefund"
};

var msg = new Message();

var applyRefundAmount;

var initPage = function (params) {

    initFormData(params);

};

var initFormData = function (params) {

    $.each(constantsEnumData.applyRefundProgress,function (index,row) {

        if (row.value === 'AUDIT_PASS' || row.value === 'AUDIT_NOT_PASS') {

            $('<OPTION>').val(row.value).text(row.name).appendTo($('#apply-refund-progress-select'));

        }
    });

    var res = params.callParams.row;

    applyRefundAmount = res.applyRefundAmount;

    $("INPUT[name ='applyRefundId']").val(res.id);

    if (res.applyRefundProgress !== 'NOT_AUDIT') {

        if (res.applyRefundProgress === 'AUDIT_PASS'){

            $('#refuseReason').hide();
        }

        if (res.applyRefundProgress === 'AUDIT_NOT_PASS') {

            $('#refundAmount').hide();
        }

        $('SELECT').val(res.applyRefundProgress);

        $("INPUT[name ='agreeRefundAmount']").val(res.agreeRefundAmount);

        $("INPUT[name ='rejectReason']").val(res.rejectReason);

        $("INPUT[name ='remark']").val(res.remark);

        optionChange();

    }
    else {

        $("INPUT[name ='agreeRefundAmount']").val(res.agreeRefundAmount);

        $("INPUT[name ='rejectReason']").val(res.rejectReason);

        $("INPUT[name ='remark']").val(res.remark);

        $('#refundAmount').hide();

        optionChange();

    }
};

var optionChange = function () {

    $('#apply-refund-progress-select').change(function () {

        var neo = $(this).children('option:selected').val();

        if (neo === 'AUDIT_PASS') {

            $('#refuseReason').hide();

            $('#refundAmount').show();
        }
        else {
            $('#refuseReason').show();

            $('#refundAmount').hide();
        }
    });

};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();
    
    if (params.applyRefundProgress === 'AUDIT_PASS') {

        if (!REG_EXPS.PLUS_MONEY.test(params.agreeRefundAmount)) {

            msg.show("同意退款金额格式不正确!");

            return;
        }

        if (params.agreeRefundAmount > applyRefundAmount) {

            msg.show("同意退款金额不能大于申请退款金额!");

            return;
        }

        delete params.rejectReason;
    }
    else {

        if (!params.rejectReason) {

            msg.show("拒绝理由不能为空!");

            return;
        }

        delete params.agreeRefundAmount;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));

};
