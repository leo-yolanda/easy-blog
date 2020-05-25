layui.use('laydate', () => {

    let laydate = layui.laydate;
    laydate.render({
        elem: '#test-n1',
        position: 'static',
        showBottom: false
    })
})