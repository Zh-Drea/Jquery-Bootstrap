var SKU_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-sku-data-table'
};

var SKU_PAGE_URLS = {
    GET_PAGE: contextPath + '/sku/getPage',
    DELETE: contextPath + '/sku/delete',
    SHELVE_OR_NO: contextPath + '/sku/shelveOrUnShelve'
};

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var skuQueryParams = {};

var initPageDom = function (params) {

    initSkuPageDom();

    if (params.callParams.id) {

        skuQueryParams.spuId = params.callParams.id;

    }

    initSkuBootstrapTable();

    skuToolbarListener();

};

var spuIdOnly;

var skuRefSpuName;

var skuRefSpuSummary;

var initFormData = function (params) {

    spuIdOnly = params.callParams.id;

    skuRefSpuName = params.callParams.skuRefSpuName;

    skuRefSpuSummary = params.callParams.skuRefSpuSummary;
};

var skuToolbarListener = function () {

    $('#toolbar-sku button').attr('disabled', 'disabled');

    $('#toolbar-sku #btn-add').removeAttr('disabled');

    $('#toolbar-sku #btn-add-batch').removeAttr('disabled');

    var rows = $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {

        $('#toolbar-sku #btn-edit').removeAttr('disabled');

        $('#toolbar-sku #btn-edit-banner').removeAttr('disabled');

        $('#toolbar-sku #btn-copy-sku').removeAttr('disabled');

        $('#toolbar-sku #btn-edit-detail').removeAttr('disabled');

        $('#toolbar-sku #btn-edit-slideshow').removeAttr('disabled');

        $('#toolbar-sku #btn-copy').removeAttr('disabled');
    }

    if (length > 0) {

        $('#toolbar-sku #btn-del').removeAttr('disabled');

        $('#toolbar-sku #btn-sku-shelves').removeAttr('disabled');

        $('#toolbar-sku #btn-out-sku-shelves').removeAttr('disabled');
    }
};

var initSkuBootstrapTable = function () {

    var options = {
        url: SKU_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-sku',
        queryParams: function (e) {
            return JSON.stringify($.extend(skuQueryParams, {
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
        },{
            field: 'imageAttachment',
            title: 'banner图附件',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }
                return $("<P>").append($('<IMG>').attr('src', value.resourceFullAddress).addClass('img-thumbnail resource-img-thumbnail')).html();
            }
        }, {
            field: 'skuRefGoodsAttributeOptions',
            title: '属性选项',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }

                var names = [];

                $.each(value, function (index, o) {
                    names.push(o.goodsAttribute.name+ ':'+o.goodsAttributeOption.value);
                });

                return names.join(" ; ")
            }
        }, {
            field: 'recordNo',
            title: '备案编号'
        }, {
            field: 'name',
            title: 'sku名称'
        }, {
            field: 'goodsState',
            title: '商品状态',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.goodsState[obj].name;
            }
        }, {
            field: 'stockNum',
            title: '库存',
            align: 'center'
        }, {
            field: 'lockedNum',
            title: '锁定库存',
            align: 'center'
        }, {
            field: 'salesNum',
            title: '销售量',
            align: 'center'
        }, {
            field: 'packagedWeight',
            title: '打包重量',
            align: 'center'
        }, {
            field: 'minimumUnitOfMeasure',
            title: '最小计量单位',
            align: 'center'
        }, {
            field: 'recordPrice',
            title: '备案价格',
            align: 'center'
        }, {
            field: 'costPrice',
            title: '成本价格',
            align: 'center'
        }, {
            field: 'marketPrice',
            title: '市场价格',
            align: 'center'
        }, {
            field: 'agentPrice',
            title: '代理价格',
            align: 'center'
        }, {
            field: 'retailPrice',
            title: '零售价格',
            align: 'center'
        }, {
            field: 'taxPrice',
            title: '税费价格',
            align: 'center'
        }, {
            field: 'enableRebate',
            title: '是否开启返利',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? '是' : '否';
            }
        }, {
            field: 'rebateRule',
            title: '返利规则',
            align: 'center',
            formatter:function (value,row,index) {
                return value ? value.code : null;
            }
        }, {
            field: 'logisticTemplate',
            title: '物流模板',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'summary',
            title: '简介'
        }, {
            field: 'goodsStateUpdateDatetime',
            title: '状态修改时间',
            align: 'center',
            visible: false
        }, {
            field: 'packageType',
            title: '打包类型',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.packageType[obj].name;
            }
        }, {
            field: 'repertory',
            title: '仓库名称',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'goodsModel',
            title: '商品型号',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'packageSpecification',
            title: '打包规格',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'uploadIdCardImage',
            title: '是否上传身份证',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? '是' : '否';
            }
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
        onCheck: skuToolbarListener,
        onUncheck: skuToolbarListener,
        onCheckAll: skuToolbarListener,
        onUncheckAll: skuToolbarListener,
        onPageChange: function (number, size) {

            $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            skuToolbarListener();
        },
        onRefresh: function () {

            $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            skuToolbarListener();
        }
    };

    $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var editedSkuCallback = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        if (OPT_HANDLE.SAVE === optHandle) {
            $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        } else {
            $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};

