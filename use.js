/**
 * Created by azmake on 16/6/21.
 */

/**
 * 测试 1 核心
 */
//$("h1").text("hello, world.").css("color","green");


/**
 *测试 2 数据
 */

//$("#msg").data("name", "Hello, world.");
// alert($("#msg").data("name"));
// $("#msg").removeData("name");
// alert($("#msg").data("name"));

/**
 *测试 2 事件
 */
//
// $("#msg").click(
//     function () {
//         alert(this.innerHTML);
//     }
// );

/**
 *测试 3 AJAX
 */

$("#btn").click(function () {
    alert("click on");
    $("#msg").load("hello.txt");
});