(function () {
    angular.module("app")
    .controller("UserRegistCtrl", ["$scope", "$state", "dataService", "$location", "$interval",
        "templateConfig", "regularService", "utilityService",
        function ($scope, $state, dataService, $location, $interval, templateConfig, regularService, utilityService) {
            $scope.enableSendVerificationCode = true;
            $scope.times = 0;
            $scope.userInfo = {
                account: "",
                userName: "",
                userPhone: "",
                userEmail: "",
                password: "",
                repeatPassword: "",
                idCard:"",
                verificationCode: "",
                msgId:""
            };
            $scope.account = {
                isRight: true,
                msg: "必须填写"
            };

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

            $scope.accountList = [];

            $scope.sendVerificationCode = function () {
                if ($scope.times > 0) return;
                if ($scope.userInfo.userPhone == "") {
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



            $scope.loadData = function () {
                //$scope.hiddenScreen();
                dataService.getAllAccount().then(function (args) {
                    $scope.accountList = args;
                }, function (args) {

                });
            };

            $scope.hiddenScreen = function () {
                $scope.$emit("hiddenScreen", null);
            };

            $scope.regist = function () {
                $scope.closeTimer();
                var checkResult = true;
                var isWx = $location.absUrl().toLowerCase().indexOf("wxmain") > 0;
                if ($scope.userInfo.account === "") {
                    //$scope.account.isRight = false;
                    //$scope.account.msg = "必须填写";
                    //checkResult = false;
                    utilityService.alert("用户账号必须填写");
                    return;
                }
                else if ($scope._isRepectAccount($scope.userInfo.account)) {
                    //$scope.account.isRight = false;
                    //$scope.account.msg = "该名称已经被注册";
                    //checkResult = false;
                    alert("该名称已经被注册");
                    return;
                }
                else {
                    $scope.account.isRight = true;
                }

                if ($scope.userInfo.userPhone === "") {
                    //$scope.userPhone.isRight = false;
                    //$scope.userPhone.msg = "必须填写";
                    //checkResult = false;
                    alert("手机号码必须填写");
                    return;
                }
                else {
                    $scope.userPhone.isRight = true;
                }

                if ($scope.userInfo.verificationCode === "") {
                    //$scope.verificationCode.isRight = false;
                    //$scope.verificationCode.msg = "必须填写";
                    //checkResult = false;
                    utilityService.alert("验证码必须填写");
                    return;
                }
                else {
                    $scope.verificationCode.isRight = true;
                }

                if ($scope.userInfo.password === "") {
                    //$scope.password.isRight = false;
                    //$scope.password.msg = "必须填写";
                    //checkResult = false;
                    alert("密码必须填写");
                    return;
                }
                else {
                    $scope.password.isRight = true;
                }


                if ($scope.userInfo.repeatPassword === "") {
                    //$scope.repeatPassword.isRight = false;
                    //$scope.repeatPassword.msg = "必须填写";
                    //checkResult = false;
                    alert("验证密码必须填写");
                    return;
                }
                else {
                    $scope.repeatPassword.isRight = true;
                }

                if (templateConfig.userRegist.templateName == "userRegist_private") {
                    if ($scope.userInfo.userName === "") {
                        utilityService.alert("姓名必须填写");
                        return;
                    }

                    if ($scope.userInfo.idCard === "") {
                        utilityService.alert("身份证号必须填写");
                        return;
                    }
                    else if (!regularService.isIdCard($scope.userInfo.idCard)) {
                        utilityService.alert("不是有效的身份证号码");
                        return;
                    }
                }


                if (checkResult) {
                    dataService.validVerificationCode($scope.userInfo.msgId, $scope.userInfo.verificationCode)
                    .then(function (args) {
                        args.data = eval(args.data);
                        if (args.data.is_valid == "True") {
                            dataService.regist($scope.userInfo).then(function (args) {
                                utilityService.alert("用户注册成功");
                                $state.go("tab.index");
                            }, function (args) {
                                utilityService.alert("用户注册失败（" + args + "）");
                            });
                        }
                        else {
                            utilityService.alert("验证码验证失败（" + args.data.error.message + "）")
                        }
                        
                    },
                    function (args) {
                        utilityService.alert("验证码错误，请重新输入");
                    });
                    
                }
            };

            $scope.toLogin = function () {
                $state.go("login");
            }

            $scope._isRepectAccount = function (account) {
                for (var i = 0; i < $scope.accountList.length; i++) {
                    if (account == $scope.accountList[i])
                        return true;
                }
                return false;
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