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