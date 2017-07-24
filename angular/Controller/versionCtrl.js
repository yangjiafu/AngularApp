(function () {
    angular.module("app")
    .controller("versionCtrl", ["$scope", "$http", "storeService", "myConfig", "$location",
        function ($scope, $http, storeService, myConfig, $location) {
        $scope.m = {
            aId: "a51a2ee445c04c5e3a41330c48c5f84c",
            uKey: "45ec6b22db5aca603893ef9974f6d41a",
            api_key: "608f636ec02fb3f1c66651ea8e07acf6",
            aKey:"",
            content: "",
            curVersion: myConfig.version,
            lastVersion: "",
            lastContent: ""
        };

        $scope.build = function () {
            var url = "http://www.pgyer.com/apiv1/app/builds";
            var data = {
                aId: $scope.m.aId,
                _api_key: $scope.m.api_key,
                page:1
            };

            $http.post(url, data).then(function (args) {
                $scope.m.content = args.data.data;
                $scope.m.aKey = args.data.data.list[0].appKey,
                $scope.m.lastVersion = args.data.data.list[0].appVersion;
                $scope.m.lastContent = "";
            }, function (args) {
                $scope.m.content = "获取版本信息失败，请稍后再试";
            });
        };

        $scope.update = function () {
            var url = "http://www.pgyer.com/apiv1/app/install?aId=" + $scope.m.aId + "&_api_key=" + $scope.m.api_key;
            window.open(url, '_system', 'location=no');
        };

        $scope.build();
    }]);
})();