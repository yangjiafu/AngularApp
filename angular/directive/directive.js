(function () {
    angular.module("app")
    .directive('scrollHeight', function ($window) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                element[0].style.height = ($window.innerHeight - 44 - 49 - 200) + 'px';
            }
        }
    })
    .directive('alyVideo', function ($window) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {

            }
        }
    });
})();