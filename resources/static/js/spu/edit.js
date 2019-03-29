var PAGE_URLS = {
    GET_BY_ID: contextPath + "/spu/getById",
    SAVE_OR_UPDATE: contextPath + "/spu/saveOrUpdate",
    GET_ALL_COUNTRY: contextPath + "/country/getAll",
    GET_ALL_COUNTRY_PAVILION: contextPath + "/countryPavilion/getAll",
    GET_ALL_BRAND: contextPath + "/brand/getAllByGoodsGroupId",
    GET_ALL_GOODS_GROUP: contextPath + "/goodsGroup/getAll",
    GET_ALL_USAGE_GROUP: contextPath + "/usageGroup/getAll"
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    layui.use('laydate', function () {

        var laydate = layui.laydate;

        laydate.render({
            elem: '#shelfLifeDate'
        });
    });

    $('#goodsGroup-list').change(function () {

        var isExist = false;

        $("#brand-list").find("option").remove();

        $("#brand-list").prepend("<option value=''>请选择</option>");

        var p = {
            goodsGroupId: $(this).val()
        };
        if ($(this).val()) {

            $.sendRequest(PAGE_URLS.GET_ALL_BRAND,JSON.stringify(p),{},function (result) {

                if (checkRespCodeSuccess(result)){

                    $.each(result.data, function (index, row) {

                        $('<OPTION>').val(row.id).text(row.name).appendTo($('#brand-list'));

                        if (!isExist && brandId === row.id) {
                            isExist = true;
                        }

                    });

                    if (isExist) {
                        $('#brand-list').val(brandId);
                    }
                }

            })
        }

    });

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

    //获取国家
    $.sendRequest(PAGE_URLS.GET_ALL_COUNTRY, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#origin-list'));

                if (index === 0) {
                    $('#origin-list').val(row.id);
                }
            });
        }
    });

    // 获取国家馆
    $.sendRequest(PAGE_URLS.GET_ALL_COUNTRY_PAVILION, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#country-pavilion-list'));

                if (index === 0) {
                    $('#country-pavilion-list').val(row.id);
                }
            });
        }
    });

    //获取商品分类
    $.sendRequest(PAGE_URLS.GET_ALL_GOODS_GROUP, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#goodsGroup-list'));
            });

        }

    });

    $.each(constantsEnumData.goodsType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#goods-type-list'));
    });

    //获取用途分类
    // $.sendRequest(PAGE_URLS.GET_ALL_USAGE_GROUP, JSON.stringify({}), {async: false}, function (result) {
    //
    //     if (checkRespCodeSuccess(result)) {
    //
    //         $.each(result.data, function (index, row) {
    //
    //             $('<OPTION>').val(row.id).text(row.name).appendTo($('#usage-group-multiple-selected'));
    //
    //         });
    //     }
    // });

    // $('#usage-group-multiple-selected').multiselect({
    //     buttonWidth: '188px'  ,
    //     nonSelectedText: '请选择'
    // });
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    params.origin = {
        id: $('#origin-list').val()
    };

    params.countryPavilion = {
        id: $('#country-pavilion-list').val()
    };

    params.brand = {
        id: $('#brand-list').val()
    };

    params.goodsGroup = {
        id: $('#goodsGroup-list').val()
    };
    if (!params.goodsGroup.id) {
        msg.show("分类不能为空!");
        return;
    }
    if (!params.brand.id) {
        msg.show("品牌不能为空!");
        return;
    }
    if (!params.code) {
        msg.show("商品编码不能为空!");
        return;
    }
    if (!params.name) {
        msg.show("商品名称不能为空!");
        return;
    }

    if (!REG_EXPS.PLUS_MONEY.test(params.agentUnitPrice)) {
        msg.show("代理商单价格式不正确!");
        return;
    }

    if (!REG_EXPS.PLUS_MONEY.test(params.retailUnitPrice)) {
        msg.show("普通用户单价格式不正确!");
        return;
    }
    
    if (!REG_EXPS.PLUS_INTEGER.test(params.singleOrderMinNum)) {
        msg.show("单次下单最小数量格式不正确!");
        return;
    }
    if (!REG_EXPS.PLUS_INTEGER.test(params.singleOrderMaxNum)) {
        msg.show("单次下单最大数量格式不正确!");
        return;
    }
    if (parseInt(params.singleOrderMinNum) >= parseInt(params.singleOrderMaxNum)) {
        msg.show("单次下单最小数量必须小于最大数量!");
        return;
    }
    if (!REG_EXPS.PLUS_INTEGER.test(params.afterSaleDays)) {
        msg.show("售后天数格式不正确!");
        return;
    }

    // var usageGroupIds = $('#usage-group-multiple-selected').val();
    //
    // var usageGroup = [];
    //
    // $.each(usageGroupIds, function (index, obj) {
    //
    //     usageGroup.push({'id': obj});
    //
    //     params.usageGroups = usageGroup;
    //
    // });

    var shelfLifeDateStr = params.shelfLifeDate;

    delete params.shelfLifeDate;

    var allParams = {};

    allParams.spu = params;

    allParams.shelfLifeDateStr = shelfLifeDateStr;

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(allParams));
};

var brandId;

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

        brandId = result.data.brand.id;

        $('#edit-form').autoFillForm(result.data);

        $('#goodsGroup-list').change();

        // var usageGroupIds = [];
        // //回显分类选项
        // if (result.data.usageGroups) {
        //
        //     $.each(result.data.usageGroups, function (index, obj) {
        //
        //         usageGroupIds.push(obj.id);
        //     });
        // }
        //
        // $('#usage-group-multiple-selected').multiselect('select', usageGroupIds);

    }

};
