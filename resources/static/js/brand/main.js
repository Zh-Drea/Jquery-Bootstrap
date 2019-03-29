var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/brand/getPage',
    DELETE: contextPath + '/brand/delete',
    GET_ALL: contextPath + "/country/getAll"
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {
        $('#toolbar #btn-edit').removeAttr('disabled');
    }
    if (length > 0) {
        $('#toolbar #btn-del').removeAttr('disabled');
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
            field: 'id',
            title: '主键',
            align: 'center'
        }, {
            field: 'country',
            title: '国家名称',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'goodsGroups',
            title: '商品分类',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }

                var names = [];

                $.each(value, function (index, o) {
                    names.push(o.name);
                });

                return names.join(",")
            }
        },{
            field: 'code',
            title: '品牌编码',
            align: 'center'
        }, {
            field: 'name',
            title: '品牌名称',
            align: 'center'
        }, {
            field: 'englishName',
            title: '英文名称',
            align: 'center'
        }, {
            field: 'hot',
            title: '是否热门',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? '是' : '否';
            }
        }, {
            field: 'orderNum',
            title: '排序编号',
            align: 'center'
        }, {
            field: 'imageAttachment',
            title: '品牌附件',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }
                return $("<P>").append($('<IMG>').attr('src', value.resourceFullAddress).addClass('img-thumbnail resource-img-thumbnail')).html();
            }
        }, {
            field: 'summary',
            title: '品牌简介'
        }, {
            field: 'createDatetime',
            title: '创建时间',
            align: 'center',
            visible:false
        }, {
            field: 'updateDatetime',
            title: '修改时间',
            align: 'center',
            visible:false
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

        if (OPT_HANDLE.UPDATE === optHandle) {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        } else {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
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

var initPageDom = function () {

    $('#page-data-query-btn').click(function () {

        queryParams = $('#page-data-query-form').serializeJson();

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $('#toolbar button').click(function () {

        var title = $(this).attr('data-title');

        var optHandle = $(this).attr('data-handle');

        if (OPT_HANDLE.DELETE === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteCallback);

            return;
        }

        var callParams = {};

        if (OPT_HANDLE.UPDATE === optHandle) {
            $.extend(callParams, {
                id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        new Message().openView({
            content: [contextPath + '/brand/editPage', 'yes'],
            title: title,
            area: ['800px', '590px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });
    $.sendRequest(PAGE_URLS.GET_ALL, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {
                $('<OPTION>').val(row.id).text(row.name).appendTo($('#country-list'));
            });
        }
    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});