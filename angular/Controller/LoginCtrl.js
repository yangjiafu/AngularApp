(function () {
    angular.module("app")
    .controller("LoginCtrl", ["$scope", "$state", "dataService", "dataShareService", "$location", "myConfig", "$log", "utilityService", "$ionicLoading",
        function ($scope, $state, dataService, dataShareService, $location, myConfig, $log, utilityService, $ionicLoading) {
            // 账号
            $scope.model = {};
            $scope.model.account="";
            // 密码
            $scope.model.password="";

            // 登录方法
            $scope.login = function () {
                dataService.login({ account: $scope.model.account, password: $scope.model.password })
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
                   dataShareService.personInfo = {};
                   dataShareService.personJobWish = {};
                   utilityService.alert(args);
               });
            };

            // 退出登录方法
            $scope.exitLogin = function () {
                dataService.exitLogin();
                $scope.$emit("exitLogin", null);
            };

            // 收起登录窗口
            $scope.toggleLoginBox = function () {
                var box = angular.element('#loginBox');
                box.toggle();
            };

            // 用户注册
            $scope.regist = function () {
                $state.go("userRegist");
            };

            // 找回密码
            $scope.findpassword = function () {
                $state.go("findpassword");
            };


            //dataService.isNewVersion().then(function (args) {

            //}, function (args) {

            //});
        }]);
})();