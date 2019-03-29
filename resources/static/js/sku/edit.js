var PAGE_URLS = {
    GET_REF_PAGE: contextPath + "/spu/getSpuRefGoodsAttributePage",
    GET_BY_ID: contextPath + "/sku/getById",
    SAVE_OR_UPDATE: contextPath + "/sku/saveOrUpdate",
    GET_ALL_GOODS_MODEL: contextPath + "/goodsModel/getAll",
    GET_ALL_LOG: contextPath +'/logisticTemplate/getAll',
    GET_ALL_REPERTORY: contextPath +"/repertory/getAll",
    GET_ALL_PACKAGE_SPECIFICATION: contextPath +"/packageSpecification/getAll",
    GET_ALL_REBATE_RULE: contextPath +"/rebateRule/getAll"
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

//SPU属性的集合
var res;

//main界面传过来的spuId
var spuIdOnly;

//main界面传过来的照片id
var imageAttachmentId;

//界面传过来的 是否复制sku
var  isCopySku;

//实现返利规则只能选一个
var rebateOptionChange = function () {

    $('#rebate-rule-multiple-selected').change(function () {

        // Get selected options.
        var selectedOptions = $('#rebate-rule-multiple-selected option:selected');

        if (selectedOptions.length > 0) {
            // Disable all other checkboxes.
            var nonSelectedOptions = $('#rebate-rule-multiple-selected option').filter(function () {
                return !$(this).is(':selected');
            });

            nonSelectedOptions.each(function () {
                var input = $('.dropdown-menu').find('input[value="' + $(this).val() + '"]');
                input.prop('disabled', true);
                input.parent('li').addClass('disabled');
            });
        }
        else {

            $('#rebate-rule-multiple-selected option').each(function () {
                var input = $('.dropdown-menu').find('input[value="' + $(this).val() + '"]');
                input.prop('disabled', false);
                input.parent('li').addClass('disabled');
            });
        }
    })
};

//返利规则回显
var rebateOptionEcho = function () {

    // Get selected options.
    var selectedOptions = $('#rebate-rule-multiple-selected option:selected');

    if (selectedOptions.length > 0) {
        // Disable all other checkboxes.
        var nonSelectedOptions = $('#rebate-rule-multiple-selected option').filter(function () {
            return !$(this).is(':selected');
        });

        nonSelectedOptions.each(function () {
            var input = $('.dropdown-menu').find('input[value="' + $(this).val() + '"]');
            input.prop('disabled', true);
            input.parent('li').addClass('disabled');
        });
    }
    else {

        $('#rebate-rule-multiple-selected option').each(function () {
            var input = $('.dropdown-menu').find('input[value="' + $(this).val() + '"]');
            input.prop('disabled', false);
            input.parent('li').addClass('disabled');
        });
    }
};

var initPageDom = function (params) {

    spuIdOnly = params.callParams.spuId;

    isCopySku=params.callParams.isCopySku;

    imageAttachmentId = params.callParams.imageAttachmentId ? params.callParams.imageAttachmentId : null;

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

     var p = {
        spuId: params.callParams.spuId
    };

    var result = $.sendRequest(PAGE_URLS.GET_REF_PAGE, JSON.stringify(p));

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDesc);

        return;
    }

     res = result.data.records;
    //商品名称及选项
    $.each(res, function (index, obj) {

        var optionTemp = $('#option-template').clone().attr('id', 'option-select' + obj.id);

        optionTemp.find('SPAN').val(obj.id).text(obj.name);

        var select = optionTemp.find('SELECT').data(obj);

        $.each(obj.goodsAttributeOptions, function (j, option) {

            $('<OPTION>').val(option.id).text(option.value).appendTo(select);
        });

        $('#option-template').before(optionTemp);
    });

    // //获取商品状态
    // $.each(constantsEnumData.goodsState, function (index, obj) {
    //
    //     $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#goods-state-select'));
    //
    //     if (index === 'NOT_ON_SALE') {
    //         $('#goods-state-select').val(obj.value);
    //     }
    // });
    //获取打包类型
    $.each(constantsEnumData.packageType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#package-type-select'));

        if (index !== 0) {
            $('#package-type-select').val(obj.value);
        }
    });
    //物流模板
    $.sendRequest(PAGE_URLS.GET_ALL_LOG, JSON.stringify({}),{async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#logistic-template-select'));

                if (index === 0) {
                    $('#logistic-template-select').val(row.id);
                }
            });
        }
    });
    //仓库名称
    $.sendRequest(PAGE_URLS.GET_ALL_REPERTORY, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#repertory-list'));

                if (index === 0) {
                    $('#repertory-list').val(row.id);
                }
            });
        }
    });
    //商品型号
    $.sendRequest(PAGE_URLS.GET_ALL_GOODS_MODEL, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#goods-model-list'));

            });
        }
    });
    //打包规格
    $.sendRequest(PAGE_URLS.GET_ALL_PACKAGE_SPECIFICATION, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#package-specification-list'));

            });
        }
    });

    $.sendRequest(PAGE_URLS.GET_ALL_REBATE_RULE, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.code).attr('content',row.ruleRemark? row.ruleRemark:"").appendTo($('#rebate-rule-multiple-selected'));

            });
        }
    });

    $('#rebate-rule-multiple-selected').multiselect({
        buttonWidth: '205px',
        nonSelectedText: '请选择',
        maxHeight: 200,
        enableFiltering: true
    });

    rebateOptionChange();

    //tips显示返利规则 结算规则内容
    $("LABEL").mouseenter(function () {

        var _this = this;

        var res = $(this).find('INPUT').attr('value');

        $.each($("#rebate-rule-multiple-selected option"),function (index,obj) {

            var item = $(obj);

            if ($(item).attr('value') === res) {

                layer.tips($(item).attr('content'),_this, {
                    tips: [1, '#3595CC']
                });
            }
        });
    });

    $("LABEL").mouseleave(function () {

        layer.tips();
    });
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    var goodsAttributes = [];

    var allParams = {};

    $.each(res, function (index, obj) {

        var p = {};

        var plt = {};

        var goodsAttributeOptions = [];

        var attrName = $('#option-select' + obj.id).find('SPAN').val();

        var attrOption = $('#option-select' + obj.id).find('SELECT').val();

        p.id = attrOption;

        goodsAttributeOptions.push(p);

        plt.id = attrName;

        plt.goodsAttributeOptions = goodsAttributeOptions;

        goodsAttributes.push(plt);

        allParams.goodsAttributes = goodsAttributes;
    });

    params.spu = {
        id:spuIdOnly
    };

    params.logisticTemplate = {
        id: $('#logistic-template-select').val()
    };

    params.imageAttachment = {
        id: imageAttachmentId
    };

    params.repertory = {
        id: $('#repertory-list').val()
    };

    var model = $('#goods-model-list').val();

    var pack = $('#package-specification-list').val();

    if(model !== "") {

        params.goodsModel = {
            id: $('#goods-model-list').val()
        };
    }
    
    if (pack !== "") {

        params.packageSpecification = {
            id: $('#package-specification-list').val()
        };
    }

    if (!params.recordNo) {
        msg.show("备案编号不能为空!");
        return;
    }

    if (params.recordPrice != 0) {

        if (!REG_EXPS.PLUS_MONEY.test(params.recordPrice)) {
            msg.show("备案价格格式不正确!");
            return;
        }
    }

    if (!REG_EXPS.JUST_NUMBER.test(params.packagedWeight)) {
        msg.show("打包重量格式不正确!");
        return;
    }
    //PLUS为正整数
    if (!REG_EXPS.PLUS_INTEGER.test(params.minimumUnitOfMeasure)) {
        msg.show("最小计量单位格式不正确!");
        return;
    }
    //正整数和0
    if (!REG_EXPS.POSITIVE_INTEGER.test(params.stockNum)) {
        msg.show("库存格式不正确!");
        return;
    }
    //POSITIVE为正整数和零,NUMBER为纯数字,PLUS为正整数
    if (!REG_EXPS.PLUS_MONEY.test(params.costPrice)) {
        msg.show("成本价格格式不正确!");
        return;
    }
    if (!REG_EXPS.PLUS_MONEY.test(params.marketPrice)) {
        msg.show("市场价格格式不正确!");
        return;
    }
    if (!REG_EXPS.PLUS_MONEY.test(params.agentPrice)) {
        msg.show("代理价格格式不正确!");
        return;
    }
    if (!REG_EXPS.PLUS_MONEY.test(params.retailPrice)) {
        msg.show("零售价格格式不正确!");
        return;
    }
    if (params.taxPrice != 0) {

        if (!REG_EXPS.PLUS_MONEY.test(params.taxPrice)) {
            msg.show("税费价格格式不正确!");
            return;
        }
    }

    if ($('#enableRebateSelected option:selected').val() === "true"){

        params.rebateRule ={
            id: $('#rebate-rule-multiple-selected').val()[0]
        };

    }else{

        params.rebateRule ={
            id: null
        };
    }

    //如果是拷貝sku，去掉id
    if (isCopySku){
        params.id=null;
    }

    allParams.sku = params;

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(allParams));
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
        //属性名称选项值
        var plt = result.data.skuRefGoodsAttributeOptions;

        if (plt) {

            $.each(plt,function (index,obj) {

                $('#option-select' + obj.goodsAttribute.id).find('SELECT').val(obj.goodsAttributeOption.id);

            });
        }

        if (result.data.rebateRule){

            $('#rebate-rule-multiple-selected').multiselect('select',result.data.rebateRule.id);

            rebateOptionEcho();
        }
    }

    else {

        $('#spuName').val(params.callParams.name);

        $('#spuSummary').val(params.callParams.summary)
    }
};