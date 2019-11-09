jQuery(document).ready(function ($) {

    class InputListClass extends HTMLElement {
        constructor() {
            super();


        }
        connectedCallback() {
            this.innerHTML = `
            <double-input class="inputs" style="align-self:stretch; flex-grow:1; position:relative"></double-input>
            <double-input class="inputs" style="align-self:stretch; flex-grow:1; position:relative"></double-input>
            <div style="align-self:stretch; flex-grow:1; flex-basis:1px; display:flex; flex-direction:row; justify-content:space-between;">
                <button class="subtract round" style="flex-grow:0">-</button>
                <button class="add round" style="flex-grow:0">+</button>
            </div>
            `;

            //this.toggleCollapse = this.toggleCollapse.bind(this);
            
            $(this).css("display", "flex");
            $(this).css("flex-direction", "column");
            $(this).find('.subtract').on('click',(i)=>{
                if($(i.target).parent().prev())
                    $(i.target).parent().prev().remove();
                //TODO: resize parent. 
                var dcontainer = $(this).parents('.draggable')[0];
                if(dcontainer){
                    var l = $(this).children().length;
                    var deltaProportion = (l)/(l+1);
                    var h = dcontainer.style.height;
                    var to = h.slice(0,-1)*deltaProportion+'%';
                    dcontainer.style.height=to;
                }
            });
            $(this).find('.add').on('click',(i)=>{
                var container = $(this);
                $(i.target).parent().before(`<double-input class="inputs" style="align-self:stretch; flex-grow:1; position:relative"></double-input>`);
                
                var dcontainer = $(this).parents('.draggable')[0];
                if(dcontainer){
                    var l = $(this).children().length;
                    var deltaProportion = (l)/(l-1);
                    var h = dcontainer.style.height;
                    var to = h.slice(0,-1)*deltaProportion+'%';
                    dcontainer.style.height=to;
                }
            });
        }

    }
    customElements.define('input-list', InputListClass);
});