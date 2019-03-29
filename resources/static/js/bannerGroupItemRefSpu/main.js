var SPU_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-spu-data-table'
};

var SPU_PAGE_URLS = {
    GET_PAGE: contextPath + '/bannerGroupItemRefSpu/getPage',
    DELETE: contextPath + '/bannerGroupItemRefSpu/delete'
};

var spuToolbarListener = function () {

    $('#toolbar-spu button').attr('disabled', 'disabled');

    var rows = $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length > 0) {

        $('#toolbar-spu #btn-spu-del').removeAttr('disabled');
    }

};

var spuQueryParams = {};

var initSpuBootstrapTable = function () {

    var options = {
        url: SPU_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-spu',
        queryParams: function (e) {
            return JSON.stringify($.extend(spuQueryParams, {
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
            field: 'spu',
            title: 'spu编码',
            formatter:function (value, row, index) {
                return value ? value.code : null;
            }
        }, {
            field: 'spu',
            title: 'spu名称',
            formatter:function (value, row, index) {
                return value ? value.name : null;
            }
        }, {
            field: 'spu',
            title: '品牌名称',
            formatter:function (value, row, index) {
                return value ? value.brand.name : null;
            }
        }, {
            field: 'spu',
            title: '产地',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.origin.name : null;
            }
        }, {
            field: 'spu',
            title: '国家馆',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.countryPavilion.name : null;
            }
        }, {
            field: 'spu',
            title: '商品分类',
            align: 'center',
            formatter:function (value, row, index) {
                return value ? value.goodsGroup.name : null;
            }
        }],
        onCheck: spuToolbarListener,
        onUncheck: spuToolbarListener,
        onCheckAll: spuToolbarListener,
        onUncheckAll: spuToolbarListener,
        onPageChange: function (number, size) {

            $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            spuToolbarListener();
        },
        onRefresh: function () {

            $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            spuToolbarListener();
        }
    };

    $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

function deleteSpuCallback() {

    var ids = [];

    var rows = $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {
        ids.push(row.id);
    });

    var params = {
        ids: ids
    };

    $.sendRequest(SPU_PAGE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);

            return;
        }

        $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });

}

var spuRecoveryInitialization = function () {

    spuQueryParams = {};

    $(SPU_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

};

var initSpuPageDom = function () {

    $('#toolbar-spu button').click(function () {

        var optHandle = $(this).attr('data-handle-spu');

        if ('delete-spu' === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteSpuCallback);

            return;
        }

    });

};

$(function () {

    initSpuPageDom();

    initSpuBootstrapTable();

    spuToolbarListener();
});