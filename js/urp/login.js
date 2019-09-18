getOption((Option) => {
    if (Option.URPSwitch)
        loadingSuccess();
    if (Option.LoginTwoWeekSwitch)
        loginjs();
    if (Option.LoginYZMSwitch)
        YZM_init();
});

function loadingSuccess() {
    let Footer = document.querySelector('#formFooter');
    Footer.innerHTML += '<br><s style="color: #56baed; font-size:0.8em">SCUExtension加载成功</s>';
}

function loginjs() {

    let twoweek = document.createElement("input");
    twoweek.setAttribute('name', '_spring_security_remember_me');
    twoweek.setAttribute('value', 'on');
    twoweek.setAttribute('type', 'hidden');
    document.querySelector('form.form-signin').append(twoweek);


    let loginButton = document.querySelector('#loginButton');
    let ss = document.createElement("b");
    ss.innerText = '两周内免登录';
    ss.setAttribute('style', 'color:#218868; font-size:1.2em');
    loginButton.parentNode.insertBefore(ss, loginButton);
    loginButton.parentNode.insertBefore(document.createElement('br'), loginButton);
    ss.parentNode.insertBefore(document.createElement('br'), ss);
}

let mutex = false;

function YZM_init() {
    document.getElementById('captchaImg').onload = () => {
        setYZM();
    };
    setYZM();
}

function setYZM() {
    if (mutex)
        return;
    mutex = true;
    chrome.runtime.sendMessage(
        {ImageData: imRead('captchaImg')},
        function (response) {
            $('#input_checkcode').val(response);
            mutex = false;
        }
    );
}



