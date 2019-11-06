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
                        $(this).find('.collapse-width')
                            .removeClass('collapse-width')
                            .addClass('collapse-height');
                        $(this).find('.fill-width')
                            .removeClass('fill-width')
                            .addClass('fill-height');
                    }else if(v=='horizontal'){
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
            <button class="collapse-button" type="button">
                List
            </button>
            <div class="collapse-height">
                <div class="inner">
                    <ul><li>hello</li></ul>
                </div>
            </div>
            `;
            
            this.toggleCollapse = this.toggleCollapse.bind(this);
           
            var b = $(this).find(".collapse-button");
            
            b.click(this.toggleCollapse);
        
            this.orientation = this.getAttribute('orientation');
        }

    }
    customElements.define('collapsible-area', collapsibleAreaClass);
});