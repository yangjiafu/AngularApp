(function () {
    angular.module("app")
    .service("offlineCoursesService", ["$cordovaFile", "$cordovaFileTransfer", "$cordovaImagePicker", "$q", "$log",
        "$window", "dataService", "myConfig", "encodeService",
        function ($cordovaFile, $cordovaFileTransfer, $cordovaImagePicker, $q, $log, $window, dataService, myConfig, encodeService) {
        var _rootPath = $window.cordova.file.dataDirectory;
        var _indexFile = "index.txt";
        var _resourceFile = "resource.txt";
        var _getCourseRoot = function () {
            return "courses";
        }

        var _getCoursePath = function (courseId, version) {
            return _getCourseRoot() + "/" + courseId + "." + version;
        }

        var _getCourseFullPath = function (courseId, version) {
            return _rootPath + _getCoursePath(courseId, version) + "/";
        }

        var _getCourseList = function () {
            var defer = $q.defer();
            $cordovaFile.checkDir(_rootPath, _getCourseRoot())
            .then(function (args) { }, function (args) {
                return $cordovaFile.createDir(_rootPath, _getCourseRoot());
            })
            .then(function (args) {
                return $cordovaFile.checkFile(_rootPath + _getCourseRoot() + "/", _indexFile);
            })
            .then(function (args) { }, function (args) {
                return $cordovaFile.createFile(_rootPath + _getCourseRoot() + "/", _indexFile, angular.toJson([]), true);
            })
            .then(function (args) {
                return $cordovaFile.readAsText(_rootPath + _getCourseRoot() + "/", _indexFile);
            })
            .then(function (args) {
                var obj = [];
                if (args != "") {
                    obj = angular.fromJson(args);
                }
                defer.resolve(obj);
            }, function (args) {
                defer.reject(args);
            });
            return defer.promise;
        };
        this.getCourseList = function () {
            return _getCourseList();
        };

        var _addCourse = function (courseId, version) {
            var defer = $q.defer();
            _getCourseList()
            .then(function (args) {
                var hasItem = false;
                for (var i = 0; i < args.length; i++) {
                    if (args[i].courseId == courseId && args[i].version == courseId) {
                        hasItem = true;
                        break;
                    }
                }
                if (hasItem == false) {
                    args.push({
                        courseId: courseId,
                        version: version
                    });
                }
                $log.debug(angular.toJson(args));
                return $cordovaFile.writeFile(_rootPath + _getCourseRoot() + "/", _indexFile, angular.toJson(args), true);
            })
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                defer.reject(args);
            });
            return defer.promise;
        };
        var _removeCourse = function (courseId, version) {
            var defer = $q.defer();
            _getCourseList()
            .then(function (args) {
                var hasItem = false;
                var index = 0;
                for (var i = 0; i < args.length; i++) {
                    if (args[i].courseId == courseId && args[i].version == courseId) {
                        hasItem = true;
                        index = i;
                        break;
                    }
                }
                if (hasItem == true) {
                    args.splice(index, 1);
                }
                $log.debug(angular.toJson(args));
                return $cordovaFile.writeFile(_rootPath + _getCourseRoot() + "/", _indexFile, angular.toJson(args), true);
            })
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                defer.reject(args);
            });
            return defer.promise;
        };

        this.removeCourseItem = function (courseId, version) {
            var defer = $q.defer();

            $cordovaFile.checkDir(_rootPath, _getCoursePath(courseId, version))
            .then(function (args) {
                return $cordovaFile.checkFile(_getCourseFullPath(courseId, version), _indexFile);
            })
            .then(function (args) {
                return $cordovaFile.removeFile(_getCourseFullPath(courseId, version), _indexFile);
            })
            .then(function (args) {
                return $cordovaFile.removeDir(_rootPath, _getCoursePath(courseId, version));
            })
            .then(function (args) {
                return _removeCourse(courseId, version);
            })
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                defer.reject(args);
            });
            return defer.promise;
        };

        this.addCourseItem = function (courseId, courseName, version, indexJson) {
            var defer = $q.defer();
            // 创建课程目录
            $cordovaFile.checkDir(_rootPath, _getCourseRoot())
            .then(function (args) { }, function (args) {
                return $cordovaFile.createDir(_rootPath, _getCourseRoot());
            })
            .then(function (args) {
                return $cordovaFile.checkDir(_rootPath, _getCoursePath(courseId, version));
            })
            .then(function (args) { }, function (args) {
                return $cordovaFile.createDir(_rootPath, _getCoursePath(courseId, version));
            })
            .then(function (args) {
                return $cordovaFile.writeFile(_getCourseFullPath(courseId, version), _indexFile, indexJson, true);
            })
            .then(function (args) {
                return _addCourse(courseId, version);
            })
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                defer.reject(args);
            });
            
            return defer.promise;
        };

        this.readCourseItem = function (courseId, version) {
            var defer = $q.defer();
            $cordovaFile.checkDir(_rootPath, _getCoursePath(courseId, version))
            .then(function (args) {
                return $cordovaFile.checkFile(_getCourseFullPath(courseId, version), _indexFile);
            })
            .then(function (args) {
                return $cordovaFile.readAsText(_getCourseFullPath(courseId, version), _indexFile);
            })
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                defer.reject(args);
            });
            return defer.promise;
        }

        var _writeResourceIndex = function (courseId, version, args) {
            var defer = $q.defer();
            // 创建课程目录
            //$cordovaFile.checkDir(_rootPath, _getCourseRoot())
            //.then(function (args) { }, function (args) {
            //    $log.debug("create courses path");
            //    return $cordovaFile.createDir(_rootPath, _getCourseRoot());
            //})
            //.then(function (args) {
            //    return $cordovaFile.checkDir(_rootPath, _getCoursePath(courseId, version));
            //})
            //.then(function (args) { }, function (args) {
            //    $log.debug("create courses item path");
            //    return $cordovaFile.createDir(_rootPath, _getCoursePath(courseId, version));
            //})
            //.then(function (args) {
            //    $log.debug("write resource file")
            //    return $cordovaFile.writeFile(_getCourseFullPath(courseId, version), _resourceFile, angular.toJson(args), true);
            //})
            $cordovaFile.writeFile(_getCourseFullPath(courseId, version), _resourceFile, angular.toJson(args), true)
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                defer.reject(args);
            });

            return defer.promise;
        };

        this.testReadResource = function (courseId, version) {
            return _removeCourse(courseId, version);
        };
        var _removeResource = function (courseId, version) {
            var defer = $q.defer();

            $cordovaFile.checkDir(_rootPath, _getCoursePath(courseId, version))
            .then(function (args) {
                $cordovaFile.checkFile(_getCourseFullPath(courseId, version), _indexFile);
            })
            .then(function (args) {
                $cordovaFile.readAsText(_getCourseFullPath(courseId, version), _indexFile);
            })
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                defer.reject(args);
            });
            return defer.promise;
        };

        this.downloadResource = function (courseId, version) {
            var resources = [];
            var defer = $q.defer();
            dataService.getCourseResource({ courseId: courseId })
            .then(function (args) {
                var promiseList = [];
                $log.debug("course resources is : " + args.length);
                for (var i = 0; i < args.length; i++) {
                    var url = myConfig.filesUrl + "/courses/" + args[i];
                    targetPath = _getCourseFullPath(courseId, version);
                    var trustHosts = true;
                    var options = {};
                    $log.debug("url is : " + url);
                    $log.debug("target path is " + targetPath);
                    promiseList.push($cordovaFileTransfer.download(url, targetPath, options, trustHosts));
                    //$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                    //.then(function (args) {
                    //    // Success!
                    //}, function (args) {
                    //    // Error
                    //}, function (progress) {
                    //    $timeout(function () {
                    //        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                    //    });
                    //});
                    
                }
                resources = args;
                return $q.all(promiseList);
                
            })
            .then(function (args) {
                $log.debug("resource content is : " + angular.toJson(resources));
                return _writeResourceIndex(courseId, version, resources);
            })
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                $log.debug("get course resource error");
                defer.reject(args);
            });

            return defer.promise;
        };

        this.saveImageBase64 = function (courseId, version, imgFile) {
            var base64File = imgFile + ".txt";

            var defer = $q.defer();
            $cordovaFile.readAsText(_getCourseFullPath(courseId, version), imgFile)
            .then(function (args) {
                var t = encodeService.base64decode(args);
                return $cordovaFile.writeFile(_getCourseFullPath(courseId, version), base64File, t, true);
            })
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                defer.reject(args);
            })
            return defer.promise;
        };

        this.readImageBase64 = function (courseId, version, imgFile) {
            var base64File = imgFile + ".txt";
            return $cordovaFile.readAsText(_getCourseFullPath(courseId, version), base64File)
        };

        this.testDownload = function (courseId, version) {
            var url = "http://www.kmztsoftware.com/CourseFiles/courses/党章课程一/20170515154441_mbbwwkoi.jpg";
            var targetPath = "file:///data/user/0/com.ionicframework.wyxx236962/files/courses/2.1/20170515154441_mbbwwkoi.jpg";
            var options = {};
            var trustHosts = true;
            return $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        };

        this.testDownloadFile = function (courseId, version) {
            var tempPath = "courses/2.1";
            var path = "file:///data/user/0/com.ionicframework.wyxx236962/files/courses/2.1/";
            var file = "20170515154441_mbbwwkoi.jpg";

            var defer = $q.defer();
            $log.debug("do check dir (" + _rootPath + ")");
            $cordovaFile.checkDir(_rootPath, tempPath)
            .then(function (args) {
                $log.debug("do check file ");
                return $cordovaFile.checkFile(path, file);
            })
            .then(function (args) {
                defer.resolve(args);
            }, function (args) {
                defer.reject(args);
            });
            return defer.promise;
        };

        this.testShowPic = function () {
            var defer = $q.defer();
            var options = {
                maximumImagesCount: 10,
                width: 800,
                height: 800,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
              .then(function (results) {
                  for (var i = 0; i < results.length; i++) {
                      console.log('Image URI: ' + results[i]);
                  }
                  defer.resolve(results);
              }, function (error) {
                  defer.reject(error);
              });

            return defer.promise;
        };
    }]);
})();