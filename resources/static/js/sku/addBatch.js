var PAGE_URLS = {
    GET_REF_PAGE: contextPath + "/spu/getSpuRefGoodsAttributePage",
    SAVE_OR_UPDATE: contextPath + "/sku/batchAddSku",
    GET_ALL_GOODS_MODEL: contextPath + "/goodsModel/getAll",
    GET_ALL_LOG: contextPath +'/logisticTemplate/getAll',
    GET_ALL_REPERTORY: contextPath +"/repertory/getAll",
    GET_ALL_PACKAGE_SPECIFICATION: contextPath +"/packageSpecification/getAll",
    GET_ALL_REBATE_RULE: contextPath +"/rebateRule/getAll"
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

};

var index = 2;

var res;

var spuIdOnly;

var imageAttachmentId;

//增加删除tab
var addDelItem = function () {

    $('.glyphicon-plus').click(function () {

        var templateTab = $('#li-template').clone();

        $(templateTab).attr('id','li-template-'+index).find('A').attr('href', '#tab-ref-detail-'+index).text('商品'+index);

        $('<span class="glyphicon glyphicon-remove"></span>').appendTo($(templateTab));

        $(templateTab).find('SPAN').addClass('delete-position');

        if (index > 9) {

            $(templateTab).find('SPAN').css({
                'margin-left' : '60px'
            })
        }

        $('.glyphicon-plus').before($(templateTab));

        var templateDetails = $('#tab-ref-detail-1').clone();

        $(templateDetails).attr('id','tab-ref-detail-'+index).removeClass('in active');

        $(templateDetails).find('#spuNameCopy').val($('#spuName').val());

        $(templateDetails).find('#spuSummaryCopy').val($('#spuSummary').val());

        $(templateDetails).find('#recordNoCopy').val($('#recordNo').val());

        $(templateDetails).find('#enableRebateSelected').val($('#enableRebateSelected').val());

        //给复制界面的多选框附上功能
        $(templateDetails).find('#rebate-rule-multiple-selected').multiselect({
            buttonWidth: '330px',
            nonSelectedText: '请选择',
            maxHeight: 200,
            enableFiltering: true
        });

        $(templateDetails).find('SPAN').val('返利规则').next().children('DIV').remove();

        $(templateDetails).appendTo($('#myTabContent'));

        index++;

        $('#myTab a:last').tab('show');

        $.each($('li[id^="li-template-"]'), function (index,obj) {

            var item = $(obj).find('SPAN');

            $(item).click(function () {

                $(this).parent().hide();

                var hrefAttachmentId = $(this).prev().attr('href');

                $('#myTab li:eq(0) a').tab('show');

                $(hrefAttachmentId).attr('role','delete');
            });
        });

        //给复制界面添加返利规则tip信息
        $.each($('div[id^="tab-ref-detail-"]'), function (index,obj) {

            $(obj).find("LABEL").mouseenter(function () {

                var _this = this;

                var res = $(this).find('INPUT').attr('value');

                $.each($("#rebate-rule-multiple-selected option"), function (index, des) {

                    var item = $(des);

                    if ($(item).attr('value') === res) {

                        layer.tips($(item).attr('content'), _this, {
                            tips: [1, '#3595CC']
                        });
                    }
                });
            });

            $(obj).find("LABEL").mouseleave(function () {

                layer.tips();
            });
        });
    });
};

