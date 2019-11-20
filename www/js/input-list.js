jQuery(document).ready(function ($) {
    $.fn.stylesList = function () {
        var $this = this;

        var i = -1;
        var obj = {};
        while ($this[0].style[++i])
            obj[$this[0].style[i]] = $this[0].style[$this[0].style[i]];

        return obj;
    };
    $.fn.applyStyles = function (stylesList) {
        var $this = this;
        for (var k in stylesList) {
            $this.css(k, stylesList[k]);
        }
    };
    $.fn.clearStyles = function () {
        var $this = this;
        $this.attr("style", "");
    };
    $.fn.swapStyles = function (that) {
        var $this = this;
        var $that = $(that);

        var stylesA = $this.stylesList();
        var stylesB = $that.stylesList();
        $this.clearStyles();
        $that.clearStyles();
        $this.applyStyles(stylesB);
        $that.applyStyles(stylesA);

    };
    $.fn.swapClasses = function (that) {
        var $this = this;
        var $that = $(that);
        var a = $this[0].classList;
        var b = $that[0].classList;
        $this.classList = b;
        $that.classList = a;
    };
    $.fn.swapWith = function (that) {
        var $this = this;
        if (that) {
            var $that = $(that);


            $this.swapStyles($that);
            $this.swapClasses($that);
            // create temporary placeholder
            var $temp = $("<div>");

            // 3-step swap
            $this.before($temp);
            $that.before($this);
            $temp.after($that).remove();

            return $this;
        }
    };
    jQuery.fn.any = function (filter) {
        for (i = 0; i < this.length; i++) {
            if (filter.call(this[i])) return true;
        }
        return false;
    };
    class InputListClass extends HTMLElement {

        matchElements(arr1, arr2) {
            var results = [];
            for (var i = 0; i < arr2.length; i++)
                if (!$(arr1).any(function () { return this == arr2[i]; })) {
                    results.push(arr2[i]);
                }
            return results;
        }

        swapItems(el1, el2){
            if(el1 && el2){
                $(el1).css('transition', 'opacity 200ms');
                $(el2).css('transition', 'opacity 200ms');
                $(el1).addClass('hide');
                $(el2).addClass('hide');
                setTimeout(() => {
                    $(el1).swapWith($(el2));
                    
                    $(el1).removeClass('hide');
                    $(el2).removeClass('hide');
                }, 200);
                
            }
        }
        moveUp(ele) {
            this.swapItems($(ele)[0], $(ele).prev()[0]);
        }
        constructor() {
            super();


        }

        connectedCallback() {
            this.innerHTML = this.innerHTML + `
            <div class="addremove" style="align-self:stretch; flex-grow:0; flex-basis:.25in; display:flex; flex-direction:row; justify-content:space-between;">
                <button class="subtract round" style="width:.25in; flex-grow:0; box-sizing:border-box">-</button>
                <button class="add round" style="width:.25in; flex-grow:0; box-sizing:border-box">+</button>
            </div>
            `;

            //this.toggleCollapse = this.toggleCollapse.bind(this);

            var children = $(this).children().not('.addremove');
            children.css('align-self', 'stretch');
            children.css('flex-grow', '1');
            children.css('position', 'relative');

            $(this).css("display", "flex");
            $(this).css("overflow", "visible");
            $(this).css("flex-direction", "column");
            $(this).find('.subtract').on('click', (i) => {
                if ($(i.target).parent().prev()) {
                    var l = $(this).children().length - 2;
                    if (l == 0) {
                        this.lastEleH = $(i.target).parent().prev().outerHeight();
                    }
                    var el = $(i.target).parent().prev();
                    el.remove();

                    this.dispatchEvent(new CustomEvent('elementRemoved',
                        {
                            bubbles: true,
                            detail: {
                                element: el,
                                parent: this
                            }
                        }
                    ));

                    //TODO: resize parent. 
                    var dcontainer = $(this).parents('.draggable')[0];
                    if (dcontainer && !this.DisableDraggableResize) {

                        var deltaProportion = (l) / (l + 1);
                        var btnH = $(this).find('.addremove').outerHeight();
                        var h = ($(dcontainer).outerHeight() - btnH) * deltaProportion + btnH;

                        dcontainer.style.height = h + 'px';
                        $(dcontainer).parents('custom-form-creator')[0].RecalculatePosition(dcontainer);
                    }
                }
            });
            $(this).find('.add').on('click', (i) => {
                $(i.target).parent().before(`<double-input class="inputs" style="align-self:stretch; flex-grow:1; position:relative"></double-input>`);

                var el = $(i.target).parent().prev();
                this.dispatchEvent(new CustomEvent('elementAdded',
                    {
                        bubbles: true,
                        detail: {
                            element: el,
                            parent: this
                        }
                    }
                ));

                var dcontainer = $(this).parents('.draggable')[0];
                if (dcontainer && !this.DisableDraggableResize) {
                    var l = $(this).children().length - 1;
                    var deltaProportion = (l) / (l - 1);
                    var btnH = $(this).find('.addremove').outerHeight();
                    var h = ($(dcontainer).outerHeight() - btnH) * deltaProportion + btnH;
                    if (l == 1) h = (this.lastEleH ? this.lastEleH : 50) + btnH;
                    dcontainer.style.height = h + 'px';
                    $(dcontainer).parents('custom-form-creator')[0].RecalculatePosition(dcontainer);
                }
            });

            this.addEventListener('elementAdded', e => {
                var item = e.detail.element;
                if (item[0].tagName == 'DOUBLE-INPUT') {
                    var btn = $(
                        '<button class="move-up-btn round" style="box-sizing:border-box; width:100%; height: 100%"></button>'
                    );
                    item[0].setRightOption(btn);
                    btn.on('click', this.moveUp.bind(this, $(btn).parent().parent()));
                    this.dispatchEvent(new CustomEvent('move-up-btn-added', {
                        bubbles: true,
                        detail: {
                            element: btn,
                        }
                    }
                    ));
                }
            });

            var item = $(this).children().filter('double-input');
            var btn = $(
                '<button class="move-up-btn round" style="box-sizing:border-box; width:100%; height: 100%"></button>'
            );
            item.each((i,e)=>{
                e.setRightOption(btn.clone());
            });
            $(this).find('.option-area.right').children().on('click', e => this.moveUp($(e.target).parent().parent()));
        }

    }
    customElements.define('input-list', InputListClass);
});