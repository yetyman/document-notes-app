
jQuery(document).ready(function ($) {

    class customFormCreatorClass extends HTMLElement {
        //PossibleResize() {
        //    var w = $(this).width();
        //    var h = $(this).height();
        //    if (w != this.W || h != this.H) {
        //        this.Reposition();
        //    }
        //    this.W = w;
        //    this.H = w;
        //}
        Reposition() {
            //hopefully this will all be automatic with percentages.
            //but either(not both) resizing or repositioning could be requiredx
        }
        DisableConfig(object) {
            if(!object)
                object = '.draggable';
            $(object).draggable('disable');
            $(object).resizable('disable');
            $('.show-on-config').removeClass('shown');
        }
        EnableConfig(object) {
            if(!object)
                object = '.draggable';
            $(object).draggable('enable');
            $(object).resizable('enable');
            $('.show-on-config').addClass('shown');
        }
        AddFormItem() {
            var container = $(this);
            $(this).append(`
            <div class="draggable unset movable-on-config" style="width:100px;height:1.5em;padding:5px;">
                <div class="draggable-handle show-on-config shown">&nbsp</div>
                <double-input class="fill-parent inputs draggable-item"></double-input>
            </div>`);

            var newitem = $(this).find('.unset');
            $(newitem).removeClass('unset');
            
            var setsize = (ele) => {
                var cellPercentWidth = 100 * $(ele).outerWidth() / container.innerWidth();
                var cellPercentHeight = 100 * $(ele).outerHeight() / container.innerHeight();
                $(ele).css('width', cellPercentWidth + '%');
                $(ele).css('height', cellPercentHeight + '%');
            };
            var setpos = (ele) => {
                var l = (100 * parseFloat($(ele).position().left / parseFloat($(ele).parent().width()))) + "%";
                var t = (100 * parseFloat($(ele).position().top / parseFloat($(ele).parent().height()))) + "%";
                $(ele).css("left", l);
                $(ele).css("top", t);
            };

            setsize(newitem);
            setpos(newitem);

            newitem
                .draggable({
                    containment: 'parent',

                    stop: function (event, ui) {
                        //update this form item in the dictionary of form items
                        setpos(this);
                    },
                })
                .resizable({
                    stop: function (event, ui) {
                        setsize(this);
                    }
                });
        }
        constructor() {
            super();
            
            Object.defineProperty(this, 'configuring', {
                get() {
                    if (!this.isConfiguring) this.isConfiguring = false;
                    return this.isConfiguring;
                },
                set(v) {
                    this.isConfiguring = v;
                    if (this.isConfiguring) {
                        this.EnableConfig($('.movable-on-config'));
                    } else {
                        this.DisableConfig($('.movable-on-config'));
                    }
                }
            });

        }

        connectedCallback() {
            if (!$("link[href='css/custom-form.css']").length)
                $('<link href="css/custom-form.css" rel="stylesheet">').appendTo("head");

            this.DisableConfig = this.DisableConfig.bind(this);
            this.EnableConfig = this.EnableConfig.bind(this);
            this.AddFormItem = this.AddFormItem.bind(this);
            //this.export = this.export.bind(this);
            // this.import = this.import.bind(this);
            this.innerHTML = `
                <button class="add-item round label show-on-config" style="display:inline-block; position:absolute; right:10px; bottom:10px; width:40px; height:40px; font-size:40px">
                </button>
            `;
            $(this).find('.add-item').on('click', this.AddFormItem);

            //jsut for testing purposes
            this.AddFormItem();
            $(this).children().last()
                .css("top", "30")
                .find('textarea').val("$hi:30");
            this.AddFormItem();
            $(this).children().last()
                .css("top", "100")
                .find('textarea').val("$h:100");
            this.AddFormItem();
            $(this).children().last()
                .css("top", "250")
                .find('textarea').val("$g:$hi+$h");
            this.AddFormItem();
            $(this).children().last()
                .css("top", "300")
                .find('textarea').val("300");

            this.DisableConfig();
        }

    }
    customElements.define('custom-form-creator', customFormCreatorClass);
});