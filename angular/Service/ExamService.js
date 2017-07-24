(function() {
    angular.module("app")
    .service("examService", function () {
        this._questions = [];             // 保存所有的题目
        this._index = 0;
        this._options = {
            enableDisorder: false,          // 是否允许无序做题
            isAllQuestionUse: false,        // 如果是true 的话，课程中的所有题目都将是题目。  如果是 false 的话， 题目数量由 questionNumber 决定
            questionNumber: 50,
            questionSore: 2,
            difficulty: 2
        };

        // 根据课件内容生成题目
        // options{
        //     isAllQuestionUse: true | false     // 如果是true 的话，课程中的所有题目都将是题目。  如果是 false 的话， 题目数量由 questionNumber 决定
        //     questionNumber:50
        //     questionSore:2,
        //     difficulty: 2
        // }
        this.loadData = function (courseData, options) {
            if (options)
                this._options = options;

            var questionList = [];
            for (var i = 0; i < courseData.length; i++) {
                this._getAllQuestionFromCourse(courseData[i], questionList);
            }



            if (this._options.isAllQuestionUse) {
                this._questions = questionList;
            }
            else {
                this._questions = this._filterSomeQuestion(questionList, this._options.questionNumber);
            }

            for (i = 0; i < this._questions.length; i++) {
                this.productQuestion(this._questions[i], this._options.difficulty);
            }
            this._index = 0;
        };

        //  从课件内容中获取所有的题目
        this._getAllQuestionFromCourse = function (courseData, questionList) {
            if (courseData.IsQuestion) {
                questionList.push(courseData);
            }

            for (var i = 0; i < courseData.nodes.length; i++) {
                arguments.callee(courseData.nodes[i], questionList);
            }
        };

        // 从题目列表中随机过滤掉一些题目
        this._filterSomeQuestion = function (questionList, number) {
            if (number >= questionList.length) return questionList;

            var filterTimes = questionList.length - number;
            for (var i = 0; i < filterTimes; i++) {
                var index = parseInt(Math.random() * 1000) % questionList.length;

                questionList[index] = questionList[questionList.length - 1];
                questionList.pop();
            }
            return questionList;
        };

        // 获取题目数量
        this.getQuestionCount = function () {
            return this._questions.length;
        };

        // 检测是否完成做题
        this.isCompleted = function () {
            var count = 0;
            for (var i = 0; i < this._questions.length; i++) {
                if (this._questions[i].isUserAnswer)
                    count++;
            }
            return count >= this._questions.length;
        };

        // 获取当前题目
        this.getQuestionItem = function () {
            return this._questions[this._index];
        };

        // 下一题
        // 如果是最后一题返回 false, 否则返回 true
        this.nextQuestion = function () {
            this.checkQuestionAnswer(this._questions[this._index]);

            if (this._options.enableDisorder) {
                for (var i = this._index; i < this._questions.length; i++) {
                    if (!this._questions[i].isUserAnswer) {
                        this._index = i;
                        return true;
                    }
                }

                for (i = 0; i < this._index; i++) {
                    if (!this._questions[i].isUserAnswer) {
                        this._index = i;
                        return true;
                    }
                }
                return false;
            }
            else {
                if (this._index >= this._questions.length - 1)
                    return false;
                this._index++;
                return true;
            }
        };

        // 上一题
        // 如果是第一题返回 false, 否则返回 true
        this.pirsoQuestion = function () {
            this.checkQuestionAnswer(this._questions[this._index]);

            if (this._options.enableDisorder) {
                for (var i = this._index - 1; i >= 0; i--) {
                    //if (!this._questions[i].isUserAnswer) {
                    this._index = i;
                    return true;
                    //}
                }

                //for (i = this._index; i >= 0; i--) {
                //    if (!this._questions[i].isUserAnswer) {
                //        this._index = i;
                //        return true;
                //    }
                //}
                return false;
            }
            else {
                if (this._index >= this._questions.length - 1)
                    return false;
                this._index--;
                return true;
            }
        };


        this.moveToQuestionById = function (questionId) {
            for (var i = 0; i < this._questions.length; i++) {
                if (this._questions[i].id == questionId) {
                    this._index = i;
                    return true;
                }
            }
            return false;
        };

        this.moveToQuestionByIndex = function (index) {
            if (index >= 0 && index < this._questions.length) {
                this._index = index;
                return true;
            }
            return false;
        };

        // 根据难度生成题目
        // 补充数据结构到答案上
        // {
        //      isKeep: true|false             // 是否保留
        //      isRight:  true|false
        //      isUserSelect : true|false
        //      enableAnswer : true|false   // 是否允许答题
        //  }
        //  补充的数据结构到题目上
        //  {
        //      isUserAnswer: true | false        用户是否答题
        //      isUserAnswerRight: true | false   用户答题是否正确
        //      score:0                           题目分值
        //      answers;[]            // 经过混合处理后的题目集合
        //      rightAnswerCount      // 正确的答案数目
        //      userAnswerRightCount  // 用户回答正确的答案数
        //  }
        this.productQuestion = function (questionItem, difficulty) {
            var rightList = this._getAllRightAnswer(questionItem);
            var wrongList = this._getAllWrongAnswer(questionItem);
            var rightListCount = rightList.length;
            var answerList = this._mixAnswer(rightList, wrongList, difficulty);

            for (var i = 0; i < answerList.length; i++) {
                answerList[i].isRight = answerList[i].IsRightAnswer;
                answerList[i].isUserSelect = false;
                answerList[i].enableAnswer = true;
                if (!answerList[i].isKeep) {
                    answerList[i].isKeep = answerList[i].isRight;
                }
            }

            questionItem.isUserAnswer = false;
            questionItem.isUserAnswerRight = false;
            questionItem.score = this._options.questionSore;
            questionItem.answers = answerList;
            questionItem.rightAnswerCount = rightListCount;
        };
        this._getAllRightAnswer = function (questionItem) {
            var list = [];
            for (var i = 0; i < questionItem.nodes.length; i++) {
                if (questionItem.nodes[i].IsRightAnswer)
                    list.push(questionItem.nodes[i]);
            }
            return list;
        };
        this._getAllWrongAnswer = function (questionItem) {
            var list = [];
            for (var i = 0; i < questionItem.nodes.length; i++) {
                if (!questionItem.nodes[i].IsRightAnswer)
                    list.push(questionItem.nodes[i]);
            }
            return list;
        };
        this._mixAnswer = function (rightList, wrongList, difficulty) {
            var mixNumber = 0;
            if (difficulty === 0) {
                // 无难度
                mixNumber = 0;
            }
            else if (difficulty == 1) {
                // 容易
                mixNumber = 2;
            }
            else if (difficulty == 2) {
                // 一般
                mixNumber = 4;
            }
            else {
                // 困难
                mixNumber = 6;
            }

            for (var i = 0; i < mixNumber; i++) {
                if (wrongList.length <= 0) break;

                var indexWrong = parseInt(Math.random() * 1000) % wrongList.length;
                var obj = wrongList[indexWrong];
                obj.isKeep = true;
                wrongList[indexWrong] = wrongList[wrongList.length - 1];
                wrongList.pop();

                var indexRight = parseInt(Math.random() * 1000) % rightList.length;
                for (var j = rightList.length - 1; j >= indexRight; j--) {
                    if (j == rightList.length - 1) {
                        rightList.push(rightList[j]);
                    }
                    else {
                        rightList[j + 1] = rightList[j];
                    }
                }
                rightList[indexRight] = obj;
            }
            return rightList;
        };

        // 检查正确性
        this.checkQuestionAnswer = function (questionItem) {
            //if (questionItem.isUserAnswer) return;
            questionItem.isUserAnswer = true;
            questionItem.isUserAnswerRight = true;
            questionItem.userAnswerRightCount = 0;
            for (var i = 0; i < questionItem.answers.length; i++) {
                questionItem.isUserAnswerRight = questionItem.isUserAnswerRight &&
                    ((questionItem.answers[i].isRight==true && questionItem.answers[i].isUserSelect==true) ||
                    (questionItem.answers[i].isRight==false && questionItem.answers[i].isUserSelect==false));
                if (questionItem.answers[i].isRight && questionItem.answers[i].isUserSelect) {
                    questionItem.userAnswerRightCount++;
                }
                questionItem.answers[i].enableAnswer = false;
            }
        };

        // 获取正确答案
        this.getRightAnswerResult = function (questionItem) {
            var list = [];
            for (var i = 0; i < questionItem.answers.length; i++) {
                if (questionItem.answers[i].isRight) {
                    list.push(questionItem.answers[i]);
                }
            }
            return list;
        };

        // 获取用户回答正确的答案
        this.getUserRightAnswerResult = function (questionItem) {
            var list = [];
            for (var i = 0; i < questionItem.answers.length; i++) {
                if (questionItem.answers[i].isRight && questionItem.answers[i].isUserSelect) {
                    list.push(questionItem.answers[i]);
                }
            }
        };

        //  统计正确率
        //  result:{
        //      score:0     
        //      questionCount:0
        //      doQuestionCount:0
        //      doRightQuestionCount:0
        //  }
        this.getScore = function () {
            result = {
                score: 0,
                questionCount: this._questions.length,
                doQuestionCount: 0,
                doRightQuestionCount: 0
            };
            for (var i = 0; i < this._questions.length; i++) {
                if (this._questions[i].isUserAnswer) {
                    result.doQuestionCount++;
                }
                if (this._questions[i].isUserAnswerRight) {
                    result.doRightQuestionCount++;
                    result.score += this._questions[i].score;
                }
            }
            return result;
        };
    });
})();