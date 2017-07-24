/*
    属性：
    items         数据集合
    displayMode   显示模式（分页显示|滚动加载|显示全部）
    pageStep      步长
    queryAllData  查询所有的数据的 promise
    queryPageData 查询页面数据的 promise
*/
(function () {
    angular.module("ljxTools")
    .controller("ljxListBoxCtrl", ["$scope", "$q", "$timeout", function ($scope, $q, $timeout) {
        $scope._items = [];           // 显示的数据
        $scope._pageCount = 0;        // 页码数
        $scope._currentPage = 1;      // 当前页

        $scope.init = function () {
            if ($scope.displayMode === "显示全部") {
                $scope._initAllData();
            }
            else {
                $scope._initPageData();
            }
        };

        $scope._initAllData = function () {
            $scope._items = $scope.items;
        };

        $scope._initPageData = function () {
            $scope._pageCount = parseInt($scope.count / $scope.pageStep);
            if ($scope.count % $scope.pageStep > 0) {
                $scope._pageCount++;
            }
            $scope._currentPage = 1;
            $scope._toPage($scope._currentPage);
        };

        $scope.scrollPage = function () {
            if ($scope._currentPage < $scope._pageCount)
                $scope._toPage($scope._currentPage + 1);
        };

        $scope._toPage = function (pageNumber) {
            if (!$scope.items) return;
            var startIndex = parseInt((pageNumber - 1) * $scope.pageStep);
            var limit = parseInt(pageNumber * $scope.pageStep > $scope.count ? $scope.count - (pageNumber - 1) * $scope.pageStep : $scope.pageStep);
            var tempLength = startIndex + limit;
            $scope._tmpStart = startIndex;
            $scope._tmpLimit = limit;
            if ($scope.items.length < tempLength) {
                $scope._loadData({ start: startIndex, limit: limit })
                .then(function (args) {
                    for (var i = 0; i < args.length; i++) {
                        $scope.items.push(args[i]);
                    }
                    $scope._showPage($scope._tmpStart, $scope._tmpLimit);
                }, function (args) {

                });
            }
            else {
                $scope._showPage($scope._tmpStart, $scope._tmpLimit);
            }
        };

        $scope._showPage = function (start, limit) {
            $scope._items = [];
            for (var i = 0; i < limit; i++) {
                $scope._items.push($scope.items[start + i]);
            }
        };

        $scope._loadData = function (data) {
            var deferred = $q.defer();
            if (!$scope.queryAllData) {
                $scope.queryAllData(data).then(function (args) {
                    deferred.resolve(args);
                }, function (args) {
                    deferred.reject(args);
                });
            }
            else if (!$scope.queryPageData) {
                $scope.queryPageData(data).then(function (args) {
                    deferred.resolve(args);
                }, function (args) {
                    deferred.reject(args);
                });
            }

            $timeout(function () {
                $timeout.cancel();
                deferred.reject("没有设置加载函数");
            }, 100);
            return deferred.promise;
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform) {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxListBox.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxListBox.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxListBox.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxListBox.directive.pc.html');
                }
            }
            

            return url;
        };
    }]);
})();