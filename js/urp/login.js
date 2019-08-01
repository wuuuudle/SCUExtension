getOption((Option) => {
    if (Option.LoginTwoWeekSwitch)
        loginjs();
    if (Option.LoginYZMSwitch)
        setTimeout(YZM_init, 800);
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

    return tf.browser.fromPixels(ctx.getImageData(0, 0, canvas.width, canvas.height)).asType('float32').div(255).as4D(1, 60, 180, 3);
}

const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
let model = null;

async function YZM_init() {
    model = await tf.loadLayersModel(chrome.extension.getURL('model/model.json'));
    document.getElementById('captchaImg').onload = () => {
        setYZM();
    };
    setYZM();
}


function setYZM() {
    let captcha = tf.tidy(() => {
        let data = imRead('captchaImg');
        let predict = model.predict(data);
        return predict.reduce((data, item) => {
            return data + characters[item.as1D().argMax().arraySync()];
        }, '');
    });
    $('#input_checkcode')[0].value = captcha;
}



