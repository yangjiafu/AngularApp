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