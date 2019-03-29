var SPU_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var SPU_PAGE_URLS = {
    GET_PAGE_BANNER: contextPath + '/bannerGroupItemRefSpu/getSpuPage',
    GET_PAGE_COLUMN: contextPath + '/columnGroupItemRefSpu/getSpuPage',
    GET_ALL_COUNTRY: contextPath + "/country/getAll",
    GET_ALL_COUNTRY_PAVILION: contextPath + "/countryPavilion/getAll",
    GET_ALL_BRAND: contextPath + "/brand/getAll",
    GET_ALL_GOODS_GROUP: contextPath + "/goodsGroup/getAll",
    GET_ALL_USAGE_GROUP: contextPath + "/usageGroup/getAll"
};

var queryParams = {};

var url;

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    initSpuPageDom();

    if (params.callParams.bannerGroupItemId) {
        queryParams = {
            bannerGroupItemId : params.callParams.bannerGroupItemId
        };
        url = SPU_PAGE_URLS.GET_PAGE_BANNER
    }
    else {
        queryParams = {
            columnGroupItemId : params.callParams.columnGroupItemId
        };
        url = SPU_PAGE_URLS.GET_PAGE_COLUMN

    }

    initBootstrapTable();

    toolbarListener();

};

var initFormData = function (params) {

};

var toolbarListener = function () {

};

var initBootstrapTable = function () {

    var options = {
        toolbar: '#toolbar',
        url: url,
        queryParams: function (e) {
            return JSON.stringify($.extend(queryParams, {
                page: {
                    pageNumber: (e.offset / e.limit) + 1,
                    pageSize: e.limit
                }
            }));
        },
        responseHandler: function (result) {

            if (checkRespCodeSuccess(result)) {
                return result.data;
            }

            new Message().show(result.errDesc);
        },
        columns: [{
            checkbox: true
        }, {
            field: 'code',
            title: '商品编码'
        }, {
            field: 'name',
            title: '商品名称'
        }, {
            field: 'brand',
            title: '品牌名称',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'origin',
            title: '产地',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'countryPavilion',
            title: '国家馆',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'goodsGroup',
            title: '商品分类',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'hot',
            title: '是否热门',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? '是' : '否';
            }
        },{
            field: 'goodsState',
            title: '商品状态',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.goodsState[obj].name;
            }
        },  {
            field: 'summary',
            title: '简介描述'
        }, {
            field: 'skuOnSaleNum',
            title: 'sku上架数量',
            align: 'center'
        }, {
            field: 'goodsStateUpdateDatetime',
            title: '状态修改时间',
            align: 'center',
            visible: false
        }, {
            field: 'createDatetime',
            title: '创建时间',
            align: 'center',
            visible: false
        }, {
            field: 'updateDatetime',
            title: '修改时间',
            align: 'center',
            visible: false
        }],
        onCheck: toolbarListener,
        onUncheck: toolbarListener,
        onCheckAll: toolbarListener,
        onUncheckAll: toolbarListener,
        onPageChange: function (number, size) {

            $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarListener();
        },
        onRefresh: function () {

            $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarListener();
        }
    };

    $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var initSpuPageDom = function () {

    $('#page-data-query-btn').click(function () {

        var  queryParam = $('#page-data-query-form').serializeJson();

        if (queryParams.bannerGroupItemId) {

            queryParam.bannerGroupItemId = queryParams.bannerGroupItemId;
            //查询时附上banner内容id
            queryParams = queryParam;
        }
        else {

            queryParam.columnGroupItemId = queryParams.columnGroupItemId;
            //查询时附上栏目内容id
            queryParams = queryParam;

        }
        if (!queryParams.goodsState) {

            queryParams.goodsState = null
        }

        $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    //获取国家
    $.sendRequest(SPU_PAGE_URLS.GET_ALL_COUNTRY, JSON.stringify({}), {}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#origin-list'));

            });
        }
    });

    // 获取国家馆
    $.sendRequest(SPU_PAGE_URLS.GET_ALL_COUNTRY_PAVILION, JSON.stringify({}), {}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#country-pavilion-list'));

            });
        }
    });

    //获取品牌
    $.sendRequest(SPU_PAGE_URLS.GET_ALL_BRAND, JSON.stringify({}), {}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#brand-list'));

            });
        }
    });

    //获取商品分类
    $.sendRequest(SPU_PAGE_URLS.GET_ALL_GOODS_GROUP, JSON.stringify({}), {}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#goodsGroup-list'));

            });
        }
    });

    //获取用途分类
    $.sendRequest(SPU_PAGE_URLS.GET_ALL_USAGE_GROUP, JSON.stringify({}), {}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#usageGroup-list'));
            });
        }
    });

    $.each(constantsEnumData.goodsState, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#goods-state-list'));
    });

};

var getSelectRows = function () {

    return $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();
};

