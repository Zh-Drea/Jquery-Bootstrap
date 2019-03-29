var PAGE_DOMS = {
    ATTR_EDIT_ITEM: "attr-edit-item"
};

var PAGE_URLS = {
    GET_REF_PAGE: contextPath + "/spu/getSpuRefGoodsAttributePage",
    SAVE_OR_UPDATE: contextPath + "/spu/saveOrUpdateSpuRefAttribute",
    DELETE_ATTR: contextPath + "/spu/deleteGoodsAttribute",
    DELETE_OPTION: contextPath + "/spu/deleteAttributeOption"
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (params.callParams.id) {
        $('#spu-id').val(params.callParams.id);
    }

};

var saveOrUpdate = function () {

    var params = {
        'spuId': $('#spu-id').val()
    };

    var goodsAttributes = [];

    var hasEmptyChar = false;

    $.each($('div[id^="' + PAGE_DOMS.ATTR_EDIT_ITEM + '"]'), function (index, obj) {

        var item = $(obj).find("input[name='attr-name']");

        var attributeId = item.data() ? item.data().id : null;
        var name = item.val();
        var goodsAttributeOptions = [];

        if (name === '') {

            hasEmptyChar = true;

            return true;
        }

        var options = $(obj).find('.item-option-edit-panel input');

        for (var i = 0; i < options.length; i++) {

            var option = $(options[i]);

            if (!option.parent().hasClass('attr-option-template')) {

                var value = option.val();

                if (value === '') {

                    hasEmptyChar = true;

                    return true;
                }

                goodsAttributeOptions.push({
                    id: option.data() ? option.data().id : null,
                    value: value
                });
            }

        }

        goodsAttributes.push({
            id: attributeId,
            name: name,
            goodsAttributeOptions: goodsAttributeOptions
        })

    });

    if (hasEmptyChar) {
        msg.show('属性及属性选项不能为空');
        return;
    }

    params.goodsAttributes = goodsAttributes;

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

var initFormData = function (params) {

    if (params.callParams.id) {

        var p = {
            spuId: params.callParams.id
        };

        var result = $.sendRequest(PAGE_URLS.GET_REF_PAGE, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {

            msg.show(result.errDesc);

            return;
        }

        if (result.data) {
            addAttrItem(result.data);
        }
    }

};

var itemId = 0;

var addAttrItem = function (page) {

    $(page.records).each(function (index, obj) {

        var attrItem = $('#attr-item-template').clone();

        attrItem.attr("id", PAGE_DOMS.ATTR_EDIT_ITEM + "-" + itemId).css({
            'display': 'block'
        }).appendTo($('#attr-edit-from'));

        attrItem.find("input[name='attr-name']").data(obj).val(obj.name);

        var attrDeleteBtn = attrItem.find('.attr-item-remove-badge');

        if (obj.id) {

            if (obj.canDelete) {

                attrDeleteBtn.click(function () {

                    var result = $.sendRequest(PAGE_URLS.DELETE_ATTR, JSON.stringify({"id": obj.id}));

                    if (!checkRespCodeSuccess(result)) {

                        msg.show(result.errDesc);

                        return;
                    }

                    $(this).parents('.attr-item').remove();
                });
            } else {
                attrDeleteBtn.css({'visibility': 'hidden'});
            }

        } else {
            attrDeleteBtn.click(function () {

                $(this).parents('.attr-item').remove();
            });
        }

        attrItem.find('.attr-option-remove-badge').click(function () {
            $(this).parent().remove();
        });

        attrItem.find('.attr-option-add-btn').click(function () {

            var optionItem = attrItem.find('.attr-option-template').clone();

            optionItem.css({
                'margin-left': '4px'
            }).removeClass('attr-option-template');

            optionItem.insertAfter($(this).parent().prev());

            optionItem.find('.attr-option-remove-badge').click(function () {
                $(this).parent().remove();
            });

        });

        if (obj.goodsAttributeOptions) {
            addAttrItemOptions(attrItem, obj.goodsAttributeOptions);
        }

        itemId++;
    });

};

var addAttrItemOptions = function (attrItem, options) {

    $.each(options, function (index, obj) {

        var optionItem = attrItem.find('.attr-option-template').clone();

        optionItem.css({
            'margin-left': '4px'
        }).removeClass('attr-option-template');

        optionItem.find('input').val(obj.value).data(obj);

        optionItem.insertAfter(attrItem.find('.attr-option-add-btn').parent().prev());

        var optionDeleteBtn = optionItem.find('.attr-option-remove-badge');

        if (obj.id) {

            if (obj.canDelete) {

                optionDeleteBtn.click(function () {

                    var result = $.sendRequest(PAGE_URLS.DELETE_OPTION, JSON.stringify({"id": obj.id}));

                    if (!checkRespCodeSuccess(result)) {

                        msg.show(result.errDesc);

                        return;
                    }

                    $(this).parent().remove();
                });
            } else {
                optionDeleteBtn.css({'visibility': 'hidden'});
            }

        } else {
            optionDeleteBtn.click(function () {
                $(this).parent().remove();
            });
        }

    });

};

$(function () {

    var records = [];

    var item = {
        name: ''
    };

    records.push(item);

    $('#add-attr-btn').click(function () {
        addAttrItem({
            records: records
        });
    });

});