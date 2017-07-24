(function () {
    angular.module("app")
    .service("utilityService", ["$ionicPopup", function ($ionicPopup) {
        this.alert = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: '<strong>提示</strong>',
                template: '<div style="font-size:16px;" class="text-center">' + message + '</div>',
                buttons: [{
                    text: '确定',
                    type: 'alertButton',
                    onTap: function (e) {
                        // 返回的值会导致处理给定的值。
                        alertPopup.close();
                    }
                }]
            });
        };

        this.confirm = function (message, okFunction) {
            var tt = $ionicPopup.confirm({
                title: '<strong>提示</strong>',
                template: '<div style="text-align:center;">' + message + '</div>',
                okText: '确定',
                okType: 'confirmButton',
                cancelText: '取消',
                cancelType: 'confirmButton'
            });

            tt.then(function (args) {
                if (args) {
                    okFunction();
                };
            });
        };

        this.getDateDbString = function (date) {
            return moment(date).format("YYYY-MM-DD HH:mm:ss");
        };

    }]);
})();
