function getOption(callback) {
    chrome.storage.sync.get({
        MasterSwitch: true,
        URPSwitch: true,
        LoginTwoWeekSwitch: false,
        XKYZMSwitch: false,
        YJPJSwitch: true,
        GradePointSwitch: true,
        CCSwitch: true,
        RepairSwitch: true,
        injectSwitch: true,
        fatherTree: {
            MasterSwitch: null,
            URPSwitch: 'MasterSwitch',
            LoginTwoWeekSwitch: 'URPSwitch',
            XKYZMSwitch: 'URPSwitch',
            YJPJSwitch: 'URPSwitch',
            GradePointSwitch: 'URPSwitch',
            CCSwitch: 'MasterSwitch',
            RepairSwitch: 'CCSwitch',
            injectSwitch: 'CCSwitch'
        }
    }, function (items) {
        let data = {};
        let func = (name) => {
            if (name == null) return true;
            if (!items[name]) return false;
            return items[name] && func(items.fatherTree[name]);
        };
        for (let item in items) {
            if (item.endsWith('Switch'))
                data[item] = func(item);
        }
        callback(data);
    });
}

function getCC_id(callback) {
    chrome.storage.sync.get({
        CC_id: '',
    }, function (items) {
        callback(items.CC_id);
    });
}