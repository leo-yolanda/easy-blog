layui.use(["element", "laypage"], () => {
    let element = layui.element
    let laypage = layui.laypage
    const $ = layui.$

    element.tabDelete('demo', 'xxx')



    laypage.render({
        //指向存放分页的容器，值可以是容器ID、DOM对象
        elem: "laypage",
        //数据总数。一般通过服务端得到
        count: $("#laypage").data("maxnum"),
        //每页显示的条数  数据从后端到前端
        limit: 5,
        //连续出现的页码个数
        groups: 5,
        //起始页。一般用于刷新类型的跳页以及HASH跳页
        curr: location.pathname.replace("/page/", ""),
        //回调 当分页被切换时触发，函数返回两个参数：
        //obj（当前分页的所有选项值）
        //first（是否首次，一般用于初始加载的判断）
        jump(obj, f) {
            // console.log(obj);
            // console.log(f);


            $("#laypage a").each((i, v) => {
                // console.log($(v).data("page"));

                let pageValue = `/page/${$(v).data("page")}`
                    // console.log($(v));
                    // console.log(pageValue);


                v.href = pageValue
            })
        }
    })
})