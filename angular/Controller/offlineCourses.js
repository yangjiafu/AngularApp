(function () {
    angular.module("app")
    .controller("offlineCoursesCtrl", ["$scope", "offlineCoursesService", "$cordovaInAppBrowser", "$log",
        function ($scope, offlineCoursesService, $cordovaInAppBrowser, $log) {
        $scope.m = {};
        $log.debug("init offine courses ctrl");

        $scope.write = function () {
            offlineCoursesService.addCourseItem(2, "testCourse", "1", "text content").then(function (args) {
                $log.debug("save success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("save error : " + args);
                $scope.m.info = args;
            });
        }
        
        $scope.read = function () {
            offlineCoursesService.readCourseItem(2, "1").then(function (args) {
                $log.debug("read success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("read error : " + args);
                $scope.m.info = args;
            });
        }

        $scope.remove = function () {
            offlineCoursesService.removeCourseItem(2, "1").then(function (args) {
                $log.debug("remove success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("remove error : " + args);
                $scope.m.info = args;
            });
        }

        $scope.getCourseList = function () {
            offlineCoursesService.getCourseList()
            .then(function (args) {
                $log.debug("get course list success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("get course list error : " + args);
                $scope.m.info = args;
            });
        }

        $scope.downloadResource = function () {
            offlineCoursesService.downloadResource(2, "1")
            .then(function (args) {
                $log.debug("download resource success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("download resource error : " + args);
                $scope.m.info = args;
            });
        }

        $scope.testReadResource = function () {
            offlineCoursesService.testReadResource(2, "1")
            .then(function (args) {
                $log.debug("read resource success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("read resource error : " + args);
                $scope.m.info = args;
            });
        };

        $scope.testDownload = function () {
            offlineCoursesService.testDownload(2, "1")
            .then(function (args) {
                $log.debug("read resource success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("read resource error : " + args);
                $scope.m.info = args;
            });
        };

        $scope.testDownloadFile = function () {
            offlineCoursesService.testDownloadFile(2, "1")
            .then(function (args) {
                $log.debug("read resource success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("read resource error : " + args);
                $scope.m.info = args;
            });
        }

        $scope.testSaveBase64 = function () {
            offlineCoursesService.saveImageBase64(2, "1", "20170515154441_mbbwwkoi.jpg")
            .then(function (args) {
                $log.debug("read resource success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("read resource error : " + args);
                $scope.m.info = args;
            });
        }

        $scope.testReadBase64 = function () {
            offlineCoursesService.readImageBase64(2, "1", "20170515154441_mbbwwkoi.jpg")
            .then(function (args) {
                $log.debug("read resource success : " + args);
                $scope.m.info = args;
            }, function (args) {
                $log.debug("read resource error : " + args);
                $scope.m.info = args;
            });
        }

        $scope.testShowPic = function () {
            offlineCoursesService.testShowPic()
            .then(function (args) {
                $log.debug("show pic success : " + args);
                $scope.m.info = args;
                $scope.m.img = args[0];
                //window.open(encodeURI(args[0]), '_system');
                window.open(args[0], '_system');
            }, function (args) {
                $log.debug("show pic error : " + args);
                $scope.m.info = args;
            });
        };



        //var options = {
        //    location: 'yes',
        //    clearcache: 'yes',
        //    toolbar: 'no'
        //};

        //document.addEventListener(function () {
        //    $cordovaInAppBrowser.open('http://ngcordova.com', '_blank', options)
        //      .then(function (event) {
        //          // success
        //      })
        //      .catch(function (event) {
        //          // error
        //      });


        //    $cordovaInAppBrowser.close();

        //}, false);

        //$rootScope.$on('$cordovaInAppBrowser:loadstart', function (e, event) {

        //});

        //$rootScope.$on('$cordovaInAppBrowser:loadstop', function (e, event) {
        //    // insert CSS via code / file
        //    $cordovaInAppBrowser.insertCSS({
        //        code: 'body {background-color:blue;}'
        //    });

        //    // insert Javascript via code / file
        //    $cordovaInAppBrowser.executeScript({
        //        file: 'script.js'
        //    });
        //});

        //$rootScope.$on('$cordovaInAppBrowser:loaderror', function (e, event) {

        //});

        //$rootScope.$on('$cordovaInAppBrowser:exit', function (e, event) {

        //});

    }]);
})();