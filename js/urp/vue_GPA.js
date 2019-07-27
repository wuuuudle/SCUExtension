setTimeout(() => {
    let vueGPA = new Vue({
        el: '#gpa_app',
        data: {
            message: 'hello',
            totalCount: 0,
            avgGD: 0.00,
            records: [],
            records_total: [],
        },
        mounted: function () {
            $.post('/student/integratedQuery/scoreQuery/allTermScores/data', {
                zxjxjhh: '',
                kch: '',
                kcm: '',
                pageNum: 1,
                pageSize: 1
            }, (jsondata, status) => {
                this.totalCount = jsondata.list.pageContext.totalCount;
                $.post('/student/integratedQuery/scoreQuery/allTermScores/data', {
                    zxjxjhh: '',
                    kch: '',
                    kcm: '',
                    pageNum: 1,
                    pageSize: this.totalCount
                }).then((data) => {
                    return (// 将获取的全部课程成绩列表按照学期分组
                        data.list.records.reduce(function (acc, cur) {
                            // 如果没有挂科，那么 cur[18] ≡ null
                            // 如果挂科了，检查是否是因为「缓考」才在系统中记录为「未通过」，如果是缓考，则跳过这条记录
                            if (!cur[18] || cur[18].indexOf('缓考') === -1) {
                                var s = acc.filter(function (v) {
                                    return v.semester === cur[0];
                                });

                                if (s.length) {
                                    s[0].courses.push(cur);
                                } else {
                                    acc.push({
                                        semester: cur[0],
                                        courses: [cur]
                                    });
                                }
                            }
                            return acc;
                        }, [])
                    );
                }).then((list) => {
                    this.records = this.convertRecords(list);
                    this.records_total = this.convertRecords(list);
                    this.records_total = this.records_total.map((item) => {
                        return item.courses;
                    }).reduce((acc, cur) => {
                        return acc.concat(cur);
                    });
                    this.records_total = this.uniqueList(this.records_total);
                    this.records.forEach((item) => {
                        item.courses = this.uniqueList(item.courses);
                    });
                    console.log(this.records_total);
                });
            });
        },
        methods: {
            getPointByScore: function (score, semester) {
                // 2017年起，川大修改了绩点政策，因此要检测学期的年份
                var enrollmentYear = Number(semester.match(/^\d+/)[0]);

                if (enrollmentYear >= 2017) {
                    // 2017-2018秋季学期起使用如下标准（Fall Term 2017-2018~Present）
                    if (score >= 90) {
                        return 4;
                    } else if (score >= 85) {
                        return 3.7;
                    } else if (score >= 80) {
                        return 3.3;
                    } else if (score >= 76) {
                        return 3;
                    } else if (score >= 73) {
                        return 2.7;
                    } else if (score >= 70) {
                        return 2.3;
                    } else if (score >= 66) {
                        return 2;
                    } else if (score >= 63) {
                        return 1.7;
                    } else if (score >= 61) {
                        return 1.3;
                    } else if (score >= 60) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    // 2017-2018秋季学期以前使用如下标准（Before Fall Term 2017-2018）
                    if (score >= 95) {
                        return 4;
                    } else if (score >= 90) {
                        return 3.8;
                    } else if (score >= 85) {
                        return 3.6;
                    } else if (score >= 80) {
                        return 3.2;
                    } else if (score >= 75) {
                        return 2.7;
                    } else if (score >= 70) {
                        return 2.2;
                    } else if (score >= 65) {
                        return 1.7;
                    } else if (score >= 60) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            convertRecords: function (rawList) {
                return rawList.map((s) => {
                    return {
                        semester: s.semester.replace(/^(\d+-\d+)-(.+)$/, '$1学年 $2学期').replace('1-1学期', '秋季学期').replace('2-1学期', '春季学期'),
                        courses: s.courses
                        // 根据 http://jwc.scu.edu.cn/detail/122/6891.htm 《网上登录成绩的通知》 的说明
                        // 教师「暂存」的成绩学生不应看到
                        // 因此为了和教务处成绩显示保持一致，这里只显示「已提交」的成绩
                            .filter((v) => {
                                return v[4] === '05';
                            }).map((v) => {
                                return {
                                    name: v[11],
                                    score: v[8],
                                    level: v[17],
                                    gpa: this.getPointByScore(v[8], s.semester),
                                    credit: v[13],
                                    attribute: v[15],
                                    courseNumber: v[1],
                                    selected: false
                                };
                            }) // 分数可能为null
                            .filter((v) => {
                                return v.score;
                            })
                    };
                }) // 不显示还没有课程成绩的学期
                    .filter((v) => {
                        return v.courses && v.courses.length;
                    });
            },
            calAvgGrade: function (list) {
                let total1 = 0;
                let total2 = 0;
                list.forEach((item) => {
                    total1 += item.score * item.credit;
                    total2 += item.credit;
                });
                return (total1 / total2).toFixed(3);
            },
            calAvgPoint: function (list) {
                let total1 = 0;
                let total2 = 0;
                list.forEach((item) => {
                    total1 += item.gpa * item.credit;
                    total2 += item.credit;
                });
                return (total1 / total2).toFixed(3);
            },
            uniqueList: function (list) {
                let result = {};
                let result2 = [];
                list.forEach((item) => {
                    let temp = result[item.courseNumber];
                    if (!temp || (result[item.courseNumber].score < item.score))
                        result[item.courseNumber] = item;
                });
                for (let temp in result)
                    result2.push(result[temp]);
                return result2;
            },
            sortMethod: function (o1, o2) {
                console.log(o1, o2);
                if (o1 < o2) return -1;
                else if (o1 > o2) return 1;
                else return 0;
            }
        }
    });
}, 200);