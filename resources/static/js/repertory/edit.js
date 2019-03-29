var PAGE_URLS = {
    GET_BY_ID: contextPath + "/repertory/getById",
    SAVE_OR_UPDATE: contextPath + "/repertory/saveOrUpdate",
    GET_ALL: contextPath + "/country/getAll"
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

    //  获取国家Id
    $.sendRequest(PAGE_URLS.GET_ALL, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {
            // $("#country-list").append("<option>请选择</option>");
            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#country-list'));

                if (index === 0) {
                    $('#country-list').val(row.id);
                }
            });
        }
    });

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
    //关联国家表
    params.country = {
        id: $('#country-list').val()
    };
    if (!params.country.id) {
        msg.show("请选择国家!");
        return;
    }
    if (!params.code) {
        msg.show("仓库编码不能为空!");
        return;
    }
    if (!params.name) {
        msg.show("仓库名称不能为空!");
        return;
    }
    if (!params.address) {
        msg.show("详细地址不能为空!");
        return;
    }

    if (!REG_EXPS.REP_ADDRESS.test(params.address)) {
        msg.show("详细地址格式不正确!");
        return;
    }

    if (!params.defaultSenderName) {
        msg.show("默认发货人不能为空!");
        return;
    }
    if (!REG_EXPS.NUM.test(params.defaultSenderName)) {
        msg.show("默认发货人格式不正确!");
        return;
    }

    if (!params.defaultSenderPhoneNo) {
        msg.show("默认发货电话号码不能为空!");
        return;
    }
    if (!REG_EXPS.REP_PHONE.test(params.defaultSenderPhoneNo)) {
        msg.show("默认发货电话格式不正确!");
        return;
    }

    if (params.phoneNo) {

        if (!REG_EXPS.PLUS_INTEGER.test(params.phoneNo)) {
            msg.show("电话号码格式不正确!");
            return;
        }
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
