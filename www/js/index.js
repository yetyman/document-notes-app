const { BrowserWindow, ipcMain } = require('electron');
const nativeImage = require('electron').nativeImage;
const dialog = require('electron').remote;
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        //    this.receivedEvent('deviceready');
        jQuery(document).ready(function ($) {
            $('.calculate-button').on('click', calculateRelativeValues);
            document.addEventListener('valueChanged', calculateRelativeValues);
            $('.sizing-button').on('click', () => {
                var c = $('.image-container');
                if(c.hasClass('fit-parent')){
                    if(c[0].style.height == 'auto'){
                        c[0].style.height = null;
                    }else{
                        $('.image-box').toggleClass('fit-image');
                        $('.image-container').toggleClass('fit-parent');
                        $('.image-container').toggleClass('fit-content');
                    }
                }else{
                    c[0].style.height = 'auto';

                    $('.image-box').toggleClass('fit-image');
                    $('.image-container').toggleClass('fit-parent');
                    $('.image-container').toggleClass('fit-content');
                }
            });
            $('.form-config-button').on('click', () => {
                $('custom-form-creator')[0].configuring = !$('custom-form-creator')[0].configuring ;
            });
            $('.background-button').on('click', () => {
                //bring up some open picture file dialogue
                const { BrowserWindow } = require('electron');
                const { dialog } = require('electron').remote;
                
                dialog.showOpenDialog(null, {
                    properties: ['openFile']
                }).then(function (files) {
                    if (files !== undefined && files.filePaths[0] !== undefined) {
                        // handle files
                        alert(JSON.stringify(files.filePaths[0]));

                        var subpath =JSON.stringify('file:///'+files.filePaths[0]).replace('\\', '//');
                        var path = 'url(' + subpath + ')';
                        //$('.app').css("background-image", path);

                        var imageSrc = path
                            .replace(/url\((['"])?(.*?)\1\)/gi, '$2')
                            .split(',')[0];

                        // I just broke it up on newlines for readability        
                        console.info(imageSrc);
                        //var image = new Image();
                        //image.src = imageSrc;
                        var image =$('.sizing-box');
                        image.attr('src', imageSrc);
                        image.on('load',()=>{

                            var width = image.width(),
                            height = image.height();
    
                            
                            $('custom-form-creator').width($('.sizing-box').width());
                            $('custom-form-creator').height($('.sizing-box').height());
                            //alert('width =' + width + ', height = ' + height)   ; 
                        });
                    
                    
                    }
                });
            });
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();