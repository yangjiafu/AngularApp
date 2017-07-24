angular.module('app', ['ngCordova', 'ionic', "ui.tree", 'ljxTools', 'ionic-native-transitions'], function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.timeout = 100000;

    var param = function(obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
})
.constant("templateConfig", {
    programName: "我要学习",
    userRegist: {
        templateName: "userRegist_private"
    }
})
.constant("myConfig", {
    programName: "我要学习",
    platform: "app",
    videoPlatform: "yd",
    version: "1.0.47",
    //serviceUrl: "http://localhost:57322/",
    //serviceUrl: "http://www.kmztsoftware.com/ZSDT",
    //filesUrl: "http://www.kmztsoftware.com/CourseFiles",
    serviceUrl: "http://www.ynjjxx.com/ZSDT",
    filesUrl:"http://www.ynjjxx.com/CourseFiles",
    needSelectDifficulty:false,
    templates: [
        {
            key: "userRegist",
            value:{
                templateName: "userRegist_private"
            }
        }
    ],
    debug: {
        videoFrom : "fwq"
    }
})
.run(function ($ionicPlatform, $ionicPopup, $rootScope, $location, $ionicHistory, $ionicActionSheet, $http,
    $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2, storeService, dataService, dataShareService, $state, $log) {
    $ionicPlatform.ready(function() {
        //setTimeout(function() {
        //    navigator.splashscreen.hide();
        //}, 1000);
        var token = storeService.getLocalValue("token");
        $log.debug("app run function token is : " + token);
        if (token) {
            dataService.loginByToken({ token: token })
            .then(function (args) {
                return dataService.getPersonInfo({ account: dataService.userInfo.account });
            })
            .then(function (args) {
               dataShareService.personInfo = args;
               return dataService.getPersonJobWish({ personId: dataService.userInfo.personId });
            })
            .then(function (args) {
                dataShareService.personJobWish = args;
                $state.go("tab.allCourseList");
            }, function (args) {
                $state.go("login");
            })
            
        }
        else {
            $state.go("login");
        }

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function(e) {

        e.preventDefault();

        function showConfirm() {
            var confirmPopup = $ionicPopup.confirm({
                title: '<strong>提示</strong>',
                template: '<div style="text-align:center;">您确定要退出吗?</div>',
                okText: '确定',
                okType: 'confirmButton',
                cancelText: '取消',
                cancelType: 'confirmButton'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                } else {
                    // Don't close
                }
            });
        }

        

        if ($location.path() == '/tab/index' || $location.path() == '/tab/lists' || $location.path() == '/tab/account' || $location.path() == '/tab/publish' || $location.path() == '/login') {
            showConfirm();
        } else if ($ionicHistory.backView()) {
            //$ionicHistory.goBack();
            showConfirm();
        } else {
            showConfirm();
        }

        return false;
    }, 100);
})
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(true);
})
.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      //下面加上自己的
      'http://*.kmztsoftware.com/**',
      'http://*.ynjjxx.com/**',
      'http://vdikmzy.eicp.net:8085/**',
      'file:///data/user/0/com.ionicframework.wyxx236962',
      'http://gw.alicdn.com/**',
      'http://*.aliyun.com/**',
      'http://*.aliyuncs.com/**',
      'http://videocloud.cn-hangzhou.log.aliyuncs.com/**'
    ]);

    //// 黑名单
    //$sceDelegateProvider.resourceUrlBlacklist([
    //  'http://xx.com/**'
    //]);
})
.config(function($ionicNativeTransitionsProvider){ 
    $ionicNativeTransitionsProvider.setDefaultOptions({ 
        duration: 400, // in milliseconds (ms), default 400, 
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4 
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, 
        androiddelay: -1, // same as above but for Android, default -1 
        winphonedelay: -1, // same as above but for Windows Phone, default -1, 
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android) 
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android) 
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option 
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back 
    });

    $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'left'
    });

    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
    });
})
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('tab', {
        url: '/tab',
        cache: false,
        abstract: true,
        //controller:function($scope){
        //    $scope.value = "ok";
        //},
        templateUrl: 'angular/appView/tabs.html'
    })
    .state('tab.courseList', {
        url: '/courseList',
        cache: true,
        views: {
            'tab-mycourse': {
                templateUrl: 'angular/appView/courseList.html',
                controller: 'appCourseListCtrl'
            }
        },
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('tab.courseItem', {
        url: '/courseItem/:id/:parent',
        cache: true,
        views: {
            'tab-mycourse': {
                templateUrl: 'angular/appView/courseItem.html',
                controller: 'appCourseItemCtrl'
            }
        },
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('tab.allCourseList', {
        url: '/allCourseList',
        cache: true,
        views: {
            'tab-course': {
                templateUrl: 'angular/appView/allCourseList.html',
                controller: 'allCourseListCtrl'
            }
        },
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('tab.allCourseItem', {
        url: '/courseItem/:id/:parent',
        cache: false,
        views: {
            'tab-course': {
                templateUrl: 'angular/appView/courseItem.html',
                controller: 'appCourseItemCtrl'
            }
        },
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('selectCourse', {
        url: '/selectCourse/:isAll/:courseId',
        cache: false,
        templateUrl: 'angular/appView/selectCourse.html',
        controller: 'SelectCourseCtrl',
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('learnCourse', {
        url: '/learnCourse/:courseId/:courseName/:difficulty',
        cache: false,
        templateUrl: 'angular/appView/learnCourse.html',
        controller: 'LearnCourseCtrl'
    })
    .state('learnCourse1', {
        url: '/learnCourse1/:courseId/:courseName/:difficulty',
        cache: false,
        templateUrl: 'angular/appView/learnCourse1.html',
        controller: 'LearnCourse1Ctrl'
    })
    .state('examCourse', {
        url: '/examCourse/:courseId/:courseName/:difficulty',
        cache: false,
        templateUrl: 'angular/appView/examCourse.html',
        controller: 'ExamCourseCtrl'
    })
    .state('examCourse1', {
        url: '/examCourse1/:courseId/:courseName/:difficulty',
        cache: false,
        templateUrl: 'angular/appView/examCourse1.html',
        controller: 'ExamCourse1Ctrl'
    })
    .state('tab.messageClassify', {
        url: '/messageClassify',
        cache: true,
        views: {
            'tab-message': {
                templateUrl: 'angular/appView/messageClassify.html',
                controller: 'MessageClassifyCtrl'
            }
        },
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('tab.messageList', {
        url: '/messageList/:id',
        cache: false,
        views: {
            'tab-message': {
                templateUrl: 'angular/appView/messageList.html',
                controller: 'MessageListCtrl'
            }
        },
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('tab.messageItem', {
        url: '/messageItem/:id',
        cache: false,
        views: {
            'tab-message': {
                templateUrl: 'angular/appView/messageItem.html',
                controller: 'MessageItemCtrl'
            }
        },
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('tab.messageItemUrl', {
        url: '/messageItemUrl/:classifyId/:url',
        cache: false,
        views: {
            'tab-message': {
                templateUrl: 'angular/appView/messageItemUrl.html',
                controller: 'MessageItemUrlCtrl'
            }
        },
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('tab.person', {
        url: '/person',
        cache:false,
        views: {
            'tab-person': {
                templateUrl: 'angular/appView/person.html',
                controller: 'PersonCtrl'
            }
        },
        //nativeTransitions: {
        //    "type": "flip",
        //    "direction": "up"
        //}
    })
    .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'angular/appView/login.html',
        controller: 'LoginCtrl',
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('findPassword', {
        url: '/findPassword',
        cache: false,
        templateUrl: 'angular/appView/findPassword.html',
        controller: 'FindPasswordCtrl',
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('updatePassword', {
        url: '/updatePassword',
        cache: false,
        templateUrl: 'angular/appView/updatePassword.html',
        controller: 'updatePasswordCtrl',
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('learnRecord', {
        url: '/learnRecord',
        cache: false,
        templateUrl: 'angular/appView/learnRecord.html',
        controller: 'learnRecordCtrl',
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('version', {
        url: '/version',
        cache: false,
        templateUrl: 'angular/appView/version.html',
        controller: 'versionCtrl',
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('offlineCourses', {
        url: '/offlineCourses',
        cache: false,
        templateUrl: 'angular/appView/offlineCourses.html',
        controller: 'offlineCoursesCtrl',
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('userRegist', {
        url: '/userRegist',
        cache: false,
        templateUrl: 'angular/appView/userRegist_private.html',
        controller: 'UserRegistCtrl',
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    })
    .state('test', {
        url: '/test',
        cache: false,
        templateUrl: 'angular/appView/test.html',
        controller: '',
        nativeTransitions: {
            "type": "flip",
            "direction": "up"
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/allCourseList');

});
