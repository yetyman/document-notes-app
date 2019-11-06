jQuery(document).ready(function ($) {

    class collapsibleAreaClass extends HTMLElement {
        toggleCollapse () {
            var w,l,h;
            if(this.orientation=='vertical'){
                w = $(this).find(".collapse-height");
                l = $(this).find(".collapse-height").find(".inner");
        
                if (w.hasClass('open')) {
                    w.removeClass('open');
                    w.height(0);
                } else {
                    w.addClass('open');
                    h = l.outerHeight();
                    w.css("height", h);
                }
            }else{
                w = $(this).find(".collapse-width");
                l = $(this).find(".collapse-width").find(".inner");
        
                if (w.hasClass('open')) {
                    w.removeClass('open');
                    w.width(0);
                } else {
                    w.addClass('open');
                    h = l.outerWidth();
                    w.css("width", h);
                }
            }
        }
        constructor() {
            super();
            
            this._orientation = 'vertical';
            Object.defineProperty(this, 'orientation', {
                get() {
                    return this._orientation;
                },
                set(v) {
                    if(v == 'vertical'){
                        this._orientation = v;
                        $(this).css("flex-direction", "column");
                        $(this).find('.collapse-width')
                            .removeClass('collapse-width')
                            .addClass('collapse-height');
                        $(this).find('.fill-width')
                            .removeClass('fill-width')
                            .addClass('fill-height');
                    }else if(v=='horizontal'){
                        $(this).css("flex-direction", "row");
                        this._orientation = v;
                        $(this).find('.collapse-height')
                            .removeClass('collapse-height')
                            .addClass('collapse-width');
                        $(this).find('.fill-height')
                            .removeClass('fill-height')
                            .addClass('fill-width');
                    }
                }
            });

        }
        connectedCallback() {
            this.innerHTML = `
            <button class="collapse-button" type="button" style="flex-grow:0">
                List
            </button>
            <div class="collapse-height">
                <div class="inner" style="min-width:10px; min-height:10px;flex-grow:0">
                    <ul><li>hello</li></ul>
                </div>
            </div>
            `;
            
            this.toggleCollapse = this.toggleCollapse.bind(this);
           
            var b = $(this).find(".collapse-button");
            
            b.click(this.toggleCollapse);
        
            var orient = this.getAttribute('orientation');
            if(orient)
            this.orientation = orient;
            else
            this.orientation = this.orientation;
            $(this).css("display", "flex");
        }

    }
    customElements.define('collapsible-area', collapsibleAreaClass);
});