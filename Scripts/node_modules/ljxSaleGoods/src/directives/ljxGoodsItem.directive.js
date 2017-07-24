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