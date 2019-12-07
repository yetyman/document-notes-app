jQuery(document).ready(function ($) {
    class dropDownClass extends HTMLElement {
        export(){
            return {
                type:"dropdown",
                cover:$(this).find('.collapse-cover').ExportableChildren(),
                content:$(this).find('.inner').ExportableChildren()
            };
        }
        import(settings){
            this.setCover(formCreator.create(settings.cover));
            this.setContent(formCreator.create(settings.content));
        }
        matchElements(arr1, arr2){
            var results = [];
            for(var i = 0; i<arr2.length; i++)
                if (!$(arr1).any(function(){return this == arr2[i];})) {
                  results.push(arr2[i]);
                }
            return results.length==0;
        }
        swapItems(el1, el2){
            if(el1 && el2){
                this.addTransitionProperty(el1,"opacity 200ms");
                this.addTransitionProperty(el2,"opacity 200ms");

                $(el1).addClass('hide');
                $(el2).addClass('hide');
                setTimeout(() => {
                    $(el1).swapWith($(el2));
                    
                    $(el1).removeClass('hide');
                    $(el2).removeClass('hide');
                }, 200);
                
            }
        }
        moveToTop(ele){
            this.swapItems($(ele)[0], $(this).find('.collapse-cover').find('double-input')[0]);
        }
        openCollapse() {
            $(this).find('double-input').each((i,e)=>e.showOptions());
            var b = $(this).find('.collapse-cover');
            $(this).find(".collapse-height").addClass('open');
            $(this).find(".collapse-height").removeClass('hide');
            var itemsContainer = $(this).find(".inner");
            var items = itemsContainer.children();
            
            if(items.length == 1 && items[0].tagName == 'INPUT-LIST')
            {    
                console.log($(items[0]));
                itemsContainer = $(items[0]);
                this.addTransitionProperty(itemsContainer,"margin-top 200ms");
                itemsContainer.css("margin-top",0);                
            }

            itemsContainer.children().each((x,y)=>{
                console.log($(y));
                this.addTransitionProperty(y,"height 200ms");
                $(y).css("height",b.outerHeight()).css('overflow', 'visible !important');
            });

            this.addEventListener('move-up-btn-added',e=>{
                $(e.detail.element)
                .removeClass('move-up-btn')
                .addClass('move-to-top-btn')
                .off('click')
                .on('click', this.moveToTop.bind(this,$(e.detail.element).parent().parent()));
            });
                
            
            items = itemsContainer.children();
            this.itemh = b.outerHeight();

            setInterval(() => {
                //next step! replace this with actual resize event resizing. just hook the event right in to the resize event. literally. its so straight forward.
                if(b.outerHeight() !=this.itemh || !this.matchElements(items, itemsContainer.children())){
                    items = itemsContainer.children().toArray();
                    this.itemh = b.outerHeight();
                    $(items).each((x,y)=>{
                        this.addTransitionProperty(y,"height 0ms");
                        $(y).css('height',b.outerHeight()).css('overflow', 'visible !important');
                    });
                }
            }, 50);
        }
        addTransitionProperty(ele, newprop){
            if(!($(ele).css("transition") && $(ele).css("transition").includes(newprop.split(" ")[0])))
            {
                $(ele).css("transition",(($(ele).css("transition")&&$(ele).css("transition")+",")&&"")+newprop);
            }
        }
        closeCollapse() {

            $(this).find('double-input').each((i,e)=>e.hideOptions());
            $(this).find(".collapse-height").removeClass('open');
            $(this).find(".collapse-height").addClass('hide');
            var items = $(this).find(".inner").children();
            if(items.length == 1 && items[0].tagName == 'INPUT-LIST')
            {    
                this.addTransitionProperty(items[0],"margin-top 200ms");
                $(items[0]).css("margin-top","-.25in");                
                items = $(items[0]).children();
            }
            items.each((x,y)=>{
                this.addTransitionProperty(y,"height 0ms");
                $(y).css("height","0");
            });
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
                    return $(this).find(".collapse-height").hasClass('open');
                },
                set(v) {
                    if(v)
                        this.openCollapse();
                    else
                        this.closeCollapse();
                }
            });

        }
        connectedCallback() {
            this.innerHTML = `
            <div class="collapse-cover fill-parent" type="button" style="background:transparent; position:relative; box-sizing:border-box; z-index:1; overflow:visible">
                <double-input class='inputs'></double-input>
                <button class="collapse-button round" style="padding:0; box-sizing:border-box; width:.25in; height:.25in; position:absolute; top:0; right:0; margin-right:-.25in">
                <div class="fit-parent" style="height: 75%;width: 75%;margin-left: 12.5%;"></div>
                </button>
            </div>
            <div class="collapse-height" style="background:transparent; overflow:visible;">
                <div class="inner" style="">
            `+//hey me. this is bad encapsulation. you are writing drop down code above that makes it the height of the children inside of this, but the children arent all uniform. you have to find a solution to hide the drop down and let it maintain its height. sorry.
                this.innerHTML +
                `   </div>
            </div>
            `;

            //TODO: abstract dropdown to actually be just a drop down. then have three inheriting children(collapsible-input-list, collapsible-check-list(the top input is a view, not an editable one), and collapsible-radio-list(once again, top is view))
            var input = 
            $(this).find('.collapse-cover').find('double-input').each((i,e)=>{
                e.setRightOption($('<button class="move-to-top-btn round" style="box-sizing:border-box; width:100%; height: 100%"></button>'));
            });
            $(this).find('.move-to-top-btn').on('click', (i)=>this.moveToTop($(i.target).parent().parent()));
            this.toggleCollapse = this.toggleCollapse.bind(this);
            this.openCollapse = this.openCollapse.bind(this);
            this.closeCollapse = this.closeCollapse.bind(this);
            this.addTransitionProperty = this.addTransitionProperty.bind(this);
            
            var b = $(this).find(".collapse-button");
            
            b.click(this.toggleCollapse);

            var resizesParent = $(this).find('input-list');
            resizesParent.each(x=>
                resizesParent[x].DisableDraggableResize=true
            );
            if($(this).attr('title'))
                this.changeTitle($(this).attr('title'));

            $(this).css("overflow", "visible");
            this.closeCollapse();
        }

    }
    customElements.define('drop-down', dropDownClass);
});