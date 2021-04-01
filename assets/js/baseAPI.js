//每次调用$.get()或$.post()或$.ajax()的时候，会先调用ajaxPrefilter这个函数，在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 请求的url里面包含/my/这个字符就给配置对象添加请求头
    // 统一为有权限的接口配置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '' //???为什么要或上空值
        }
    }
    // 不论成功还是失败都会调用complete函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token'); //????为什么要清空
            location.href = '/bigevent/login.html';
        }
    }
})