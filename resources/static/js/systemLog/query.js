var initPage = function (res) {

    var params = res.callParams.params;

    var result = res.callParams.result;

    $('#params').text(params);

    $('#result').text(result);
};