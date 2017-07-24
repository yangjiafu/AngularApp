/*
    属性：
    buttonsCount         // button 的最大数量
    pageCount            // 分页数
    currentPage          // 当前页数


    事件触发器：
    currentPageChanged(currentPage)     向父作用域上报

    内部属性:
    _currentPage
    _pageCount  总页数
    _startPage  
    _endPage
    _buttons    按钮集合
    

    内部函数：
    __toFirst();
    __toLast();
    __toPriou();
    __toNext();
    __toPage(currentPage);
    _pageButtonClick(button);
    __getButton(key, value, isActive);
    _refreshButtons(currentPage);
*/
(function(){
    angular.module("ljxTools")
    .controller("ljxPageControlCtrl", ["$scope", function ($scope) {
        $scope._currentPage = 1;
        $scope._buttons = [];
        $scope._buttonStep = 0;
        $scope._pageCount = 1;
        $scope._startPage = 1;
        $scope._endPage = 1;

        $scope._getButton = function (key, value, isActive) {
            return {
                key: key,
                value: value,
                isActive: isActive
            };
        };

        $scope._refreshButtons = function (currentPage) {
            $scope._buttons = [];

            $scope._buttons.push($scope._getButton("first", "首页", false));
            $scope._buttons.push($scope._getButton("priou", "前" + $scope._buttonStep + "页", false));

            var tt = 0;
            if (currentPage < $scope._startPage) {
                if ($scope._startPage - 1 < $scope.buttonsCount) {
                    tt = $scope._startPage - 1;
                    $scope._startPage = $scope._startPage - tt;
                    $scope._endPage = $scope._endPage - tt;
                }
                else {
                    $scope._startPage = $scope._startPage - $scope.buttonsCount;
                    $scope._endPage = $scope._endPage - $scope.buttonsCount;
                }
            }
            else if (currentPage > $scope._endPage) {
                if ($scope._pageCount - $scope._endPage < $scope.buttonsCount) {
                    tt = $scope._pageCount - $scope._endPage;
                    $scope._startPage = $scope._startPage + tt;
                    $scope._endPage = $scope._endPage + tt;
                }
                else {
                    $scope._startPage = $scope._startPage + $scope.buttonsCount;
                    $scope._endPage = $scope._endPage + $scope.buttonsCount;
                }
            }
            else {
                $scope._endPage = Math.min($scope._endPage, $scope._pageCount);
            }

            for (var i = $scope._startPage; i <= $scope._endPage; i++) {
                $scope._buttons.push($scope._getButton(i, i, i == $scope._currentPage));
            }


            $scope._buttons.push($scope._getButton("next", "后" + $scope._buttonStep + "页", false));
            $scope._buttons.push($scope._getButton("last", "尾页", false));
        };

        $scope._pageButtonClick = function (buttonItem) {
            if (buttonItem.key == "first") {
                $scope._toFirst();
            }
            else if (buttonItem.key == "last") {
                $scope._toLast();
            }
            else if (buttonItem.key == "priou") {
                $scope._toPriou();
            }
            else if (buttonItem.key == "next") {
                $scope._toNext();
            }
            else {
                $scope._toPage(buttonItem.key);
            }
        };

        $scope._toFirst = function () {
            $scope._toPage(1);
        };
        $scope._toLast = function () {
            $scope._toPage($scope._pageCount);
        };
        $scope._toPriou = function () {
            $scope._toPage($scope._currentPage - $scope._buttonStep);
        };
        $scope._toNext = function () {
            $scope._toPage($scope._currentPage + $scope._buttonStep);
        };
        $scope._toPage = function (pageNumber) {
            if (pageNumber == $scope._currentPage) return;
            if (pageNumber < 1) {
                $scope._currentPage = 1;
            }
            else if (pageNumber > $scope._pageCount) {
                $scope._currentPage = $scope._pageCount;
            }
            else {
                $scope._currentPage = pageNumber;
            }
            $scope._refreshButtons($scope._currentPage);

            $scope.currentPage = $scope._currentPage;
            $scope.$emit('currentPageChanged', {
                currentPage: $scope._currentPage
            });
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxPageControl.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxPageControl.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxPageControl.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxPageControl.directive.pc.html');
                }
            }
            
            return url;
        };
    }]);
})();