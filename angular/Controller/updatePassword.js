(function () {
    angular.module("app")
    .controller("updatePasswordCtrl", ["$scope", "dataService", "utilityService", function ($scope, dataService, utilityService) {
        $scope.m = {};

        $scope.m.newPassword = "";
        $scope.m.repeatPassword = "";
        $scope.updatePassword = function () {
            if ($scope.m.newPassword !== $scope.m.repeatPassword) {
                utilityService.alert("重复密码和密码不一致");
                return;
            }
            dataService.saveNewPassword($scope.m.newPassword).then(function (args) {
                utilityService.alert("密码已经修改");
            }, function (args) {
                utilityService.alert("密码修改失败");
            });
        };
    }])
})();