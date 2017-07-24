(function() {
    angular.module("app")
    .service("dataService", ["$http", "$q", "$cacheFactory", "$window", "myConfig", "storeService", "$log",
        function ($http, $q, $cacheFactory, $window, myConfig, storeService, $log) {
            this.tag = "数据服务";

            // 用户信息
            this.userInfo = {
                personId: "",
                account: "",
                userName: "",
                token: ""
            };
            
            this.userInfo = {
                personId: "1",
                account: "ljx",
                userName: "",
                token: "7c3ba5ae-ce41-4ff9-8e6b-f9c8a7f5c6bf"
            };
            

            $window.customCache = $cacheFactory('cache1');
            $window.userInfo = this.userInfo;
            // 登录
            this.login = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/login";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            $window.userInfo.personId = obj.data.personId;
                            $window.userInfo.account = obj.data.account;
                            $window.userInfo.userName = obj.data.personName;
                            $window.userInfo.token = obj.data.token;
                            storeService.setLocalValue("token", obj.data.token);
                            $log.debug("login user name is : " + obj.data.personName);
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            this.loginByToken = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/LoginByToken";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            $window.userInfo.personId = obj.data.personId;
                            $window.userInfo.account = obj.data.account;
                            $window.userInfo.userName = obj.data.personName;
                            $window.userInfo.token = obj.data.token;
                            storeService.setLocalValue("token", obj.data.token);
                            $log.debug("login user name is : " + obj.data.personName);
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            // 微信登录
            this.wxLogin = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/wxLogin";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            $window.userInfo.personId = obj.data.personId;
                            $window.userInfo.account = obj.data.account;
                            $window.userInfo.userName = obj.data.userName;
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            this.checkToken = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/checkToken";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            // 退出登录
            this.exitLogin = function () {
                var data = { token: this.userInfo.token };
                this.userInfo.personId = "";
                this.userInfo.account = "";
                this.userInfo.userName = "";
                this.userInfo.token = "";

                var defer = $q.defer();
                if (data.token) {
                    var url = myConfig.serviceUrl + "/App/exitLogin";
                    $http.post(url, data)
                        .then(function (args) {
                            var obj = args.data;
                            if (obj.isSuccess === true) {
                                defer.resolve("");
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                }
                else {
                    defer.resolve("");
                }
                
                return defer.promise;
            };

            // 获取所有已经注册的用户账号
            this.getAllAccount = function () {
                var key = "getAllAccount";
                var defer = $q.defer();
                if (!$window.customCache.get(key)) {
                    var url = myConfig.serviceUrl + "/App/getAllAccount";
                    $http.post(url, {})
                        .then(function (args) {
                            var obj = args.data;
                            if (obj.isSuccess === true) {
                                $window.customCache.put(key, obj.data);
                                defer.resolve(obj.data);
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                }
                else {
                    defer.resolve($window.customCache.get(key));
                }
                return defer.promise;
            };
            // 注册
            // data:{
            //      openId : "",
            //      account :""
            //      userName :""
            //      userEmail:""
            //      userPhone:""
            //      password
            //  }
            this.regist = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/regist";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;

                        if (obj.isSuccess === true) {
                            $window.userInfo.personId = obj.data.personId;
                            $window.userInfo.account = obj.data.account;
                            $window.userInfo.userName = obj.data.userName;
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            // 获取用户信息
            // data:{account:""}
            this.getPersonInfo = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/GetPersonInfo";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;

                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            }

            // 修改用户信息
            // data: tbl_person 对象
            this.savePersonInfo = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/SavePersonInfo";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;

                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            }

            // 获取个人求职意向
            // data:{personId:""}
            this.getPersonJobWish = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/GetPersonJobWish";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;

                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            // 编辑个人求职意向
            this.savePersonJobWish = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/SavePersonJobWish";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;

                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            // 发送验证码
            this.sendVerificationCode = function (phone) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/sendVerificationCode";
                var data = {
                    phone: phone
                };

                $http.post(url, data).then(function (args) {
                    defer.resolve(args.data);
                }, function (args) {
                    defer.reject(args);
                });
                return defer.promise;
            };

            this.validVerificationCode = function (msgId, code) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/validVerificationCode";
                var data = {
                    msgId: msgId,
                    code: code,
                };

                $http.post(url, data).then(function (args) {
                    defer.resolve(args.data);
                }, function (args) {
                    defer.reject(args);
                });
                return defer.promise;
            }


            // 获取广告图片
            this.getAdvertisementList = function () {
                var key = "getAdvertisementList";
                var defer = $q.defer();
                if (!$window.customCache.get(key)) {
                    var url = myConfig.serviceUrl + "/App/GetAdvertisementList";
                    $http.post(url, {})
                        .then(function (args) {
                            var obj = args.data;
                            if (obj.isSuccess === true) {
                                for (var i = 0; i < obj.data.length; i++) {
                                    obj.data[i] = myConfig.filesUrl + "/Advertisement/" + obj.data[i];
                                }
                                $window.customCache.put(key, obj.data);
                                defer.resolve(obj.data);
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                }
                else {
                    defer.resolve($window.customCache.get(key));
                }
                return defer.promise;
            };

            // 获取课程主题文本
            // strWhere:
            //  {
            //      courseName:       //课程名称
            //      fileName:         //文件名称
            //  }
            this.getTextContentByUrl = function (url) {
                var key = url;
                //$http.get(url)
                //.then(function (args) {
                //    $window.customCache.put(key, args);
                //    defer.resolve(args);
                //}, function (args) {
                //    defer.reject(args);
                //});

                $http({
                    url: url,
                    method: "get",
                    responseType: "text"
                }).then(function (args) {
                    $window.customCache.put(key, args);
                    defer.resolve(args);
                }, function (args) {
                    defer.reject(args);
                });
            };
            this.getTextContent = function (data) {
                var key = "getTextContent_" + data.courseName + "_" + data.fileName;
                var defer = $q.defer();
                if (!$window.customCache.get(key)) {
                    var url = myConfig.serviceUrl + "/App/GetTextContent";
                    $http.post(url, data)
                        .then(function (args) {
                            var obj = args.data;
                            if (obj.isSuccess === true) {
                                $window.customCache.put(key, obj.data);
                                defer.resolve(obj.data);
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                }
                else {
                    defer.resolve($window.customCache.get(key));
                }
                return defer.promise;
            };

            // 获取课程列表
            // strWhere:{
            //    type: "精品课程"|"热门课程"
            //    limit:6
            // }
            this.getCourseList = function (strWhere) {
                var defer = $q.defer();

                //console.debug("do getCourseList");
                var key = "getCourseList_" + strWhere.type + "_" + strWhere.limit;
                //if (!$window.localStorage[key]) {
                //    console.debug("do getCourseList from server");
                var url = myConfig.serviceUrl + "/App/GetCourseList";
                    $http.post(url, strWhere)
                        .then(function (args) {
                            var obj = args.data;
                            for (var i = 0; i < obj.data.length; i++) {
                                if (obj.data[i].img)
                                    obj.data[i].img = myConfig.filesUrl + "/Courses/" + obj.data[i].img;
                                if (obj.data[i].file)
                                    obj.data[i].file = myConfig.filesUrl + "/Courses/" + obj.data[i].file;
                            }
                            if (obj.isSuccess === true) {
                                $window.localStorage[key] = JSON.stringify(obj.data);
                                defer.resolve(obj.data);
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                //}
                //else {
                //    defer.resolve(JSON.parse($window.localStorage[key]));
                //}
                return defer.promise;
            };

            // 获取课程索引树
            // strWhere:{
            //    personId:
            //    isAll:       // true 显示所有课程      false 显示我的课程
            // }
            this.getCourseIndexTree = function (strWhere) {
                var key = "getCourseIndexTree_" + strWhere.isAll + "_" + strWhere.personId;
                var defer = $q.defer();
                if (!$window.customCache.get(key)) {
                    var url = myConfig.serviceUrl + "/App/GetCourseIndexTree";
                    $http.post(url, strWhere)
                        .then(function (args) {
                            var obj = args.data;
                            if (obj.isSuccess === true) {
                                $window.customCache.put(key, obj.data);
                                defer.resolve(obj.data);
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                }
                else {
                    defer.resolve($window.customCache.get(key));
                }
                return defer.promise;
            };
            this.clearCourseIndexTreeCache = function (strWhere) {
                var key = "getCourseIndexTree_" + strWhere.isAll + "_" + strWhere.personId;
                if ($window.customCache.get(key)) {
                    $window.customCache.remove(key);
                }
            };


            this.getMyCourseList = function (strWhere) {
                strWhere.personId = userInfo.personId;
                var key = "getMyCourseList_" + strWhere.personId;
                var defer = $q.defer();
                if (!$window.customCache.get(key)) {
                    var url = myConfig.serviceUrl + "/App/GetMyCourseList";
                    $http.post(url, strWhere)
                        .then(function (args) {
                            var obj = args.data;
                            if (obj.isSuccess === true) {
                                $window.customCache.put(key, obj.data);
                                defer.resolve(obj.data);
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                }
                else {
                    defer.resolve($window.customCache.get(key));
                }
                return defer.promise;
            }
            this.clearMyCourseListCache = function (strWhere) {
                strWhere.personId = userInfo.personId;
                var key = "getMyCourseList_" + strWhere.personId;
                if ($window.customCache.get(key)) {
                    $window.customCache.remove(key);
                }
            };

            // 获取课程所有信息（包括学习记录 和 讨论列表)
            // strWhere:{
            //    courseId: 
            //    personId:
            // }
            this.getCourseInfoAll = function (strWhere) {
                var key = "getCourseInfoAll_" + strWhere.courseId + "_" + strWhere.personId;
                var defer = $q.defer();
                if (!$window.customCache.get(key)) {
                    var url = myConfig.serviceUrl + "/App/GetCourseInfoAll";
                    $http.post(url, strWhere)
                        .then(function (args) {
                            var obj = args.data;
                            if (obj.isSuccess === true) {
                                obj.data.baseInfo.img = myConfig.filesUrl + "/Courses/" + obj.data.baseInfo.img;
                                obj.data.baseInfo.infos = [];
                                obj.data.baseInfo.infos.push(obj.data.baseInfo.lastLearn);
                                obj.data.baseInfo.infos.push(obj.data.baseInfo.maxExam);
                                $window.customCache.put(key, obj.data);
                                defer.resolve(obj.data);
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                }
                else {
                    defer.resolve($window.customCache.get(key));
                }
                return defer.promise;
            };
            this.clearGetCourseInfoAllCache = function (strWhere) {
                var key = "getCourseInfoAll_" + strWhere.courseId + "_" + strWhere.personId;
                if ($window.customCache.get(key)) {
                    $window.customCache.put(key, null);
                }
            };

            // 提交评论
            // data:{
            //    personId:   
            //    courseId:
            //    score:      评分
            //    discuss:
            // }
            this.saveDiscuss = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/SaveDiscuss";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            // 获取评论（包括评论数和评论列表)
            // data:{
            //      courseId:""
            //      start:""
            //      limit:""
            // }
            // return:{
            //      count: 评论数
            //      list: 评论列表
            // }
            this.getDiscuss = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/GetDiscuss";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            }

            // 获取学习记录（包括记录总数和记录列表)
            // data:{
            //      personId:"",
            //      courseId:""       // 如果不分课程则不设置该参数
            //      start:""
            //      limit:""
            // }
            // return:{
            //      count: 记录总数
            //      list: 记录列表
            // }
            this.getLearnRecord = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/getLearnRecord";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            }

            // 提交收藏
            // data:{
            //    personId:
            //    courseId:
            // }
            this.saveKeep = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/SaveKeep";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };


            // 移除收藏
            // data:{
            //    personId:
            //    courseId:
            // }
            this.removeKeep = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/RemoveKeep";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };


            this._dealCourseContentUrl = function (data, courseName) {
                var i = 0;
                if (data instanceof Array) {
                    for (var t = 0; t < data.length; t++) {
                        //if (data[t].Text) {
                        //    data[t].Text = myConfig.filesUrl + "/courses/" + courseName + "/" + data[t].Text;
                        //}

                        if (data[t].Image) {
                            data[t].Image = myConfig.filesUrl + "/courses/" + courseName + "/" + data[t].Image;
                        }

                        if (data[t].Video) {
                            if (data[i].Video.indexOf("/") < 0)
                                data[t].Video = myConfig.filesUrl + "/courses/" + courseName + "/" + data[t].Video;
                        }

                        if (data[t].File) {
                            if (data[i].File.indexOf("/") < 0)
                                data[t].File = myConfig.filesUrl + "/courses/" + courseName + "/" + data[t].File;
                        }

                        for (i = 0; i < data[t].nodes.length; i++) {
                            arguments.callee(data[t].nodes[i], courseName);
                        }
                    }
                }
                else {
                    //if (data.Text) {
                    //    data.Text = myConfig.filesUrl + "/courses/" + courseName + "/" + data.Text;
                    //}

                    if (data.Image) {
                        data.Image = myConfig.filesUrl + "/courses/" + courseName + "/" + data.Image;
                    }

                    if (data.Video) {
                        if (data.Video.indexOf("/") < 0)
                            data.Video = myConfig.filesUrl + "/courses/" + courseName + "/" + data.Video;
                    }

                    if (data.File) {
                        if (data.File.indexOf("/") < 0)
                            data.File = myConfig.filesUrl + "/courses/" + courseName + "/" + data.File;
                    }

                    for (i = 0; i < data.nodes.length; i++) {
                        arguments.callee(data.nodes[i], courseName);
                    }
                }

            };
            $window._dealCourseContentUrl = this._dealCourseContentUrl;
            // 获取课程内容
            this.getCourseContent = function (strWhere) {
                strWhere.videoPlatform = myConfig.videoPlatform;
                if (this.userInfo && this.userInfo.personId) {
                    strWhere.personId = this.userInfo.personId;
                }
                else {
                    strWhere.personId = -1;
                }

                var key = "getCourseContent_" + strWhere.courseId + "_" + strWhere.personId;
                var defer = $q.defer();
                if (!$window.customCache.get(key)) {
                    var url = myConfig.serviceUrl + "/App/getCourseContent";
                    $http.post(url, strWhere)
                        .then(function (args) {
                            var obj = args.data;
                            if (obj.isSuccess === true) {
                                $window._dealCourseContentUrl(obj.data.courseContent, obj.data.courseName);
                                $window.customCache.put(key, obj.data.courseContent);
                                defer.resolve(obj.data.courseContent);
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                }
                else {
                    defer.resolve($window.customCache.get(key));
                }
                return defer.promise;
            };


            // 保存学习或测试信息
            this.saveLearnInfo = function (data) {
                if (this.userInfo && this.userInfo.personId) {
                    data.personId = this.userInfo.personId;
                }
                else {
                    data.personId = -1;
                }

                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/SaveLearnInfo";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve("");
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );

                return defer.promise;
            };

            // 修改用户信息
            this.savePersonBaseInfo = function (data) {
                if (this.userInfo && this.userInfo.personId) {
                    data.personId = this.userInfo.personId;
                }
                else {
                    data.personId = -1;
                }
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/SavePersonBaseInfo";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve("");
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );

                return defer.promise;
            };

            // 重置密码（忘记密码的时候使用)
            this.resetPassword = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/ResetPassword";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve("");
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );

                return defer.promise;
            };
            // 修改密码
            this.saveNewPassword = function (password) {
                var data = {};
                data.password = password;
                if (this.userInfo && this.userInfo.personId) {
                    data.personId = this.userInfo.personId;
                }
                else {
                    data.personId = -1;
                }
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/SaveNewPassword";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve("");
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );

                return defer.promise;
            };

            // 获取消息列表
            // data:{
            //  userId:"",
            //  isRead:"",
            // }
            this.getMessageList = function (data) {
                var key = "getMessageList_" + data.userId + "_" + data.isRead +"_" + data.classifyId;
                var defer = $q.defer();
                if (!$window.customCache.get(key)) {
                    var url = myConfig.serviceUrl + "/IMessage/getMessageList";
                    $http.post(url, data)
                        .then(function (args) {
                            var obj = args.data;
                            if (obj.isSuccess === true) {
                                for (var i = 0; i < obj.data.length; i++) {
                                    if (obj.data[i].msgList) {
                                        for(var j = 0; j < obj.data[i].msgList.length; j++){
                                            if (obj.data[i].msgList[j].content){
                                                obj.data[i].msgList[j].contents = obj.data[i].msgList[j].content.split("/n");
                                            }
                                        }
                                    }
                                    else {
                                        if (obj.data[i].content) {
                                            obj.data[i].contents = obj.data[i].content.split("/n");
                                        }
                                    }
                                    
                                }
                                $window.customCache.put(key, obj.data);
                                defer.resolve(obj.data);
                            }
                            else {
                                defer.reject(obj.msg);
                            }
                        },
                        function (args) {
                            defer.reject(args);
                        }
                    );
                }
                else {
                    defer.resolve($window.customCache.get(key));
                }
                return defer.promise;
            };
            this.clearGetMessageListCache = function (data) {
                var key = "getMessageList_" + data.userId + "_" + data.isRead;
                if ($window.customCache.get(key)) {
                    $window.customCache.put(key, null);
                }
            };

            this.getCourseResource = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/getCourseResource";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve(obj.data);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            this.queryVideoUrlFromYD = function (data) {
                var defer = $q.defer();
                var url = myConfig.serviceUrl + "/App/queryVideoUrlFromYD";
                $http.post(url, data)
                    .then(function (args) {
                        var obj = args.data;
                        if (obj.isSuccess === true) {
                            defer.resolve(obj);
                        }
                        else {
                            defer.reject(obj.msg);
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };

            this.isNewVersion = function () {
                var key = "version";
                var defer = $q.defer();
                var data = {
                    aId: "a51a2ee445c04c5e3a41330c48c5f84c",
                    page: "1",
                    _api_key: "608f636ec02fb3f1c66651ea8e07acf6"
                }
                var url = "http://www.pgyer.com/apiv1/app/builds";
                $http.post(url, data)
                    .then(function (args) {
                        defer.resolve(obj.data);
                        if (!$window.localStorage[key]) {
                            defer.resolve(false);
                        }
                        else {
                            if (obj.appKey == $window.localStorage[key]) {
                                defer.resolve(true);
                            }
                            else {
                                defer.resolve(false);
                            }
                        }
                    },
                    function (args) {
                        defer.reject(args);
                    }
                );
                return defer.promise;
            };
        }]);
})();