
//Url
(function (exports) {
    var mUrl = (function () {
        return {
            //将url转码
            fEncode: function (sUrl) {
                var aRes = sUrl.split('?'),
                    sRes,
                    oRes,
                    sHost,
                    i;

                if (aRes.length == 1) {
                    return sUrl;
                }
                else {
                    sHost = aRes[0];
                    sRes = aRes[1];
                    oRes = this.fGetParam(sUrl);
                    sHost += '?';
                    for (i in oRes) {
                        sHost += (encodeURIComponent(i) + '=' + encodeURIComponent(oRes[i]) + '&');
                    }
                    return sHost;
                }
            },
            //提取url中参数
            fGetParam: function (sUrl) {
                var sParam = sUrl.split("?")[1],
                    aDataSet = sParam.split('&'),
                    i,
                    oRes = {};

                for (i in aDataSet) {
                    oRes[aDataSet[i].split("=")[0]] = aDataSet[i].split("=")[1];
                }

                return oRes;
            }
        };
    })();

    exports.mUrl = mUrl;
})(window);

//AJAX 依赖mUrl模块
(function (exports) {
    var mAjax = (function () {
        //将对象转化为能传送的字符串
        var fSerialize = function (o) {
            var i, aRes = [],
                fSer = function (o, sHead) {
                    var sT = sHead || "",
                        i;

                    for (i in o) {
                        if (typeof o[i] == "object") { //对象递归遍历 内部属性字段
                            arguments.callee(o[i], sT + '[' + i + ']');
                        }
                        else {
                            aRes.push(sT + '[' + encodeURIComponent(i) + ']' + "=" + encodeURIComponent(o[i]));
                        }
                    }
                };

            for (i in o) {
                if (typeof o[i] == "object") {
                    fSer(o[i], i);
                }
                else {
                    aRes.push(encodeURIComponent(i) + "=" + encodeURIComponent(o[i]));
                }
            }

            return aRes.join('&');
        };

        return {
            fGet: function (sUrl, fCallback) {
                this.fAjax('get', sUrl, {}, fCallback);
            },
            fPost: function (sUrl, oSend, fCallback) {
                this.fAjax('post', sUrl, oSend, fCallback, { "Content-Type": "application/x-www-form-urlencoded" });
            },

            fAjax: function (sType, sUrl, oSend, fCallback, oHeaders) {
                var xhr = new XMLHttpRequest(),
                    i,
                    oH = oHeaders || {};

                xhr.open(sType, mUrl.fEncode(sUrl), true);

                for (i in oH) {
                    xhr.setRequestHeader(i, oHeaders[i]);
                }

                xhr.send(fSerialize(oSend));

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status < 300 && xhr.status >= 200 || xhr.status == 304) {
                            fCallback.call(xhr, xhr.responseText);
                        }
                    }
                };
            }
        };
    })();

    exports.mAjax = mAjax;
})(window);