function deleteSkuCallback() {

    var ids = [];

    var rows = $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {
        ids.push(row.id);
    });

    var params = {
        ids: ids
    };

    $.sendRequest(SKU_PAGE_URLS.DELETE, JSON.stringify(params), {}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);

            return;
        }

        $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });

}

var upDownSku = function (list,state) {

    var skuList = [];

    var allSku = {};

    $.each(list,function (index,value) {

        var skuParam = {};

        skuParam.goodsState = value.goodsState;

        skuParam.id = value.id;

        skuList.push(skuParam);
    });

    allSku.skuList = skuList ;

    if (state  === 'shelves') {

        allSku.goodsState = 'ON_SALE'
    }
    else {

        allSku.goodsState = 'SOLD_OUT'
    }

    return allSku;
};

var initSkuPageDom = function () {

    $('#page-data-query-btn').click(function () {

        skuQueryParams = $('#page-data-query-form').serializeJson();

        skuQueryParams.spuId = spuIdOnly;

        $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $('#toolbar-sku button').click(function () {

        var title = $(this).attr('data-title');

        var optHandle = $(this).attr('data-handle');

        if (OPT_HANDLE.DELETE === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteSkuCallback);

            return;
        }

        var callParams = {
            spuId:spuIdOnly
        };

        if (OPT_HANDLE.SAVE !== optHandle  && 'add-batch' !== optHandle) {

            var res = $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

            $.extend(callParams, {
                id: res.id
            });

            if (res.imageAttachment) {
                $.extend(callParams, {
                    imageAttachmentId: res.imageAttachment.id
                })
            }
        }
        else {

            $.extend(callParams, {
                name:skuRefSpuName,
                summary:skuRefSpuSummary
            });
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        if ('add-batch' === optHandle) {

            var options = {
                content: [contextPath + '/sku/addBatchPage'],
                title: title,
                area: ['1100px', '540px']
            };

           var index = new Message().openView(options, 'initPage', callParams, 'saveOrUpdate', null, editedSkuCallback, yesCallbackParams);

           layer.full(index);

            return;
        }

        if ('edit-banner' === optHandle) {

            var options = {
                content: [contextPath + '/sku/bannerPage'],
                title: title,
                area: ['400px', '375px']
            };

            new Message().openView(options, 'initPage', callParams, 'saveOrUpdate', null, editedSkuCallback, yesCallbackParams);

            return;
        }

        if ('sku-shelves' === optHandle) {

            var rows = $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

            var result = $.sendRequest(SKU_PAGE_URLS.SHELVE_OR_NO , JSON.stringify(upDownSku(rows,'shelves')));

            if (!checkRespCodeSuccess(result)) {

                msg.show(result.errDesc);

                return;
            }

            $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();

            return;
        }

        if ('out-sku-shelves' === optHandle) {

            var rows = $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

            var result = $.sendRequest(SKU_PAGE_URLS.SHELVE_OR_NO , JSON.stringify(upDownSku(rows,'outShelves')));

            if (!checkRespCodeSuccess(result)) {

                msg.show(result.errDesc);

                return;
            }

            $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();

            return;
        }

        if ('edit-detail' === optHandle) {

            var optionsTwo = {
                content: [contextPath + '/sku/detailPage'],
                title: title,
                area: ['380px', '500px']
            };

            new Message().openView(optionsTwo, 'initPage', callParams, 'saveOrUpdate', null, editedSkuCallback, yesCallbackParams);

            return;
        }

        if ('edit-slideshow' === optHandle) {

            var optionsThree = {
                content: [contextPath + '/sku/slideshowPage'],
                title: title,
                area: ['380px', '500px']
            };

            new Message().openView(optionsThree, 'initPage', callParams, 'saveOrUpdate', null, editedSkuCallback, yesCallbackParams);

            return;
        }

        if ('image-copy' === optHandle) {

            var optionsFour = {
                content: [contextPath + '/sku/copyPage'],
                title: '复制资源图片',
                btn:['复制','关闭'],
                area: ['420px', '300px']
            };

            new Message().openView(optionsFour, 'initPage', callParams, 'saveOrUpdate', null, editedSkuCallback, yesCallbackParams);

            return;
        }

        if('copy-sku' === optHandle){

            var selectRow = $(SKU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

            callParams.id=selectRow[0].id;
            callParams.isCopySku=true;

            new Message().openView({
                content: [contextPath + '/sku/editPage'],
                title: title,
                area: ['1100px', '540px']
            }, 'initPage', callParams, 'saveOrUpdate', null, editedSkuCallback, yesCallbackParams);

            return;

        }

        new Message().openView({
            content: [contextPath + '/sku/editPage'],
            title: title,
            area: ['1100px', '540px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedSkuCallback, yesCallbackParams);
    });
};

