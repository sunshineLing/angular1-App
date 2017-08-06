'use strict';

// 导入app模块，配置
// 第一个参数是配置路由的，第二个是用来
angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // main是导航的名字
    $stateProvider.state('main', {
        url: '/main',  // url是路径
        templateUrl: 'view/main.html',  // 模板
        controller: 'mainCtrl'  
    }).state('position', {  // 职位详情页的路由
        url: '/position/:id',
        templateUrl: 'view/position.html',
        controller: 'positionCtrl'
    }).state('company', {
        url: '/company/:id',
        templateUrl: 'view/company.html',
        controller: 'companyCtrl'
    }).state('search', {
        url: '/search',
        templateUrl: 'view/search.html',
        controller: 'searchCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'view/login.html',
        controller: 'loginCtrl'
    }).state('register', {
        url: '/register',
        templateUrl: 'view/register.html',
        controller: 'registerCtrl'
    }).state('post', {
        url: '/post',
        templateUrl: 'view/post.html',
        controller: 'postCtrl'
    }).state('me', {
        url: '/me',
        templateUrl: 'view/me.html',
        controller: 'meCtrl'
    }).state('favorite', {
        url: '/favorite',
        templateUrl: 'view/favorite.html',
        controller: 'favoriteCtrl'
    })
    // 导航重定向到main上面
    $urlRouterProvider.otherwise('main');
}])