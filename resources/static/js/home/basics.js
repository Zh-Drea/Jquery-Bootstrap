var PAGE_URLS = {
    GET_BY_ID : contextPath + "/manager/getById",
    UPDATE : contextPath + "/manager/update"
};

var msg = new Message();

$(function () {

    $.each(constantsEnumData.sexual, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#sexual-list'));

    });

    $('#modifiedData').click(function () {

        var params = $('#edit-form').serializeJson();

        if (params.phoneNo) {
            
            if (!REG_EXPS.PLUS_INTEGER.test(params.phoneNo)) {
                msg.show("电话号码格式不正确!");
                return;
            } 
        }
        
        if (params.email) {

            if (!REG_EXPS.MAILBOX.test(params.email)) {
                msg.show("邮箱地址不正确!");
                return;
            }
        }
        
        params.id = $('#managerId').text();

        var obj = $.sendRequest(PAGE_URLS.UPDATE,JSON.stringify(params));

        if (checkRespCodeSuccess(obj)) {

            msg.show("修改成功!");

            return;
        }
    });

    var managerId = {
        id : $('#managerId').text()
    };

    var result = $.sendRequest(PAGE_URLS.GET_BY_ID,JSON.stringify(managerId));

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDesc);

        return;
    }

    $('#edit-form').autoFillForm(result.data);
});