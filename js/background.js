let model = null;
const characters = '0123456789abcdefghijklmnopqrstuvwxyz';

async function load_model() {
    model = await tf.loadLayersModel(chrome.extension.getURL('model/model.json'));
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
    if (Option.LoginYZMSwitch) {
        load_model().then();
    }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    getOption((Option) => {
        if (Option.LoginYZMSwitch) {
            if (request.ImageData) {
                if (model == null) {
                    load_model().then(() => {
                        sendResponse(recaptcha(request.ImageData))
                    });
                } else {
                    sendResponse(recaptcha(request.ImageData));
                }
            }
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






