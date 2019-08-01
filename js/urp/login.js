getOption((Option) => {
    if (Option.LoginTwoWeekSwitch)
        loginjs();
    if (Option.LoginYZMSwitch)
        YZM_init();
});

function loginjs() {
    let Footer = document.querySelector('#formFooter');
    Footer.innerHTML += '<br><s style="color: #56baed; font-size:0.8em">SCUExtension加载成功</s>';


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

function imRead(imageSource) {
    let img = null;
    img = document.getElementById(imageSource);

    let canvas = null;
    let ctx = null;

    canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 60;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 180, 60);
    let temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let array = nShapeArray(null, 1, 60, 180, 3);
    array[0].forEach((value, item1, arr) => {
        arr[item1].forEach((value, item2, arr) => {
            arr[item2].forEach((value, item3, arr) => {
                arr[item3] = temp.data[4 * (item1 * 180 + item2) + item3] / 255.0;
            })
        });
    });
    return array;
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
            $('#input_checkcode')[0].value = response;
            mutex = false;
        }
    );
}



