$(function() {
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = addZero(dt.getMonth() + 1);
        var d = addZero(dt.getDate());
        var hh = addZero(dt.getHours());
        var mm = addZero(dt.getMinutes());
        var ss = addZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 定义补零函数
    function addZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义一个查询的参数对象，请求数据的时候，需要将请求参数对象提交到服务器
    var query = {
        pagenum: 1, // 页码值，默认请求第1页的值
        pagesize: 2, // 每页显示几条数据，默认显示2条
        cate_id: '', // 文章分类的id
        state: '' // 文章的发布状态
    };
    initTable();
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败！');
                }
                console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    initCate();
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类数据失败！');
                }
                var htmlStr = template('tpl-cate', res);
                $('#select_cate').html(htmlStr);
                // 通过layui重新渲染表单区域UI结构
                layui.form.render();
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        query.cate_id = cate_id;
        query.state = state;
        initTable();
    });
    // 渲染分页
    function renderPage(total) {
        layui.laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize, //每页显示的条数
            curr: query.pagenum, //当前页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义排版
            limits: [2, 3, 5, 10], //每页条数的选择项
            // 触发jump回调的方式有2种
            // ①只要调用了layui.laypage.render()方法，就会触发jump回调
            // ②点击页码的时候，会触发jump回调
            jump: function(obj, first) {
                // 用first值，判断哪种方式，触发的jump回调
                // ① 值为true，则是layui.laypage.render()方法，触发jump回调
                // ② 值为undefined，则是点击页码，触发jump回调
                //obj包含了当前分页的所有参数：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                // 把最新的 页码值，赋值给 query 这个查询参数对象中
                query.pagenum = obj.curr;
                // 把最新的 每页显示的条数，赋值给 query 这个查询参数对象中
                query.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initTable();
                }
            }
        });
    }

    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var length = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章失败！');
                    }
                    layui.layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据，如果没有剩余的数据则让页码值-1之后，在调initTable函数
                    if (length === 1) {
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })
})