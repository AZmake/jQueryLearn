/**
 * Created by azmake on 16/6/21.
 */
/**
 * jQuery的实现原理的模拟代码 1 核心部分
 */

/**
 * 定义变量undefined方便使用
 */
var undefined = undefined;
var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;
/**
 * jQuery是一个函数,其实调用jQuery.fn.init创建对象
 */
var $ = jQuery = window.$ = window.jQuery = function (selector, context) {
    return new jQuery.fn.init(selector,context);
};

/**
 * 用来检测是否是一个id
 */
idExpr = /^#([\w-]+)$/;

/**
 * 设置 jQuery 的原型对象, 用于所有 jQuery 对象共享
 */
jQuery.fn = jQuery.prototype = {
    length:0,
    jquery:"1.4.2",
    // 这是一个示例，仅仅提供两种选择方式：id 和标记名
    init:function (selector, context) {
        if (typeof selector === "string"){
            match = idExpr.exec(selector);
            if (match && match[1]){
                var elem = document.getElementById(match[1]);
                if (elem){
                    this.length = 1;
                    this[0] = elem;
                }
            }else {
                var nodes = document.getElementsByTagName(selector);
                for(var l = nodes.length, j = 0; j < l; j++){
                    this[j] = nodes[j];
                }
                this.length = nodes.length;
            }

            this.context = document;
            this.selector = selector;
            return this;

        }
    },
    /**
     * 代表的 DOM 对象的个数
     * @returns {number}
     */
    size:function () {
        return this.length;
    },
    /**
     * 用来设置 css 样式
     */
    css:function (name, value) {
        this.each(
            function (name, value) {
                this.style[name] = value;
            },
            arguments
        );
        return this;
    },
    /**
     * 用来设置文本内容
     */
    text:function (val) {
        if (val){
            this.each(function () {
                    this.innerHTML = val;
                },
                arguments
            )
        }
        return this;
    },
    /**
     * 用来对所有的 DOM 对象进行操作
     * @param callback callback 自定义的回调函数
     * @param args args 自定义的参数
     */
    each:function (callback, args) {
        return jQuery.each(this,callback,args);
    }
};
/**
 *  init 函数的原型也就是 jQuery 的原型
 */
jQuery.fn.init.prototype = jQuery.prototype;

/**
 * 用来遍历 jQuery 对象中包含的元素
 * @param object
 * @param callback
 * @param args
 */
jQuery.each = function (object, callback, args) {
    var i = 0, length = object.length;
    if (args === undefined){
        for (var value = object[0]; i < length && callback.call(value,i,value)!==false;value = object[++i]){

        }
    }else {
        for (;i < length;){
            if (callback.apply(object[i++],args) == false){
                break;
            }
        }
    }
};








/**
 * jQuery的实现原理的模拟代码 2 数据部分
 */
function now() {
    return (new Date).getTime();
}
/**
 * 扩充数据的属性名,动态生成,避免与已有的属性冲突
 */
var expando = "jQuery" + now(),uuid = 0, windowData = {};
jQuery.cache = {};
jQuery.expando = expando;

/**
 * 管理数据,可以针对DOM对象保存私有的数据,可以读取保存的数据
 * @param key
 * @param value
 */
jQuery.fn.data = function (key, value) {
    if(value == undefined){
        return jQuery.data(this[0],key);
    }else {
        this.each(
            function () {
                jQuery.data(this,key,value);
            }
        );
    }
};

/**
 * 移除数据,删除保存在对象上的数据
 * @param key
 * @returns {*}
 */
jQuery.fn.removeData = function (key) {
    return this.each(
        function () {
            jQuery.removeData(this,key);
        }
    )
};

/**
 * 为元素保存数据
 * @param elem
 * @param name
 * @param data
 * @returns {*}
 */
jQuery.data = function (elem, name, data) {
    //取得元素保存的键值
    var id = elem[expando],cache = jQuery.cache,thisCache;
    //没有id的情况下无法取值
    if (!id && typeof name === "string" && data === undefined){
        return null;
    }
    //为元素计算一个唯一的键值
    if (!id){
        id = ++uuid;
    }
    if(!cache[id]){
        elem[expando] = id;
        cache[id] = {};
    }

    thisCache = cache[id];
    if (data !== undefined){
        thisCache[name] = data;
    }
    return typeof name === "string"?thisCache[name]:thisCache;
};
/**
 * 删除保存的数据
 * @param elem
 * @param name
 */
jQuery.removeData = function (elem,name) {
    var id = elem[expando],cache = jQuery.cache, thisCache = cache[id];
    if(name){
        if (thisCache){
            delete thisCache[name];
            if (jQuery.isEmptyObject(thisCache)){
                jQuery.removeData(elem);
            }
        }
    }
};

/**
 * 检查对象是否为空
 * @param obj
 * @returns {boolean}
 */
jQuery.isEmptyObject = function (obj) {
    for (var name in obj){
        return false;
    }
    return true;
};
/**
 * 检查是否是一个函数
 * @param obj
 * @returns {boolean}
 */
jQuery.isFunction = function (obj) {
    var s = toString.call(obj);
    return toString.call(obj) === "[object Function]";
};

jQuery.isWindow = function( obj ) {
    /* jshint eqeqeq: false */
    return obj != null && obj == obj.window;
};

jQuery.isPlainObject = function (obj) {
    var key;

    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
        return false;
    }

    try {

        // Not own constructor property must be Object
        if ( obj.constructor &&
            !hasOwn.call( obj, "constructor" ) &&
            !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
            return false;
        }
    } catch ( e ) {

        // IE8,9 Will throw exceptions on certain host objects #9897
        return false;
    }

    // Support: IE<9
    // Handle iteration over inherited properties before own properties.
    // if ( !support.ownFirst ) {
    //     for ( key in obj ) {
    //         return hasOwn.call( obj, key );
    //     }
    // }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    for ( key in obj ) {}

    return key === undefined || hasOwn.call( obj, key );
};




