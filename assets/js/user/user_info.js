$(function() {
    layui.form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    });
    initUserInfo();
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.mag('获取用户基本信息失败')
                }
                layui.form.val('formUserInfo', res.data);
            }
        })
    };
    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    });
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        var data = $(this).serialize();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改用户信息失败！');
                }
                layui.layer.msg('修改用户信息成功！');
                window.parent.getUserInfo();
            }
        })
    });

})