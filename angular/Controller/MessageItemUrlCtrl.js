(function() {
    angular.module("app")
        .controller("MessageItemUrlCtrl", ["$scope", "$stateParams", "dataService", "dataShareService", "$log", "$state",
            function ($scope, $stateParams, dataService, dataShareService, $log, $state) {
                $scope.m = {
                    url: $stateParams.url
                };

                $scope.toMessageList = function () {
                    $state.go("messageList", { id: $stateParams.classifyId });
                };

                var setFrameSize = function () {
                    var fh = window.screen.height - 100;
                    angular.element("#myframe")[0].height = fh;
                };

                setFrameSize();
        }]);
})();
