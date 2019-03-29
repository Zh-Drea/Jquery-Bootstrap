var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/systemConfig/getPage'
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {
        $('#toolbar #btn-edit').removeAttr('disabled');
    }
};

var queryParams = {};

var initBootstrapTables = function () {

    var options = {

        url: PAGE_URLS.GET_PAGE,

        toolbar: '#toolbar',

        singleSelect:true,

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
            field: 'apiGatewayOuterMainUrl',
            title: '网关外网地址',
            align: 'center'

        }, {
            field: 'apiGatewayInnerMainUrl',
            title: '网关内网地址',
            align: 'center'
        }, {
            field: 'webappOuterMainUrl',
            title: 'webapp地址',
            align: 'center'
        }, {
            field: 'invitationCodeShareUrl',
            title: 'webapp邀请码分享地址',
            align: 'center'
        }, {
            field: 'invitationCodeShareTitle',
            title: 'webapp邀请码分享标题',
            align: 'center'
        }, {
            field: 'invitationCodeShareImageAttachment',
            title: 'webapp邀请码分享图标',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }
                return $("<P>").append($('<IMG>').attr('src', value.resourceFullAddress).addClass('img-thumbnail resource-img-thumbnail')).html();
            }
        },  {
            field: 'appDownloadImageAttachment',
            title: 'app下载二维码图片附件',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }
                return $("<P>").append($('<IMG>').attr('src', value.resourceFullAddress).addClass('img-thumbnail resource-img-thumbnail')).html();
            }
        }, {
            field: 'invitationCodeShareDesc',
            title: 'webapp邀请码分享描述',
            align: 'center'
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

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

         $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();

        return;
    }

    new Message().show(result.errDesc);
};

var initPageDom = function () {

    $('#toolbar button').click(function () {

        var title = $(this).attr('data-title');

        var optHandle = $(this).attr('data-handle');

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
            content: [contextPath + '/systemConfig/editPage', 'yes'],
            title: title,
            area: ['800px', '666px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});