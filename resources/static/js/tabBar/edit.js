var PAGE_URLS = {
    GET_BY_ID: contextPath + "/tabBar/getById",
    SAVE_OR_UPDATE: contextPath + "/tabBar/saveOrUpdate"
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

    if (!params.code) {
        msg.show("编码不能为空!");
        return;
    }
    if (!params.name) {
        msg.show("名称不能为空!");
        return;
    }

    params.unActiveImageAttachment = {
        id: $('#imageAttachmentUnActiveId').val()
    };
    params.activeImageAttachment = {
        id: $('#imageAttachmentActiveId').val()
    };

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

            if (null !== result.data.unActiveImageAttachment) {
                $('#attachment-image-unActive').attr('src', result.data.unActiveImageAttachment.resourceFullAddress).data(result.data.unActiveImageAttachment);
            }
            if (null !== result.data.activeImageAttachment) {
                $('#attachment-image-active').attr('src', result.data.activeImageAttachment.resourceFullAddress).data(result.data.activeImageAttachment);
            }
        }
    }

};

var msg = new Message();

$(function () {

    layui.use('upload', function () {

        var upload = layui.upload;

        upload.render({
            elem: '#select-file-unActive-btn',
            url: uploadParams.uploadUrl,
            auto: false,
            data: {
                attachmentOrigin: uploadParams.attachmentOrigin
            },
            bindAction: '#upload-file-unActive-btn',
            before: function (obj) {
                msg.loading();
            },
            done: function (result, index, upload) {
                msg.closeLoading();

                if (checkRespCodeSuccess(result)) {

                    $('#imageAttachmentUnActiveId').val(result.data.id);

                    $('#attachment-image-unActive').attr('src', result.data.resourceFullAddress).data(result.data);
                }

            }, error: function (index, upload) {
                msg.closeLoading();
            }
        });
    });

    layui.use('upload', function () {

        var upload = layui.upload;

        upload.render({
            elem: '#select-file-active-btn',
            url: uploadParams.uploadUrl,
            auto: false,
            data: {
                attachmentOrigin: uploadParams.attachmentOrigin
            },
            bindAction: '#upload-file-active-btn',
            before: function (obj) {
                msg.loading();
            },
            done: function (result, index, upload) {
                msg.closeLoading();

                if (checkRespCodeSuccess(result)) {

                    $('#imageAttachmentActiveId').val(result.data.id);

                    $('#attachment-image-active').attr('src', result.data.resourceFullAddress).data(result.data);
                }

            }, error: function (index, upload) {
                msg.closeLoading();
            }
        });
    });
});