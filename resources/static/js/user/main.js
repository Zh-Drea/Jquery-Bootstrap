var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/user/getPage'
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disables');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {

        $('#toolbar #btn-edit').removeAttr('disabled');

        $('#toolbar #btn-edit-remark').removeAttr('disabled');

        $('#toolbar #btn-edit-state').removeAttr('disabled');

        $('#toolbar #btn-query-son').removeAttr('disabled');

        if (rows[0].parentUser) {

            $('#toolbar #btn-query-father').removeAttr('disabled');
        }

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
            field: 'phoneNo',
            title: '电话号码',
            align: 'center'

        }, {
            field: 'wxNo',
            title: '微信号',
            align: 'center'

        }, {
            field: 'country',
            title: '所属国家',
            align: 'center',
            formatter: function (value,row,index) {
                return value ? value.name : null;
            }
        },  {
            field: 'country',
            title: '电话区号',
            align: 'center',
            formatter:function (value,row,index) {
               return value ? value.phoneNoCode : null;
            }
        }, {
            field: 'nickname',
            title: '昵称',
            align: 'center'
        }, {
            field: 'sexual',
            title: '性别',
            align: 'center',
            formatter:function (obj,index,row) {
                return obj ? constantsEnumData.sexual[obj].name : null;
            }
        }, {
            field: 'birthday',
            title: '生日',
            align: 'center'
        }, {
            field: 'userType',
            title: '类型',
            align: 'center',
            formatter:function (obj,row,index) {
                return  obj ? constantsEnumData.userType[obj].name : null;
            }
        }, {
            field: 'userLevel',
            title: '用户级别',
            align: 'center',
            formatter:function (obj,row,index) {
                return  obj ? obj.name : null;
            }
        },
        //     {
        //     field: 'parentUser',
        //     title: '上级用户',
        //     align: 'center',
        //     formatter:function (obj,row,index) {
        //         return  obj ? obj.name : null;
        //     }
        // }, {
        //     field: 'invitationCode',
        //     title: '邀请码',
        //     align: 'center'
        // },
            {
            field: 'accountState',
            title: '状态',
            align: 'center',
            formatter:function (obj,row,index) {
                return  obj ? constantsEnumData.accountState[obj].name : null;
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

    $.each(constantsEnumData.userType,function (index,row) {

        $('<OPTION>').val(row.value).text(row.name).appendTo($('#user-type-select'));

    });

    $('#page-data-query-btn').click(function () {

        queryParams = $('#page-data-query-form').serializeJson();
        
        if (!queryParams.userType) {

            queryParams.userType = null;
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $('#toolbar button').click(function () {

        var optHandle = $(this).attr('data-handle');

        var callParams = {
            id : $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
        };

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        if ('edit' === optHandle) {

            var options = {
                content: [contextPath +  '/user/editPage'],
                title: '修改用户级别',
                area: ['400px', '303px']
            };

            new Message().openView(options, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

            return;
        }

        if ('edit-remark' === optHandle) {

            var optionsRefRemark = {
                content: [contextPath +  '/userRefRemark/editPage'],
                title: '修改用户备注',
                area: ['400px', '260px']
            };

            new Message().openView(optionsRefRemark, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);
        }

        if ('edit-state' === optHandle) {

            var optionsRefState = {
                content: [contextPath +  '/userRefState/editPage'],
                title: '修改用户状态',
                area: ['400px', '260px']
            };

            new Message().openView(optionsRefState, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);
        }

        if ('query-son' === optHandle) {

            $.extend(callParams,{
                phoneNo: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().phoneNo
            });

            var index = new Message().openView({
                content: [contextPath +  '/userRelation/mainPage'],
                title: '查看用户子级',
                btn:['关闭'],
                area: ['400px', '260px']
            }, 'initPage', callParams, null, null, null, null);

            layer.full(index);
        }

        if ('query-father' === optHandle) {

            $.extend(callParams,{
                phoneNo: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().phoneNo,
                parentUserId: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().parentUser.id
            });

            var indexFather = new Message().openView({
                content: [contextPath +  '/userRelationSon/mainPage'],
                title: '查看用户父级',
                btn:['关闭'],
                area: ['400px', '260px']
            }, 'initPage', callParams, null, null, null, null);

            layer.full(indexFather);
        }
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});