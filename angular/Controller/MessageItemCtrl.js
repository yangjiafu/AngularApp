(function() {
    angular.module("app")
        .controller("MessageItemCtrl", ["$scope", "$stateParams", "dataService", "dataShareService", "$log", "$state",
            function ($scope, $stateParams, dataService, dataShareService, $log, $state) {
                $scope.messageItem = null;
                $scope.id = $stateParams.id;
                $scope.modal = {
                    shareData: dataShareService,
                    id: $stateParams.id
                };

                var formatMessage = function (input) {
                    if (input instanceof Array) {
                        var list = [];
                        for (var i = 0; i < input.length; i++) {
                            var item = {};
                            if ((typeof input[i]) == "string") {
                                var tempArray = input[i].split(":");
                                if (tempArray.length == 1)
                                    tempArray = input[i].split("：");
                                if (tempArray.length >= 2) {
                                    item.key = tempArray[0];

                                    var tempString = "";
                                    for (var j = 1; j < tempArray.length; j++) {
                                        tempString += tempArray[j];
                                    }
                                    item.value = tempString;
                                    item.isKeyValue = true;
                                }
                                else {
                                    item.value = input[i];
                                    item.key = "";
                                    item.isKeyValue = false;
                                }
                                list.push(item);
                            }
                            else {
                                list.push(input[i]);
                            }
                            
                        }
                        return list;
                    }
                    return input;
                };

                $scope.loadData = function () {
                    for (var i = 0; i < $scope.modal.shareData.messageList.length; i++) {
                        if ($scope.modal.shareData.messageList[i].msgId && $scope.modal.shareData.messageList[i].msgId == $scope.id) {
                            $scope.messageItem = $scope.modal.shareData.messageList[i];
                            break;
                        }

                        if ($scope.modal.shareData.messageList[i].msgList) {
                            for (var j = 0; j < $scope.modal.shareData.messageList[i].msgList.length; j++) {
                                if ($scope.modal.shareData.messageList[i].msgList[j].msgId &&
                                    $scope.modal.shareData.messageList[i].msgList[j].msgId == $scope.id) {
                                    $scope.messageItem = $scope.modal.shareData.messageList[i].msgList[j];
                                    $scope.messageItem.sendTime = $scope.modal.shareData.messageList[i].sendTime;
                                    break;
                                }
                            }
                        }

                        if ($scope.messageItem && $scope.messageItem.contents)
                            $scope.messageItem.contents = formatMessage($scope.messageItem.contents);
                    }
                };

                $scope.toMessageList = function () {
                    $state.go("tab.messageList", { id: $scope.messageItem.msgClassifyId });
                };

                $scope.loadData();
        }]);
})();
