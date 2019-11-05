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
        connectedCallback() {
            if (!$("link[href='css/custom-form.css']").length)
                $('<link href="css/custom-form.css" rel="stylesheet">').appendTo("head");
           
                //TODO: why not add that it also switches on hover? you just need a flag to make sure that if it is already focused it doesnt go away on hover out.
            this.setFocusText = this.setFocusText.bind(this);
            this.setUnfocusText = this.setUnfocusText.bind(this);
            this.getFocusText = this.getFocusText.bind(this);
            this.getUnfocusText = this.getUnfocusText.bind(this);
            this.innerHTML = `
                <input class="fill-parent show-on-focus"></input>
                <input class="fill-parent show-on-focusout shown"></input>
            `;
            var focusing = false;
            var focused = ()=>{
                if(!focusing){
                    focusing = true;
                    $(this).find(".show-on-focus").addClass('shown');
                    $(this).find(".show-on-focus").focus();
                    $(this).find(".show-on-focusout").removeClass('shown');
                    focusing = false;
                }
            }
            var focusouted = ()=>{
                if(!focusing){
                    focusing = true;
                    $(this).find(".show-on-focusout").focus();
                    $(this).find(".show-on-focus").removeClass('shown');
                    $(this).find(".show-on-focusout").addClass('shown');
                    focusing = false;
                }
            }
            $(this).find(".show-on-focus").focus(focused);
            $(this).find(".show-on-focusout").focus(focused);
            $(this).find(".show-on-focus").focusout(focusouted);
            $(this).find(".show-on-focusout").focusout(focusouted);
        }

    }
    customElements.define('double-input', doubleInputClass);
});