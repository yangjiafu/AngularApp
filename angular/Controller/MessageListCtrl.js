(function() {
    angular.module("app")
        .controller("MessageListCtrl", ["$scope", "dataService", "dataShareService", "$log", "$stateParams", "$state", "$location",
            function ($scope, dataService, dataShareService, $log, $stateParams, $state, $location) {
                $scope.modal = {
                    shareData: dataShareService
                };

                $scope.loadData = function () {
                    dataService.getMessageList({
                        userId: dataService.userInfo.personId,
                        classifyId: $stateParams.id,
                        isRead: ""
                    }).then(function (args) {
                        dataShareService.messageList = args;
                    }, function (args) { });
                };

                $scope.toMessageClassify = function () {
                    $state.go("tab.messageClassify");
                };

                $scope.toMessageItem = function (item) {
                    if (item.url != "") {
                        //$location.url(item.url);
                        //window.open(encodeURI(item.url), '_self');

                        $state.go("tab.messageItemUrl", { classifyId: item.msgClassifyId, url: encodeURI(item.url) });
                    }
                    else {
                        $state.go("tab.messageItem", { id: item.msgId });
                    }
                };

                $scope.loadData();
        }]);
})();
