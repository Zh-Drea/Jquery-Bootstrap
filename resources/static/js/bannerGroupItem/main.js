var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/bannerGroupItem/getPage',

    DELETE: contextPath + '/bannerGroupItem/delete',

    GET_ALL_BANNER_GROUP: contextPath + "/bannerGroup/getAll",

    SAVE_OR_UPDATE: contextPath + "/bannerGroupItemRefSpu/saveBannerGroupItemRefSpu"
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    spuRecoveryInitialization();

    if (length === 1) {
        $('#toolbar #btn-edit').removeAttr('disabled');

        $('#toolbar #btn-detail-edit').removeAttr('disabled');

        $('#toolbar #btn-spu-ref').removeAttr('disabled');

        $('#toolbar #btn-del').removeAttr('disabled');

        spuQueryParams.bannerGroupItemId = rows[0].id;

        $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    }

};

var queryParams = {};

var initBootstrapTables = function () {

    var options = {
        url: PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar',
        singleSelect: true,
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
            field: 'bannerGroup',
            title: '分类',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.title : null;
            }
        }, {
            field: 'title',
            title: '标题'
        }, {
            field: 'enable',
            title: '是否启用',
            align:'center',
            formatter: function (value, row, index) {
                return value ? "是" : "否";
            }
        }, {
            field: 'imageAttachment',
            title: 'banner附件',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }
                return $("<P>").append($('<IMG>').attr('src', value.resourceFullAddress).addClass('img-thumbnail resource-img-thumbnail')).html();
            }
        }, {
            field: 'orderNum',
            title: '序号',
            align: 'center'
        }, {
            field: 'remark',
            title: '备注',
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

        if (OPT_HANDLE.SAVE === optHandle) {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        } else {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};

var selectRowsCallback = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    var res = {};

    var spuIds = [];

    res.bannerGroupItemId = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id;

    $.each(result, function (index, obj) {

        spuIds.push(obj.id);
    });

    res.spuIds = spuIds;

    var obj = $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(res));

    if (obj) {

        if (checkRespCodeSuccess(obj)) {

            layer.close(params.layerIndex);

            if ('ref-spu' === optHandle) {

                $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
            }
            return;
        }
    }
};


function deleteCallback() {

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

    var params = {
        id: rows.id
    };

    $.sendRequest(PAGE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);
            return;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(params, true);
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

        if (OPT_HANDLE.SAVE !== optHandle) {
            $.extend(callParams, {

                id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        if ('ref-spu'=== optHandle) {
            $.extend(callParams, {

                bannerGroupItemId: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        if ('edit-detail' === optHandle) {

            var options = {
                content: [contextPath + '/bannerGroupItemRefAttachment/editPage'],
                title: title,
                area: ['380px', '500px']
            };

            new Message().openView(options, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

            return;
        }

        if ('ref-spu' === optHandle) {

            var options = {
                content: [contextPath + '/spu/selectSpuPage'],
                title: title,
                area: ['1130px', '620px']
            };

            new Message().openView(options, 'initPage', callParams, 'getSelectRows', null, selectRowsCallback, yesCallbackParams);

            return;
        }

        new Message().openView({
            content: [contextPath + '/bannerGroupItem/editPage', 'no'],
            title: title,
            area: ['800px', '423px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });

    $.sendRequest(PAGE_URLS.GET_ALL_BANNER_GROUP, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {
                $('<OPTION>').val(row.id).text(row.title).appendTo($('#banner-group-list'));
            });
        }
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});