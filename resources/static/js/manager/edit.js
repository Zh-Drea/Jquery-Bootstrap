var PAGE_URLS = {
    GET_BY_ID: contextPath + "/manager/getById",
    SAVE_OR_UPDATE: contextPath + "/manager/saveOrUpdate",
    ROLES_GET_ALL: contextPath + "/role/getAll"
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

    $.each(constantsEnumData.managerType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#manager-type-list'));

    });

    $.each(constantsEnumData.accountState, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#account-state-list'));

    });

    $.each(constantsEnumData.sexual, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#sexual-list'));

    });

    $.sendRequest(PAGE_URLS.ROLES_GET_ALL, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#role-type-list'));

            });
        }
    });

    $('#role-type-list').multiselect({
        buttonWidth: '216px'  ,
        nonSelectedText: '请选择',
        maxHeight: 200
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

        if (result.data.managerType === 'SUPER') {

            $('#manager-type-list OPTION').remove();

            $('<OPTION>').val('SUPER').text('超级管理员').appendTo($('#manager-type-list'));
        }

        var optHandle = params.yesCallbackParams.viewOptHandle;

        if (OPT_HANDLE.UPDATE === optHandle) {

            var roles = [];

            if (result.data.roles) {

                $.each(result.data.roles, function (index, obj) {

                    roles.push(obj.id);
                });
            }

            $('#role-type-list').multiselect('select', roles);
        }

    }

};

//添加信息
var saveOrUpdate = function () {
    //直接序列化为json数组
    var params = $('#edit-form').serializeJson();

    if (!params.username) {
        msg.show("用户名不能为空!");
        return;
    }
    if (params.phoneNo) {

        if (!REG_EXPS.PLUS_INTEGER.test(params.phoneNo)) {

            msg.show("电话号码格式不正确!");
            return;
        }
    }
    if (params.email) {

        if (!REG_EXPS.MAILBOX.test(params.email)) {

            msg.show("邮箱格式不正确!");
            return;
        }
    }

    var roles = $('#role-type-list').val();

    var role = [];

    $.each(roles, function (index, obj) {

        role.push({'id': obj});

        params.roles = role;

    });

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
