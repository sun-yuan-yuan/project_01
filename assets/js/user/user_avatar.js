$(function() {
    // 1.1 获取裁剪区域的 DOM 元素 
    var $image = $('#image');
    // 1.2 配置选项 
    const options = {
        // 纵横比 
        aspectRatio: 1,
        // 指定预览区域 
        preview: '.img-preview'
    };
    // 1.3 创建裁剪区域 
    $image.cropper(options);
    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#file').click();
    });
    // 为文件选择框绑定change事件
    $('#file').on('change', function(e) {
        var fileList = e.target.files;
        if (fileList.length === 0) {
            return layui.layer.msg('请选择图片!')
        }
        var file = fileList[0];
        // 根据选择的文件创建一个URL地址
        var newImageUrl = URL.createObjectURL(file);
        $image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', newImageUrl) //重新设置图片路径
            .cropper(options); //重新初始裁剪区域
    });
    //为确定按钮绑定点击事件
    $('#btnUpload').on('click', function() {
        var dataUrl = $image
            .cropper('getCroppedCanvas', { //创建一个canvas画布
                width: 100,
                height: 100
            }).toDataURL('image/png') //将canva画布上的内容转换为base64格式的字符
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataUrl },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败！')
                }
                layui.layer.msg('更新头像成功！');
                window.parent.getUserInfo();
            }
        })

    })

})