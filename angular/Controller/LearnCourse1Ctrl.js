(function() {
    angular.module("app")
    .controller("LearnCourse1Ctrl", ["$scope", "$interval", "$stateParams", "dataService",
        "convertService", "$state", "myConfig", "$log", "utilityService", "courseService1", "$ionicSlideBoxDelegate", "storeService", "$timeout", "$q",
        function ($scope, $interval, $stateParams, dataService, convertService,
            $state, myConfig, $log, utilityService, courseService1, $ionicSlideBoxDelegate, storeService, $timeout, $q) {
            var scope = $scope;
            $scope.m = {
                params:{
                    courseId:$stateParams.courseId,
                    courseName:$stateParams.courseName,
                    difficulty:$stateParams.difficulty
                },
                learn: courseService1.learn,
                learnInfo: {
                    courseId: $stateParams.courseId,
                    learnMode: "学习",
                    questionNumber: 0,
                    answerNumber: 0,
                    answerRightNumber: 0,
                    score: 0,
                    startTime: new Date(),
                    endTime: new Date(),
                    useTime:""
                },
                isShowLearnInfo: false,
            };

            $scope.loadData = function () {
                dataService.getCourseContent({
                    courseId: $scope.m.params.courseId
                }).then(function (args) {
                    courseService1.loadLearnInfo(args[0], $scope.m.params.difficulty);
                    for (var i = 0; i < $scope.m.learn.questions.length; i++) {
                        if ($scope.m.learn.questions[i].fileType == "video") {
                            $scope.m.learn.questions[i].video = splitVideo($scope.m.learn.questions[i].file);
                        }
                    }
                    $scope.m.learn.curQuestion = $scope.m.learn.questions[0];
                    $scope.m.learn.index = 0;
                    //if (storeService.getLocalValue($scope.m.params.courseId + "_index")){
                    //    $scope.m.learn.index = storeService.getLocalValue($scope.m.params.courseId + "_index")
                    //}
                    $timeout(createSwiper, 500);
                }, function (args) {
                }); 
            };

            
            $scope.getContent = function (courseItem) {

                var defer = $q.defer();
                if (!courseItem) {
                    defer.resolve("");
                }
                else if (courseItem.file.indexOf(".txt") < 0){
                    defer.resolve("");
                }
                else {
                    dataService.getTextContent({
                        courseName: $scope.m.params.courseName,
                        fileName: courseItem.file
                    })
                    .then(function (args) {
                        //setContent(tempIndex, args, true);
                        var array = args.split("\n");
                        var list = [];
                        for (var i = 0; i < array.length; i++) {
                            if (array[i] !== "") {
                                list.push(array[i]);
                            }
                        }
                        courseItem.TextContent = list;
                        defer.resolve(list);
                    }, function (args) { defer.reject(""); });
                }

                return defer.promise;
            }

            // 退出的时候显示本次学习信息
            $scope.showLearnCompleteInfo = function () {
                $scope.m.isShowLearnInfo = true;
                var score = courseService1.getLearnScore();
                $scope.m.learnInfo.questionNumber = score.questionCount;
                $scope.m.learnInfo.answerNumber = score.doQuestionCount;
                $scope.m.learnInfo.answerRightNumber = score.doRightQuestionCount;
                $scope.m.learnInfo.score = score.score;
                $scope.m.learnInfo.endTime = new Date();
                //$scope.m.learnInfo.startTime = $scope.modal.startTime;
                //$scope.m.learnInfo.useTime = $scope.modal.useTime;
            };

            // 退出课程
            $scope.learnCompleted = function () {
                $scope.m.learnInfo.startTime = utilityService.getDateDbString($scope.m.learnInfo.startTime);
                $scope.m.learnInfo.endTime = utilityService.getDateDbString($scope.m.learnInfo.endTime);

                dataService.saveLearnInfo($scope.m.learnInfo)
                .then(function (args) {
                    $scope.m.isShowLearnInfo = false;
                    storeService.setLocalValue($scope.m.params.courseId + "_index", $scope.m.learn.index);
                    //$scope.loadData();
                    $state.go("tab.allCourseList");
                }, function (args) {
                    utilityService.alert(args);
                });
            };


            $scope.closeTimer = function () {
                $interval.cancel($scope.timer);
            };


            $scope.submitQuestion = function () {
                selectAnswerEx();
                courseService1.checkLearnQuestionAnswer($scope.m.learn.curQuestion);
                setAnswerClass(true);
                setLockSwipe();
            };

            $scope.selectAnswer = function (item) {
                $scope.m.learn.curQuestion.answerStatus = 0;
                item.isUserChoice = !item.isUserChoice;
            };

            var setLockSwipe = function(){
                //if(m_swiper.activeIndex == 0){
                //    m_swiper.lockSwipeToPrev();
                //}
                
                if(m_swiper.activeIndex < m_swiper.slides.length - 1){
                    var temp = $scope.m.learn.questions[m_swiper.activeIndex];
                    if (temp.type=="question" && temp.answerStatus != 1)
                        m_swiper.lockSwipeToNext();
                    else
                        m_swiper.unlockSwipeToNext();

                    if (temp.file.indexOf(".txt") >= 0) {
                        scope.getContent(temp);
                    }
                }

                scope.m.learn.curQuestion = scope.m.learn.questions[m_swiper.activeIndex];
            }

            $scope.next = function () {
                courseService1.nextLearn();
                //$scope.slideChanged(tempIndex);
                m_swiper.slideNext();
            };

            $scope.prior = function () {
                courseService1.priorLearn();
                //$scope.slideChanged(tempIndex);
                m_swiper.slidePrev();
            };

            var splitVideo = function (video) {
                var result = {
                    video: "",
                    ydVideo: "",
                    alyVideo: ""
                };
                var temp = video;
                if (video.indexOf("@yd@") >= 0) {
                    var t = temp.split("@yd@");
                    result.video = t[0];
                    temp = t[1];
                }
                else if (video.indexOf("@aly@") >= 0) {
                    var tt = temp.split("@aly@");
                    if (result.video == "") {
                        result.video = tt[0];
                    }
                    else {
                        result.ydVideo = tt[0];
                    }
                    result.alyVideo = tt[1];
                }
                else {
                    result.video = temp;
                }
                return result;
            };

            var t1 = moment().unix();
            $scope.timer = $interval(function () {

                $scope.m.learnInfo.endTime = new Date();
                var t2 = moment().unix();
                var t3 = t2 - t1;
                $scope.m.learnInfo.useTime = moment(t3 * 1000).utc().utcOffset(0).format('HH:mm:ss');
            }, 1000);

            $scope.loadData();

            createVideo = function (item, video, index) {
                if (item.alyPlay) return;
                $timeout(function () {
                    try {
                        // android apiKey   bwdmqod3j2fbgfldopxxbglzon729vqcjsqz1xe87sgoc921xcz84zx84bvkqeym
                        // html    apiKey   712by3pqx7pgwi5vxhepzlm4oiomiicpz821myaiu5d4mdngxs2xnx9jrpp7p9hh

                        if (video.alyVideo != "") {
                            //// 从视频点播获取资源
                            //item.alyPlay = new prismplayer({
                            //    id: "J_prismPlayer" + index,
                            //    autoplay: false,
                            //    width: "100%",
                            //    vid: video.alyVideo,
                            //    playauth: "",
                            //    accId: "LTAIvX5Yi4jRvZRp",
                            //    accSecret: "NBUnKZQ7kg04J7uL7i1sXCWHDwMmI0",
                            //    apiKey: "712by3pqx7pgwi5vxhepzlm4oiomiicpz821myaiu5d4mdngxs2xnx9jrpp7p9hh"
                            //    //prismType:1
                            //});

                            //清除之前video带来的影响
                            video.alyVideo = "";
                            item.alyPlay = ""
                            // 从服务器获取资源
                            item.alyPlay = new prismplayer({
                                id: "J_prismPlayer" + index,
                                autoplay: false,
                                width: "98%",
                                //accId: "LTAIvX5Yi4jRvZRp",
                                //accSecret: "NBUnKZQ7kg04J7uL7i1sXCWHDwMmI0",
                                //apiKey: "712by3pqx7pgwi5vxhepzlm4oiomiicpz821myaiu5d4mdngxs2xnx9jrpp7p9hh",
                                source: video.video
                            });
                        }
                        else {

                            //清除之前video带来的影响
                            video.alyVideo = "";
                            item.alyPlay = ""
                            // 从服务器获取资源
                            item.alyPlay = new prismplayer({
                                id: "J_prismPlayer" + index,
                                autoplay: false,
                                width: "98%",
                                //accId: "LTAIvX5Yi4jRvZRp",
                                //accSecret: "NBUnKZQ7kg04J7uL7i1sXCWHDwMmI0",
                                //apiKey: "712by3pqx7pgwi5vxhepzlm4oiomiicpz821myaiu5d4mdngxs2xnx9jrpp7p9hh",
                                source: video.video
                            });
                        }
                    }
                    catch (exception) {
                        scope.m.exception = exception;
                    }
                    
                }, 100);
                
            }

            var m_swiper = null;
            var createSwiper = function() {
                m_swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    freeMode: false,
                    speed:300,
                    shortSwipes: true,
                    threshold:70,

                    onSlideChangeEnd: function (swiper) {
                        //alert(swiper.activeIndex);
                        var item = scope.m.learn.questions[swiper.activeIndex];
                        createVideo(item, item.video, swiper.activeIndex);
                        setLockSwipe();
                        addSwiper(swiper);
                        window.scrollTo(0, 0);
                    },
                    onSlideChangeStart: function (swiper) {
                        var item = scope.m.learn.questions[swiper.previousIndex];
                        if (item.fileType == "video") {
                            if (item.alyPlay) {
                                item.alyPlay.pause();
                            }
                        }
                    }
                });
                addSwiper(m_swiper)
                .then(function (args) {
                    addSwiper(m_swiper);
                });
                
            }

            var addSwiper = function(swiper) {
                var defer = $q.defer();
                if (!swiper || !swiper.slides) {
                    defer.reject("");
                }
                else {
                    var tempIndex = swiper.slides.length;
                    var item = scope.m.learn.questions[tempIndex];
                    scope.getContent(item)
                        .then(function (args) {
                            if (scope.m.learn.questions.length > tempIndex) {
                                var html = "";
                                html += '<div class="swiper-slide">';
                                if (scope.m.learn.questions[tempIndex].type == "catalog") {
                                    html += getCatalogHtml(scope.m.learn.questions[tempIndex]);
                                }
                                else if (scope.m.learn.questions[tempIndex].type == "question") {
                                    html += getQuestionHtml(scope.m.learn.questions[tempIndex], tempIndex);
                                }
                                html += '</div>';
                                swiper.appendSlide(html);
                                setEventListenerEx(swiper.slides.length - 2);
                                setEventListenerEx(swiper.slides.length - 1);

                                //if (scope.m.learn.questions[tempIndex].fileType == "video") {
                                //    createVideo(scope.m.learn.questions[tempIndex], scope.m.learn.questions[tempIndex].video, tempIndex);
                                //}
                            }
                            defer.resolve("");
                        }, function (args) {
                            defer.reject("");
                        });
                }
                
                return defer.promise;
            };

            var setEventListenerEx = function (index) {
                $("div[id*='questionDiv" + index + "']").unbind("click").click(function () {
                    var id = this.id;
                    var checkId = "#" + id.replace("questionDiv", "questionCheck");
                    var check = $(checkId)[0].checked;   //$(checkId).attr("checked");
                    if (check) {
                        //$(checkId).attr("checked", false);
                        $(checkId)[0].checked = false;
                    }
                    else {
                        //$(checkId).attr("checked", true);
                        $(checkId)[0].checked = true;
                    }
                    setAnswerClass(false);
                });

                //$("#questionPanel").unbind("touchmove").on("touchmove", function (event) {
                //    event.preventDefault();
                //});
            };

            var setAnswerClass = function (isShowResult) {
                var id = "span[id*='questionSpan" + m_swiper.activeIndex + "']";
                if (isShowResult) {
                    $(id).each(function (index, element) {
                        var question = scope.m.learn.questions[m_swiper.activeIndex];
                        if (question.answerStatus != 0 &&                      // 回答状态为已经回答
                            question.items[index].type == 'errorAnswer' &&      // 答案类型为错误答案
                            question.items[index].isUserChoice) {                // 用户选择情况为选择
                            // 显示错误答案
                            $(element).addClass("assertive");
                            $(element).attr("style",  
                                "text-decoration:line-through;" );
                        }
                        else if (question.answerStatus != 0 &&
                            question.items[index].type == 'rightAnswer' &&
                            question.items[index].isUserChoice) {
                            // 显示正确答案
                            $(element).addClass("positive");
                        }
                    });
                }
                else {
                    $(id).each(function (index, element) {
                        $(element).removeClass("assertive");
                        $(element).removeClass("positive");
                        $(element).attr("style", "");
                    });
                }
            };

            var selectAnswerEx = function () {
                var id = "input[id*='questionCheck" + m_swiper.activeIndex + "']";
                $(id).each(function (index, element) {
                    var checkValue = $(element)[0].checked;
                    if (checkValue) {
                        scope.m.learn.questions[m_swiper.activeIndex].items[index].isUserChoice = true;
                    }
                    else {
                        scope.m.learn.questions[m_swiper.activeIndex].items[index].isUserChoice = false;
                    }
                })
            };

            var getCatalogHtml = function(item) {
                var html = "";
                // 处理标题
                html = angular.element("#catalogTitleTemplate").html();
                if (item.title.indexOf("图片") >= 0 || item.title.indexOf("视频") >= 0)
                    html = html.replace("#title#", "");
                else
                    html = html.replace("#title#", item.title);

                // 处理内容
                for (var i = 0; i < item.items.length; i++) {
                    if (item.items[i].title.indexOf("图片") >= 0 ||
                        item.items[i].title.indexOf("视频") >= 0 ||
                        item.items[i].type == "question")
                        continue;
                    html += '<div class="leftIndentation" style="margin:10px;" ><span>' + item.items[i].title + '</span></div>';
                }

                // 处理资源
                html += getCourseResourceHtml(item);
                return html;
            };

            var getQuestionHtml = function(item, index) {
                var html = "";
                // 处理标题
                var titleList = [];
                if (typeof item.title == "string") {
                    titleList = item.title.split("。");
                }
                else {
                    titleList = item.title;
                }
                for (var i = 0; i < titleList.length; i++) {
                    titleList[i] = titleList[i].replace("@check@", "");
                    if (titleList[i].trim() == "") {
                        titleList.splice(i, 1);
                    }
                }

                html = '<div class="padding">';
                html += '<strong>';
                html += '<span style="float:right;"  class="assertive">(' + item.rightAnswerCount + ')</span>';
                for (var i = 0; i < titleList.length; i++) {
                    html += '<span style="display:block; margin-top:8px;">' + titleList[i] + '</span>';
                }
                html += '</strong>';
                html += '</div>';

                // 处理内容
                html += getQuestionContentHtml(item,index);

                // 处理资源
                html += getCourseResourceHtml(item);
                return html;
            };

            var getQuestionContentHtml = function(item, index) {
                var html = "";
                
                html += '<div id="questionPanel">';
                for (var i = 0; i < item.items.length; i++) {
                    html += '<div class="leftIndentation stable-border" style="margin:10px;" id="questionDiv' + index  +"_" + i + '"/div>';
                    html += '<input type="checkbox" id="questionCheck' + index + "_" + i + '"/>';
                    html += '<span id="questionSpan' + index + "_" + i + '">' + item.items[i].title + '</span>';
                    html += '</div>';
                }
                html += '</div>';
                return html;
            }

            var getCourseResourceHtml = function(item) {
                var html = "";
                if (item.fileType == "img") {
                    html = angular.element("#imageTemplate").html();
                    html = html.replace("#file#", item.file);
                }
                else if (item.fileType == "video") {
                    html = angular.element("#videoTemplate").html();
                    //if (item.video.alyVideo == "") {
                    //    html = html.replace("#file#", item.video.video);       // 从阿里云服务器上获取视频
                    //}
                    //else {
                    //    html = '<div class="prism-player" id="J_prismPlayer' + m_swiper.slides.length + '"></div>';   // 从阿里云视频点播上获取视频
                    //}
                    //html = html.replace("#file#", item.video.video);
                    html = '<div class="prism-player" id="J_prismPlayer' + m_swiper.slides.length + '" style="position: relative;margin: auto;overflow: hidden" ></div>';

                }
                else if (item.fileType == "text") {
                    html += '<div class="padding">';
                    for (var i = 0; i < item.TextContent.length; i++) {
                        html += '<div class="item-text-wrap">';
                        html += '<p>&nbsp;&nbsp;&nbsp;&nbsp;' + item.TextContent[i] + '</p>';
                        html += '</div>';
                    }
                    html += '</div>';
                }
                return html;
            }
            
        }]);
})();