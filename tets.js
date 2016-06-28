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

var support = {};

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




