$(function() {
    initCate();
    initEditor();
    // 加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败！');
                }
                var htmlStr = template('tpl-cateList', res);
                $('[name=cate_id]').html(htmlStr);
                layui.form.render();
            }
        })
    };
    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 给 选择封面 绑定事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });
    // 监听选择 图片文件 是否改变
    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 给 草稿 按钮添加点击事件
    var art_state = '已发布';
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });
    // 为表单添加 submit 事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 基于form表单，迅速创建formData对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态存到fd中
        fd.append('state', art_state);
        // fd.forEach(function(v, k) {
        //     console.log(k, v)
        // })
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 将文件对象存储到fd中
                fd.append('cover_img', blob);
            });
        publishArticle(fd);
    });
    // 发布文章
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 像服务器提交的是formdate格式的数据，必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('发布文章失败！');
                }
                layui.layer.msg('发布文章成功！');
                location.href = '/article/art_list.html';
            }
        })
    }
})