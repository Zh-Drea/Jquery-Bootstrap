var PAGE_URLS = {
    GET_BY_ID: contextPath + "/user/getById",
    SAVE_OR_UPDATE: contextPath + "/user/updateUserAccountState"
};

var initPage = function (params) {

    $.each(constantsEnumData.accountState, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#account-state-select'));
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

        $('#edit-form').autoFillForm(result.data);
    }
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
