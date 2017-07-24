(function () {
    angular.module("app")
    .controller("FindPasswordCtrl", ["$scope", "$state", "dataService", "$location", "$interval", "utilityService",
        function ($scope, $state, dataService, $location, $interval, utilityService) {
            $scope.userInfo = {
                userPhone: "",
                password: "",
                repeatPassword: "",
                verificationCode: "",
                msgId:""
            };
            $scope.times = 0;

            $scope.userPhone = {
                isRight: true,
                msg: "必须填写"
            };

            $scope.password = {
                isRight: true,
                msg: "必须填写"
            };

            $scope.repeatPassword = {
                isRight: true,
                msg: "必须填写"
            };

            $scope.verificationCode = {
                isRight: true,
                msg: "必须填写"
            };

            $scope.sendVerificationCode = function () {
                if ($scope.times > 0) return;
                if ($scope.userInfo.userPhone === "") {
                    utilityService.alert("请输入手机号码");
                    return;
                }
                $scope.times = 60;
                $scope.openTimer();
                dataService.sendVerificationCode($scope.userInfo.userPhone).then(function (args) {
                    $scope.userInfo.msgId = args.data.msg_id;
                }, function (args) {

                });
            };

            
            $scope.hiddenScreen = function () {
                $scope.$emit("hiddenScreen", null);
            };

            $scope.resetPassword = function () {
                var checkResult = true;

                if ($scope.userInfo.userPhone === "") {
                    $scope.userPhone.isRight = false;
                    $scope.userPhone.msg = "必须填写";
                    checkResult = false;
                }
                else {
                    $scope.userPhone.isRight = true;
                }

                if ($scope.userInfo.verificationCode === "") {
                    $scope.verificationCode.isRight = false;
                    $scope.verificationCode.msg = "必须填写";
                    checkResult = false;
                }
                else {
                    $scope.verificationCode.isRight = true;
                }

                if ($scope.userInfo.password === "") {
                    $scope.password.isRight = false;
                    $scope.password.msg = "必须填写";
                    checkResult = false;
                }
                else {
                    $scope.password.isRight = true;
                }


                if ($scope.userInfo.repeatPassword === "") {
                    $scope.repeatPassword.isRight = false;
                    $scope.repeatPassword.msg = "必须填写";
                    checkResult = false;
                }
                else {
                    $scope.repeatPassword.isRight = true;
                }

                if (checkResult) {
                    dataService.validVerificationCode($scope.userInfo.msgId, $scope.userInfo.verificationCode)
                    .then(function (args) {
                        if (args.data.is_valid == "True") {
                            dataService.resetPassword($scope.userInfo).then(function (args) {
                                utilityService.alert("密码重置成功");
                                $state.go("tab.index");
                            }, function (args) {
                                utilityService.alert("密码重置成功（" + args + "）");
                            });
                        }
                        else {
                            utilityService.alert("验证码验证失败（" + args.data.error.message + "）");
                        }

                    },
                    function (args) {
                        utilityService.alert("验证码错误，请重新输入");
                    });
                    
                }
            };

            $scope.toLogin = function () {
                $state.go("login");
            };

            $scope.closeTimer = function () {
                if ($scope.timer) {
                    $interval.cancel($scope.timer);
                }
            };

            $scope.openTimer = function () {
                $scope.timer = $interval(function () {
                    if ($scope.times <= 0) return;
                    $scope.times--;
                }, 1000);
            };
        }]);
})();