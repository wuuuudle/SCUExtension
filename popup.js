Vue.component('menu_trees', {
    props: ['tree_data', 'style_data', 'switch_value'],
    template:
        '<div>' +
        '      <el-col :span="style_data[tree_data.id].span" :offset="style_data[tree_data.id].offset">\n' +
        '          <div :id="\'Text\'+tree_data.Switch" :style="style_data[tree_data.id].style">{{tree_data.name}}\n' +
        '              <el-switch\n' +
        '                      v-model="switch_value[tree_data.Switch]"\n' +
        '                      active-color="#51ccee"\n' +
        '                      inactive-color="#bdbdbd"\n' +
        '                      @change="subChangeStatus($event,tree_data.Switch)"' +
        '                      :disabled="tree_data.disabled">\n' +
        '              </el-switch>\n' +
        '          </div>\n' +
        '      </el-col>' +
        '      <template v-if="tree_data.children && switch_value[tree_data.Switch]">' +
        '          <menu_trees v-for="(item,index) in tree_data.children" :key="index" ' +
        '                      :tree_data="item" ' +
        '                      :style_data="style_data" ' +
        '                      :switch_value="switch_value"' +
        '                      @change_status="subChangeStatus">' +
        '          </menu_trees>' +
        '      </template>' +
        '</div>',
    methods: {
        subChangeStatus: function (value, name) {
            this.$emit('change_status', value, name)
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        SwitchValue: {},
        cc_id: '',
        menutrees_data: {
            name: '总开关',
            Switch: 'MasterSwitch',
            id: 0,
            disabled: false,
            children: [{
                name: '教务管理系统',
                Switch: 'URPSwitch',
                id: 1,
                disabled: false,
                children: [{
                    name: '两周内免登录',
                    Switch: 'LoginTwoWeekSwitch',
                    id: 2,
                    disabled: false,
                }, {
                    name: '自动填写登录验证码',
                    Switch: 'LoginYZMSwitch',
                    id: 2,
                    disabled: false,
                }, {
                    name: '选课验证码过滤',
                    Switch: 'XKYZMSwitch',
                    id: 2,
                    disabled: true,
                }, {
                    name: '绩点计算增强',
                    Switch: 'GradePointSwitch',
                    id: 2,
                    disabled: false,
                }, {
                    name: '一件评教',
                    Switch: 'YJPJSwitch',
                    id: 2,
                    disabled: false,
                }],
            }, {
                name: '课程中心',
                Switch: 'CCSwitch',
                id: 1,
                disabled: false,
                children: [{
                    name: '修复按钮失效',
                    Switch: 'RepairSwitch',
                    id: 2,
                    disabled: false,
                }],
            }],
        },
        style_data: [
            {span: 24, offset: 0, style: 'font-size: 20px;color: #bdbdbd;'},
            {span: 22, offset: 2, style: 'font-size: 15px;color: #bdbdbd;'},
            {span: 20, offset: 4, style: 'font-size: 12px;color: #bdbdbd;'}]
    },
    mounted: function () {
        this.LoadOption();
    },
    methods: {
        changeStatus: function (value, name) {
            let temp = {};
            temp[name] = value;
            chrome.storage.sync.set(temp, this.LoadOption);
        },
        LoadOption: function () {
            getOption((Option) => {
                this.SwitchValue = Option;
                setTimeout(() => {
                    for (let item in this.SwitchValue) {
                        if (this.SwitchValue[item])
                            $('#Text' + item).css('color', '#51ccee');
                        else
                            $('#Text' + item).css('color', '#bdbdbd');
                    }
                }, 10);
            });
            getCC_id((Option) => {
                this.cc_id = Option;
            })
        }
    }
});
