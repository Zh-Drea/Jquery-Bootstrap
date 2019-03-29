var PAGE_URLS = {
    GET_BY_ID: contextPath + "/columnGroup/getById",
    SAVE_OR_UPDATE: contextPath + "/columnGroup/saveOrUpdate"
};

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    params.imageAttachment = {
        id: $('#imageAttachmentId').val()
    };

    if (!params.code) {
        msg.show("栏目标识不能为空!");
        return;
    }
    if (!params.title) {
        msg.show("栏目标题不能为空!");
        return;
    }
    if (!REG_EXPS.INTEGER.test(params.orderNum)) {
        msg.show("排列序号格式不正确!");
        return;
    }
    if ("" === params.imageAttachment.id) {
        msg.show("照片不能为空!");
        return;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

var initFormData = function (params) {

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

        var optHandle = params.yesCallbackParams.viewOptHandle;

        if (OPT_HANDLE.UPDATE === optHandle) {

            if (null !== result.data.imageAttachment) {
                $('#attachment-image').attr('src', result.data.imageAttachment.resourceFullAddress).data(result.data.imageAttachment);
            }
        }
    }

};

var msg = new Message();

$(function () {

    layui.use('upload', function () {

        var upload = layui.upload;

        upload.render({
            elem: '#select-file-btn',
            url: uploadParams.uploadUrl,
            auto: false,
            data: {
                attachmentOrigin: uploadParams.attachmentOrigin
            },
            bindAction: '#upload-file-btn',
            before: function (obj) {
                msg.loading();
            },
            done: function (result, index, upload) {
                msg.closeLoading();

                if (checkRespCodeSuccess(result)) {

                    $('#imageAttachmentId').val(result.data.id);

                    $('#attachment-image').attr('src', result.data.resourceFullAddress).data(result.data);
                }

            }, error: function (index, upload) {
                msg.closeLoading();
            }
        });
    });

});