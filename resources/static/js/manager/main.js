var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/manager/getPage',

    DELETE: contextPath + '/manager/delete',

    RESET: contextPath + '/manager/resetPassword'
};

var msg =new Message();

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {
        $('#toolbar #btn-edit').removeAttr('disabled');

        $('#toolbar #btn-reset-password').removeAttr('disabled');
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
            field: 'username',
            title: '用户名称',
            align: 'center'
        }, {
            field: 'roles',
            title: '角色分类',
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
            field: 'phoneNo',
            title: '电话号码',
            align: 'center'
        }, {
            field: 'realName',
            title: '真实姓名',
            align: 'center'
        }, {
            field: 'email',
            title: '邮箱地址',
            align: 'center'
        }, {
            field: 'sexual',
            title: '性别',
            align: 'center',
            formatter:function (obj,row,index) {
               return constantsEnumData.sexual[obj].name;
            }
        }, {
            field: 'accountState',
            title: '状态',
            align: 'center',
            formatter:function (obj,row,index) {
                return constantsEnumData.accountState[obj].name;
            }
        }, {
            field: 'managerType',
            title: '类型',
            align: 'center',
            formatter:function (obj,row,index) {
                return constantsEnumData.managerType[obj].name;
            }
        }, {
            field: 'remark',
            title: '备注',
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
//重置密码
function resetPassword() {

    var params = {
        id : $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
    };

    var result = $.sendRequest(PAGE_URLS.RESET,JSON.stringify(params));

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDesc);

        return;
    }

    $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
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

        if ('reset' === optHandle) {

            msg.confirm("确认重置密码?",resetPassword);

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
            content: [contextPath + '/manager/editPage', 'yes'],
            title: title,
            area: ['800px', '450px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});