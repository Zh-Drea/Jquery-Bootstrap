var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/spu/getPage',
    DELETE: contextPath + '/spu/delete',
    SHELVE_OR_NO: contextPath + '/spu/shelveOrUnShelve',
    GET_SHELVE_NUM: contextPath + '/spu/getShelveOrUnShelveNum',
    GET_ALL_COUNTRY: contextPath + "/country/getAll",
    GET_ALL_COUNTRY_PAVILION: contextPath + "/countryPavilion/getAll",
    GET_ALL_BRAND: contextPath + "/brand/getAll",
    GET_ALL_GOODS_GROUP: contextPath + "/goodsGroup/getAll",
    GET_ALL_REBATE_RULE: contextPath + "/rebateRule/getAll"
};

var msg = new Message();

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    $('#toolbar #btn-reset-hot').removeAttr('disabled');

    $('#toolbar #btn-lead').removeAttr('disabled');

    $('#toolbar #btn-export-spu').removeAttr('disabled');

    var res = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = res.length;

    if (length > 0) {

        $('#toolbar #btn-del').removeAttr('disabled');
    }

    if (length === 1) {

        var obj = res[0].goodsState;

        if (obj === 'ON_SALE') {
            $('#toolbar #btn-out-spu-shelves').removeAttr('disabled');
        } else {
            $('#toolbar #btn-spu-shelves').removeAttr('disabled');
        }

        $('#toolbar #btn-edit').removeAttr('disabled');

        $('#toolbar #btn-edit-sku').removeAttr('disabled');

        $('#toolbar #btn-edit-image').removeAttr('disabled');

        $('#toolbar #btn-edit-attr').removeAttr('disabled');

        $('#toolbar #btn-batch-production').removeAttr('disabled');
    }

};

var queryParams = {};

var initBootstrapTables = function () {

    var options = {
        url: PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar',
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
            field: 'imageAttachment',
            title: '图片附件',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }
                return $("<P>").append($('<IMG>').attr('src', value.resourceFullAddress).addClass('img-thumbnail resource-img-thumbnail')).html();
            }
        }, {
            field: 'code',
            title: '商品编码'
        }, {
            field: 'name',
            title: '商品名称'
        }, {
            field: 'goodsState',
            title: '商品状态',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.goodsState[obj].name;
            }
        }, {
            field: 'goodsType',
            title: '商品类型',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.goodsType[obj].name;
            }
        }, {
            field: 'agentUnitPrice',
            title: '代理商单价',
            align: 'center'
        }, {
            field: 'retailUnitPrice',
            title: '普通用户单价',
            align: 'center'
        }, {
            field: 'salesNum',
            title: '销售数量',
            align: 'center'
        }, {
            field: 'singleOrderMinNum',
            title: '单次下单最小数量',
            align: 'center'
        }, {
            field: 'singleOrderMaxNum',
            title: '单次下单最大数量',
            align: 'center'
        }, {
            field: 'skuOnSaleNum',
            title: 'sku上架数量',
            align: 'center'
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
        },
            //     {
            //     field: 'usageGroups',
            //     title: '用途分类',
            //     align: 'center',
            //     formatter: function (value, row, index) {
            //         if (null === value) {
            //             return "";
            //         }
            //
            //         var names = [];
            //
            //         $.each(value, function (index, o) {
            //             names.push(o.name);
            //         });
            //
            //         return names.join(",")
            //     }
            // },
            {
                field: 'hot',
                title: '是否热门',
                align: 'center',
                formatter: function (value, row, index) {
                    return value ? '是' : '否';
                }
            }, {
                field: 'shelfLifeDate',
                title: '保质日期',
                align: 'center'
            }, {
                field: 'afterSaleDays',
                title: '售后天数',
                align: 'center'
            }, {
                field: 'summary',
                title: '简介描述'
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

            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarListener();
        },
        onRefresh: function () {

            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarListener();
        }

    };

    $(PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var editedCallback = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        if (OPT_HANDLE.SAVE === optHandle) {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        } else {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};

function deleteCallback() {

    var ids = [];

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {
        ids.push(row.id);
    });

    var params = {
        ids: ids
    };

    $.sendRequest(PAGE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);

            return;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });
}

function spuShelvesCallback() {

    var row = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var res = {};

    res.id = row[0].id;

    res.goodsState = row[0].goodsState;

    var result = $.sendRequest(PAGE_URLS.SHELVE_OR_NO, JSON.stringify(res));

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDesc);

        return;

    }

    $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
}

function outSpuShelvesCallback() {

    var row = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var res = {};

    res.id = row[0].id;

    res.goodsState = row[0].goodsState;

    var result = $.sendRequest(PAGE_URLS.SHELVE_OR_NO, JSON.stringify(res));

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDesc);

        return;

    }

    $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
}

//返回sku上下架个数
var selectRow = function () {

    var spuId = {
        id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
    };

    var res = $.sendRequest(PAGE_URLS.GET_SHELVE_NUM, JSON.stringify(spuId));

    if (!checkRespCodeSuccess(res)) {

        msg.show(res.errDesc);

        return;
    }

    var obj;

    var shelvesNum = res.data.ShelveNum;

    var outShelvesNum = res.data.UnShelveNum;

    if (shelvesNum !== 0 && outShelvesNum !== 0) {

        obj = {
            sentence: '上架数量' + '<strong>' + shelvesNum + '</strong>' + ',下架数量' + '<strong>' + outShelvesNum + '</strong>' + ',请到sku管理界面进行操作',
            promptType: 'show'
        };

    }

    if (shelvesNum === 0 && outShelvesNum !== 0) {

        obj = {
            sentence: '请仔细核对:' + '上架数量' + '<strong>' + shelvesNum + '</strong>' + ',下架数量' + '<strong>' + outShelvesNum + '</strong>' + ',是否全部上架?'
        };
    }

    if (shelvesNum !== 0 && outShelvesNum === 0) {

        obj = {
            sentence: '请仔细核对:' + '上架数量' + '<strong>' + shelvesNum + '</strong>' + ',下架数量' + '<strong>' + outShelvesNum + '</strong>' + ',是否全部下架?'
        };
    }

    return obj;
};

