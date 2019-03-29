var PAGE_URLS = {
    GET_BY_ID: contextPath + "/logisticDetail/getById",
    SAVE_OR_UPDATE: contextPath + "/logisticDetail/saveOrUpdate",
    GET_ALL_COMPANY: contextPath + "/logisticCompany/getAll"
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var packageId;

var initPageDom = function (params) {

    packageId = params.callParams.orderPackageId;

    //获取物流公司
    $.sendRequest(PAGE_URLS.GET_ALL_COMPANY, JSON.stringify({}), {}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#logistic-company-list'));

                if (index === 0) {
                    $('#logistic-company-list').val(row.id);
                }
            });
        }
    });
    //获取发货状态
    $.each(constantsEnumData.deliveryStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#delivery-status-list'));

        if (index === 'DELIVERED') {
            $('#delivery-status-list').val(obj.value);
        }
    });

    $.each(constantsEnumData.logisticType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#logistic-detail-status'));

        if (index === 'LOGISTIC') {
            $('#logistic-detail-status').val(obj.value);
        }
    });

    $('#logistic-detail-status').change(function () {

        var res = $(this).children('option:selected').val();

        if (res === 'LOGISTIC') {

            $('#logisticNo').show();

            $('#logistic-company').show();

            $('#deliveryStatus').show();

            $('#login').hide();
        }
        else {

            $('#logisticNo').hide();

            $('#logistic-company').hide();

            $('#deliveryStatus').hide();

            $('#login').show();
        }
    });

};

var initFormData = function (params) {

    if (params.callParams.detailId) {

        var p = {
            id: params.callParams.detailId
        };

        var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {
            new Message().show(result.errDesc);
            return;
        }

        $('#edit-form').autoFillForm(result.data);

        $('#delivery-status-list').val(result.data.orderPackage.deliveryStatus);

        $('#detail-id').val(params.callParams.detailId);

        $('#logistic-detail-status').change();
    }
};


var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    params.id = $('#detail-id').val() ? $('#detail-id').val() : "";

    var deliveryStatus = params.deliveryStatus;

    delete params.deliveryStatus;

    params.orderPackage ={
        id: packageId,
        deliveryStatus : deliveryStatus
    };

    params.logisticCompany = {
        id: $('#logistic-company-list').val()
    };

    if ($('#logistic-detail-status').children('option:selected').val() !== 'LOGISTIC') {

        var res = {};

        res.id = params.id;

        res.logisticType = 'SELF_MENTION';

        res.orderPackage = params.orderPackage;

        res.remark = params.remark;

        return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(res));
    }

    else {

        return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
    }
};
