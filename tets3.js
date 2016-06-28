/**
 * Created by azmake on 16/6/21.
 */
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


/**
 * jQuery.extend 也可以通过 jQuery.fn.extend 使用， 在 jQuery 中使用很多，用来为一个目标对象扩展成员，扩展的成员来自于一系列参考对象。
 *这样，如果我们需要为 jQuery.fn 扩展成员 removeData，就可以这样进行。
 */


jQuery.fn.extend(
    {
        removeData: function( key ) {
            return this.each(function() {
                jQuery.removeData( this, key );
            });
        }
    }
); 
