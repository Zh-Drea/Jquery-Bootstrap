//bootstrap-treeView参数配置
var treeView = function (list) {
    $('#tree').treeview({
        data: list,
        levels: 5
    });

    $('#tree').treeview('expandAll', { levels: 5, silent: true });
};