var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/columnGroup/getPage',

    DELETE: contextPath + '/columnGroup/delete'
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
            field: 'code',
            title: '标识',
            align:'center'
        }, {
            field: 'title',
            title: '标题',
            align:'center'
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
        },{
            field: 'enable',
            title: '是否启用',
            align:'center',
            formatter: function (value, row, index) {
                return value ? "是" : "否";
            }
        }, {
            field: 'orderNum',
            title: '排列序号',
            align:'center'
        }, {
            field: 'remark',
            title: '备注',
            align:'center'
        }, {
            field: 'createDatetime',
            title: '创建时间',
            align:'center',
            visible:false
        }, {
            field: 'updateDatetime',
            title: '修改时间',
            align:'center',
            visible:false
        }
        ],
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
            content: [contextPath + '/columnGroup/editPage', 'no'],
            title: title,
            area: ['800px', '420px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});