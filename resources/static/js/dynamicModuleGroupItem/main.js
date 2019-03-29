var ITEM_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-item-data-table'
};

var ITEM_PAGE_URLS = {
    GET_PAGE: contextPath + '/dynamicModuleGroupItem/getPage',
    DELETE: contextPath + '/dynamicModuleGroupItem/delete'
};

var itemToolbarListener = function () {

    $('#toolbar-item #btn-item-edit').attr('disabled', 'disabled');

    $('#toolbar-item #btn-item-del').attr('disabled', 'disabled');

    var res = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

    if(res) {

        var rows = $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

        var length = rows.length;

        if (length === 1) {
            $('#toolbar-item #btn-item-edit').removeAttr('disabled');
        }
        if (length > 0) {
            $('#toolbar-item #btn-item-del').removeAttr('disabled');
        }
    }
};

var itemQueryParams = {};

var initItemBootstrapTable = function () {

    var options = {
        url: ITEM_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-item',
        queryParams: function (e) {
            return JSON.stringify($.extend(itemQueryParams, {
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
            field: 'title',
            title: '标题',
            align: 'center'
        }, {
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
            field: 'skipType',
            title: '跳转类型',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.skipType[obj].name;
            }
        }, {
            field: 'pageType',
            title: '页面类型',
            align: 'center'
        }, {
            field: 'pageUrl',
            title: '页面地址',
            align: 'center'
        }, {
            field: 'interfaceUrl',
            title: '接口地址',
            align: 'center'
        }, {
            field: 'interfaceParams',
            title: '接口参数',
            align: 'center'
        }, {
            field: 'enable',
            title: '是否启用',
            align: 'center',
            formatter:function (value,row,index) {
                return value ? "是":"否";
            }
        }, {
            field: 'orderNum',
            title: '排序编号',
            align: 'center'
        }, {
            field: 'remark',
            title: '备注信息',
            align: 'center'
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
        onCheck: itemToolbarListener,
        onUncheck: itemToolbarListener,
        onCheckAll: itemToolbarListener,
        onUncheckAll: itemToolbarListener,
        onPageChange: function (number, size) {

            $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            itemToolbarListener();
        },
        onRefresh: function () {

            $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            itemToolbarListener();
        }
    };

    $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var editedItemCallback = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        if (OPT_HANDLE.UPDATE === optHandle) {
            $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        } else {
            $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};

function deleteItemCallback() {

    var ids = [];

    var rows = $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {
        ids.push(row.id);
    });

    var params = {
        ids: ids
    };

    $.sendRequest(ITEM_PAGE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);

            return;
        }

        $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });

}

var itemRecoveryInitialization = function () {

    itemQueryParams = {};

    $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

};

var initItemPageDom = function () {

    $('#toolbar-item button').click(function () {

        var title = $(this).attr('data-title-item');

        var optHandle = $(this).attr('data-handle-item');

        if ('delete-item' === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteItemCallback);

            return;
        }

        var callParams = {
            dynamicModuleGroupId: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        if (OPT_HANDLE.UPDATE === optHandle) {
            $.extend(callParams, {
                id: $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        new Message().openView({
            content: [contextPath + '/dynamicModuleGroupItem/editPage', 'no'],
            title: title,
            area: ['800px', '630px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedItemCallback, yesCallbackParams);

    });

};

$(function () {

    initItemPageDom();

    initItemBootstrapTable();

    itemToolbarListener();
});