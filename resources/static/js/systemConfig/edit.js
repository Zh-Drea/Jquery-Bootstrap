var PAGE_URLS = {
    GET_BY_ID: contextPath + "/systemConfig/getById",
    SAVE_OR_UPDATE: contextPath + "/systemConfig/saveOrUpdate"
};

var msg = new Message();

var initPage = function (params) {

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

        if (null !== result.data.invitationCodeShareImageAttachment) {
            $('#attachment-image').attr('src', result.data.invitationCodeShareImageAttachment.resourceFullAddress).data(result.data.invitationCodeShareImageAttachment);
        }

        if (null !== result.data.appDownloadImageAttachment) {
            $('#attachment-app-image').attr('src', result.data.appDownloadImageAttachment.resourceFullAddress).data(result.data.appDownloadImageAttachment);
        }
    }
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    if (!params.webappOuterMainUrl) {
        msg.show("webapp地址不能为空!");
        return;
    }

    if (!params.invitationCodeShareUrl) {
        msg.show("webapp邀请码分享地址不能为空!");
        return;
    }

    if (!params.invitationCodeShareTitle) {
        msg.show("webapp邀请码分享标题不能为空!");
        return;
    }

    if (!params.invitationCodeShareDesc) {
        msg.show("webapp邀请码分享描述不能为空!");
        return;
    }

    params.invitationCodeShareImageAttachment = {
        id: $('#invitationCodeShareImageAttachmentId').val()
    };

    params.appDownloadImageAttachment = {
        id: $('#appDownloadImageAttachmentId').val()
    };

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

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
            }
            ,done: function (result, index, upload) {
                msg.closeLoading();

                if (checkRespCodeSuccess(result)) {

                    $('#invitationCodeShareImageAttachmentId').val(result.data.id);

                    $('#attachment-image').attr('src', result.data.resourceFullAddress).data(result.data);
                }

            }, error: function (index, upload) {
                msg.closeLoading();
            }
        });
    });

    layui.use('upload', function () {

        var upload = layui.upload;

        upload.render({
            elem: '#select-file-app-btn',
            url: uploadParams.uploadUrl,
            auto: false,
            data: {
                attachmentOrigin: uploadParams.attachmentOrigin
            },
            bindAction: '#upload-file-app-btn',
            before: function (obj) {

                msg.loading();
            }
            ,done: function (result, index, upload) {
                msg.closeLoading();

                if (checkRespCodeSuccess(result)) {

                    $('#appDownloadImageAttachmentId').val(result.data.id);

                    $('#attachment-app-image').attr('src', result.data.resourceFullAddress).data(result.data);
                }

            }, error: function (index, upload) {
                msg.closeLoading();
            }
        });
    });
});