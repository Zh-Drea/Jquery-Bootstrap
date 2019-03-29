var PAGE_URLS = {
    SAVE_WORD : contextPath + "/manager/updatePassword"
};

var msg = new Message();

$(function () {

    $('#btn-edit').click(function () {

        var params = $('#edit-form').serializeJson();

        if (!params.oldPassword || !params.newPassword || !params.rePassword) {
                msg.show("输入不能为空!");
                return;
        }

        if (params.oldPassword === params.newPassword) {
            msg.show("新旧密码不能一致");
            return;
        }
        //密码需由6到18位字母和数字组合
        if (!REG_EXPS.PASSWORD.test(params.newPassword)) {
            msg.show("新密码格式不正确");
            return;
        }

        if (params.newPassword !== params.rePassword) {
            msg.show("新密码前后不一致!");
            return;
        }

        var result = $.sendRequest(PAGE_URLS.SAVE_WORD, JSON.stringify(params));

        if (!checkRespCodeSuccess(result)) {

            msg.show(result.errDesc);

            return;
        }

        //清空input框的值
        $('.form-control').val("");

        msg.show("密码修改成功!");

    })
});