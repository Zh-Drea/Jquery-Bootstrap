var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/country/getPage',
    DELETE: contextPath + '/country/delete'
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
            field: 'code',
            title: '国家编码',
            align: 'center'
        }, {
            field: 'name',
            title: '国家名称',
            align: 'center'
        }, {
            field: 'shortMark',
            title: '简写标志',
            align: 'center'
        }, {
            field: 'fullMark',
            title: '全写标志',
            align: 'center'
        }, {
            field: 'orderNum',
            title: '排序编号',
            align: 'center'
        }, {
            field: 'phoneNoCode',
            title: '电话区号',
            align: 'center'
        }, {
            field: 'enableLoginRegister',
            title: '登录注册',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? '开放' : '关闭';
            }
        }, {
            field: 'imageAttachment',
            title: '展示图片',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }
                return $("<P>").append($('<IMG>').attr('src', value.resourceFullAddress).addClass('img-thumbnail resource-img-thumbnail')).html();
            }
        }, {
            field: 'createDatetime',
            title: '创建时间',
            align: 'center'
        }, {
            field: 'updateDatetime',
            title: '修改时间',
            align: 'center'
        }],
 /*       onClickCell: function (field, value, row, $element) {
            console.log(value);
            console.log(row);
            console.log($element);
            console.log(field);
            $element.attr('contenteditable', true);
            $element.blur(function () {
            })
        },*/
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
            content: [contextPath + '/country/editPage', 'no'],
            title: title,
            area: ['800px', '530px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();
});