var initPageDom = function () {

    $('#export-sku').mouseenter(function () {

        layer.tips('下载符合搜索条件的sku信息', this, {
            tips: [1, '#3595CC']
        })
    });

    $('#export-sku').mouseleave(function () {

        layer.tips();
    });

    $('#export-sku').click(function () {

        var p = $('#page-data-query-form').serializeJson();

        if (!p.goodsState) {

            p.goodsState = null
        }

        if (!p.goodsType) {

            p.goodsType = null
        }

        $('#plt').val(JSON.stringify(p));
    });

    $('#page-data-query-btn').click(function () {

        queryParams = $('#page-data-query-form').serializeJson();

        if (!queryParams.goodsState) {

            queryParams.goodsState = null
        }

        if (!queryParams.goodsType) {

            queryParams.goodsType = null
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $('#btn-lead').click(function () {

        new Message().openView({
            content: [contextPath + '/skuImport/editPage'],
            title: "导入sku信息",
            maxmin: true,
            btn: ['关闭'],
            area: ['520px', '300px']
        });
    });

    $('#toolbar button').click(function () {

        var title = $(this).attr('data-title');

        var optHandle = $(this).attr('data-handle');

        if (OPT_HANDLE.DELETE === optHandle) {

            msg.confirm('确定删除选中数据？', deleteCallback);

            return;
        }

        if ('spu-shelves' === optHandle) {

            var obj = selectRow();

            if (obj) {

                if (obj.promptType === 'show') {

                    msg.show(obj.sentence);
                } else {

                    msg.confirm(obj.sentence, spuShelvesCallback);
                }
            }

            return;
        }

        if ('out-spu-shelves' === optHandle) {

            var plt = selectRow();

            if (plt) {

                if (plt.promptType === 'show') {

                    msg.show(plt.sentence);
                } else {

                    msg.confirm(plt.sentence, outSpuShelvesCallback);
                }
            }

            return;
        }

        var callParams = {};

        if (OPT_HANDLE.SAVE !== optHandle && 'reset-hot' !== optHandle && 'export-spu' !== optHandle) {
            $.extend(callParams, {
                id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        if ('edit-sku' === optHandle) {

            var res = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

            $.extend(callParams, {
                skuRefSpuName: res[0].name,
                skuRefSpuSummary: res[0].summary
            });

            var options = {
                content: [contextPath + '/sku/mainPage'],
                title: "SKU管理",
                maxmin: true,
                btn: null,
                area: ['800px', '440px'],
                cancel: function () {
                    $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
                }
            };

            var index = new Message().openView(options, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

            layer.full(index);

            return;
        }

        if ('edit-attr' === optHandle) {

            var optionsTwo = {
                content: [contextPath + '/spuRefGoodsAttribute/editPage'],
                title: "编辑-属性信息",
                maxmin: true,
                area: ['1000px', '452px']
            };

            new Message().openView(optionsTwo, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

            return;
        }

        if ('batch-production' === optHandle) {

            var fix = {
                content: [contextPath + '/spuBatchSku/editPage'],
                title: "编辑-批量生产信息",
                maxmin: true,
                area: ['1000px', '452px']
            };

            new Message().openView(fix, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

            return;
        }

        if ('edit-image' === optHandle) {

            var options = {
                content: [contextPath + '/spuRefAttachment/editPage'],
                title: "编辑-附件信息",
                area: ['400px', '375px']
            };

            new Message().openView(options, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

            return;
        }

        if ('reset-hot' === optHandle) {

            var hotItem = {
                content: [contextPath + '/spu/resetHotPage'],
                title: "重置热门",
                area: ['400px', '246px']
            };

            new Message().openView(hotItem, null, null, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

            return;
        }

        if ('export-spu' === optHandle) {

            var exportItem = {
                content: [contextPath + '/spu/exportPage'],
                title: "导出",
                area: ['300px', '246px']
            };

            new Message().openView(exportItem, 'initPage', callParams, null, null, null, null);

            return;
        }

        new Message().openView({
            content: [contextPath + '/spu/editPage', 'yes'],
            title: title,
            area: ['800px', '540px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });

    $.each(constantsEnumData.goodsState, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#goods-state-list'));
    });

    $.each(constantsEnumData.goodsType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#goods-type-list'));
    });

    //获取国家
    $.sendRequest(PAGE_URLS.GET_ALL_COUNTRY, JSON.stringify({}), {async: true}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#origin-list'));

            });
        }
    });

    // 获取国家馆
    $.sendRequest(PAGE_URLS.GET_ALL_COUNTRY_PAVILION, JSON.stringify({}), {async: true}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#country-pavilion-list'));

            });
        }
    });

    //获取品牌
    $.sendRequest(PAGE_URLS.GET_ALL_BRAND, JSON.stringify({}), {async: true}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#brand-list'));

            });
        }
    });

    //获取商品分类
    $.sendRequest(PAGE_URLS.GET_ALL_GOODS_GROUP, JSON.stringify({}), {async: true}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#goodsGroup-list'));

            });
        }
    });

    //获取返利规则
    $.sendRequest(PAGE_URLS.GET_ALL_REBATE_RULE, JSON.stringify({}), {async: true}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.code).appendTo($('#rebate-rule-list'));
            });
        }
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();
});