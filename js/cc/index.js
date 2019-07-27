getOption((Option) =>
{
    if (Option.RepairSwitch)
        $('.menubg')[0].setAttribute('style', 'position: relative;');
});

function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'js/cc/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = chrome.extension.getURL(jsPath);
    document.head.appendChild(temp);
}
