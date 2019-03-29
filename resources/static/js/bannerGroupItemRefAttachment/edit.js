var PAGE_URLS = {
    SAVE_OR_UPDATE_DETAILS: contextPath + "/bannerGroupItemRefAttachment/saveDetailImages",
    GET_BY_ID: contextPath + "/bannerGroupItemRefAttachment/getDetailImagesByBannerGroupItemId",
    DELETE: contextPath + "/bannerGroupItemRefAttachment/deleteDetailImage"
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

};

var saveOrUpdate = function (obj) {

    if (obj.callParams.id) {

        var params = {};

        var imageAttachments = [];

        params.bannerGroupItemId = obj.callParams.id;

        for (var i = 1; i < index; i++) {

            var plt = {};

            var imageTemple = $( '#image-item-new-' + i).find('IMG').data();

            var imageTempleNum = $( '#image-item-new-' + i).find('INPUT').val();

            if (imageTemple) {

                if (imageTempleNum !== ""){

                    plt.orderNum = imageTempleNum;
                }
                if (imageTemple.attachment) {
                    plt.id = imageTemple.id;

                    plt.attachment = {
                        id: imageTemple.attachment.id
                    };
                }
                else {
                    plt.attachment = {
                        id: imageTemple.id
                    };
                }

                imageAttachments.push(plt);
            }
        }

        params.bannerGroupItemRefAttachments = imageAttachments;

    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE_DETAILS, JSON.stringify(params));
};

var initFormData = function (params) {

    if (params.callParams.id) {

        var p = {
            bannerGroupItemId: params.callParams.id
        };

        var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {
            new Message().show(result.errDesc);
            return;
        }

        if (result.data.length !== 0) {

            $.each(result.data,function (index,obj) {

                addImageToImagesPanel(obj);
            })
        }

    }

};

var index = 1;

var addImageToImagesPanel = function (attachments) {

    var cloneTemp = $('#image-item-template').clone().attr('id', 'image-item-new-' + index);

    if (attachments.attachmentType) {
        cloneTemp.find('IMG').attr('src', attachments.attachment.resourceFullAddress).css({
            "width": "200px", "height": "100px"
        }).data(attachments);

        cloneTemp.find('INPUT').css({
            "width": "50px"
        }).attr('value', attachments.orderNum);

        cloneTemp.find('.image-remove-badge').click(function () {
            var p = {
                id:attachments.id
            };
            var result = $.sendRequest(PAGE_URLS.DELETE, JSON.stringify(p));

            if (!checkRespCodeSuccess(result)) {
                new Message().show(result.errDesc);
                return;
            }
            $(this).parent().remove();
        });
    }
    else {
        cloneTemp.find('IMG').attr('src', attachments.resourceFullAddress).css({
            "width": "200px", "height": "100px"
        }).data(attachments);

        cloneTemp.find('INPUT').css({
            "width": "50px"
        }).attr('value', index);

        cloneTemp.find('.image-remove-badge').click(function () {
            $(this).parent().remove();
        })

    }
    cloneTemp.appendTo($('#images-panel'));

    index++;

};

$(function () {

    layui.use('upload', function () {

        var upload = layui.upload;

        upload.render({
            elem: '#select-file-btn',
            url: uploadParams.uploadUrl,
            multiple:true,
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

                    addImageToImagesPanel(result.data);
                }

            }, error: function (index, upload) {
                msg.closeLoading();
            }
        });
    });

});