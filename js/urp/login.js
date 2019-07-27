getOption((Option) =>
{
    if(Option.LoginTwoWeekSwitch)
        loginjs();
});
function loginjs()
{
    var Footer = document.querySelector('#formFooter');
    Footer.innerHTML += '<br><s style="color: #56baed; font-size:0.8em">SCUExtension加载成功</s>';


    var twoweek = document.createElement("input");
    twoweek.setAttribute('name', '_spring_security_remember_me');
    twoweek.setAttribute('value', 'on');
    twoweek.setAttribute('type', 'hidden');
    document.querySelector('form.form-signin').append(twoweek);


    var loginButton = document.querySelector('#loginButton');
    var ss = document.createElement("b");
    ss.innerText = '两周内免登录';
    ss.setAttribute('style', 'color:#218868; font-size:1.2em');
    loginButton.parentNode.insertBefore(ss, loginButton);
    loginButton.parentNode.insertBefore(document.createElement('br'), loginButton);
    ss.parentNode.insertBefore(document.createElement('br'), ss);
}



