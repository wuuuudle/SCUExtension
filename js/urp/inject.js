let Version = null;
window.addEventListener("message", function (event) {
    if (event.data.showDetails) {
        Version = event.data.showDetails.Version;
        openExtensionDetails(event.data.showDetails.URL);
    } else if (event.data.YJPJ) {
        YJPJ_search();
    }
}, false);


function getPostDate(text) {
    const form = $(text).find("form")[1];
    const data = $(form).find("input");
    let ret = {};

    for (let i = 0; i < data.length; i++) {
        if (i < 5) {
            ret[$(data[i]).attr("name")] = $(data[i]).attr("value");
        } else {
            if ($(data[i]).attr("value") === "10_1") {
                ret[$(data[i]).attr("name")] = $(data[i]).attr("value");
            }
        }
    }
    ret['zgpj'] = '好，非常好！';
    return ret;
}

let evaluationItem = 0;
let datas;

let sum_time = 0;
let interval_times = null;

function times() {
    urp.alert('下一次评教' + ":" + (60 - sum_time));
    sum_time++;
}

function evaluationPost(data) {
    $.ajax({
        //async: false,
        url: '/student/teachingEvaluation/teachingEvaluation/evaluationPage',
        type: 'post',
        beforeSend: (xhr) => {
            xhr.setRequestHeader('X-Requested-With', {
                toString: function () {
                    return '';
                }
            });
        },
        data: {
            evaluatedPeople: data.evaluatedPeople,
            evaluatedPeopleNumber: data.id.evaluatedPeople,
            questionnaireCode: data.questionnaire.questionnaireNumber,
            questionnaireName: data.questionnaire.questionnaireName,
            evaluationContentNumber: data.id.evaluationContentNumber,
            evaluationContentContent: ''
        },
        //dataType: 'json',
        success: (text) => {
            const postDate = getPostDate(text);
            setTimeout(() => {
                $.ajax({
                        async: true,
                        url: '/student/teachingEvaluation/teachingEvaluation/evaluation',
                        type: "post",
                        data: postDate,
                        success: (text) => {
                            console.log(text);
                            if (interval_times != null)
                                clearInterval(interval_times);
                            urp.alert(data.evaluatedPeople + " " +
                                data.evaluationContent + " :" +
                                text.result);
                            if (text.result === "success") {
                                evaluationItem++;
                            }
                            sum_time = 0;
                            evaluationNext();
                        }
                    }
                );
            }, 1000 * 60 + 1000);
        }
    });
}

function evaluationNext() {
    interval_times = setInterval(times, 1000);
    if (evaluationItem >= datas.length) {
        if (interval_times != null)
            clearInterval(interval_times);
        urp.alert("已完成评教");
        return;
    }
    while (datas[evaluationItem].isEvaluated !== '否') {
        evaluationItem++;
        if (evaluationItem >= datas.length) {
            if (interval_times != null)
                clearInterval(interval_times);
            urp.alert("已完成评教");
            return;
        }
    }
    evaluationPost(datas[evaluationItem]);
}

function YJPJ_search() {
    $.post('/student/teachingEvaluation/teachingEvaluation/search', {}, (jsondata, status) => {
        datas = jsondata.data;
        evaluationItem = 0;
        evaluationNext();
    });
}

function openExtensionDetails(url) {
    let modal = addslidersModel("extension_details_modal", "60%");
    modal.modal({
        remote: url
    }).on('hide.bs.modal', function () {
        modal.remove();
    });
}
