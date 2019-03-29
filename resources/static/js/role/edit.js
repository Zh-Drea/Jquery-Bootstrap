var PAGE_URLS = {
    GET_BY_ID: contextPath + "/role/getById",
    SAVE_OR_UPDATE: contextPath + "/role/saveOrUpdate",
    ALL_MENUS: contextPath + "/permission/loadAllTree"
};

var msg = new Message();

function getChildNodeIdArr(node) {
    var ts = [];
    if (node.nodes) {
        for (x in node.nodes) {
            ts.push(node.nodes[x].nodeId);
            if (node.nodes[x].nodes) {
                var getNodeDieDai = getChildNodeIdArr(node.nodes[x]);
                for (j in getNodeDieDai) {
                    ts.push(getNodeDieDai[j]);
                }
            }
        }
    } else {
        ts.push(node.nodeId);
    }
    return ts;
}

//选中所有子节点时选中父节点
function setParentNodeCheck(node) {

    var parentNode = $('#tree').treeview("getNode", node.parentId);

    if (parentNode.nodes) {

        var checkedCount = 0;

        for (x in parentNode.nodes) {
            if (parentNode.nodes[x].state.checked) {
                checkedCount++;
            } else {
                break;
            }
        }

        if (checkedCount === parentNode.nodes.length) {

            //当父节点的子节点全部选完，父节点状态改变为checked
            $('#tree').treeview("checkNode", parentNode.nodeId);

            setParentNodeCheck(parentNode);
        } else {

            //当选中父节点，取消某些子节点，去除父节点checked状态
            $('#tree').treeview('uncheckNode', [parentNode.nodeId, {silent: true}]);

            setParentNodeCheck(parentNode);
        }
    }
}

//bootstrap-treeView参数配置
var treeView = function (treeRefData,params) {

    $('#tree').treeview({
        data: treeRefData,
        levels: 5,
        showCheckbox: true,
        hierarchicalCheck: true,
        //选中
        onNodeChecked: function (event, node) {

            setParentNodeCheck(node);

            var selectNodes = getChildNodeIdArr(node); //获取所有子节点

            if (selectNodes) { //子节点不为空，则选中所有子节点
                $('#tree').treeview('checkNode', [selectNodes, {silent: true}]);
            }

        },
        //取消选中
        onNodeUnchecked: function (event, node) { //取消选中节点

            setParentNodeCheck(node);

            var selectNodes = getChildNodeIdArr(node); //获取所有子节点

            if (selectNodes) { //子节点不为空，则取消选中所有子节点
                $('#tree').treeview('uncheckNode', [selectNodes, {silent: true}]);
            }
        },

        onNodeExpanded: function (event, data) {

        },

        onNodeSelected: function (event, data) {

        }
    });

    if (params) {
        $('#tree').treeview('collapseAll', {silent: true});
    }
    else {
        $('#tree').treeview('expandAll', {levels: 5, silent: true});
    }

};

var initPage = function (params) {

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };

        var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {

            msg.show(result.errDesc);

            return;
        }
        $('#edit-form').autoFillForm(result.data);

        var res =$.sendRequest(PAGE_URLS.ALL_MENUS,JSON.stringify(p));

        if (!checkRespCodeSuccess(res)) {

            msg.show(res.errDesc);

            return;
        }
        //判断子节点是否全部选完，选完则父节点checked:true
        $.each(res.data,function (index,row) {

            var isExit = true;

            var list = [];

            $.each(row.nodes,function (o,obj) {

               list.push(obj.state.checked);
            });

            $.each(list,function (i,plt) {

                if (!plt) {
                    return isExit = false;
                }

            });

            if (isExit) {
                row.state.checked = true
            }else {
                row.state.checked = false
            }
        });

        treeView(res.data,false);
    }
    else {

        var b ={
            id: null
        };

        var row = $.sendRequest(PAGE_URLS.ALL_MENUS,JSON.stringify(b));

        if (!checkRespCodeSuccess(row)) {

            msg.show(row.errDesc);

            return;
        }

        treeView(row.data,true);
    }
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    if (!params.name) {

        msg.show("角色名不能为空!");

        return;
    }

    var res = $('#tree').treeview('getChecked');

    $.each(res, function (index, obj) {

        if (obj.nodes) {

            delete res[index];
        }
    });

    var treeIds = [];

    $.each(res, function (o, plt) {

        if (plt) {

            treeIds.push({id: plt.id});
        }
    });

    params.permissions = treeIds;

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
