let model = null;
const characters = '0123456789abcdefghijklmnopqrstuvwxyz';

async function load_model(isInit) {
    model = await tf.loadLayersModel(chrome.extension.getURL('model/model.json'));
    if (isInit)
        tf.tidy(() => {
            model.predict(tf.tensor4d(nShapeArray(1, 1, 60, 180, 3)));
        });
}

function recaptcha(ImageData) {
    return tf.tidy(() => {
        let data = tf.tensor4d(ImageData);
        let predict = model.predict(data);
        return predict.reduce((data, item) => {
            return data + characters[item.as1D().argMax().arraySync()];
        }, '');
    });
}

//初次加载，如果已勾选。将model载入内存
getOption((Option) => {
    if (Option.LoginYZMSwitch || Option.XKYZMSwitch) {
        load_model(true).then();
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    getOption((Option) => {
        if (Option.LoginYZMSwitch || Option.XKYZMSwitch) {
            if (request.ImageData) {
                if (model == null) {
                    load_model(true).then(() => {
                        sendResponse(recaptcha(request.ImageData))
                    });
                } else {
                    sendResponse(recaptcha(request.ImageData));
                }
            }
        }
        if (request.getCalendarList) {
            $.get('http://jwc.scu.edu.cn/article/206/206_1.htm', (response) => {
                sendResponse($.map($(response).find('ul li div h5 a'), (e) => {
                    let dom = $(e);
                    return {text: dom.text(), url: dom.attr('href')}
                }));
            });
        }
        if (request.calendarURL) {
            $.get(request.calendarURL, (response) => {
                // sendResponse($.map($(response).find('table'), (e) => {
                //     console.log({a: e});
                //     return e.innerHTML;
                // }));
                sendResponse(response);
            });
        }
    });
    return true;
});


chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'update') {
        $.getJSON(chrome.extension.getURL('information.json'), function (data) {
            let Version = data.version_name + '-' + data.version;
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'img/logo.png',
                title: 'SCUExtension插件已更新',
                message: '当前版本:' + Version
            });
        });
    }
});






