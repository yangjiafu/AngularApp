(function() {
    angular.module("app")
        .controller("PersonCtrl", ["$scope", "$timeout", "dataService", "$state", "dataShareService",
            "$log", "$ionicModal", "regularService", "utilityService",
            function ($scope, $timeout, dataService, $state,  dataShareService, $log, $ionicModal, regularService,
                utilityService) {
                $scope.m = {};
                $scope.m.sd = {
                    personInfo: dataShareService.personInfo,
                    personJobWish : dataShareService.personJobWish
                };
                $scope.m.level = "1";
                $scope.groups = [];
                $scope.group = {};

                $scope.loadData = function () {
                    $scope.groups.push({ name: "基本信息", items: [] });
                    $scope.groups.push({ name: "求职意向", items: [] });
                    $scope.groups.push({ name: "设置", items: [] });
                    
                    //$log.debug("get person info, account is : " + dataService.userInfo.account);
                    //dataService.getPersonInfo({ account: dataService.userInfo.account }).then(function (args) {
                    //    dataShareService.personInfo = args;
                    //    $scope.m.sd.personInfo = dataShareService.personInfo;
                    //}, function (args) {
                    //    $scope.m.sd.personInfo = {};
                    //});

                    //dataService.getPersonJobWish({ personId: dataService.userInfo.personId }).then(function (args) {
                    //    dataShareService.personJobWish = args;
                    //    $scope.m.sd.personJobWish = dataShareService.personJobWish;
                    //}, function (args) {
                    //    $scope.m.sd.personJobWish = {};
                    //});

                    $scope.group = $scope.groups[0];
                };

                $scope.load基本信息 = function () {
                    for (var i = 0; i < $scope.groups.length; i++) {
                        if ($scope.groups[i].name == "基本信息") {
                            var tempGroup = $scope.groups[i];
                            tempGroup.items = [];
                            tempGroup.items.push({
                                key: "账号:",
                                value: dataShareService.personInfo.account,
                                groupName: tempGroup.name,
                                type: "content"
                            });
                            tempGroup.items.push({
                                key: "姓名:",
                                value: dataShareService.personInfo.name,
                                groupName: tempGroup.name,
                                type: "content"
                            });
                            tempGroup.items.push({
                                key: "性别:",
                                value: dataShareService.personInfo.sex,
                                groupName: tempGroup.name,
                                type: "content"
                            });
                            tempGroup.items.push({
                                key: "出生年月:",
                                value: dataShareService.personInfo.birthday,
                                groupName: tempGroup.name,
                                type: "content"
                            });
                            tempGroup.items.push({
                                key: "身份证号:",
                                value: dataShareService.personInfo.idCard,
                                groupName: tempGroup.name,
                                type: "content"
                            });
                            tempGroup.items.push({
                                key: "电话号码:",
                                value: dataShareService.personInfo.mobilePhone,
                                groupName: tempGroup.name,
                                type: "content"
                            });
                        }
                    }
                };

                $scope.load求职意向 = function () {
                    for (var i = 0; i < $scope.groups.length; i++) {

                        if ($scope.groups[i].name == "求职意向") {
                            var tempGroup = $scope.groups[i];
                            tempGroup.items = [];
                            tempGroup.items.push({
                                key: "特长:",
                                value: dataShareService.personJobWish.skill,
                                groupName: tempGroup.name,
                                type:"content"
                            });
                            tempGroup.items.push({
                                key: "自我评价:",
                                value: dataShareService.personJobWish.evaluation,
                                groupName: tempGroup.name,
                                type: "content"
                            });
                            tempGroup.items.push({
                                key: "求职意向:",
                                value: dataShareService.personJobWish.wish,
                                groupName: tempGroup.name,
                                type: "content"
                            });
                        }
                    }
                };

                $scope.load设置 = function () {
                    for (var i = 0; i < $scope.groups.length; i++) {
                        if ($scope.groups[i].name == "设置") {
                            var tempGroup = $scope.groups[i];
                            tempGroup.items = [];
                            tempGroup.items.push({
                                key: "修改密码",
                                value: "",
                                groupName: tempGroup.name,
                                type: "link",
                                iconClass: "ion-locked"
                            });
                            tempGroup.items.push({
                                key: "版本检查",
                                value: "",
                                groupName: tempGroup.name,
                                type: "link",
                                iconClass: "ion-ios-cloud-download-outline"
                            });
                            tempGroup.items.push({
                                key: "安全退出",
                                value: "",
                                groupName: tempGroup.name,
                                type: "link",
                                iconClass: "ion-log-out"
                            });
                        }
                    }
                };

                $scope.toggleGroup = function (group) {
                    $scope.group = group;
                    if (group.name == "基本信息")
                        $scope.load基本信息();
                    else if (group.name == "求职意向")
                        $scope.load求职意向();
                    else if (group.name == "设置")
                        $scope.load设置();
                };

                $scope.toSubList = function (groupName) {
                    if (groupName == "离线课程") {
                        $state.go("offlineCourses");
                        return;
                    }
                    else if (groupName == "学习记录") {
                        $state.go("learnRecord");
                        return;
                    }

                    for (var i = 0; i < $scope.groups.length; i++) {
                        if ($scope.groups[i].name == groupName) {
                            $scope.group = $scope.groups[i];
                        }
                    }

                    if ($scope.group.name == "基本信息")
                        $scope.load基本信息();
                    else if ($scope.group.name == "求职意向")
                        $scope.load求职意向();
                    else if ($scope.group.name == "设置")
                        $scope.load设置();

                    $scope.m.level = "2";
                };

                $scope.toParentLevel = function () {
                    $scope.m.level = "1";
                };

                $scope.isGroupShown = function (group) {
                    return group == $scope.group;
                };

                $scope.edit = function (item) {
                    $scope.m.curEditItem = item;
                    $scope.m.editItem = {
                        key: item.key,
                        value: item.value,
                        groupName: item.groupName
                    };
                    if (item.key == "姓名:" || item.key == "电话号码:" || item.key == "身份证号:" || item.key == "特长:" ||
                        item.key == "自我评价:" || item.key == "求职意向:") {
                        $ionicModal.fromTemplateUrl('editText.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            $scope.modal = modal;
                            $scope.modal.show();
                        });
                    }
                    else if (item.key == "性别:") {
                        if (!$scope.m.editItem.value) {
                            $scope.m.editItem.value = "男";
                        }
                        $ionicModal.fromTemplateUrl('editSex.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            $scope.modal = modal;
                            $scope.modal.show();
                        });
                    }
                    else if (item.key == "出生年月:") {
                        if (!$scope.m.editItem.value) {
                            $scope.m.editItem.value = new Date();
                        }
                        var timestamp = ($scope.m.editItem.value + "").match(/\d+/);
                        timestamp[0] /= 1000;
                        $scope.m.editItem.value = moment.unix(timestamp[0]).format("YYYY-MM-DD");

                        $ionicModal.fromTemplateUrl('editBirthday.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            $scope.modal = modal;
                            $scope.modal.show();
                        });
                    }
                    else if (item.key == "修改密码") {
                        $state.go("updatePassword");
                    }
                    else if (item.key === "版本检查") {
                        $state.go("version");
                    }
                    else if (item.key === "安全退出") {
                        utilityService.confirm("确定退出登录？", exitLogin);
                    }
                };

                var exitLogin = function () {
                    $log.debug("do exit login");
                    dataService.exitLogin().then(function (args) {
                        $log.debug("do exit login success");
                        $state.go("login");
                    }, function (args) {
                        $log.debug("do exit login fail");
                    });
                };

                $scope.saveEdit = function () {
                    if ($scope.m.editItem.key == "身份证号:") {
                        if (!regularService.isIdCard($scope.m.editItem.value)) {
                            utilityService.alert("不是有效的身份证号");
                            return;
                        }
                        else {
                            $scope.m.sd.personInfo.idCard = $scope.m.editItem.value;
                        }
                    }
                    else if ($scope.m.editItem.key == "电话号码:") {
                        if (!regularService.isMobilePhone($scope.m.editItem.value)) {
                            utilityService.alert("不是有效的电话号码");
                            return;
                        }
                        else {
                            $scope.m.sd.personInfo.mobilePhone = $scope.m.editItem.value;
                        }
                    }
                    else if ($scope.m.editItem.key == "出生年月:") {
                        var year = $scope.m.editItem.value.getFullYear();
                        var month = $scope.m.editItem.value.getMonth();
                        var date = $scope.m.editItem.value.getDate();
                        $scope.m.editItem.value = yer
                        $scope.m.sd.personInfo.birthday = year + "-" + month + "-" + date;
                    }
                    else if ($scope.m.editItem.key == "性别:") {
                        $scope.m.sd.personInfo.sex = $scope.m.editItem.value;
                    }
                    else if ($scope.m.editItem.key == "特长:") {
                        $scope.m.sd.personJobWish.skill = $scope.m.editItem.value;
                    }
                    else if ($scope.m.editItem.key == "自我评价:") {
                        $scope.m.sd.personJobWish.evaluation = $scope.m.editItem.value;
                    }
                    else if ($scope.m.editItem.key == "求职意向:") {
                        $scope.m.sd.personJobWish.wish = $scope.m.editItem.value;
                    }
                    $scope.m.curEditItem.value = $scope.m.editItem.value;
                    $scope.modal.hide();

                    if ($scope.m.editItem.groupName == "基本信息") {
                        $scope.savePersonInfo();
                    }
                    else if ($scope.m.editItem.groupName == "求职意向") {
                        $scope.savePersonJobWish();
                    }
                };

                $scope.cancleEdit = function () {
                    $scope.modal.hide();
                };


                
                $scope.savePersonInfo = function () {
                    dataService.savePersonInfo($scope.m.sd.personInfo).then(function (args) {
                        
                    }, function (args) {

                    });
                };

                $scope.savePersonJobWish = function () {
                    $scope.m.sd.personJobWish.personId = $scope.m.sd.personInfo.tbl_Person_ID;
                    console.log('在js中savePersonJobWish的值是：'+$scope.m.sd.personJobWish.personId);
                    dataService.savePersonJobWish($scope.m.sd.personJobWish).then(function (args) {
                        if (!$scope.m.sd.personJobWish.tbl_person_wish_id) {
                            dataService.getPersonJobWish({ personId: dataService.userInfo.personId }).then(function (args) {
                                dataShareService.personJobWish = args;
                                $scope.m.sd.personJobWish = dataShareService.personJobWish;
                            }, function (args) {
                                $scope.m.sd.personJobWish = {};
                            });
                        }
                    }, function (args) {

                    });
                };

                
                $scope.$on("$ionicView.enter", function (event, data) {
                    $log.debug("entry person");
                });

                $scope.loadData();

        }]);
})();
