var DETAIL_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-detail-data-table'
};

var DETAIL_PAGE_URLS = {
    GET_PAGE: contextPath + '/orderDetail/getPage'
};

var msg = new Message();

var detailToolbarListener = function () {

    $('#toolbar-detail button').attr('disabled', 'disabled');

    var rows = $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {

        $('#toolbar-detail #btn-img-query').removeAttr('disabled');

        $('#toolbar-detail #btn-info-edit').removeAttr('disabled');

        $('#toolbar-detail #btn-id-card-image').removeAttr('disabled');
    }

};

var detailQueryParams = {};

var initDetailBootstrapTable = function () {

    var options = {
        url: DETAIL_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-detail',
        singleSelect: true,
        queryParams: function (e) {
            return JSON.stringify($.extend(detailQueryParams, {
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
            field: 'receiverName',
            title: '收货人姓名',
            align: 'center'
        },{
            field: 'fullAddress',
            title: '收获详细地址',
            align: 'center'
        }, {
            field: 'receiverPhoneNo',
            title: '收货人电话号码',
            align: 'center'
        }, {
            field: 'receiverIdCardNo',
            title: '收货人身份证号',
            align: 'center'
        }, {
            field: 'idCardImageFrontAttachment',
            title: '正面照',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }

                return $("<P>").append($('<IMG>').attr('src', value.resourceFullAddress).addClass('img-thumbnail resource-img-thumbnail')).html();
            }
        }, {
            field: 'idCardImageBackAttachment',
            title: '背面照',
            align: 'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }

                return $("<P>").append($('<IMG>').attr('src', value.resourceFullAddress).addClass('img-thumbnail resource-img-thumbnail')).html();
            }
        }, {
            field: 'remark',
            title: '备注',
            align: 'center'
        }],
        onCheck: detailToolbarListener,
        onUncheck: detailToolbarListener,
        onCheckAll: detailToolbarListener,
        onUncheckAll: detailToolbarListener,
        onPageChange: function (number, size) {

            $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            detailToolbarListener();
        },
        onRefresh: function () {

            $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            detailToolbarListener();
        }
    };

    $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var detailRecoveryInitialization = function () {

    detailQueryParams = {};

    $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

};

var editedDetailCallback = function (params) {

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();

        return;
    }

    new Message().show(result.errDesc);
};

var initImagePageDom = function () {

  $('#btn-id-card-image').click(function () {

      var res = $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

      if (res.idCardImageFrontAttachment && res.idCardImageBackAttachment) {

          var callParams = {
              id : res.id
          };

          new Message().openView({
              content: [contextPath + '/imageCheck/leadPage'],
              title: "下载身份证照片",
              maxmin: true,
              btn:['关闭'],
              area: ['320px', '262px']
          }, 'initPage', callParams, null, null, null, null);
      }
  });

  $('#btn-img-query').click(function () {

      var res = $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

      if(res.idCardImageFrontAttachment) {

          var imageFront = res.idCardImageFrontAttachment.resourceFullAddress;

          var imageBack = res.idCardImageBackAttachment.resourceFullAddress;

          var callParams = [

             {
                frontOrBack : imageFront
             }
            ,
             {
                frontOrBack : imageBack
             }
             ];

          new Message().openView({
            content: [contextPath + '/imageCheck/showPage'],
            title: "查看身份证",
            area: ['520px', '500px']
        }, 'initPage', callParams, null, null, null, null);
       }
    });

    $('#btn-info-edit').click(function () {

        var detailId = $(DETAIL_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id;

            var callParams =
                {
                    id: detailId
                }
            ;

            new Message().openView({
                content: [contextPath + '/orderDetail/editPage'],
                title: "修改信息",
                area: ['800px', '395px']
            }, 'initPage', callParams, 'saveOrUpdate', null, editedDetailCallback, null);
    });
};

$(function () {

    initImagePageDom();

    initDetailBootstrapTable();

    detailToolbarListener();
});