var initPageDom = function (params) {

    $('#spuName').val(params.callParams.name);

    $('#spuNameCopy').val(params.callParams.name);

    $('#spuSummary').val(params.callParams.summary);

    $('#spuSummaryCopy').val(params.callParams.summary);

    addDelItem();

    spuIdOnly = params.callParams.spuId;

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

    $.each(res, function (index, obj) {

        var optionTemp = $('#option-template').clone().attr('id', 'option-select' + obj.id);

        optionTemp.find('SPAN').val(obj.id).text(obj.name);

        var select = optionTemp.find('SELECT').data(obj);

        $.each(obj.goodsAttributeOptions, function (j, option) {

            $('<OPTION>').val(option.id).text(option.value).appendTo(select);
        });

        $('#option-template').before(optionTemp);
    });

    $.each(constantsEnumData.packageType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#package-type-select'));

        if (index !== 0) {
            $('#package-type-select').val(obj.value);
        }
    });

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

                $('<OPTION>').val(row.id).text(row.code).attr('content',row.ruleRemark ? row.ruleRemark:"").appendTo($('#rebate-rule-multiple-selected'));

            });
        }
    });

    $('#tab-ref-detail-1').find('#rebate-rule-multiple-selected').multiselect({
        buttonWidth: '330px',
        nonSelectedText: '请选择',
        maxHeight: 200,
        enableFiltering: true
    });

    $("LABEL").mouseenter(function () {

        var _this = this;

        var res = $(this).find('INPUT').attr('value');

        $.each($("#rebate-rule-multiple-selected option"), function (index, obj) {

            var item = $(obj);

            if ($(item).attr('value') === res) {

                layer.tips($(item).attr('content'), _this, {
                    tips: [1, '#3595CC']
                });
            }
        });
    });

    $("LABEL").mouseleave(function () {

        layer.tips();
    })
};
//判断批量上传商品参数是否正确
var validateParams = function (params) {

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
    //PLUS为正整数
    if (!REG_EXPS.PLUS_INTEGER.test(params.minimumUnitOfMeasure)) {
        msg.show("最小计量单位格式不正确!");
        return;
    }
    if (!REG_EXPS.POSITIVE_INTEGER.test(params.stockNum)) {
        msg.show("库存格式不正确!");
        return;
    }
    //POSITIVE为正整数和零,NUMBER为纯数字,PLUS为正整数
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
    if (!REG_EXPS.PLUS_MONEY.test(params.marketPrice)) {
        msg.show("市场价格格式不正确!");
        return;
    }
    if (!REG_EXPS.PLUS_MONEY.test(params.agentPrice)) {
        msg.show("代理价格格式不正确!");
        return;
    }
    if (!REG_EXPS.PLUS_MONEY.test(params.costPrice)) {
        msg.show("成本价格格式不正确!");
        return;
    }

    if (!REG_EXPS.JUST_NUMBER.test(params.packagedWeight)) {
        msg.show("打包重量格式不正确!");
        return;
    }

    return true;
};

var saveOrUpdate = function () {

    var spuDetails = [];

    var isExist = false;

    $.each($('div[id^="tab-ref-detail-"]'), function (index,obj) {

        //跳出本次循环
        if ($(obj).attr('role')) {

            return true;
        }

        var params = $(obj).find('.col-xs-12').serializeJson();

        var goodsAttributes = [];

        params.spu = {
            id:spuIdOnly
        };

        params.imageAttachment = {
            id: imageAttachmentId
        };

        params.logisticTemplate = {
            id: $('#logistic-template-select').val()
        };

        params.repertory = {
            id: $('#repertory-list').val()
        };

        var model = $(obj).find('#goods-model-list').val();

        var pack = $(obj).find('#package-specification-list').val();

        if(model !== "") {

            params.goodsModel = {
                id: $(obj).find('#goods-model-list').val()
            };
        }

        if (pack !== "") {

            params.packageSpecification = {
                id: $(obj).find('#package-specification-list').val()
            };
        }

        if ($(obj).find('#enableRebateSelected option:selected').val() === "true"){

            params.rebateRule ={
                id: $('#rebate-rule-multiple-selected').val()
            };

        }else{

            params.rebateRule ={
                id: null
            };
        }

        var publicParams = $('#details-form').serializeJson();

        delete publicParams.name;

        delete publicParams.recordNo;

        delete publicParams.summary;

        $.extend(params,publicParams);

        //如果没有返回true，则不进行循环
        if (!validateParams(params)) {

            isExist = true;

            return false;
        }

        $.each(res, function (index, rs) {

            var p = {};

            var plt = {};

            var goodsAttributeOptions = [];

            var attrName = rs.id;

            p.id = $(obj).find('#option-select' + rs.id).find('SELECT').val();

            goodsAttributeOptions.push(p);

            plt.id = attrName;

            plt.goodsAttributeOptions = goodsAttributeOptions;

            goodsAttributes.push(plt);

            params.goodsAttributes = goodsAttributes;
        });

        spuDetails.push(params);
    });

    //如果输入字符不正确，则不调用接口
    if (isExist) {

        return;
    }

    var allParams = {};

    allParams.skuList = spuDetails;

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(allParams));
};