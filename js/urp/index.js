indexjs();

function showVersion() {
    $.getJSON(chrome.extension.getURL('information.json'), function (data) {
        Version = data.version_name + '-' + data.version;
        let s = '<li class="red" style="text-align: center">\n<a class="showDetails" href="#">\n<i class="ace-icon fa fa-cogs"></i>SCUExtension' + '</a>\n</li>';
        //$('.nav.ace-nav .green').after(s);
        $('.nav.ace-nav li').first().after(s);
        $('.showDetails').click(() => {
            window.postMessage({
                showDetails: {
                    Version: Version,
                    URL: chrome.extension.getURL('js/urp/details.html')
                }
            }, '*');
        });
    });
}

function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/urp/inject.js';
    let temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = chrome.extension.getURL(jsPath);
    document.head.appendChild(temp);
}

function addYJPJ() //添加一键评教
{
    $('h4.header.smaller.lighter.grey').append('<button class="btn btn-xs btn-round btn-purple YJPJ">一键评教</button>');
    $('.btn.btn-xs.btn-round.btn-purple.YJPJ').click(() => {
        window.postMessage({YJPJ: true}, '*');
    });
}

function addShowGPA() {
    let s = $.ajax({url: chrome.extension.getURL('js/urp/vue_GPA.html'), async: false});
    $('.page-content .row:first').append(s.responseText);

    let vue_script = document.createElement('script');
    vue_script.setAttribute('type', 'text/javascript');
    vue_script.src = chrome.extension.getURL('js/urp/vue_GPA.js');
    document.body.after(vue_script);
}

function showCalendar() {
    $('.nav.ace-nav .green:last a').remove();

    $('.nav.ace-nav .green:last').append($.ajax({
        url: chrome.extension.getURL('js/urp/vue_calendar.html'),
        async: false
    }).responseText);

    let vue_script = document.createElement('script');
    vue_script.setAttribute('type', 'text/javascript');
    vue_script.src = chrome.extension.getURL('js/urp/vue_calendar.js');
    document.body.after(vue_script);

    window.addEventListener("message", (event) => {
        if (event.data.getCalendarList) {
            chrome.runtime.sendMessage(
                {getCalendarList: true},
                (response) => {
                    window.postMessage({calendarList: response}, '*');
                }
            );
        } else if (event.data.calendarURL) {
            chrome.runtime.sendMessage(
                {calendarURL: event.data.calendarURL},
                (response) => {
                    window.postMessage({calendarDom: response}, '*');
                }
            );
        }
    }, false);
}

function injectVue() {
    let links = document.createElement('link');
    links.setAttribute('rel', 'stylesheet');
    links.setAttribute('href', chrome.extension.getURL('js/vue/index.css'));
    document.head.appendChild(links);
    injectCustomJs('js/vue/vue.js');
    injectCustomJs('js/vue/index.js');
}

function XKYZM() {
    let yzm_area = $('#yzm_area');
    if (yzm_area.css('display') !== 'none') {
        let img = yzm_area.children('img')[0];
        let input = yzm_area.children('input');

        let mutex = false;

        function YZM_init() {
            img.onload = () => {
                setYZM();
            };
            setYZM();
        }

        function setYZM() {
            if (mutex)
                return;
            mutex = true;
            chrome.runtime.sendMessage(
                {ImageData: imRead(img)},
                function (response) {
                    input.val(response);
                    mutex = false;
                }
            );
        }

        YZM_init();
    }
}

function indexjs() {
    if (window.location.pathname.startsWith('/login')) return;//如果是登录界面则不进行注入
    getOption((Option) => {
        if (!Option.URPSwitch) return;
        injectCustomJs('js/urp/inject.js'); //页面注入js
        showVersion();
        if (Option.CalendarSwitch || Option.GradePointSwitch) injectVue();
        if (Option.CalendarSwitch) showCalendar();
        if (Option.YJPJSwitch && window.location.pathname.startsWith('/student/teachingEvaluation/evaluation/index')) addYJPJ();//添加一键评教按钮
        if ((window.location.pathname === '/' || window.location.pathname.startsWith('/index.jsp')) && Option.GradePointSwitch) addShowGPA(); //添加绩点计算
        if (Option.XKYZMSwitch && window.location.pathname.startsWith('/student/courseSelect/courseSelect/index')) XKYZM();//自动填写选课验证码
    });
}
