jQuery(document).ready(function ($) {

    class collapsibleAreaClass extends HTMLElement {
        changeTitle(title){
            $(this).find('.collapse-button').find('p')[0].innerText = title;
            $(this).attr('title', title);
        }
        openCollapse() {
            var w, l, h;
            if (this.orientation == 'vertical') {
                w = $(this).find(".collapse-height");
                l = $(this).find(".collapse-height").find(".inner");
                w.addClass('open');
                h = l.outerHeight();
                w.css("height", h);
            } else {
                w = $(this).find(".collapse-width");
                l = $(this).find(".collapse-width").find(".inner");
                w.addClass('open');
                h = l.outerWidth();
                w.css("width", h);
            }
        }
        closeCollapse() {
            var w;
            if (this.orientation == 'vertical') {
                w = $(this).find(".collapse-height");
                w.removeClass('open');
                w.height(0);
            } else {
                w = $(this).find(".collapse-width");
                w.removeClass('open');
                w.width(0);
            }
        }
        toggleCollapse() {
            if (this.open)
                this.closeCollapse();
            else this.openCollapse();
        }
        constructor() {
            super();
            Object.defineProperty(this, 'open', {
                get() {
                    if (this.orientation == 'vertical')
                        return $(this).find(".collapse-height").hasClass('open');
                    else
                        return $(this).find(".collapse-width").hasClass('open');
                },
                set(v) {
                    if(v)
                        this.openCollapse();
                    else
                        this.closeCollapse();
                }
            });
            this._orientation = 'vertical';
            Object.defineProperty(this, 'orientation', {
                get() {
                    return this._orientation;
                },
                set(v) {
                    if (v == 'vertical') {
                        this._orientation = v;
                        $(this).css("flex-direction", "column");
                        $(this).find('.collapse-button').find('p').css('writing-mode', 'lr-tb');
                        $(this).find('.collapse-width')
                            .removeClass('collapse-width')
                            .addClass('collapse-height');
                        $(this).find('.fill-width')
                            .removeClass('fill-width')
                            .addClass('fill-height');
                    } else if (v == 'horizontal') {
                        $(this).css("flex-direction", "row");
                        $(this).find('.collapse-button').find('p').css('writing-mode', 'tb-rl');
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
                <p>List</p>
            </button>
            <div class="collapse-height">
                <div class="inner" style="min-width:10px; min-height:10px;flex-grow:0">
            `+
                this.innerHTML +
                `   </div>
            </div>
            `;

            this.toggleCollapse = this.toggleCollapse.bind(this);
            this.openCollapse = this.openCollapse.bind(this);
            this.closeCollapse = this.closeCollapse.bind(this);
            this.changeTitle = this.changeTitle.bind(this);

            var b = $(this).find(".collapse-button");

            b.click(this.toggleCollapse);

            var orient = this.getAttribute('orientation');
            if (orient)
                this.orientation = orient;
            else
                this.orientation = this.orientation;

            if($(this).attr('title'))
                this.changeTitle($(this).attr('title'));

            $(this).css("display", "flex");
            this.open = this.open;
        }

    }
    customElements.define('collapsible-area', collapsibleAreaClass);
});