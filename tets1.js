/**
 * Created by azmake on 16/6/21.
 */

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
 * 使用例子
 */

$("#msg").data("name", "Hello, world.");
alert($("#msg").data("name"));
$("#msg").removeData("name");
alert($("#msg").data("name"));