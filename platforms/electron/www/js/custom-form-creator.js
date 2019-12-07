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
        RecalculatePosition(item){
            this.SetSize(item);
            this.SetPos(item);
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
        GetSize(ele){
            var container = $(this);
            var width = 100 * $(ele).outerWidth() / container.innerWidth() + '%';
            var height = 100 * $(ele).outerHeight() / container.innerHeight() + '%';
            return {width:width,height:height};
        }
        SetSize(ele){
            var size = this.GetSize(ele);
            $(ele).css('width', size.width);
            $(ele).css('height', size.height);
        }
        GetPos(ele){
            var l = (100 * parseFloat($(ele).position().left / parseFloat($(ele).parent().width()))) + "%";
            var t = (100 * parseFloat($(ele).position().top / parseFloat($(ele).parent().height()))) + "%";
            return {left:l, top:t};
        }
        SetPos(ele){
            var pos = this.GetPos(ele);
            $(ele).css("left", pos.left);
            $(ele).css("top", pos.top);
        }
        CreateTestFormItem(formtype, l,t, w, h,i){
            
            var val = "$"+String.fromCharCode(i+65)+":30";
            if(i>0){
                val+="+$"+String.fromCharCode(i+64);
            }
            this.AddFormItem(formtype,l,t,w,h);
            var item = $(this).children().last();
            item.find('textarea').val(val);
                
            this.SetSize(item);
            this.SetPos(item);
        }
        AddFormItem(formtype,l,t,w,h) {
            var container = $(this);
            var formEl;
            //don't forget to put the inputs class on internal double-inputs
            if (formtype == 'image')
                formEl = `<image class="fill-parent draggable-item"></image>`;//dont use img. we wwant to be able to display svg too. because why not
            else if (formtype == 'dropdown')
                formEl = `<drop-down class="fill-parent draggable-item">
                    <input-list></input-list>
                </drop-down>`;
            else if (formtype == 'list')
                formEl = `<input-list class="fill-parent draggable-item">
                    <double-input class="inputs"></double-input>
                    <double-input class="inputs"></double-input>
                </input-list>`;
            else if (formtype == 'checklist')
                formEl = `<checklist class="fill-parent draggable-item"></checklist>`;
            else if (formtype == 'radiolist')
                formEl = `<radiolist class="fill-parent draggable-item"></radiolist>`;
            else//(!formtype || formtype == 'input') 
                formEl = `<double-input class="fill-parent inputs draggable-item"></double-input>`;
            
            $(this).append(`
            <div class="draggable unset movable-on-config" style="width:100px;height:1.5em;padding:5px;">
                <div class="draggable-handle show-on-config shown">&nbsp</div>
                `+formEl+`
            </div>`);

            var newitem = $(this).find('.unset');
            $(newitem).removeClass('unset');

            newitem.css("top", t)
                .css("left", l)
                .css("width", w)
                .css("height", h);

            this.SetSize(newitem);
            this.SetPos(newitem);

            newitem
                .draggable({
                    containment: 'parent',
                    drag: (e,ui)=>{
                        var pos = this.GetPos(ui.helper[0]);
                        this.BoundsChanged(
                        { 
                            top:pos.top, 
                            left:pos.left, 
                            width:ui.helper[0].style.width,
                            height:ui.helper[0].style.height 
                        });
                    },
                    stop: container[0].SetPos.bind(container, newitem)
                })
                .resizable({
                    stop: container[0].SetSize.bind(container, newitem),
                    resize: (e,ui)=>{
                        var size = this.GetSize(ui.helper[0]);
                        this.BoundsChanged(
                        { 
                            top:ui.helper[0].style.top,//$(this)[0].style.top, 
                            left:ui.helper[0].style.left, 
                            width:size.width,
                            height:size.height 
                        });
                    },
                });
        }
        BoundsChanged(bounds){
            //fire event
            //bounds should be top,left,width,height
            this.dispatchEvent(new Event('bounds-changed', {bounds:bounds, element:this} ));
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

            this.GetPos = this.GetPos.bind(this);
            this.GetSize = this.GetSize.bind(this);
            this.SetPos = this.SetPos.bind(this);
            this.SetSize = this.SetSize.bind(this);
            this.DisableConfig = this.DisableConfig.bind(this);
            this.EnableConfig = this.EnableConfig.bind(this);
            this.AddFormItem = this.AddFormItem.bind(this);
            this.CreateTestFormItem = this.CreateTestFormItem.bind(this);
            this.RecalculatePosition = this.RecalculatePosition.bind(this);
            this.BoundsChanged = this.BoundsChanged.bind(this);
            //this.export = this.export.bind(this);
            // this.import = this.import.bind(this);
            this.innerHTML = `
                <button class="add-item round label show-on-config" style="display:inline-block; position:absolute; right:10px; bottom:10px; width:40px; height:40px; font-size:40px">
                </button>
            `;
            $(this).find('.add-item').on('click', this.AddFormItem);

            //jsut for testing purposes

            setTimeout(() => {
                
                this.CreateTestFormItem(null,150, 0*50, 100, '1.5em',0);
                this.CreateTestFormItem(null,150, 1*50, 100, '1.5em',1);
                this.CreateTestFormItem(null,150, 2*50, 100, '1.5em',2);
                this.CreateTestFormItem(null,150, 3*50, 100, '1.5em',3);
                this.CreateTestFormItem('list',150, 4*50, 150,'4.5em',4);
                this.CreateTestFormItem('dropdown',50, 5*50, 150,50,5);
            
                this.DisableConfig();
            }, 500);
        }

    }
    customElements.define('custom-form-creator', customFormCreatorClass);
});