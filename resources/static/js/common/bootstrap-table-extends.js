var DEFAULT_BOOTSTRAP_TABLE_OPTIONS = {
    cache: false,
    striped: true,
    pagination: true,
    showRefresh: true,
    showColumns: true,
    showExport: false,
    showToggle: false,
    smartDisplay: true,
    minimumCountColumns: 1,
    pageSize: 5,
    clickToSelect: true,
    pageList: [5, 10, 25, 50, 100, 'All'],
    idField: 'id',
    uniqueId: 'id'
};

var SERVER_BOOTSTRAP_TABLE_OPTIONS = {
    url: null,
    method: 'POST',
    contentType: 'application/json',
    sidePagination: 'server',
    dataField: 'records',
    totalField: 'totalElements',
    queryParams: function (e) {
        return {
            page: {
                pageNumber: (e.offset / e.limit) + 1,
                pageSize: e.limit
            }
        };
    }
};

(function ($) {

    $.fn.initBootstrapTable = function (options, sidePaginationServer) {

        var tableOptions = {};

        tableOptions = sidePaginationServer ? $.extend(tableOptions, DEFAULT_BOOTSTRAP_TABLE_OPTIONS, SERVER_BOOTSTRAP_TABLE_OPTIONS) : DEFAULT_BOOTSTRAP_TABLE_OPTIONS;

        $.extend(tableOptions, options);

        $(this).bootstrapTable(tableOptions);
    };

    $.fn.bootstrapTableRefreshCurrentPage = function () {

        var currentPage = $(this).bootstrapTable('getOptions').pageNumber;

        if (currentPage > 1 && $(this).bootstrapTable('getData').length === 0) {

            $(this).bootstrapTable('selectPage', currentPage - 1);

            return;
        }

        $(this).bootstrapTable('refresh');
    };

    $.fn.bootstrapTableSelectFirstPage = function () {

        var currentPage = $(this).bootstrapTable('getOptions').pageNumber;

        if (currentPage > 1) {

            $(this).bootstrapTable('selectPage', 1);

            return;
        }

        $(this).bootstrapTable('refresh');
    };

    $.fn.bootstrapTableRemoveByUniqueId = function (uniqueId, isRefreshCurrentPage) {

        $(this).bootstrapTable('removeByUniqueId', uniqueId);

        if (isRefreshCurrentPage) {

            $(this).bootstrapTableRefreshCurrentPage();
        }
    };

    $.fn.bootstrapTableRemoveByUniqueIds = function (uniqueIds, isRefreshCurrentPage) {

        var dom = $(this);

        $.each(uniqueIds, function (index, uniqueId) {

            dom.bootstrapTable('removeByUniqueId', uniqueId);
        });

        if (isRefreshCurrentPage) {

            $(this).bootstrapTableRefreshCurrentPage();
        }
    };

    $.fn.bootstrapTableGetSelections = function () {

        return $(this).bootstrapTable('getSelections');
    };

    $.fn.bootstrapTableGetSelectionRow = function () {

        var rows = $(this).bootstrapTable('getSelections');

        return rows.length > 0 ? rows[0] : null;
    };

    $.fn.bootstrapTableRemoveAll = function () {

        $(this).bootstrapTable('removeAll');
    };

})(jQuery);