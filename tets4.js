/**
 * Created by azmake on 16/6/22.
 */
/**
 * jQuery的实现原理的模拟代码 5 AJAX
 */

//简单的 xhr 使用如下所示
var xhr;
if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
} else if (window.ActiveXObject) {
    xhr = new ActiveXObject("Msxml2.XMLHTTP");
} else {
    throw new Error("AJAX is not supported by this browser");
}

function ready() {
    alert("start......");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            alert("Ready");
            if (xhr.status == 200) {
                alert("成功获得服务器返回的结果。");
                alert(xhr.responseText);
                var alice = eval("(" + xhr.responseText + ")");
                alert(alice.name);
            }
        }
    }
    xhr.open("get", "data.json");
    xhr.send(null);
};

//jQuery 简单地包装了对 xhr 对象的使用，通过对 jQuery 对象增加常用的访问方法，然后，提供给 jQuery 对象来使用

jQuery.extend({     // #6299
    // 请求的默认参数
    ajaxSettings: {
        url: location.href,
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        data: null,
        xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
            function () {
                return new window.XMLHttpRequest();
            } :
            function () {
                try {
                    return new window.ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                }
            }
    },

    // 用来设置 jQuery.ajaxSettings ，设置请求的参数
    ajaxSetup: function (settings) {
        jQuery.extend(jQuery.ajaxSettings, settings);
    },

    ajax: function (origSettings) {      // 实际的 ajax 函数
        var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings);

        // 创建 xhr 对象
        xhr = s.xhr();
        // 回调函数
        var onreadystatechange = xhr.onreadystatechange = function (isTimeout) {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    s.success.call(origSettings, xhr.responseText);
                }
            }
        };

        // 设置请求参数
        xhr.open(s.type, s.url);

        // Send the data    发出请求
        xhr.send(s.data);

        // return XMLHttpRequest to allow aborting the request etc.
        return xhr;
    },

    // 使用 get 方式发出 ajax 请求的方法
    get: function (url, data, callback, type) {
        // shift arguments if data argument was omited
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = null;
        }

        return jQuery.ajax({
            type: "GET",
            url: url,
            data: data,
            success: callback,
            dataType: type
        });
    }


});       // #6922

/**
 * 扩展jQuery对象,增加load方法
 */
jQuery.fn.extend(
    {
        load: function (url) {
            var self = this;
            jQuery.get(url, function (data) {
                    self.each(function () {
                            this.innerHTML = data;
                        }
                    )
                }
            )
        }
    }
);




