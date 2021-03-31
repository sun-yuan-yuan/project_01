$(function() {
    // 点击“去注册账号”的链接
    $('#link-reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击“去登录”的链接
    $('#link-login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify() 自定义校验规则
    form.verify({
        // 密码 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 确认密码 校验规则
        repwd: function(value) {
            var pwd = $('.reg-box input[name=password]').val();
            if (pwd != value) {
                return '两次密码输入不一致'
            }
        }
    })

    //监听表单的 注册事件 
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            $('#link-login').click();
        })
    })

    // 监听表单的 登录事件
    $('#form-login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登陆成功！');
                // 将登录成功得到的 token 字符串，保存到localStorage 中
                localStorage.setItem('token', res.token);
                location.href = '/bigevent/index.html';
            }
        })
    })
})