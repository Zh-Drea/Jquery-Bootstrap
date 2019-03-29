var REG_EXPS = {
    //排列序号验证(整数)
    INTEGER: /^[-\+]?\d+$/,
    //最小计量单位验证(正整数)
    PLUS_INTEGER:/^[1-9]\d*$/,
    //重量验证(正整数,正小数,0)
    JUST_NUMBER: /^\d+(?=\.{0,1}\d+$|$)/,
    //库存验证(为正整数和零)
    POSITIVE_INTEGER:/^([1-9]\d*|[0]{1,1})$/,
    //金额验证(正数以及最多小数点后两位,金额)
    PLUS_MONEY: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
    //密码验证(6到16位数字和字母组成)
    PASSWORD:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
    //默认地址(a到z的大小英文,数字,空格,和英文符号)
    REP_ADDRESS:/^([\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F?a-zA-Z\s0-9]+)$/,
    //邮箱地址
    MAILBOX:/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
    //发货人名称(英文.包括空格)
    NUM:/^([a-zA-Z\s]+)$/,
    //仓库默认发货电话
    REP_PHONE:/^[+]?[0-9]*$/
};

var CONSTANTS_URLS = {
    GET_UPLOAD_PARAMS: contextPath + '/system/getUploadParams',
    GET_CONSTANTS_ENUM_DATA: contextPath + '/getConstantsEnumData'
};

var uploadParams;
var constantsEnumData;

var result = $.sendRequest(CONSTANTS_URLS.GET_UPLOAD_PARAMS, null);

if (checkRespCodeSuccess(result)) {
    uploadParams = result.data;
}

result = $.sendRequest(CONSTANTS_URLS.GET_CONSTANTS_ENUM_DATA, null);

if (checkRespCodeSuccess(result)) {
    constantsEnumData = result.data;
}