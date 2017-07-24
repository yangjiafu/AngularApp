(function () {
    angular.module("app")
    .controller("learnRecordCtrl", ["$scope", "dataService", "myConfig", "$state", "$log",
        function ($scope, dataService, myConfig, $state, $log) {
        $scope.m = {
            learnInfoCount: 0,
            learnInfoList: []
        };

        $scope.doRefresh = function () {
            $http.get('/new-items')
             .success(function (newItems) {
                 $scope.items = newItems;
             })
             .finally(function () {
                 // 停止广播ion-refresher
                 $scope.$broadcast('scroll.refreshComplete');
             });
        };

        var learnInfoPageNumber = -1;
        $scope.m.refreshLearnInfo = function () {
            learnInfoPageNumber++;
            $log.debug("refresh learn info, page is : " + learnInfoPageNumber);
            dataService.getLearnRecord({
                personId: dataService.userInfo.personId,
                start: learnInfoPageNumber * 10,
                limit: 10
            }).then(function (args) {
                $scope.m.learnInfoCount = args.count;
                //angular.extend(args.list, $scope.courseInfo.discusses);
                $log.debug("refresh learn info, result number is : " + args.list.length);
                if (args.list.length > 0) {
                    for (var i = 0; i < args.list.length; i++) {
                        args.list[i].img = myConfig.filesUrl + "/courses/" + args.list[i].courseName + ".jpg";
                        $scope.m.learnInfoList.push(args.list[i]);
                    }
                }
                else {
                    m_enableRefreshLearnInfo = false;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (args) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        var m_enableRefreshLearnInfo = true;
        $scope.enableRefreshLearnInfo = function () {
            return m_enableRefreshLearnInfo;
        }

        $scope.goBack = function () {
            $state.go("tab.person");
        };

        $scope.m.refreshLearnInfo();
    }]);
})();