/**
 * jQuery的实现原理的模拟代码 3 事件处理
 */

/**
 * 用于生成事件处理函数的 id
 * @type {number}
 */
jQuery.guid = 1;

/**
 * jQuery 的事件对象
 * @type {{add: jQuery.event.add, global: {}, handle: jQuery.event.handle, special: {}}}
 */
jQuery.event = {
    /**
     * 为对象增加事件
     * @param elem      增加事件的元素
     * @param type      事件的名称
     * @param handler   事件处理程序
     * @param data      事件相关的数据
     */
    add:function (elem, type, handler, data) {
        var handleObjIn,handleObj;
        //确认函数有一个唯一的 ID
        if (!handler.guid){
            handler.guid = jQuery.guid++;
        }
        // 取得这个元素所对应的缓存数据对象
        var elemData = jQuery.data(elem);
        // 取得元素对应的缓存对象上的事件对象和所有事件共用的处理程序
        var events = elemData.events = elemData.events || {};
        var eventHandle = elemData.handle;
        /**
         * 是否已经有事件处理函数 handle 只有一个，都是使用 jQuery.event.handle
         * 通过使用闭包，使得这个函数引用当前的事件对象，参数。
         */
        if (!eventHandle){
            elemData.handle = eventHandle = function () {
                return jQuery.event.handle.apply(eventHandle.elem,arguments);
            };
        }
        // 使得闭包处理程序可以找到事件源对象
        eventHandle.elem = elem;

        handleObj = {handler:handler,data:data};
        handleObj.namespace = "";
        handleObj.type = type;
        handleObj.guid = handler.guid;

        // 每种事件可以有一系列的处理程序，数组形式
        var handlers = events[type],special = jQuery.event.special[type] || {};

        if(!handlers){
            handlers = events[type] = [];
            /**
             * 检查是否有特殊的事件处理函数
             * 只用 addEventListener/attachEvent 处理包含有特殊事件的处理函数
             * events handler returns false
             * 完成实际的事件注册
             * 实际的事件处理函数是 eventHandle
             */
            if(!special.setup || special.setup.call(elem,data,namespace, eventHandle) === false){
                if(elem.addEventListener){
                    elem.addEventListener(type,eventHandle,false);
                }else if (elem.attachEvent){
                    elem.attachEvent("on" + type,eventHandle);
                }
            }

        }
        //自定义的处理函数在一个堆栈中，以后 jQuery.event.handle 到这里找到实际的处理程序
        handlers.push(handleObj);
        //释放elem,防止在IE浏览器下内存泄漏
        elem = null;
    },
    global:{},
    /**
     * 真正的事件处理函数,由于是通过 return jQuery.event.handle.apply(eventHandle.elem, arguments) 调用的
     * 所以，此时的 this 就是事件源对象
     * @param event 事件参数
     * @returns {Object}
     */
    handle: function (event) {
        var all, handlers, namespaces, namespace, events;
        event = window.event;
        event.currentTarget = this;
        //在当前的事件对象上找到事件处理列表
        var events = jQuery.data(this, "events"), handlers = events[event.type];
        if (events && handlers) {
            // Clone the handlers to prevent manipulation
            handlers = handlers.slice(0);
            for (var j = 0, l = handlers.length; j < l; j++) {
                var handleObj = handlers[j];

                // 取得注册事件时保存的参数
                event.handler = handleObj.handler;
                event.data = handleObj.data;
                event.handleObj = handleObj;
                var ret = handleObj.handler.apply(this, arguments);
            }
        }
        return event.result;
    },
    special:{}
};

/**
 * bind 函数定义
 */

jQuery.fn.bind = function( type, fn)
{
    var handler = fn;
    // 调用 jQuery.event.add 添加事件
    for (var i = 0, l = this.length; i < l; i++) {
        jQuery.event.add(this[i], type, handler);
    }
    return this;
};

/**
 * unbind 函数定义
 */
jQuery.fn.unbind = function (type, fn) {
    // Handle object literals
    if (typeof type === "object" && !type.preventDefault) {
        for (var key in type) {
            this.unbind(key, type[key]);
        }
    } else {
        for (var i = 0, l = this.length; i < l; i++) {
            jQuery.event.remove(this[i], type, fn);
        }
    }
    return this;
};

/**
 * click 事件的注册方法
 * @param fn
 * @returns {jQuery}
 */
jQuery.fn.click = function (fn) {
    this.bind("click", fn);
    return this;
};


/**
 * jQuery的实现原理的模拟代码 4 重要的扩展函数 extend
 */
jQuery.extend = jQuery.fn.extend = function () {
    var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }

    if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {};
    }

    if (length === i) {
        target = this;
        --i;
    }

    for (; i < length; i++) {
        if (options = arguments[i] != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue;
                }
                if (deep && copy && (jQuery.isPlainObject(copy) || jQuery.isArray(copy))) {
                    var clone = src && (jQuery.isPlainObject(src) || jQuery.isArray(src)) ? src : jQuery.isArray(copy) ? [] : {};
                    target[name] = jQuery.extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
};

jQuery.fn.extend(
    {
        removeData: function( key ) {
            return this.each(function() {
                jQuery.removeData( this, key );
            });
        }
    }
);


/**
 * jQuery的实现原理的模拟代码 5 AJAX
 */

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