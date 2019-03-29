var PAGE_URLS = {
    GET_BY_ID: contextPath + "/user/getById",
    SAVE_OR_UPDATE: contextPath + "/user/updateUserType",
    GET_LEVEL: contextPath + "/userLevel/getAllByUserType"
};

var msg = new Message();

var initPage = function (params) {

    initFormData(params);

};

var initFormData = function (params) {

    $.each(constantsEnumData.userType,function (index,row) {

        $('<OPTION>').val(row.value).text(row.name).appendTo($('#user-type-select'));
    });

    $('#user-type-select').change(function () {

        var optionValue = $('#user-type-select option:selected').val();

        if (optionValue === 'NORMAL') {

            $('#userDis').hide()
        }
        else {

            $('#userDis').show()
        }

        var res = $.sendRequest(PAGE_URLS.GET_LEVEL,JSON.stringify({userType:optionValue}));

        if (!checkRespCodeSuccess(res)) {

            msg.show(res.errDesc);

            return;
        }

        $('#user-level-select').empty();

        $.each(res.data,function (index,obj) {

            $('<OPTION>').val(obj.id).text(obj.name).appendTo($('#user-level-select'))
        })
    });

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };

        var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {
            msg.show(result.errDesc);
            return;
        }

        $('#edit-form').autoFillForm(result.data);

        if (result.data.userType === 'NORMAL') {

            $('#userDis').hide();
        }

        $('#user-type-select').change();

        if (result.data.userLevel) {

            $('#user-level-select').val(result.data.userLevel.id);
        }
        else{
            $('#userDis').hide();

            $('#user-level-select').empty();
        }
    }
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();
    
    if (params.userType === 'NORMAL') {
        delete params.userLevelId;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
