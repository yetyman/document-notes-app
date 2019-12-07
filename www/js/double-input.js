jQuery(document).ready(function ($) {

    class doubleInputClass extends HTMLElement {
        constructor() {
            super();
        }
        setFocusText(string){
            $(this).find(".show-on-focus").val(string);
        }
        setUnfocusText(string){
            $(this).find(".show-on-focusout").val(string);
        }
        getFocusText(){
            return $(this).find(".show-on-focus").val();
        }
        getUnfocusText(){
            return $(this).find(".show-on-focusout").val();
        }
        hideOptions(){
            $(this).find('.option-area').fadeOut(200);
        }
        showOptions(){
            //option areas are position absolute. it shouldnt matter when fading in and out change its layout.
            $(this).find('.option-area').fadeIn(200);
        }
        setLeftOption(ele){
            var c = $(this).find('.left').filter('.option-area');
            this.setOption(c, ele);
        }
        setRightOption(ele){
            var c = $(this).find('.right').filter('.option-area');
            this.setOption(c, ele);
        }
        setOption(container, ele){
            //set bounds to fill option area unless already set
            ele = $(ele);
            if(!(ele.css('left') || ele.css('right') || ele.css('width'))){
                ele.addClass('fill-width');
            }
            if(!(ele.css('height') || ele.css('top') || ele.css('bottom'))){
                ele.addClass('fill-height');
            }

            while(container[0].hasChildNodes())
                container[0].removeChild(container[0].firstChild);

            container[0].appendChild(ele[0]);
        }
        connectedCallback() {
            if (!$("link[href='css/custom-form.css']").length)
                $('<link href="css/custom-form.css" rel="stylesheet">').appendTo("head");
           
                //TODO: why not add that it also switches on hover? you just need a flag to make sure that if it is already focused it doesnt go away on hover out.
            this.setFocusText = this.setFocusText.bind(this);
            this.setUnfocusText = this.setUnfocusText.bind(this);
            this.getFocusText = this.getFocusText.bind(this);
            this.getUnfocusText = this.getUnfocusText.bind(this);
            this.hideOptions = this.hideOptions.bind(this);
            this.showOptions = this.showOptions.bind(this);
            this.setLeftOption = this.setLeftOption.bind(this);
            this.setRightOption = this.setRightOption.bind(this);
            this.setOption = this.setOption.bind(this);
            if(this.innerHTML.length == 0)
                this.innerHTML = `
                    <textarea class="fill-parent show-on-focus">{{raw}}</textarea>
                    <textarea class="fill-parent show-on-focusout shown" style="transition:opacity 50"></textarea>
                    <div class="option-area left" style="box-sizing:border-box; width:.25in; height:.25in; position:absolute; top:0; left:0; margin-left:-.25in"></div>
                    <div class="option-area right" style="box-sizing:border-box; width:.25in; height:.25in; position:absolute; top:0; right:0; margin-right:-.25in"></div>
                    `;
            else{
                console.log('hi');
            }
            this.valueChanged = new CustomEvent('valueChanged', {bubbles:true});
            

            this.id = createGuid();
            var rawBinding = new Vue({
               // el: '#'+this.id,
               // props: ['raw']
            });

            var focused = (()=>{
                if(!this.focusing){
                    this.focusing = true;
                    $(this).find(".show-on-focusout").removeClass('shown');
                    $(this).find(".show-on-focusout").addClass('hide');
                    $(this).find(".show-on-focus").addClass('shown');
                    //infinite loop somehow.
                    $(this).find(".show-on-focus").focus();
                    this.focusing = false;
                }
            }).bind(this);
            var focusouted = (()=>{
                $(this).find(".show-on-focusout").removeClass('hide');
                $(this).find(".show-on-focus").removeClass('shown');
                $(this).find(".show-on-focusout").addClass('shown');
                if(this.valueChanged)
                    this.dispatchEvent(this.valueChanged);
            }).bind(this);
            $(this).find(".show-on-focus").focus(focused);
            $(this).find(".show-on-focusout").focus(focused);
            $(this).find(".show-on-focus").focusout(focusouted);
        }

    }
    customElements.define('double-input', doubleInputClass);
});