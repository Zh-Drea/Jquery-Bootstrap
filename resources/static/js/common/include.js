var checkRespCodeSuccess = function (result) {
    return null != result && '00' === result.respCode;
};

var OPT_HANDLE = {
    SAVE: 'save',
    UPDATE: 'update',
    DELETE: 'delete'
};

$(function () {

    var msg = new Message();

    /**
     * Ajax Start
     */
    $(document).ajaxStart(function () {
        msg.loading();
    });

    /**
     * Ajax Stop
     */
    $(document).ajaxComplete(function (event, request, settings) {

        msg.closeLoading();

        if (request.readyState !== 4) {
            return;
        }

        if (request.status === 518) {
            msg.show('登录超时...');
            window.top.location.href = contextPath + '/loginPage';
            return;
        }

        if (request.status === 500) {
            msg.show('系统错误, 请稍后再试...');
        }
    });

});
