$(function() {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo();
    // 点击 退出按钮 实现退出功能
    $('#btnLogout').on('click', function() {
        layui.layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            // 1、清空本地存储的token
            localStorage.removeItem('token');
            // 2、重新跳转到登录页
            location.href = '/bigevent/login.html';
            // 关闭confirm询问框
            layui.layer.close(index);
        })
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户基本信息失败！');
            }
            // console.log(res.data)
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data);
        },

    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1、获取用户名称
    var name = user.nickname || user.username;
    // 2、设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}