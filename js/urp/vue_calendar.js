setTimeout(() => {
    let vueCalendar = new Vue({
        el: '#calendarList',
        data: {
            list: []
        },
        mounted: function () {
            window.postMessage({getCalendarList: true}, '*');
            window.addEventListener('message', (event) => {
                if (event.data.calendarList) {
                    this.list = event.data.calendarList;
                } else if (event.data.calendarDom) {
                    let s = document.createElement('div');
                    s.innerHTML = event.data.calendarDom;

                    while (s.getElementsByTagName('script').length) {
                        console.log(s.getElementsByTagName('script'));
                        let child = s.getElementsByTagName('script')[0];
                        child.parentNode.removeChild(child);
                    }
                    console.log(s.getElementsByTagName('img'));
                    $('#calendar_details_modal .modal-content').html(s);
                    $('#calendar_details_modal .modal-content img').remove();
                }
            }, false);
        },
        methods: {
            handleCommand(command) {
                var modal = addslidersModel("calendar_details_modal", "75%");
                modal.modal().on('hide.bs.modal', function () {
                    modal.remove();
                });
                window.postMessage({calendarURL: command}, '*');
            }
        }
    });
}, 200);
