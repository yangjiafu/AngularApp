(function() {
    'use strict';
    angular.module('ljxTools', []);
})();

/*
    属性：
    maxItems:          最大显示数量
    classifyId:          类型
    classifyName:
    displayType:       显示样式（CellBox|RowBox)
    items:     
    contentHref        内容回调接口

    方法：

*/
(function() {
    'use strict';
    angular.module('ljxTools')
    .controller("ljxGoodsBoxCtrl", ["$scope", function ($scope) {
        $scope.maxItems = 6;
        $scope.classifyId = "";
        $scope.classifyName = "热门课程";
        $scope.displayType = "CellBox";
        $scope.items = [];

        $scope.loadData = function (items) {
            $scope.items = items;
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxGoodsBox.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxGoodsBox.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxGoodsBox.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxGoodsBox.directive.pc.html');
                }
            }
            
            return url;
        };
    }]);
})();
/*
    属性：
    img : 图片URL
    title: 标题
    starRating:   星级
    status:       状态
    commentNumber:    评论数
    infos:    信息数组
    displayType:    显示类型（BoxItem|RowItem)
    href:     单击时候的链接Url (href 属性和 clicked 事件互斥， href 为空时候，才广播 clicked 事件)

    事件触发器：
    clicked()       向父作用域发送消息   agrs:{item:item}

    函数：
    

    内部属性：
    

    内部函数：
    
*/
(function() {
    'use strict';
    angular.module('ljxTools')
    .controller("ljxGoodsItemCtrl", ["$scope", "$rootScope", "$location", function ($scope, $rootScope, $location) {
        $scope.componentName = "ljxGoodsItem";
        $scope.img = "";
        $scope.title = "title";
        $scope.starRating = 3;
        $scope.commentNumber = 0;
        $scope.status = "status";
        $scope.infos = [];
        //$scope.displayType = "BoxItem";
        $scope.href = "";
        $scope.bootstrapSize = $rootScope.bootstrapSize;

        $scope.loadData = function (item) {
            if (!item) return;
            item.componentName = $scope.componentName;
            $scope.img = item.img;
            $scope.title = item.title;
            $scope.starRating = item.starRating;
            $scope.commentNumber = item.commentNumber;
            $scope.status = item.status;
            $scope.infos = item.infos;
            $scope.displayType = item.displayType;
            $scope.href = item.href;
        };

        $scope._onClicked = function (item) {
            if (!$scope.href && $scope.href !== "") {
                $scope.$emit('clicked', {
                    item: item
                });
            }
            else {
                $location.path($scope.href);
            }
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxGoodsItem.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxGoodsItem.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxGoodsItem.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxGoodsItem.directive.pc.html');
                }
            }
            return url;
        };

        $scope.$on("onresize", function (event, data) {
            $scope.bootstrapSize = data.bootstrapSize;
        });
    }]);
})();
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
/*

*/
(function () {
    'use strict';
    angular.module('ljxTools')
    .controller("ljxMobileTreeCtrl", ["$scope", function ($scope) {
        $scope.componentName = "ljxMobileTree";
        $scope.nodes = [];
        $scope.list = [];
        $scope.nodeStack = [];

        $scope.$on("goBack", function (event, data) {
            if (data.componentName == $scope.componentName) {
                $scope.toParent();
            }
        });
        $scope.loadData = function () {
            $scope.list = $scope.nodes;
        };

        $scope.toParent = function () {
            $scope.nodeStack.pop();
            if ($scope.nodeStack.length <= 0) {
                $scope.list = $scope.nodes;
            }
            else {
                var node = $scope.nodeStack[$scope.nodeStack.length - 1];
                $scope.list = node.nodes;
            }
            
        };

        $scope.toChild = function (node) {
            //$scope.$eval($scope.clickCallback(node));
            $scope.onClick(node);
            if (node.type && node.type == "课程") return;
            $scope.nodeStack.push(node);
            $scope.list = node.nodes;
        };

        $scope.onClick = function (node) {
            $scope.$emit("click", { componentName: $scope.componentName, data: node });
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxMobileTree.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxMobileTree.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxMobileTree.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxMobileTree.directive.pc.html');
                }
            }
            return url;
        };
    }]);
})();
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

            if ($scope.isShowScollButton == "true") {
                $scope._buttons.push($scope._getButton("first", "首页", false));
                $scope._buttons.push($scope._getButton("priou", "前" + $scope._buttonStep + "页", false));
            }
            

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

            if ($scope.isShowScollButton == "true") {
                $scope._buttons.push($scope._getButton("next", "后" + $scope._buttonStep + "页", false));
                $scope._buttons.push($scope._getButton("last", "尾页", false));
            }
            
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
/*
    属性：
    maxValue : 最大值
    starNumber:     星星数量
*/
(function() {
    'use strict';
    angular.module('ljxTools')
    .controller("ljxStarToolCtrl", ["$scope", function ($scope) {
        $scope.componentName = "ljxStarTool";
        this.scope = $scope;

        //$scope.enableEdit = false;
        //$scope.maxValue = 5;
        //$scope.starNumber = 0;
        $scope._stars = [];

        $scope.itemClick = function (value) {
            if ($scope.enableEdit ==="true") {
                $scope.starNumber = value + 1;
                $scope.refresh();
                $scope.onValueChanged();
            }
        };

        $scope.refresh = function () {
            $scope._stars = [];
            for (var i = 0; i < $scope.maxValue; i++) {
                var starItem = {
                    color: i < $scope.starNumber ? "#ff8a00" : "gainsboro"
                };
                $scope._stars.push(starItem);
            }
        };

        $scope.onValueChanged = function () {
            $scope.$emit("valueChanged", { componentName: $scope.componentName, value: $scope.starNumber });
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxStarTool.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxStarTool.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxStarTool.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxStarTool.directive.pc.html');
                }
            }

            return url;
        };


    }]);
})();
/*
    属性：
    pageStep : 每页的步长，单项绑定
    isAllData: 是否是所有数据
    isShowTitle:   是否显示表名

    事件监听器：
    dataChanged()           agrs{data:data, pageCount:pageCount}
    currentPageChanged()    agrs{currentPage: currentPage}

    事件触发器：
    rowClicked()    向父作用域发送消息   agrs:{item:item}
    cellClicked()    向父作用域发送消息   agrs:{item: item, field: field, value: value}
    startIndexChanged()      向父作用域发送消息    agrs{startIndex:startIndex, length:length}
    pageCountChanged()       向子作用域发送消息    agrs{pageCount: pageCount}

    内部属性：
    _isShowPage          是否显示分页控件
    _pageCount           
    _startIndex
    _pageData
    _allData

    内部函数：
    _cloneDataStruct(data)
    _getTemplateUrl()
    _initColumnClass()
    _onRowClicked(item)
    _onCellClicked(item, field, value)
*/
(function () {
    angular.module("ljxTools")
    .controller("ljxTableCtrl", ["$scope", function ($scope) {
        $scope._isShowPage = false;
        $scope._isShowDetail = false;
        $scope._pageCount = 0;
        $scope._startIndex = 0;
        $scope._pageData = [];
        $scope._allData = [];
        $scope._rowInfo = [];

        $scope._getIsShowTitle = function () {
            return $scope.isShowTitle == "true";
        };
        // 初始化列样式（目的为了同时支持在 手机 平板 电脑上显示）
        $scope._initColumnClass = function () {
            var phoneCSS = "col-lg-1 col-md-2 col-sm-2 col-xs-3";
            var padCSS = "col-lg-1 col-md-2 col-sm-2 hidden-xs";
            var computerCSS = "col-lg-1 hidden-md hidden-sm hidden-xs";

            var fields = [];
            for (var i = 0; i < $scope._pageData.fields.length; i++) {
                if ($scope._pageData.fields[i].isShowInCol === true || $scope._pageData.fields[i].isShowInCol === "true") {
                    fields.push($scope._pageData.fields[i]);
                }
            }
            for (i = 0; i < fields.length; i++) {
                if (i < 3) {
                    // 手机样式，只显示3列
                    fields[i].css = phoneCSS;
                }
                else if (i < 5) {
                    // 平板样式，只显示5列
                    fields[i].css = padCSS;
                }
                else {
                    // 电脑样式，显示所有
                    fields[i].css = computerCSS;
                }
            }
        };

        $scope._cloneDataStruct = function (data) {
            var result = {
                tableName: data.tableName,
                rootLink: data.rootLink,
                fields: [],
                items: []
            };

            for (var i = 0; i < data.fields.length; i++) {
                result.fields.push(data.fields[i]);
            }
            return result;
        };

        //  刷新明细数据
        $scope._refreshRowInfo = function (row) {
            $scope._rowInfo = [];
            for (var p in row) {
                if (p != "$$hashKey") {
                    var item = {};
                    item.key = p;
                    item.align = $scope._getFieldAlign(p);
                    item.isShow = $scope._isShowInDetail(p);
                    item.value = row[p];
                    $scope._rowInfo.push(item);
                }
            }
        };

        $scope._isShowInDetail = function (name) {
            for (var i = 0; i < $scope._pageData.fields.length; i++) {
                if ($scope._pageData.fields[i].name == name) {
                    return $scope._pageData.fields[i].isShowInDetial;
                }
            }
            return true;
        };

        $scope._getFieldAlign = function (name) {
            for (var i = 0; i < $scope._pageData.fields.length; i++) {
                if ($scope._pageData.fields[i].name == name) {
                    return $scope._pageData.fields[i].align;
                }
            }
            return "";
        };

        $scope._showTable = function () {
            $scope._isShowDetail = false;
        };

        $scope._onRowClicked = function (item) {
            $scope.$emit('rowClicked', {
                item: item
            });

            if ($scope.enableShowDetail == "true") {
                $scope._isShowDetail = true;
                $scope._refreshRowInfo(item);
            }
        };

        $scope._onCellClicked = function (item, field, value) {
            $scope.$emit('cellClicked', {
                item: item,
                field: field,
                value: value
            });
        };

        // 获取模板Url
        $scope._getTemplateUrl = function () {
            var url = "";

            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxTable.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxTable.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxTable.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxTable.directive.pc.html');
                }
            }
            return url;
        };

        //  事件监听器，监听 dataChange 事件
        $scope.$on('dataChanged', function (event, args) {
            // pageCountChanged 事件触发器
            if ($scope._pageCount != args.pageCount) {
                $scope.$broadcast('pageCountChanged', {
                    pageCount: args.pageCount
                });
            }

            $scope._isShowPage = args.pageCount != "1";

            if ($scope.isAllData == "true") {
                $scope._allData = args.data;
                $scope._pageCount = args.pageCount;
                if ($scope._pageCount == 1) {
                    $scope._pageData = $scope._allData;
                }
                else {
                    $scope._pageData = $scope._cloneDataStruct($scope._allData);
                    for (var i = 0; i < $scope.pageStep; i++) {
                        $scope._pageData.items.push($scope._allData.items[i]);
                    }
                }
            }
            else {
                $scope._pageData = args.data;
                $scope._pageCount = args.pageCount;
            }

            $scope._initColumnClass();
        });

        $scope.$on('currentPageChanged', function (event, args) {
            event.stopPropagation();
            $scope._startIndex = (parseInt(args.currentPage) - 1) * $scope.pageStep;
            if ($scope.isAllData == "true") {
                var endIndex = parseInt(args.currentPage) * $scope.pageStep - 1;
                endIndex = Math.min(endIndex, $scope._allData.items.length - 1);

                $scope._pageData = $scope._cloneDataStruct($scope._allData);
                for (var i = $scope._startIndex; i <= endIndex; i++) {
                    $scope._pageData.items.push($scope._allData.items[i]);
                }
            }
            else {
                // startIndexChanged 事件触发器
                $scope.$emit('startIndexChanged', {
                    startIndex: $scope._startIndex,
                    length: $scope.pageStep
                });
            }
        });
    }])
    .filter("rowDetialFilter", function () {
        return function (input) {
            var result = [];
            if (input) {
                for (var i = 0; i < input.length; i++) {
                    if (input[i].isShow === true || input[i].isShow === "true") {
                        result.push(input[i]);
                    }
                }
            }
            return result;
        };
    })
    .filter("colFilter", function () {
        return function (input) {
            var result = [];
            if (input) {
                for (var i = 0; i < input.length; i++) {
                    if (input[i].isShowInCol === true || input[i].isShowInCol === "true") {
                        result.push(input[i]);
                    }
                }
            }
            return result;
        };
    });
})();
(function() {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxGoodsBox', function () {
        return {
            scope: {
                maxItems: "@",
                classifyId: "@",
                classifyName: "@",
                displayType: "@",
                platform:"@"
            },
            require: ['ngModel'],
            controller: "ljxGoodsBoxCtrl",
            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
            replace:true,
            link: function (scope, element, attrs, ctrls) {
                var ngModel = ctrls[0];
                ngModel.$render = function () {
                    if (ngModel.$modelValue instanceof Array) {
                        scope.items = ngModel.$modelValue;
                    }
                    else {
                        scope.items = [];
                        scope.items.push(ngModel.$modelValue);
                    }

                };

                scope.$watch("displayType", function (newValue, oldValue, scope) {
                    var itemDisplayType = "";
                    if (newValue == "CellBox") {
                        itemDisplayType = "BoxItem";
                    }
                    else if (newValue == "RowBox") {
                        itemDisplayType = "RowItem";
                    }
                    if (itemDisplayType === "") return;
                    for (var i = 0; i < scope.items.length; i++) {
                        if (scope.items[i]) {
                            scope.items[i].displayType = itemDisplayType;
                        }
                    }
                });

                scope.$watch("items", function (newValue, oldValue, scope) {
                    var itemDisplayType = "";
                    if (scope.displayType == "CellBox") {
                        itemDisplayType = "BoxItem";
                    }
                    else if (scope.displayType == "RowBox") {
                        itemDisplayType = "RowItem";
                    }
                    if (itemDisplayType === "") return;
                    for (var i = 0; i < scope.items.length; i++) {
                        if (scope.items[i]) {
                            scope.items[i].displayType = itemDisplayType;
                        }
                    }
                });
            }
        };
    });
})();
(function() {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxGoodsItem', function () {
        return {
            scope: true,
            controller: 'ljxGoodsItemCtrl',
            replace: true,
            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>'
            //link: function (scope, element, attrs, ctrls) {
            //    scope.$on("onresize", function (event,data) {
            //        scope.bootstrapSize = data.bootstrapSize;
            //    });
            //}
        };
    });
})();
(function () {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxListBox', function () {
        return {
            scope: {
                count: "@",
                items: "=",
                displayMode: "@",
                pageStep: "@",
                itemTemplate: "@",
                queryAllData: "&",
                queryPageData: "&",
                platform:"@"
            },
            controller: "ljxListBoxCtrl",
            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
            replace:true,
            link: function (scope, element, attrs, ctrls) {
                if (!attrs.items)
                    scope.items = [];

                if (!attrs.displayMode)
                    scope.displayMode = "显示全部";

                if (!attrs.pageStep)
                    scope.pageStep = 10;

                scope.$watch("items", function (newValue, oldValue) {
                    scope.init();
                });

                scope.$watch("displayMode", function (newValue, oldValue) {
                    scope.init();
                });

                scope.$watch("pageStep", function (newValue, oldValue) {
                    scope.init();
                });

                scope.$on("currentPageChanged", function (event, args) {
                    scope._toPage(args.currentPage);
                });

                //angular.element("ljx-list-box").bind("scroll", function () {
                //    var pageYOffset = $window.pageYOffset;
                //    var clientHeight = $document[0].documentElement.clientHeight;
                //    var offsetHeight = $document[0].body.offsetHeight;
                //    //当滚动到90%的时候去加载
                //    if (pageYOffset + clientHeight > offsetHeight * 0.9) {

                //        //scope.shopWorkCanLoad是否可加载,controller中定义
                //        //scope.shopWorkOnLoad是否正在加载,controller中定义
                //        if (scope.shopWorkCanLoad === true && scope.shopWorkOnLoad === false) {
                //            //加载数据,controller中定义
                //            scope.scrollPage();//
                //        }
                //    }
                //});
            }
        };
    });
})();
(function () {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxMobileTree', function () {
        return {
            scope: {
                itemTemplate: "@",
                clickCallback: "&",
                platform:"@"
            },
            require: ['ngModel'],
            controller: "ljxMobileTreeCtrl",
            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
            replace: true,
            link: function (scope, element, attrs, ctrls) {
                var ngModel = ctrls[0];
                ngModel.$render = function () {
                    if (ngModel.$modelValue instanceof Array) {
                        scope.nodes = ngModel.$modelValue;
                        scope.list = scope.nodes;
                        
                    }
                    else {
                        scope.nodes = [];
                        scope.nodes.push(ngModel.$modelValue);
                        scope.list = scope.nodes;
                    }

                };

                
                //scope.$watch("nodes", function (newValue, oldValue) {
                //    scope.loadData();
                //});
            }
        };
    });
})();
(function () {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxPageControl', function () {
        return {
            scope: {
                buttonsCount: "@",
                pageCount: "=",
                currentPage: "=",
                isShowScollButton:"=",
                platform:"@"
            },
            controller: "ljxPageControlCtrl",

            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
            replace: true,
            link: function (scope, element, attr, ctrls) {
                scope.$watch("pageCount", function (newValue, oldValue) {
                    scope._pageCount = newValue;
                    scope._buttonStep = scope.buttonsCount - 1;
                    scope._endPage = Math.min(scope._buttonStep, parseInt(newValue));
                    scope._refreshButtons(1);
                });
            }
        };
    });
})();
(function() {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxStarTool', [
        function () {
            return {
                scope: {
                    maxValue: '@',
                    starNumber: '=',
                    enableEdit: '@',
                    platform:'@'
                },
                //require: ['ngModel'],
                controller: 'ljxStarToolCtrl',
                template: '<div ng-include="_getTemplateUrl()"></div>',
                replace: true,
                link: function (scope, element, attr, ctrls) {
                    //var ngModel = ctrls[0];
                    //ngModel.$render = function () {
                    //    scope.starNumber = ngModel.$modelValue;
                    //};
                    if (!attr.maxValue)
                        scope.maxValue = 5;

                    if (!attr.starNumber)
                        scope.starNumber = 0;

                    if (!attr.enableEdit)
                        scope.enableEdit = false;

                    scope.$watch('maxValue', function (newValue, oldValue) {
                        scope.refresh();
                    });

                    scope.$watch('starNumber', function (newValue, oldValue) {
                        scope.refresh();
                    });
                }
            };
        }
    ]);
})();

(function () {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxTable', function () {
        return {
            scope: {
                pageStep: "@",
                isAllData: "@",
                enableShowDetail: "@",
                isShowTitle: "@",
                platform:"@"
            },
            controller: "ljxTableCtrl",
            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
            replace:true,
            link: function (scope, element, attrs, ctrls) {

            }
        };
    });
})();