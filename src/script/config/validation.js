'use strict';
angular.module('app').config(['$validationProvider', function($validationProvider) {
    // 校验规则
    var expression = {
        phone: /^1[\d]{10}$/,
        password: function(value) {
            var str = value + '';
            return str.length > 5;
        },
        required: function(value) {
            return !!value;
        }
    };

    // 错误提示信息
    var defaultMsg = {
        phone: {
            success: '',
            error: '必须是11位手机号码'
        },
        password: {
            success: '',
            error: '长度至少6位'
        },
        required: {
            success: '',
            error: '不能为空'
        }
    };

    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);