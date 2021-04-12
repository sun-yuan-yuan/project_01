$(function() {
    initArtCateList();
    // 渲染文章类别列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败！')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    };
    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });
    // 因为页面加载完还没有form表单，所以绑定事件需通过代理方式
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('新增文章分类失败！')
                }
                initArtCateList();
                layui.layer.msg('新增文章分类成功！');
                layui.layer.close(indexAdd);
            }
        })
    });

    // 点击 编辑 按钮打开 修改文章分类 弹出层
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                layui.form.val('form-edit', res.data);
            }
        })
    });

    // 更新修改的文章分类，给表单绑定submit事件，须通过代理绑定
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类信息失败！')
                }
                layui.layer.msg('更新分类信息成功！');
                layui.layer.close(indexEdit);
                initArtCateList();
            }
        })
    });

    // 删除文章分类
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章分类失败！');
                    }
                    layui.layer.msg('删除文章分类成功！');
                    layui.layer.close(index);
                    initArtCateList();
                }
            })
        })
    })
})