/*jshint esversion: 9, esnext: false,  undef: false, unused: false, -W083 */

/*
 * Plugin Name: Pmotion
 * Plugin URI: https://palleon.website/pmotion-js/
 * Version: 1.0
 * Description: Pmotion - Animated Video and GIF Maker
 * Author URI: http://codecanyon.net/user/egemenerd
 * License: http://codecanyon.com/licenses
 */

(function ($) {
  "use strict";
  $.fn.pmotion = function (options) {
    var selector = $(this);
    // Default settings
    var sets = $.extend(
      {
        baseURL: "./",
        PexelsApiKey: "",
        PexelsPagination: 20,
        PexelsLanguage: "en-US",
        PexelsImgSize: "large2x",
        PixabayApiKey: "",
        PixabayPagination: 20,
        PixabayLanguage: "en",
        PixabaySafeSearch: "false",
        PixabayEditorsChice: "false",
        apiCaching: true,
        maxUploadLimit: 10,
        canvasWidth: 1080,
        canvasHeight: 1080,
        fontFamily: "Roboto",
        borderColor: "#000000",
        borderScaleFactor: 2,
        borderOpacityWhenMoving: 0.5,
        cornerColor: "#FFFFFF",
        cornerSize: 12,
        cornerStyle: "circle",
        cornerStrokeColor: "#000000",
        borderDashArray: [4, 4],
        editingBorderColor: "rgba(0,0,0,0.5)",
        backgroundColor: "#888888",
        imageLayerColor: "#1B9AAA",
        videoLayerColor: "#DAA89B",
        textLayerColor: "#84A9C0",
        shapeLayerColor: "#87D68D",
        animatedTextLayerColor: "#87D68D",
        audioLayerColor: "#E2EB98",
        watermark: false,
        watermarkText: "Made with Pmotion",
        watermarkFontFamily: "Roboto",
        watermarkFontStyle: "normal",
        watermarkFontColor: "#000",
        watermarkFontSize: 40,
        watermarkFontWeight: "bold",
        watermarkBackgroundColor: "#FFF",
        watermarkLocation: "bottom-right",
        presets: [
          ["1:1", 1080, 1080],
          ["1:1", 720, 720],
          ["1:1", 600, 600],
          ["4:5", 1080, 1350],
          ["16:9", 1280, 720],
          ["16:9", 640, 360],
          ["9:16", 720, 1280],
          ["9:16", 360, 640],
          ["4:3", 640, 480],
          ["4:3", 480, 360],
        ],
        colorpickerSwatches: [
          "rgba(244, 67, 54, 1)",
          "rgba(233, 30, 99, 1)",
          "rgba(156, 39, 176, 1)",
          "rgba(103, 58, 183, 1)",
          "rgba(63, 81, 181, 1)",
          "rgba(33, 150, 243, 1)",
          "rgba(3, 169, 244, 1)",
          "rgba(0, 188, 212, 1)",
          "rgba(0, 150, 136, 1)",
          "rgba(76, 175, 80, 1)",
          "rgba(139, 195, 74, 1)",
          "rgba(205, 220, 57, 1)",
          "rgba(255, 235, 59, 1)",
          "rgba(255, 193, 7, 1)",
        ],
        customFunctions: function () {},
      },
      options
    );

    var audioContext = new AudioContext();
    var audioSource = false;
    var audio = false;
    var audioDestination;
    var oldtimelinepos;
    var speed = 1;
    var page = 1;
    var checkstatus = false;
    let db = new Localbase("db");
    var wip = false;
    var paused = true;
    var currenttime = 0;
    var timelinetime = 5;
    const offset_left = 20;
    var duration = 4000;
    var keyframes = [];
    var p_keyframes = [];
    var props = [
      "left",
      "top",
      "scaleX",
      "scaleY",
      "width",
      "height",
      "angle",
      "opacity",
      "fill",
      "strokeWidth",
      "stroke",
      "shadow.color",
      "shadow.offsetX",
      "shadow.offsetY",
      "shadow.blur",
      "charSpacing",
    ];
    var objects = [];
    var chunks = [];
    var colormode = "fill";
    var spaceDown = false;
    var selectedkeyframe;
    var undo = [];
    var undoarr = [];
    var redo = [];
    var groups = [];
    var redoarr = [];
    var state;
    var statearr = [];
    var recording = false;
    var canvasrecord;
    var clipboard;
    var focus = false;
    var editingpanel = false;
    var timeout;
    var tempselection;
    var line_h, line_v;
    var tempgroup = [];
    var editinggroup = false;
    var fonts = [];
    var seeking = false;
    var setting = false;
    var handtool = false;
    var canvasx = 0;
    var canvasy = 0;
    var overCanvas = false;
    var draggingPanel = false;
    var cropping = false;
    var cropobj;
    var cropscalex;
    var cropscaley;
    var croptop;
    var cropleft;
    var layer_count = 1;
    var lockmovement = false;
    var shiftx = 0;
    var shifty = 0;
    var editinglayer = false;
    var editingproject = false;
    var shiftkeys = [];
    var shiftdown = false;
    var cliptype = "object";
    var uploaded_images = [];
    var uploaded_videos = [];
    var uploaded_audios = [];
    var uploading = false;
    var background_audio = false;
    var temp_audio = false;
    var background_key = false;
    var sliders = [];
    var hovertime = 0;
    var animatedtext = [];
    var loadedFonts = [];
    var f = fabric.Image.filters;
    var recorderTimer = 1;
    var recorderPlaying = true;
    var JSON_defaults = [
      "volume",
      "audioSrc",
      "defaultLeft",
      "defaultTop",
      "defaultScaleX",
      "defaultScaleY",
      "notnew",
      "starttime",
      "top",
      "left",
      "width",
      "height",
      "scaleX",
      "scaleY",
      "flipX",
      "flipY",
      "originX",
      "originY",
      "transformMatrix",
      "stroke",
      "strokeWidth",
      "strokeDashArray",
      "strokeLineCap",
      "strokeDashOffset",
      "strokeLineJoin",
      "strokeMiterLimit",
      "angle",
      "opacity",
      "fill",
      "globalCompositeOperation",
      "shadow",
      "clipTo",
      "visible",
      "backgroundColor",
      "skewX",
      "skewY",
      "fillRule",
      "paintFirst",
      "strokeUniform",
      "rx",
      "ry",
      "selectable",
      "hasControls",
      "subTargetCheck",
      "id",
      "hoverCursor",
      "defaultCursor",
      "filesrc",
      "isEditing",
      "source",
      "assetType",
      "duration",
      "inGroup",
      "filters",
      "ogWidth",
      "ogHeight",
    ];

    // Toastr
    toastr.options.closeButton = true;
    toastr.options.positionClass = "toast-top-right";
    toastr.options.progressBar = true;
    toastr.options.newestOnTop = false;
    toastr.options.showEasing = "swing";
    toastr.options.hideEasing = "linear";
    toastr.options.closeEasing = "linear";

    // Get presets
    function getPresets() {
      const presets = sets.presets;
      var output = "";
      $.each(presets, function (index, val) {
        output +=
          '<div data-width="' +
          val[1] +
          '" data-height="' +
          val[2] +
          '">' +
          val[1] +
          "x" +
          val[2] +
          "px <span>" +
          val[0] +
          "</span></div>";
      });
      return output;
    }

    // Panel variants
    var canvas_panel =
      '<div id="canvas-properties" class="panel-section">  <p class="property-title">' +
      pmotionParams.t1 +
      '</p><div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t2 +
      '</label> <div class="control"> <input id="canvas-w" class="form-field" autocomplete="off" min="1" type="number" value="" /> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t3 +
      '</label> <div class="control"> <input id="canvas-h" class="form-field" autocomplete="off" type="number" value="" min="1" /> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t141 +
      '</label> <div class="control"> <div class="colorpicker-box"></div> <input id="canvas-color" class="form-field colorpicker" autocomplete="off" value="' +
      sets.backgroundColor +
      '" readonly /> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t5 +
      '</label> <div class="control"> <input id="canvas-duration" class="form-field" autocomplete="off" type="number" value="4" /></div></div> <hr> <p class="property-title">' +
      pmotionParams.t6 +
      '</p> <div id="canvas-presets">' +
      getPresets() +
      "</div> </div>";
    var back_to_panel =
      '<button id="back-to-canvas-settings" type="button" class="btn"> <span class="material-icons">keyboard_double_arrow_left</span>' +
      pmotionParams.t1 +
      '</button><hr> <p class="property-title">' +
      pmotionParams.t140 +
      '</p><div id="align" class="btn-group"> <span id="align-top" class="material-icons align" title="Align to the top">vertical_align_top</span> <span id="align-center-v" class="material-icons align" title="Align to the center">vertical_align_center</span> <span id="align-bottom" class="material-icons align" title="Align to the bottom">vertical_align_bottom</span> <span id="align-left" class="material-icons align" title="Align to the left">align_horizontal_left</span> <span id="align-center-h" class="material-icons align" title="Align to the center">align_horizontal_center</span> <span id="align-right" class="material-icons align" title="Align to the right">align_horizontal_right</span> </div><hr>';
    var object_panel =
      '<hr><div id="layout-properties" class="panel-section"> <p class="property-title">' +
      pmotionParams.t7 +
      '</p> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t8 +
      '</label> <div class="control"> <div id="object-x"><input type="number" class="form-field" autocomplete="off" value=1000></div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t9 +
      '</label> <div class="control"> <div id="object-y"><input type="number" class="form-field" autocomplete="off" value=1000></div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t2 +
      '</label> <div class="control"> <div id="object-w"><input type="number" class="form-field" autocomplete="off" value=1000 min=1></div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t3 +
      '</label> <div class="control"> <div id="object-h"><input type="number" class="form-field" autocomplete="off" value=1000 min=1></div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t10 +
      '</label> <div class="control"> <div id="object-r"><input type="number" class="form-field" autocomplete="off" value=1000 min=-360 max=360></div> </div> </div> </div>';
    var video_panel =
      '<div id="layout-properties" class="panel-section video-fields"><div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t8 +
      '</label> <div class="control"> <div id="object-x"><input type="text" class="form-field video-field" autocomplete="off" value=1000 readonly></div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t9 +
      '</label> <div class="control"> <div id="object-y"><input type="text" class="form-field video-field" autocomplete="off" value=1000 readonly></div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t2 +
      '</label> <div class="control"> <div id="object-w"><input type="text" class="form-field video-field" autocomplete="off" value=1000 readonly></div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t3 +
      '</label> <div class="control"> <div id="object-h"><input type="text" class="form-field video-field" autocomplete="off" value=1000 readonly></div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t10 +
      '</label> <div class="control"> <div id="object-r"><input type="text" class="form-field video-field" autocomplete="off" value=1000 readonly> </div> </div> </div> </div>';
    var back_panel =
      '<div id="back-properties" class="panel-section"> <p class="property-title">' +
      pmotionParams.t11 +
      '</p> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t12 +
      '</label> <div class="control"> <input id="object-o" type="range" min="0" max="1" value="0" step="0.1" class="rangeslider" autocomplete="off"> </div> </div> </div>';
    var path_panel =
      '<div id="back-properties" class="panel-section"> <p class="property-title">' +
      pmotionParams.t13 +
      '</p> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t4 +
      '</label> <div class="control"> <div class="colorpicker-box"></div> <input id="object-color-fill" class="form-field colorpicker" autocomplete="off" value="#FFFFFF" readonly> </div> </div> </div> <hr>';
    var svg_panel =
      '<div id="back-properties" class="panel-section"> <p class="property-title">Fill Colors</p><div id="custom-svg-colors"></div> <hr>';
    var text_panel =
      '<div id="back-properties" class="panel-section"> <p class="property-title">' +
      pmotionParams.t36 +
      '</p> <div class="control-wrap label-block"> <div class="control"> <textarea id="textarea-input" class="textarea-field" rows="3" autocomplete="off"></textarea> </div> </div> <div class="control-wrap label-block"> <div class="control"> <div class="btn-group"> <div class="format-text" id="format-bold"><span class="material-icons">format_bold</span></div> <div class="format-text" id="format-italic"><span class="material-icons">format_italic</span></div> <div class="format-text" id="format-underline"><span class="material-icons">format_underlined</span> </div> <div class="format-text" id="format-strike"><span class="material-icons">strikethrough_s</span> </div> <div class="align-text" id="align-text-left"><span class="material-icons">format_align_left</span> </div> <div class="align-text" id="align-text-center"><span class="material-icons">format_align_center</span> </div> <div class="align-text" id="align-text-right"><span class="material-icons">format_align_right</span> </div> </div> </div> </div> <div class="control-wrap label-block"> <div class="control"> <select id="font-picker" class="custom-select custom-select2" autocomplete="off"></select> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t4 +
      '</label> <div class="control"> <div class="colorpicker-box"></div> <input id="object-color-fill" class="form-field colorpicker" autocomplete="off" value="rgba(255,255,255,1)" readonly> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t123 +
      '</label> <div class="control"> <input id="text-h" type="range" min="-10" max="110" value="1" step="1" class="rangeslider" autocomplete="off"> </div> </div> </div> <hr>';
    var stroke_panel =
      '<hr> <div id="back-properties" class="panel-section"> <p class="property-title">' +
      pmotionParams.t124 +
      '</p> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t4 +
      '</label> <div class="control"> <div class="colorpicker-box"></div> <input id="object-color-stroke" class="form-field colorpicker" autocomplete="off" value="#FFFFFF" readonly> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t2 +
      '</label> <div class="control"> <div id="object-stroke"><input class="form-field" autocomplete="off" type="number" value="0" min="0"> </div> </div> </div> </div>';
    var shadow_panel =
      '<hr> <div id="back-properties" class="panel-section"> <p class="property-title">' +
      pmotionParams.t125 +
      '</p> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t4 +
      '</label> <div class="control"> <div class="colorpicker-box"></div> <input id="object-color-shadow" class="form-field colorpicker" autocomplete="off" value="#FFFFFF" readonly> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t14 +
      '</label> <div class="control"> <div id="object-shadow-x"><input class="form-field" autocomplete="off" type="number" value="0"> </div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t15 +
      '</label> <div class="control"> <div id="object-shadow-y"><input class="form-field" autocomplete="off" type="number" value="0"> </div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t16 +
      '</label> <div class="control"> <div id="object-blur"><input class="form-field" autocomplete="off" type="number" value="0"></div> </div> </div> </div>';
    var image_more_panel =
      '<div id="back-properties" class="panel-section img-filters"> <p class="property-title">' +
      pmotionParams.t17 +
      '</p> <div class="control-wrap label-block"> <div class="control"> <select class="custom-select" id="filters-list"> <option value="none">' +
      pmotionParams.t18 +
      '</option> <option value="Grayscale">' +
      pmotionParams.t19 +
      '</option> <option value="Sepia">' +
      pmotionParams.t20 +
      '</option> <option value="BlackWhite">' +
      pmotionParams.t21 +
      '</option> <option value="Brownie">' +
      pmotionParams.t22 +
      '</option> <option value="Vintage">' +
      pmotionParams.t23 +
      '</option> <option value="Technicolor">' +
      pmotionParams.t24 +
      '</option> <option value="Kodachrome">' +
      pmotionParams.t25 +
      '</option> <option value="Polaroid">' +
      pmotionParams.t26 +
      '</option> <option value="Invert">' +
      pmotionParams.t27 +
      '</option> </select> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t28 +
      '</label> <div class="control"> <input id="filter-brightness" type="range" min="-100" max="100" value="0" step="1" class="rangeslider" autocomplete="off"> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t29 +
      '</label> <div class="control"> <input id="filter-contrast" type="range" min="-100" max="100" value="0" step="1" class="rangeslider" autocomplete="off"> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t30 +
      '</label> <div class="control"> <input id="filter-saturation" type="range" min="-100" max="100" value="0" step="1" class="rangeslider" autocomplete="off"> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t31 +
      '</label> <div class="control"> <input id="filter-vibrance" type="range" min="-100" max="100" value="0" step="1" class="rangeslider" autocomplete="off"> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t32 +
      '</label> <div class="control"> <input id="filter-hue" type="range" min="-100" max="100" value="0" step="1" class="rangeslider" autocomplete="off"> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t33 +
      '</label> <div class="control"> <input id="filter-noise" type="range" min="0" max="1000" value="0" step="1" class="rangeslider" autocomplete="off"> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t16 +
      '</label> <div class="control"> <input id="filter-blur" type="range" min="0" max="100" value="0" step="1" class="rangeslider" autocomplete="off"> </div> </div> <div class="image-btns"> <button id="crop-image" type="button" class="btn">' +
      pmotionParams.t34 +
      '</button> <button id="reset-filters" type="button" class="btn">' +
      pmotionParams.t35 +
      "</button> </div> </div> <hr>";
    var animated_text_panel =
      '<div id="back-properties" class="panel-section"> <p class="property-title">' +
      pmotionParams.t36 +
      '</p> <div class="control-wrap label-block"> <div class="control"> <div id="animated-text"> <input id="animatedinput" class="form-field" type="text" value="text" autocomplete="off"> <button type="button" id="animatedset" class="btn primary"><span class="material-icons">done</span></button> </div> </div> </div> <div class="control-wrap label-block"> <div class="control"> <select id="font-picker" class="custom-select custom-select2" autocomplete="off"></select> </div> </div> <div class="control-wrap"> <div class="control-label">' +
      pmotionParams.t132 +
      '</div> <div class="control"> <select id="anim-weight" class="custom-select" autocomplete="off"> <option value="normal">' +
      pmotionParams.t133 +
      '</option> <option value="bold">' +
      pmotionParams.t134 +
      '</option> </select> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t4 +
      '</label> <div class="control"> <div class="colorpicker-box"></div> <input id="text-color" class="form-field colorpicker" autocomplete="off" value="#FFFFFF" readonly> </div> </div> </div> <hr>';
    var start_animation_panel =
      '<hr> <div id="back-properties" class="panel-section"> <p class="property-title">' +
      pmotionParams.t126 +
      '</p> <div class="control-wrap label-block"> <div class="control"> <div class="order-toggle"> <div id="order-backward" class="order-toggle-item">' +
      pmotionParams.t37 +
      '</div> <div id="order-forward" class="order-toggle-item order-toggle-item-active">' +
      pmotionParams.t38 +
      '</div> </div> </div> </div> <div class="control-wrap label-block"> <div class="control"> <div class="order-toggle"> <div id="type-letters" class="order-toggle-item-2">' +
      pmotionParams.t39 +
      '</div> <div id="type-words" class="order-toggle-item-2 order-toggle-item-active-2">' +
      pmotionParams.t40 +
      '</div> </div> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t41 +
      '</label> <div class="control"> <select id="preset-picker" class="custom-select"> <option value="fade in">' +
      pmotionParams.t42 +
      '</option> <option value="typewriter">' +
      pmotionParams.t43 +
      '</option> <option value="slide top">' +
      pmotionParams.t44 +
      '</option> <option value="slide bottom">' +
      pmotionParams.t45 +
      '</option> <option value="slide left">' +
      pmotionParams.t46 +
      '</option> <option value="slide right">' +
      pmotionParams.t47 +
      '</option> <option value="scale">' +
      pmotionParams.t48 +
      '</option> <option value="shrink">' +
      pmotionParams.t49 +
      '</option> </select> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t50 +
      '</label> <div class="control"> <select id="easing-picker" class="custom-select"> <option value="linear">' +
      pmotionParams.t51 +
      '</option> <option value="easeInQuad">' +
      pmotionParams.t52 +
      '</option> <option value="easeOutQuad">' +
      pmotionParams.t53 +
      '</option> <option value="easeInOutQuad">' +
      pmotionParams.t54 +
      '</option> <option value="easeOutInQuad">' +
      pmotionParams.t55 +
      '</option> <option value="easeInQuart">' +
      pmotionParams.t56 +
      '</option> <option value="easeOutQuart">' +
      pmotionParams.t57 +
      '</option> <option value="easeInOutQuart">' +
      pmotionParams.t58 +
      '</option> <option value="easeOutInQuart">' +
      pmotionParams.t59 +
      '</option> <option value="easeInQuint">' +
      pmotionParams.t60 +
      '</option> <option value="easeOutQuint">' +
      pmotionParams.t61 +
      '</option> <option value="easeInOutQuint">' +
      pmotionParams.t62 +
      '</option> <option value="easeOutInQuint">' +
      pmotionParams.t63 +
      '</option> <option value="easeInBounce">' +
      pmotionParams.t64 +
      '</option> <option value="easeOutBounce">' +
      pmotionParams.t65 +
      '</option> <option value="easeInOutBounce">' +
      pmotionParams.t66 +
      '</option> <option value="easeOutInBounce">' +
      pmotionParams.t67 +
      '</option> <option value="easeInSine">' +
      pmotionParams.t68 +
      '</option> <option value="easeOutSine">' +
      pmotionParams.t69 +
      '</option> <option value="easeInOutSine">' +
      pmotionParams.t70 +
      '</option> <option value="easeOutInSine">' +
      pmotionParams.t71 +
      '</option> <option value="easeInCubic">' +
      pmotionParams.t72 +
      '</option> <option value="easeOutCubic">' +
      pmotionParams.t73 +
      '</option> <option value="easeInOutCubic">' +
      pmotionParams.t74 +
      '</option> <option value="easeOutInCubic">' +
      pmotionParams.t75 +
      '</option> <option value="easeInCirc">' +
      pmotionParams.t76 +
      '</option> <option value="easeOutCirc">' +
      pmotionParams.t77 +
      '</option> <option value="easeInOutCirc">' +
      pmotionParams.t78 +
      '</option> <option value="easeOutInCirc">' +
      pmotionParams.t79 +
      '</option> <option value="easeInExpo">' +
      pmotionParams.t80 +
      '</option> <option value="easeOutExpo">' +
      pmotionParams.t81 +
      '</option> <option value="easeInOutExpo">' +
      pmotionParams.t82 +
      '</option> <option value="easeOutInExpo">' +
      pmotionParams.t83 +
      '</option> <option value="easeInBack">' +
      pmotionParams.t84 +
      '</option> <option value="easeOutBack">' +
      pmotionParams.t85 +
      '</option> <option value="easeInOutBack">' +
      pmotionParams.t86 +
      '</option> <option value="easeOutInBack">' +
      pmotionParams.t87 +
      '</option> </select> </div> </div> <div class="control-wrap"> <label class="control-label">' +
      pmotionParams.t88 +
      '</label> <div class="control"> <div id="animated-text-duration"> <input id="durationinput" class="form-field" autocomplete="off" type="number" value="0"> </div> </div> </div> </div>';
    var audio_panel =
      '<div id="layout-properties" class="panel-section"><button type="button" class="btn btn-full danger delete-audio"><span class="material-icons">delete_forever</span>' +
      pmotionParams.t91 +
      "</button>";

    // Init webglBackend
    var webglBackend;
    try {
      webglBackend = new fabric.WebglFilterBackend();
    } catch (e) {
      console.log(e);
    }

    // Populate font picker
    $.getJSON(sets.baseURL + "json/google-fonts.json", function (gfonts) {
      console.log(`${sets.baseURL}json/google-fonts.json`);
      for (var i = 0; i < gfonts.items.length; i++) {
        fonts.push(gfonts.items[i].family);
      }
      fonts.sort();
    });

    // Fabric filter backend
    fabric.filterBackend = fabric.initFilterBackend();
    fabric.filterBackend = webglBackend;

    // Initialize canvas
    var canvas = new fabric.Canvas("canvas", {
      preserveObjectStacking: true,
      backgroundColor: sets.backgroundColor,
      stateful: true,
    });
    canvas.selection = false;
    canvas.controlsAboveOverlay = true;

    // Customize controls
    fabric.Object.prototype.set({
      fontFamily: sets.fontFamily,
      transparentCorners: false,
      borderColor: sets.borderColor,
      borderScaleFactor: sets.borderScaleFactor,
      borderOpacityWhenMoving: sets.borderOpacityWhenMoving,
      cornerColor: sets.cornerColor,
      cornerSize: sets.cornerSize,
      cornerStyle: sets.cornerStyle,
      cornerStrokeColor: sets.cornerStrokeColor,
      borderDashArray: sets.borderDashArray,
      editingBorderColor: sets.editingBorderColor,
    });

    // Delete object control
    var deleteIcon =
      "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='tm_delete_btn' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='512px' height='512px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='256' cy='256' r='256'/%3E%3Cg%3E%3Crect x='120.001' y='239.987' transform='matrix(-0.7071 -0.7071 0.7071 -0.7071 256.0091 618.0168)' style='fill:%23FFFFFF;' width='271.997' height='32'/%3E%3Crect x='240' y='119.989' transform='matrix(-0.7071 -0.7071 0.7071 -0.7071 256.0091 618.0168)' style='fill:%23FFFFFF;' width='32' height='271.997'/%3E%3C/g%3E%3C/svg%3E";
    var deleteimg = document.createElement("img");
    deleteimg.src = deleteIcon;

    function deleteIconHandler(eventData, transform) {
      var target = transform.target;
      if (canvas.getActiveObject() && !canvas.getActiveObject().isEditing) {
        const selection = canvas.getActiveObject();
        if (selection.type == "activeSelection") {
          canvas.discardActiveObject();
          selection._objects.forEach(function (object) {
            deleteObject(object, canvas);
          });
        } else {
          deleteObject(target, canvas);
        }
      }
      canvas.requestRenderAll();
    }

    function renderDeleteIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = 24;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(deleteimg, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    function addDeleteIcon(obj) {
      obj.controls.deleteControl = new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 22,
        offsetX: 14,
        cursorStyle: "pointer",
        mouseUpHandler: deleteIconHandler,
        render: renderDeleteIcon,
        cornerSize: 24,
      });
    }

    // Clone object control
    var cloneIcon =
      "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='tm_add_btn' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='512px' height='512px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Ccircle style='fill:%23009688;' cx='256' cy='256' r='256'/%3E%3Cg%3E%3Crect x='240' y='120' style='fill:%23FFFFFF;' width='32' height='272'/%3E%3Crect x='120' y='240' style='fill:%23FFFFFF;' width='272' height='32'/%3E%3C/g%3E%3C/svg%3E";

    var cloneimg = document.createElement("img");
    cloneimg.src = cloneIcon;

    function cloneObject(eventData, transform) {
      var target = transform.target;
      if (target.type === "activeSelection") {
        toastr.warning(pmotionParams.t129, pmotionParams.t130);
      } else if (target.assetType === "animatedText") {
        toastr.warning(pmotionParams.t131, pmotionParams.t130);
      } else if (canvas.getActiveObject()) {
        clipboard = canvas.getActiveObject();
        copyObject();
      }
    }

    function renderCloneIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = 24;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(cloneimg, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    function addCloneIcon(obj) {
      obj.controls.cloneControl = new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 22,
        offsetX: -14,
        cursorStyle: "pointer",
        mouseUpHandler: cloneObject,
        render: renderCloneIcon,
        cornerSize: 24,
      });
    }

    // Reset object controls
    function resetControls() {
      fabric.Object.prototype.controls.ml = new fabric.Control({
        x: -0.5,
        y: 0,
        offsetX: -1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      });

      fabric.Object.prototype.controls.mr = new fabric.Control({
        x: 0.5,
        y: 0,
        offsetX: 1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      });

      fabric.Object.prototype.controls.mb = new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      });

      fabric.Object.prototype.controls.mt = new fabric.Control({
        x: 0,
        y: -0.5,
        offsetY: -1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      });

      fabric.Object.prototype.controls.tl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
      });

      fabric.Object.prototype.controls.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
      });

      fabric.Object.prototype.controls.bl = new fabric.Control({
        x: -0.5,
        y: 0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
      });

      fabric.Object.prototype.controls.br = new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
      });
    }

    // Get any object by ID
    fabric.Canvas.prototype.getItemById = function (name) {
      var object = null,
        objects = this.getObjects();
      for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i].get("type") == "group") {
          if (objects[i].get("id") && objects[i].get("id") === name) {
            object = objects[i];
            break;
          }
          var wip = i;
          for (var o = 0; o < objects[i]._objects.length; o++) {
            if (
              objects[wip]._objects[o].id &&
              objects[wip]._objects[o].id === name
            ) {
              object = objects[wip]._objects[o];
              break;
            }
          }
        } else if (objects[i].id && objects[i].id === name) {
          object = objects[i];
          break;
        }
      }
      return object;
    };

    /* Watermark */
    function add_watermark(canvasrecord) {
      if (sets.watermark) {
        var location = sets.watermarkLocation;
        var scaledFontSize = (artboard.width * sets.watermarkFontSize) / 1400;
        var watermark = new fabric.Textbox(" " + sets.watermarkText + " ", {
          objectType: "watermark",
          fontSize: scaledFontSize,
          fontFamily: sets.watermarkFontFamily,
          fontWeight: sets.watermarkFontWeight,
          fontStyle: sets.watermarkFontStyle,
          lineHeight: 1,
          fill: sets.watermarkFontColor,
          textBackgroundColor: sets.watermarkBackgroundColor,
          width: artboard.width,
          left: 0,
        });
        canvasrecord.add(watermark);

        if (location == "bottom-right") {
          watermark.textAlign = "right";
          watermark.top = artboard.height - watermark.height;
        } else if (location == "bottom-left") {
          watermark.textAlign = "left";
          watermark.top = artboard.height - watermark.height;
        } else if (location == "top-right") {
          watermark.textAlign = "right";
          watermark.top = 0;
        } else if (location == "top-left") {
          watermark.textAlign = "left";
          watermark.top = 0;
        }
        watermark.moveTo(999);
      }
    }

    // Create the artboard
    var artboard = new fabric.Rect({
      left: canvas.get("width") / 2 - sets.canvasWidth / 2,
      top: canvas.get("height") / 2 - sets.canvasHeight / 2,
      width: sets.canvasWidth,
      height: sets.canvasHeight,
      absolutePositioned: true,
      rx: 0,
      ry: 0,
      fill: "#FFF",
      hasControls: true,
      transparentCorners: false,
      borderColor: "#0E98FC",
      cornerColor: "#0E98FC",
      cursorWidth: 1,
      cursorDuration: 1,
      cursorDelay: 250,
      id: "overlay",
    });
    canvas.requestRenderAll();

    // Clip canvas to the artboard
    canvas.clipPath = artboard;
    canvas.requestRenderAll();

    // Initialize color picker (fill)
    var o_fill = Pickr.create({
      el: ".colorpicker",
      theme: "nano",
      inline: false,
      autoReposition: false,
      defaultRepresentation: "RGBA",
      default: "#FFFFFF",
      swatches: sets.colorpickerSwatches,
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          hex: true,
          rgba: true,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: true,
          clear: false,
          save: false,
        },
      },
    });

    // Close popups on scroll
    selector.find("#browser").on("scroll", function () {
      o_fill.hide();
      if (selector.find("#font-picker").length) {
        selector.find("#font-picker").select2("close");
      }
    });

    // Color picker events
    o_fill
      .on("change", (instance) => {
        if (canvas.getActiveObject()) {
          const object = canvas.getActiveObject();
          if (colormode == "fill") {
            selector
              .find("#object-color-fill")
              .val(o_fill.getColor().toHEXA().toString().substring(0, 7));
            selector
              .find("#object-color-fill")
              .parent()
              .find(".colorpicker-box")
              .css(
                "background",
                o_fill.getColor().toHEXA().toString().substring(0, 7)
              );
            object.set("fill", o_fill.getColor().toRGBA().toString());
            if (!seeking && !setting) {
              newKeyframe(
                "fill",
                object,
                currenttime,
                object.get("fill"),
                true
              );
            }
          } else if (colormode == "stroke") {
            selector
              .find("#object-color-stroke")
              .val(o_fill.getColor().toHEXA().toString().substring(0, 7));
            selector
              .find("#object-color-stroke")
              .parent()
              .find(".colorpicker-box")
              .css(
                "background",
                o_fill.getColor().toHEXA().toString().substring(0, 7)
              );
            object.set("stroke", o_fill.getColor().toRGBA().toString());
            if (!seeking && !setting) {
              newKeyframe(
                "stroke",
                object,
                currenttime,
                object.get("stroke"),
                true
              );
              newKeyframe(
                "strokeWidth",
                object,
                currenttime,
                object.get("strokeWidth"),
                true
              );
            }
          } else if (colormode == "shadow") {
            selector
              .find("#object-color-shadow")
              .val(o_fill.getColor().toHEXA().toString().substring(0, 7));
            selector
              .find("#object-color-shadow")
              .parent()
              .find(".colorpicker-box")
              .css(
                "background",
                o_fill.getColor().toHEXA().toString().substring(0, 7)
              );
            object.set(
              "shadow",
              new fabric.Shadow({
                color: o_fill.getColor().toRGBA().toString(),
                offsetX: object.shadow.offsetX,
                offsetY: object.shadow.offsetY,
                blur: object.shadow.blur,
                opacity: 1,
              })
            );
            if (!seeking && !setting) {
              newKeyframe(
                "shadow.color",
                object,
                currenttime,
                object.shadow.color,
                true
              );
              newKeyframe(
                "shadow.offsetX",
                object,
                currenttime,
                object.shadow.offsetX,
                true
              );
              newKeyframe(
                "shadow.offsetY",
                object,
                currenttime,
                object.shadow.offsetY,
                true
              );
              newKeyframe(
                "shadow.blur",
                object,
                currenttime,
                object.shadow.blur,
                true
              );
            }
          } else if (colormode == "text") {
            var obj = canvas.getActiveObject();
            selector
              .find("#text-color")
              .val(o_fill.getColor().toHEXA().toString().substring(0, 7));
            selector
              .find("#text-color")
              .parent()
              .find(".colorpicker-box")
              .css(
                "background",
                o_fill.getColor().toHEXA().toString().substring(0, 7)
              );
            animatedtext
              .find((x) => x.id == obj.id)
              .setProps(
                { fill: o_fill.getColor().toRGBA().toString() },
                canvas
              );
          }
          canvas.requestRenderAll();
        } else {
          if (colormode == "back") {
            selector
              .find("#canvas-color")
              .val(o_fill.getColor().toHEXA().toString().substring(0, 7));
            selector
              .find("#canvas-color")
              .parent()
              .find(".colorpicker-box")
              .css(
                "background",
                o_fill.getColor().toHEXA().toString().substring(0, 7)
              );
            canvas.setBackgroundColor(o_fill.getColor().toRGBA().toString());
            canvas.requestRenderAll();
          }
        }
      })
      .on("show", (color, instance) => {
        var rect = selector
          .find(".colorpicker:focus")[0]
          .getBoundingClientRect();
        var top = rect.top + rect.height + 5;
        const style = instance.getRoot().app.style;
        style.left = rect.left + "px";
        style.top = top + "px";
      })
      .on("hide", (instance) => {
        save();
      });

    // Canvas recorder initialization
    canvasrecord = new fabric.Canvas("canvasrecord", {
      preserveObjectStacking: true,
      backgroundColor: sets.backgroundColor,
      width: artboard.width,
      height: artboard.height,
    });

    // Uploader selection area
    const selectbox = new SelectionArea({
      class: "selection-area",
      selectables: [".keyframe"],
      container: "#timeline",
      startareas: ["html"],
      boundaries: ["#timeline"],
      startThreshold: 10,
      allowTouch: true,
      intersect: "touch",
      overlap: "invert",
      singleTap: {
        allow: false,
        intersect: "native",
      },
      scrolling: {
        speedDivider: 10,
        manualSpeed: 750,
      },
    });

    selectbox
      .on("beforestart", (evt) => {
        if (
          $(evt.event.target).hasClass("keyframe") ||
          $(evt.event.target).attr("id") == "seekbar" ||
          $(evt.event.target).parent().hasClass("main-row") ||
          $(evt.event.target).hasClass("main-row") ||
          $(evt.event.target).hasClass("trim-row") ||
          evt.event.which === 3
        ) {
          return false;
        }
      })
      .on("start", (evt) => {})
      .on("move", (evt) => {})
      .on("stop", (evt) => {
        selector.find(".keyframe-selected").removeClass("keyframe-selected");
        shiftkeys = [];
        if (evt.store.selected.length == 0) {
          selector.find(".keyframe-selected").removeClass("keyframe-selected");
        } else {
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          evt.store.selected.forEach(function (key) {
            shiftkeys.push({
              keyframe: key,
              offset: $(key).offset().left,
            });
            $(key).addClass("keyframe-selected");
          });
        }
      });

    // Center line reference
    function initLines() {
      if (canvas.getItemById("center_h")) {
        canvas.remove(canvas.getItemById("center_h"));
        canvas.remove(canvas.getItemById("center_v"));
      }
      if (canvas.getItemById("line_h")) {
        canvas.remove(canvas.getItemById("line_h"));
        canvas.remove(canvas.getItemById("line_v"));
      }

      // Canvas center reference
      canvas.add(
        new fabric.Line(
          [
            canvas.get("width") / 2,
            0,
            canvas.get("width") / 2,
            canvas.get("height"),
          ],
          {
            opacity: 0,
            selectable: false,
            evented: false,
            id: "center_h",
          }
        )
      );
      canvas.add(
        new fabric.Line(
          [
            0,
            canvas.get("height") / 2,
            canvas.get("width"),
            canvas.get("height") / 2,
          ],
          {
            opacity: 0,
            selectable: false,
            evented: false,
            id: "center_v",
          }
        )
      );

      // Canvas alignemnt guides
      line_h = new fabric.Line(
        [
          canvas.get("width") / 2,
          artboard.get("top"),
          canvas.get("width") / 2,
          artboard.get("height") + artboard.get("top"),
        ],
        {
          stroke: "#4affff",
          opacity: 0,
          selectable: false,
          evented: false,
          id: "line_h",
        }
      );
      line_v = new fabric.Line(
        [
          artboard.get("left"),
          canvas.get("height") / 2,
          artboard.get("width") + artboard.get("left"),
          canvas.get("height") / 2,
        ],
        {
          stroke: "#4affff",
          opacity: 0,
          selectable: false,
          evented: false,
          id: "line_v",
        }
      );
      canvas.add(line_h);
      canvas.add(line_v);
    }

    // Align controls
    function alignControls(object, type) {
      if (type == "align-top") {
        object.set(
          "top",
          artboard.get("top") +
            (object.get("height") * object.get("scaleY")) / 2
        );
      } else if (type == "align-center-v") {
        object.set("top", artboard.get("top") + artboard.get("height") / 2);
      } else if (type == "align-bottom") {
        object.set(
          "top",
          artboard.get("top") +
            artboard.get("height") -
            (object.get("height") * object.get("scaleY")) / 2
        );
      } else if (type == "align-left") {
        object.set(
          "left",
          artboard.get("left") +
            (object.get("width") * object.get("scaleX")) / 2
        );
      } else if (type == "align-center-h") {
        object.set("left", artboard.get("left") + artboard.get("width") / 2);
      } else {
        object.set(
          "left",
          artboard.get("left") +
            artboard.get("width") -
            (object.get("width") * object.get("scaleX")) / 2
        );
      }
    }

    // Align object
    selector.on("click", ".align", function () {
      const type = $(this).attr("id");
      const object = canvas.getActiveObject();
      if (canvas.getActiveObject().type == "activeSelection") {
        const tempselection = canvas.getActiveObject();
        canvas.discardActiveObject();
        tempselection._objects.forEach(function (object) {
          alignControls(object, type);
          canvas.requestRenderAll();
          newKeyframe("left", object, currenttime, object.get("left"), true);
          newKeyframe("top", object, currenttime, object.get("top"), true);
        });
        reselect(tempselection);
      } else {
        alignControls(object, type);
        canvas.requestRenderAll();
        newKeyframe("left", object, currenttime, object.get("left"), true);
        newKeyframe("top", object, currenttime, object.get("top"), true);
      }
      save();
    });

    // Alignment guides
    function centerLines(e) {
      if (!cropping) {
        line_h.opacity = 0;
        line_v.opacity = 0;
        canvas.requestRenderAll();
        const snapZone = 5;
        const obj_left = e.target.left;
        const obj_top = e.target.top;
        const obj_width = e.target.get("width") * e.target.get("scaleX");
        const obj_height = e.target.get("height") * e.target.get("scaleY");
        canvas.forEachObject(function (obj, index, array) {
          // Check for horizontal snapping
          function checkHSnap(a, b, snapZone, e, type) {
            if (a > b - snapZone && a < b + snapZone) {
              line_h.opacity = 1;
              line_h.bringToFront();
              var value = b;
              if (type == 1) {
                value = b;
              } else if (type == 2) {
                value =
                  b - (e.target.get("width") * e.target.get("scaleX")) / 2;
              } else if (type == 3) {
                value =
                  b + (e.target.get("width") * e.target.get("scaleX")) / 2;
              }
              e.target
                .set({
                  left: value,
                })
                .setCoords();
              line_h
                .set({
                  x1: b,
                  y1: artboard.get("top"),
                  x2: b,
                  y2: artboard.get("height") + artboard.get("top"),
                })
                .setCoords();
              canvas.requestRenderAll();
            }
          }

          // Check for vertical snapping
          function checkVSnap(a, b, snapZone, e, type) {
            if (a > b - snapZone && a < b + snapZone) {
              line_v.opacity = 1;
              line_v.bringToFront();
              var value = b;
              if (type == 1) {
                value = b;
              } else if (type == 2) {
                value =
                  b - (e.target.get("height") * e.target.get("scaleY")) / 2;
              } else if (type == 3) {
                value =
                  b + (e.target.get("height") * e.target.get("scaleY")) / 2;
              }
              e.target
                .set({
                  top: value,
                })
                .setCoords();
              line_v
                .set({
                  y1: b,
                  x1: artboard.get("left"),
                  y2: b,
                  x2: artboard.get("width") + artboard.get("left"),
                })
                .setCoords();
              canvas.requestRenderAll();
            }
          }
          if (obj != e.target && obj != line_h && obj != line_v) {
            var check1 = "";
            var check2 = "";
            if (obj.get("id") == "center_h" || obj.get("id") == "center_v") {
              check1 = [[obj_left, obj.get("left"), 1]];
              check2 = [[obj_top, obj.get("top"), 1]];

              for (var i = 0; i < check1.length; i++) {
                checkHSnap(
                  check1[i][0],
                  check1[i][1],
                  snapZone,
                  e,
                  check1[i][2]
                );
                checkVSnap(
                  check2[i][0],
                  check2[i][1],
                  snapZone,
                  e,
                  check2[i][2]
                );
              }
            } else {
              check1 = [
                [obj_left, obj.get("left"), 1],
                [
                  obj_left,
                  obj.get("left") + (obj.get("width") * obj.get("scaleX")) / 2,
                  1,
                ],
                [
                  obj_left,
                  obj.get("left") - (obj.get("width") * obj.get("scaleX")) / 2,
                  1,
                ],
                [obj_left + obj_width / 2, obj.get("left"), 2],
                [
                  obj_left + obj_width / 2,
                  obj.get("left") + (obj.get("width") * obj.get("scaleX")) / 2,
                  2,
                ],
                [
                  obj_left + obj_width / 2,
                  obj.get("left") - (obj.get("width") * obj.get("scaleX")) / 2,
                  2,
                ],
                [obj_left - obj_width / 2, obj.get("left"), 3],
                [
                  obj_left - obj_width / 2,
                  obj.get("left") + (obj.get("width") * obj.get("scaleX")) / 2,
                  3,
                ],
                [
                  obj_left - obj_width / 2,
                  obj.get("left") - (obj.get("width") * obj.get("scaleX")) / 2,
                  3,
                ],
              ];
              check2 = [
                [obj_top, obj.get("top"), 1],
                [
                  obj_top,
                  obj.get("top") + (obj.get("height") * obj.get("scaleY")) / 2,
                  1,
                ],
                [
                  obj_top,
                  obj.get("top") - (obj.get("height") * obj.get("scaleY")) / 2,
                  1,
                ],
                [obj_top + obj_height / 2, obj.get("top"), 2],
                [
                  obj_top + obj_height / 2,
                  obj.get("top") + (obj.get("height") * obj.get("scaleY")) / 2,
                  2,
                ],
                [
                  obj_top + obj_height / 2,
                  obj.get("top") - (obj.get("height") * obj.get("scaleY")) / 2,
                  2,
                ],
                [obj_top - obj_height / 2, obj.get("top"), 3],
                [
                  obj_top - obj_height / 2,
                  obj.get("top") + (obj.get("height") * obj.get("scaleY")) / 2,
                  3,
                ],
                [
                  obj_top - obj_height / 2,
                  obj.get("top") - (obj.get("height") * obj.get("scaleY")) / 2,
                  3,
                ],
              ];

              for (var ii = 0; ii < check1.length; ii++) {
                checkHSnap(
                  check1[ii][0],
                  check1[ii][1],
                  snapZone,
                  e,
                  check1[ii][2]
                );
                checkVSnap(
                  check2[ii][0],
                  check2[ii][1],
                  snapZone,
                  e,
                  check2[ii][2]
                );
              }
            }
          }
        });
      }
    }

    // Select2 helper
    function select2format(option) {
      var originalOption = option.element;
      if ($(originalOption).data("font")) {
        return $(
          '<div class="select2-item" style="font-family:' +
            $(originalOption).data("font") +
            '">' +
            option.text +
            "</div>"
        );
      } else {
        return $('<div class="select2-item">' + option.text + "</div>");
      }
    }

    // Lazyload
    var lazyLoadInstance = new LazyLoad({
      container: document.querySelector(".scrollingPanel"),
      callback_error: (img) => {
        img.setAttribute("src", sets.baseURL + "assets/placeholder.png");
        selector.find(img).parent().css("min-height", "auto");
        selector.find(img).parent().find(".img-loader").remove();
      },
      callback_loaded: (img) => {
        selector.find(img).parent().css("min-height", "auto");
        selector.find(img).parent().find(".img-loader").remove();
      },
    });

    /* Dropdown Menu */
    selector.find(".dropdown-wrap").on("click", function () {
      if ($(this).hasClass("opened")) {
        $(this).removeClass("opened");
        $(this).find(".dropdown").hide();
      } else {
        $(this).addClass("opened");
        $(this).find(".dropdown").show();
      }
    });

    /* Numeric validation */
    selector.on(
      "input paste keyup keydown",
      'input[type="number"]',
      function (e) {
        const regex = /^-?\d+(\.\d+)?$/;
        const inputValue = parseInt(e.target.value);
        if (!regex.test(inputValue)) {
          e.target.value = 0;
        } else if (e.target.max && inputValue > e.target.max) {
          e.target.value = e.target.max;
        } else if (e.target.min && inputValue < e.target.min) {
          e.target.value = e.target.min;
        }
      }
    );

    /* Text Input */
    selector.on("input paste", "#textarea-input", function () {
      $(this).focus();
      editinglayer = true;
      canvas.getActiveObject().set("text", $(this).val());
      canvas.requestRenderAll();
    });

    // Theme switcher
    selector.find("#theme-switcher").on("click", function () {
      selector.addClass("no-transition");
      var theme = "dark";
      if ($(this).hasClass("light")) {
        $(this).removeClass("light");
        $(this).addClass("dark");
        $(this).html('<span class="material-icons">wb_sunny</span>');
      } else if ($(this).hasClass("dark")) {
        theme = "light";
        $(this).removeClass("dark");
        $(this).addClass("light");
        $(this).html('<span class="material-icons">nightlight</span>');
      }
      var link = sets.baseURL + "css/" + theme + ".css";
      $("#theme-css").attr("href", link);
      setTimeout(function () {
        selector.removeClass("no-transition");
      }, 500);
    });

    // Init font picker
    function initFontPicker() {
      var fontPicker = selector.find("#font-picker").select2({
        theme: "dark",
        width: "100%",
        templateSelection: select2format,
        templateResult: select2format,
        allowHtml: true,
      });
      // Font Preview
      var fontTimeOut = 0;
      fontPicker.on("select2:open", function () {
        selector.find("#select2-font-picker-results").scroll(function () {
          $(this)
            .find("li")
            .each(function () {
              var item = $(this);
              if (item.is(":in-viewport( 0, #select2-font-picker-results)")) {
                if (!loadedFonts.includes(item.attr("id"))) {
                  WebFont.load({
                    google: {
                      families: [
                        item.find(".select2-item").html() +
                          ":italic,regular,bold",
                      ],
                    },
                    inactive: function () {
                      WebFont.load({
                        custom: {
                          families: [
                            item.find(".select2-item").html() +
                              ":italic,regular,bold",
                          ],
                          urls: [
                            "https://fonts.googleapis.com/css?family=" +
                              item.find(".select2-item").html() +
                              "&text=abc",
                          ],
                        },
                        active: function () {
                          console.log("active");
                        },
                      });
                    },
                  });
                  loadedFonts.push(item.attr("id"));
                }
              }
            });
        });
        selector.on(
          "keypress",
          ".select2-search .select2-search__field",
          function (e) {
            window.clearTimeout(fontTimeOut);
            fontTimeOut = setTimeout(function () {
              selector.find("#select2-font-picker-results").trigger("scroll");
            }, 500);
          }
        );
      });
    }

    // Update panel (when selecting / de-selecting objects)
    function updatePanel(selection) {
      if (selection) {
        selector.find("#object-specific").html("");
        if (
          !selector.find("#object-settings-select").hasClass("tool-active") &&
          document.body.clientWidth >= 700
        ) {
          selector.find("#object-settings-select").trigger("click");
        }
      }
      if (!selection) {
        selector.find("#object-specific").html(canvas_panel);
        selector.find("#canvas-duration").val(duration / 1000);
        updatePanelValues();
        colormode = "back";
        o_fill.setColor(canvas.backgroundColor);
      } else if (
        selection &&
        canvas.getActiveObject().get("type") == "activeSelection"
      ) {
        selector.find("#object-specific").append(video_panel);
        updatePanelValues();
      } else if (
        selection &&
        canvas.getActiveObjects().length == 1 &&
        canvas.getActiveObject().get("assetType") == "audio"
      ) {
        selector.find("#object-specific").html(audio_panel);
      } else if (
        selection &&
        canvas.getActiveObjects().length == 1 &&
        canvas.getActiveObject().get("type") != "group"
      ) {
        if (
          canvas.getActiveObject().get("type") == "image" &&
          !canvas.getActiveObject().get("assetType")
        ) {
          selector.find("#object-specific").prepend(image_more_panel);
          selector.find("#object-specific").append(back_panel);
          if (!cropping) {
            checkFilter();
          }
        } else {
          if (canvas.getActiveObject().get("assetType") != "video") {
            selector.find("#object-specific").append(back_panel);
          }
        }
        if (canvas.getActiveObject().get("assetType") != "video") {
          selector.find("#object-specific").append(stroke_panel);
          selector.find("#object-specific").append(shadow_panel);
          selector.find("#object-specific").append(object_panel);
        } else {
          selector.find("#object-specific").append(video_panel);
        }

        if (
          canvas.getActiveObject().get("type") == "path" ||
          canvas.getActiveObject().get("type") == "circle" ||
          canvas.getActiveObject().get("type") == "rect" ||
          canvas.getActiveObject().get("type") == "polygon"
        ) {
          selector.find("#object-specific").prepend(path_panel);
        } else if (
          canvas.getActiveObject().get("type") == "i-text" ||
          canvas.getActiveObject().get("type") == "textbox"
        ) {
          selector.find("#object-specific").prepend(text_panel);
          updateTextValues();
        }
        updatePanelValues();
      } else if (
        canvas.getActiveObjects().length > 1 ||
        canvas.getActiveObject().get("type") == "group"
      ) {
        if (canvas.getActiveObject().get("type") == "group") {
          if (canvas.getActiveObject().get("assetType") == "animatedText") {
            selector.find("#object-specific").prepend(animated_text_panel);
            selector.find("#object-specific").append(back_panel);
            selector.find("#object-specific").append(start_animation_panel);
            selector.find("#object-specific").append(object_panel);
            fonts.forEach(function (font) {
              selector
                .find("#font-picker")
                .append(
                  $("<option></option>")
                    .attr("value", font)
                    .text(font)
                    .attr("data-font", font)
                    .text(font)
                );
            });
            selector
              .find("#font-picker")
              .val(
                animatedtext.find((x) => x.id == canvas.getActiveObject().id)
                  .props.fontFamily
              );
            selector
              .find("#anim-weight")
              .val(
                animatedtext.find((x) => x.id == canvas.getActiveObject().id)
                  .props.fontWeight
              );
            initFontPicker();
            selector
              .find("#text-color")
              .val(
                convertToHex(
                  animatedtext.find((x) => x.id == canvas.getActiveObject().id)
                    .props.fill
                )
              );
            selector
              .find("#text-color")
              .parent()
              .find(".colorpicker-box")
              .css(
                "background",
                convertToHex(
                  animatedtext.find((x) => x.id == canvas.getActiveObject().id)
                    .props.fill
                )
              );
            selector
              .find("#preset-picker")
              .val(
                animatedtext.find((x) => x.id == canvas.getActiveObject().id)
                  .props.preset
              );
            selector
              .find(".order-toggle-item-active")
              .removeClass("order-toggle-item-active");
            selector
              .find(".order-toggle-item-active-2")
              .removeClass("order-toggle-item-active-2");
            if (
              animatedtext.find((x) => x.id == canvas.getActiveObject().id)
                .props.order == "backward"
            ) {
              selector
                .find("#order-backward")
                .addClass("order-toggle-item-active");
            } else {
              selector
                .find("#order-forward")
                .addClass("order-toggle-item-active");
            }
            if (
              animatedtext.find((x) => x.id == canvas.getActiveObject().id)
                .props.typeAnim == "letter"
            ) {
              selector
                .find("#type-letters")
                .addClass("order-toggle-item-active-2");
            } else {
              selector
                .find("#type-words")
                .addClass("order-toggle-item-active-2");
            }
            selector
              .find("#easing-picker")
              .val(
                animatedtext.find((x) => x.id == canvas.getActiveObject().id)
                  .props.easing
              );
            selector
              .find("#durationinput")
              .val(
                parseInt(
                  animatedtext.find((x) => x.id == canvas.getActiveObject().id)
                    .props.duration
                ) / 1000
              );
          } else {
            if (canvas.getActiveObject().get("assetType") == "svg") {
              selector.find("#object-specific").append(svg_panel);
              setFillColors();
            }
            selector.find("#object-specific").append(back_panel);
            selector.find("#object-specific").append(object_panel);
          }
        } else {
          selector.find("#object-specific").append(back_panel);
          if (canvas.getActiveObject().get("assetType") != "animatedText") {
            selector.find("#object-specific").append(object_panel);
          }
        }
        updatePanelValues();
      }
      if (selection) {
        selector.find("#object-specific").prepend(back_to_panel);
      }
    }

    // Convert to hex
    function convertToHex(nonHexColorString) {
      var ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = nonHexColorString;
      return ctx.fillStyle.toUpperCase();
    }

    // Toggle animation order
    selector.on(
      "click",
      ".order-toggle-item:not(.order-toggle-item-active)",
      function () {
        var object = canvas.getActiveObject();
        selector
          .find(".order-toggle-item-active")
          .removeClass("order-toggle-item-active");
        if ($(this).attr("id") == "order-backward") {
          animatedtext
            .find((x) => x.id == object.id)
            .setProp({ order: "backward" }, canvas);
        } else if ($(this).attr("id") == "order-forward") {
          animatedtext
            .find((x) => x.id == object.id)
            .setProp({ order: "forward" }, canvas);
        }
        $(this).addClass("order-toggle-item-active");
        animate(false, currenttime);
        save();
      }
    );

    // Toggle animation type
    selector.on(
      "click",
      ".order-toggle-item-2:not(.order-toggle-item-active-2)",
      function () {
        var object = canvas.getActiveObject();
        selector
          .find(".order-toggle-item-active-2")
          .removeClass("order-toggle-item-active-2");
        if ($(this).attr("id") == "type-words") {
          animatedtext
            .find((x) => x.id == object.id)
            .setProp({ typeAnim: "word" }, canvas);
        } else if ($(this).attr("id") == "type-letters") {
          animatedtext
            .find((x) => x.id == object.id)
            .setProp({ typeAnim: "letter" }, canvas);
        }
        $(this).addClass("order-toggle-item-active-2");
        animate(false, currenttime);
        save();
      }
    );

    // Update text values
    function updateTextValues() {
      const object = canvas.getActiveObject();
      fonts.forEach(function (font) {
        selector
          .find("#font-picker")
          .append(
            $("<option></option>")
              .attr("value", font)
              .text(font)
              .attr("data-font", font)
              .text(font)
          );
      });
      selector.find("#font-picker").val(object.get("fontFamily"));
      initFontPicker();
      selector
        .find("#text-h")
        .val(parseFloat((object.get("charSpacing") / 10).toFixed(2)));
      if (object.get("textAlign") == "left") {
        selector.find("#align-text-left").addClass("align-text-active");
      } else if (object.get("textAlign") == "center") {
        selector.find("#align-text-center").addClass("align-text-active");
      } else if (object.get("textAlign") == "right") {
        selector.find("#align-text-right").addClass("align-text-right-active");
      }
      if (
        object.get("fontWeight") == "bold" ||
        object.get("fontWeight") == 700
      ) {
        selector.find("#format-bold").addClass("format-text-active");
      }
      if (object.get("fontStyle") == "italic") {
        selector.find("#format-italic").addClass("format-text-active");
      }
      if (object.get("underline") == true) {
        selector.find("#format-underline").addClass("format-text-active");
      }
      if (object.get("linethrough") == true) {
        selector.find("#format-strike").addClass("format-text-active");
      }
    }

    // Update panel inputs based on object values
    function updatePanelValues() {
      if (canvas.getActiveObject()) {
        setting = true;
        var tempstore = false;
        var object = canvas.getActiveObject();
        if (
          canvas.getActiveObjects.length > 1 ||
          object.get("type") == "activeSelection"
        ) {
          object = object.toGroup();
          object.set({
            shadow: {
              blur: 0,
              color: "black",
              offsetX: 0,
              offsetY: 0,
              opacity: 0,
            },
          });
          tempstore = true;
        }
        if (object.get("type") == "i-text" || object.get("type") == "textbox") {
          selector.find("#textarea-input").val(object.get("text"));
        }
        if (object.get("assetType") == "animatedText") {
          selector
            .find("#animated-text input")
            .val(animatedtext.find((x) => x.id == object.id).text);
        }
        selector
          .find("#object-x input")
          .val(
            parseFloat(
              (
                object.get("left") -
                artboard.get("left") -
                (object.get("width") * object.get("scaleX")) / 2
              ).toFixed(2)
            )
          );
        selector
          .find("#object-y input")
          .val(
            parseFloat(
              (
                object.get("top") -
                artboard.get("top") -
                (object.get("height") * object.get("scaleY")) / 2
              ).toFixed(2)
            )
          );
        selector.find("#object-o").val(parseFloat(object.get("opacity")));
        selector
          .find("#object-w input")
          .val(
            parseFloat((object.get("width") * object.get("scaleX")).toFixed(2))
          );
        selector
          .find("#object-h input")
          .val(
            parseFloat((object.get("height") * object.get("scaleY")).toFixed(2))
          );
        selector
          .find("#object-r input")
          .val(parseFloat(object.get("angle").toFixed(2)));
        selector
          .find("#object-stroke input")
          .val(parseFloat(object.get("strokeWidth").toFixed(2)));
        if (object.get("type") != "group") {
          selector
            .find("#object-shadow-x input")
            .val(parseFloat(object.shadow.offsetX.toFixed(2)));
          selector
            .find("#object-shadow-y input")
            .val(parseFloat(object.shadow.offsetY.toFixed(2)));
          selector
            .find("#object-blur input")
            .val(parseFloat(object.shadow.blur.toFixed(2)));
          colormode = "stroke";
          o_fill.setColor(object.get("stroke"));
          colormode = "shadow";
          o_fill.setColor(object.shadow.color);
        }
        if (
          object.get("type") == "path" ||
          object.get("type") == "i-text" ||
          object.get("type") == "textbox" ||
          object.get("type") == "rect" ||
          object.get("type") == "circle" ||
          object.get("type") == "polygon"
        ) {
          colormode = "fill";
          o_fill.setColor(object.get("fill"));
        }
        if (tempstore) {
          object.toActiveSelection();
          canvas.requestRenderAll();
        }
        setting = false;
      } else {
        selector.find("#canvas-w").val(artboard.get("width"));
        selector.find("#canvas-h").val(artboard.get("height"));
      }
    }

    // Update object values based on panel rangeslider values
    selector.on("change", ".rangeslider", function () {
      var id = $(this).attr("id");
      var obj = canvas.getActiveObject();
      if (id == "object-o") {
        newKeyframe(
          "opacity",
          obj,
          currenttime,
          parseFloat($(this).val()),
          true
        );
      } else if (id == "text-h") {
        newKeyframe(
          "charSpacing",
          obj,
          currenttime,
          parseFloat($(this).val()) * 10,
          true
        );
      }
      if (id != "timeline-zoom" && id.substring(0, 6) != "qrcode") {
        save();
      }
    });

    selector.on("input", ".rangeslider", function () {
      if ($(this).attr("id") == "timeline-zoom") {
        setTimelineZoom(-1 * (parseInt($(this).val()) - 51));
      }
      if (canvas.getActiveObjects().length > 0) {
        if ($(this).val()) {
          var obj = canvas.getActiveObject();
          if (obj.get("assetType") && obj.get("assetType") == "video") {
            return false;
          }
          if ($(this).attr("id") == "object-o") {
            canvas.getActiveObject().set("opacity", parseFloat($(this).val()));
            canvas.requestRenderAll();
          } else if ($(this).attr("id") == "text-h") {
            canvas
              .getActiveObject()
              .set("charSpacing", parseFloat($(this).val()) * 10);
            canvas.requestRenderAll();
          } else if ($(this).attr("id") == "filter-brightness") {
            if (obj.filters.find((i) => i.type == "Brightness")) {
              obj.filters.find((i) => i.type == "Brightness").brightness =
                parseInt($(this).val()) / 100;
            } else {
              obj.filters.push(
                new f.Brightness({ brightness: parseInt($(this).val()) / 100 })
              );
            }
            obj.applyFilters();
            canvas.requestRenderAll();
          } else if ($(this).attr("id") == "filter-contrast") {
            if (obj.filters.find((i) => i.type == "Contrast")) {
              obj.filters.find((i) => i.type == "Contrast").contrast =
                parseInt($(this).val()) / 100;
            } else {
              obj.filters.push(
                new f.Contrast({ contrast: parseInt($(this).val()) / 100 })
              );
            }
            obj.applyFilters();
            canvas.requestRenderAll();
          } else if ($(this).attr("id") == "filter-saturation") {
            if (obj.filters.find((i) => i.type == "Saturation")) {
              obj.filters.find((i) => i.type == "Saturation").saturation =
                parseInt($(this).val()) / 100;
            } else {
              obj.filters.push(
                new f.Saturation({ saturation: parseInt($(this).val()) / 100 })
              );
            }
            obj.applyFilters();
            canvas.requestRenderAll();
          } else if ($(this).attr("id") == "filter-vibrance") {
            if (obj.filters.find((i) => i.type == "Vibrance")) {
              obj.filters.find((i) => i.type == "Vibrance").vibrance =
                parseInt($(this).val()) / 100;
            } else {
              obj.filters.push(
                new f.Vibrance({ vibrance: parseInt($(this).val()) / 100 })
              );
            }
            obj.applyFilters();
            canvas.requestRenderAll();
          } else if ($(this).attr("id") == "filter-hue") {
            if (obj.filters.find((i) => i.type == "HueRotation")) {
              obj.filters.find((i) => i.type == "HueRotation").rotation =
                parseInt($(this).val()) / 100;
            } else {
              obj.filters.push(
                new f.HueRotation({ rotation: parseInt($(this).val()) / 100 })
              );
            }
            obj.applyFilters();
            canvas.requestRenderAll();
          } else if ($(this).attr("id") == "filter-noise") {
            if (obj.filters.find((i) => i.type == "Noise")) {
              obj.filters.find((i) => i.type == "Noise").noise = parseInt(
                $(this).val()
              );
            } else {
              obj.filters.push(new f.Noise({ noise: parseInt($(this).val()) }));
            }
            obj.applyFilters();
            canvas.requestRenderAll();
          } else if ($(this).attr("id") == "filter-blur") {
            if (obj.filters.find((i) => i.type == "Blur")) {
              obj.filters.find((i) => i.type == "Blur").blur = parseInt(
                $(this).val()
              );
            } else {
              obj.filters.push(new f.Blur({ blur: parseInt($(this).val()) }));
            }
            obj.applyFilters();
            canvas.requestRenderAll();
          }
        }
      }
    });

    // Update object values based on panel input values
    selector.on("change", ".form-field", function () {
      if (canvas.getActiveObjects().length > 0) {
        if ($(this).val()) {
          var object = canvas.getActiveObject();
          if (
            $(this).parent().attr("id") == "animated-text" ||
            $(this).attr("id") == "anim-weight"
          ) {
            return false;
          }
          if (object.get("assetType") && object.get("assetType") == "video") {
            return false;
          }
          if ($(this).parent().attr("id") == "animated-text-duration") {
            var obj = p_keyframes.find((x) => x.id == object.id);
            var length = obj.end - obj.start;
            if (
              parseInt(selector.find("#durationinput").val()) * 1000 >
              length
            ) {
              selector.find("#durationinput").val(length / 1000);
            }
            animatedtext
              .find((x) => x.id == object.id)
              .setProp(
                {
                  duration:
                    parseInt(selector.find("#durationinput").val()) * 1000,
                },
                canvas
              );
            save();
            return false;
          }
          var id = $(this).parent().attr("id");
          var strokeW = 0;
          if (selector.find("#object-stroke").length) {
            strokeW = parseFloat(selector.find("#object-stroke input").val());
          }
          object.set({
            left:
              parseFloat(selector.find("#object-x input").val()) +
              artboard.get("left") +
              (object.get("width") * object.get("scaleX")) / 2,
            top:
              parseFloat(selector.find("#object-y input").val()) +
              artboard.get("top") +
              (object.get("height") * object.get("scaleY")) / 2,
            scaleX: parseFloat(
              selector.find("#object-w input").val() / object.get("width")
            ),
            scaleY: parseFloat(
              selector.find("#object-h input").val() / object.get("height")
            ),
            angle: parseFloat(selector.find("#object-r input").val()),
            opacity: parseFloat(selector.find("#object-o").val()),
            strokeWidth: strokeW,
          });
          if (object.get("type") != "group") {
            object.set({
              shadow: {
                color: object.shadow.color,
                offsetX: parseFloat(
                  selector.find("#object-shadow-x input").val()
                ),
                offsetY: parseFloat(
                  selector.find("#object-shadow-y input").val()
                ),
                opacity: 1,
                blur: parseFloat(selector.find("#object-blur input").val()),
              },
            });
          }
          canvas.requestRenderAll();
          if (
            $(this)[0].hasAttribute("id") &&
            $(this).attr("id").substring(0, 6) == "qrcode"
          ) {
            return;
          } else if (
            $(this)[0].hasAttribute("id") &&
            $(this).attr("id") == "gif-fps"
          ) {
            return;
          }
          if ($(this).val().length > 0) {
            updatePanelValues();
          }
          keyframeChanges(object, id);
        }
      } else {
        if (
          $(this).attr("id") == "canvas-w" ||
          $(this).attr("id") == "canvas-h"
        ) {
          artboard.set({
            width: parseFloat(selector.find("#canvas-w").val()),
            height: parseFloat(selector.find("#canvas-h").val()),
          });
          canvas.requestRenderAll();
          resizeCanvas();
          return;
        } else if ($(this).attr("id") == "canvas-duration") {
          if (!isNaN(parseFloat($(this).val()))) {
            setDuration(parseFloat($(this).val()) * 1000);
          }
        }
        if (
          $(this).attr("id") &&
          $(this).attr("id").substring(0, 6) == "qrcode"
        ) {
          return;
        } else if (
          $(this)[0].hasAttribute("id") &&
          $(this).attr("id") == "gif-fps"
        ) {
          return;
        } else {
          save();
        }
      }
    });

    selector.on("click", "#animatedset", function () {
      var object = canvas.getActiveObject();
      animatedtext
        .find((x) => x.id == object.id)
        .reset(
          $(this).parent().find("input").val(),
          animatedtext.find((x) => x.id == object.id).props,
          canvas,
          object
        );
    });

    // Toggle picker (maybe it could be condensed?)
    function togglePicker(item) {
      const object = canvas.getActiveObject();
      if (!o_fill.isOpen()) {
        var newcolorkeyframe = true;
        if (item.attr("id") == "object-color-fill") {
          colormode = "fill";
          o_fill.setColor(object.get("fill"));
        } else if (item.attr("id") == "object-color-stroke") {
          colormode = "stroke";
          o_fill.setColor(object.get("stroke"));
        } else if (item.attr("id") == "canvas-color") {
          colormode = "back";
          o_fill.setColor(canvas.backgroundColor);
        } else if (item.attr("id") == "text-color") {
          colormode = "text";
          o_fill.setColor(
            animatedtext.find((x) => x.id == object.id).props.fill
          );
        } else {
          colormode = "shadow";
          o_fill.setColor(object.shadow.color);
        }
        newcolorkeyframe = false;
        o_fill.show();
      } else {
        o_fill.hide();
      }
    }
    selector.on("click", "#canvas-color", function () {
      togglePicker($(this));
    });
    selector.on("click", "#object-color-fill", function () {
      togglePicker($(this));
    });
    selector.on("click", "#object-color-stroke", function () {
      togglePicker($(this));
    });
    selector.on("click", "#object-color-shadow", function () {
      togglePicker($(this));
    });
    selector.on("click", "#text-color", function () {
      togglePicker($(this));
    });

    // Set canvas preset
    selector.on("click", "#canvas-presets > div", function () {
      selector.find("#canvas-w").val($(this).attr("data-width"));
      selector.find("#canvas-h").val($(this).attr("data-height"));
      selector.find("#canvas-w").trigger("change");
      resizeCanvas();
    });

    // Populate shape grid on left panel
    function populateGrid(type) {
      var flag = false;
      if (type == "images-tab") {
        flag = false;
        selector.find("#uploaded-images-grid").html("");
        uploaded_images
          .slice()
          .reverse()
          .forEach(function (item) {
            if (!item.hidden) {
              flag = true;
              var type = item.src.substring(
                item.src.indexOf(":") + 1,
                item.src.indexOf(";")
              );
              if (type == "image/svg+xml") {
                selector
                  .find("#uploaded-images-grid")
                  .append(
                    "<div class='image-grid-item local-file img-wrap'><div class='download-media svg' title='download'><span class='material-icons'>download_for_offline</span></div><div class='delete-media' title='delete'><span class='material-icons'>remove</span></div><div class='img-loader'></div><img class='lazy object-svg' draggable=false data-src='" +
                      item.thumb +
                      "' data-file='" +
                      item.src +
                      "' data-type='" +
                      item.type +
                      "' data-key='" +
                      item.key +
                      "' /></div>"
                  );
              } else {
                selector
                  .find("#uploaded-images-grid")
                  .append(
                    "<div class='image-grid-item local-file img-wrap'><div class='download-media img' title='download'><span class='material-icons'>download_for_offline</span></div><div class='delete-media' title='delete'><span class='material-icons'>remove</span></div><div class='img-loader'></div><img class='lazy image-grid-img' draggable=false data-src='" +
                      item.thumb +
                      "' data-file='" +
                      item.src +
                      "' data-type='" +
                      item.type +
                      "' data-key='" +
                      item.key +
                      "' /></div>"
                  );
              }
            }
          });
        lazyLoadInstance.update();
        selector.find("#images-landing").remove();
        if (!flag) {
          selector
            .find("#uploaded-images-grid")
            .before(
              '<div id="images-landing"><div id="landing-text" class="notice">' +
                pmotionParams.t127 +
                "</div></div>"
            );
        }
      } else if (type == "videos-tab") {
        flag = false;
        selector.find("#uploaded-videos-grid").html("");
        uploaded_videos
          .slice()
          .reverse()
          .forEach(function (item) {
            if (!item.hidden) {
              flag = true;
              selector
                .find("#uploaded-videos-grid")
                .append(
                  "<div class='video-grid-item local-file img-wrap'><div class='download-media video' title='download'><span class='material-icons'>download_for_offline</span></div><div class='delete-media' title='delete'><span class='material-icons'>remove</span></div><div class='img-loader'></div><img class='lazy video-grid-img' draggable=false data-src='" +
                    item.thumb +
                    "' data-file='" +
                    item.src +
                    "' data-type='" +
                    item.type +
                    "' data-key='" +
                    item.key +
                    "' /></div>"
                );
            }
          });
        lazyLoadInstance.update();
        selector.find("#videos-landing").remove();
        if (!flag) {
          selector
            .find("#uploaded-videos-grid")
            .before(
              '<div id="videos-landing"><div id="landing-text" class="notice">' +
                pmotionParams.t128 +
                "</div></div>"
            );
        }
      }
    }

    // Add animated text
    selector.on("click", ".animated-text-item", function () {
      var newtext = new AnimatedText(pmotionParams.t92, {
        left: artboard.get("left") + artboard.get("width") / 2,
        top: artboard.get("top") + artboard.get("height") / 2,
        preset: $(this).attr("data-id"),
        typeAnim: "letter",
        order: "forward",
        fontFamily: sets.fontFamily,
        fontWeight: "normal",
        duration: 1000,
        easing: "linear",
        fill: "#000",
      });
      animatedtext.push(newtext);
      newtext.render(canvas);
    });

    var images_are_loaded = false;
    var videos_are_loaded = false;

    // Switch active panel in the library
    function updateBrowser(type) {
      selector.find("#browser-container > div").addClass("d-none");
      selector.find("#" + type).removeClass("d-none");
      if (type == "upload-tool") {
        selector.find("#images-tab").trigger("click");
        if (!images_are_loaded) {
          populateGrid("images-tab");
          images_are_loaded = true;
        }
      }
    }

    // Switch tab in the uploads depending on item being uploaded
    selector.on("click", ".upload-tab:not(.upload-tab-active)", function () {
      selector.find(".upload-tab-active").removeClass("upload-tab-active");
      $(this).addClass("upload-tab-active");
      var id = $(this).attr("id");
      if (id == "images-tab") {
        selector.find("#uploaded-videos").addClass("d-none");
        selector.find("#uploaded-images").removeClass("d-none");
        if (!images_are_loaded) {
          populateGrid("images-tab");
          images_are_loaded = true;
        }
      } else {
        selector.find("#uploaded-images").addClass("d-none");
        selector.find("#uploaded-videos").removeClass("d-none");
        if (!videos_are_loaded) {
          populateGrid("videos-tab");
          videos_are_loaded = true;
        }
      }
    });

    // Nav-tabs
    selector.on("click", ".nav-tab:not(.nav-tab-active)", function () {
      var wrap = $(this).parent().parent();
      var target = $(this).attr("data-target");
      wrap.find(".nav-tab-active").removeClass("nav-tab-active");
      $(this).addClass("nav-tab-active");
      wrap.find(".nav-tab-content").addClass("d-none");
      wrap.find("#" + target).removeClass("d-none");
    });

    // Switch tool
    selector.on("click", ".tool:not(.tool-active)", function () {
      if (selector.find("#browser").hasClass("collapsed")) {
        selector.find("#browser").removeClass("collapsed");
        selector.find("#canvas-area").removeClass("canvas-full");
        resizeCanvas();
      }
      selector.find(".tool").removeClass("tool-active");
      $(this).addClass("tool-active");
      updateBrowser($(this).attr("data-id"));
    });

    // Back to canvas settings
    selector.on("click", "#back-to-canvas-settings", function () {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    });

    // Drag object from the panel
    function dragObject(e, item) {
      if (e.which == 3) {
        return false;
      }
      var drag = item.clone();
      if (drag.width() === 0) {
        drag.width(340);
      }
      drag.css({
        background: "transparent",
        boxShadow: "none",
        color: "#4affff",
        border: "none",
        position: "absolute",
        zIndex: 9999999,
        left: item.offset().left,
        top: item.offset().top,
        width: canvas.getZoom() * drag.width(),
        pointerEvents: "none",
        opacity: 0,
        transition: "none",
      });
      drag.appendTo("body");
      var pageX = e.pageX;
      var pageY = e.pageY;
      var offset = drag.offset();
      var offsetx = drag.offset().left + drag.width() / 2 - e.pageX;
      var offsety = drag.offset().top + drag.height() / 2 - e.pageY;
      draggingPanel = true;
      var move = false;
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      function dragging(e) {
        selector.addClass("cursor-grabbing");
        selector.find("#bottom-area").addClass("noselect");
        selector.find("#toolbar").addClass("noselect");
        selector.find("#browser").addClass("noselect");
        selector.find("#properties").addClass("noselect");
        selector.find("#controls").addClass("noselect");
        move = true;
        var left = offset.left + (e.pageX - pageX);
        var top = offset.top + (e.pageY - pageY);
        drag.offset({ left: left, top: top });
        if (overCanvas) {
          drag.css({ opacity: 1 });
        } else {
          drag.css({ opacity: 0.5 });
        }
      }
      function released(e) {
        selector.removeClass("cursor-grabbing");
        selector.find("#bottom-area").removeClass("noselect");
        selector.find("#toolbar").removeClass("noselect");
        selector.find("#browser").removeClass("noselect");
        selector.find("#properties").removeClass("noselect");
        selector.find("#controls").removeClass("noselect");
        draggingPanel = false;
        selector.off("mousemove", dragging).off("mouseup", released);
        canvasx = canvas.getPointer(e).x;
        canvasy = canvas.getPointer(e).y;
        var xpos = canvasx + offsetx - artboard.get("left");
        var ypos = canvasy + offsety - artboard.get("top");
        if (!overCanvas && move) {
          drag.remove();
          return false;
        }
        if (move) {
          if (drag.hasClass("object-svg")) {
            newSVG(drag.attr("data-file"), xpos, ypos, 300, false);
          } else if (drag.hasClass("stock-img")) {
            selector.find("#load-image").addClass("loading-active");
            saveStockImage(drag.attr("data-file"), xpos, ypos, drag.width());
          } else if (drag.hasClass("stock-video")) {
            saveStockVideo(
              drag.attr("data-file"),
              drag.attr("data-src"),
              xpos,
              ypos
            );
          } else if (drag.hasClass("image-grid-img")) {
            selector.find("#load-image").addClass("loading-active");
            loadImage(drag.attr("data-file"), xpos, ypos, drag.width(), false);
          } else if (drag.hasClass("object-img")) {
            selector.find("#load-image").addClass("loading-active");
            loadImage(drag.attr("data-file"), xpos, ypos, drag.width(), false);
          } else if (drag.hasClass("add-text")) {
            if (drag.attr("id") == "heading-text") {
              newTextbox(
                80,
                700,
                pmotionParams.t93,
                canvasx - artboard.get("left"),
                canvasy - artboard.get("top"),
                drag.width(),
                false,
                drag.attr("data-font")
              );
            } else if (drag.attr("id") == "subheading-text") {
              newTextbox(
                60,
                500,
                pmotionParams.t94,
                canvasx - artboard.get("left"),
                canvasy - artboard.get("top"),
                drag.width(),
                false,
                drag.attr("data-font")
              );
            } else if (drag.attr("id") == "body-text") {
              newTextbox(
                50,
                400,
                pmotionParams.t95,
                canvasx - artboard.get("left"),
                canvasy - artboard.get("top"),
                drag.width(),
                false,
                drag.attr("data-font")
              );
            } else {
              newTextbox(
                60,
                400,
                pmotionParams.t96,
                canvasx - artboard.get("left"),
                canvasy - artboard.get("top"),
                drag.width(),
                false,
                drag.attr("data-font")
              );
            }
          } else if (drag.hasClass("video-grid-img")) {
            selector.find("#load-video").addClass("loading-active");
            loadVideo(drag.attr("data-file"), canvasx, canvasy);
          }
        } else {
          if (drag.hasClass("object-svg")) {
            newSVG(
              drag.attr("data-file"),
              artboard.get("left") + artboard.get("width") / 2,
              artboard.get("top") + artboard.get("height") / 2,
              300,
              true
            );
          } else if (drag.hasClass("stock-img")) {
            saveStockImage(
              drag.attr("data-file"),
              artboard.get("left") + artboard.get("width") / 2,
              artboard.get("top") + artboard.get("height") / 2,
              150
            );
          } else if (drag.hasClass("stock-video")) {
            saveStockVideo(
              drag.attr("data-file"),
              drag.attr("data-src"),
              artboard.get("left") + artboard.get("width") / 2,
              artboard.get("top") + artboard.get("height") / 2
            );
          } else if (drag.hasClass("image-grid-img")) {
            selector.find("#load-image").addClass("loading-active");
            loadImage(
              drag.attr("data-file"),
              artboard.get("left") + artboard.get("width") / 2,
              artboard.get("top") + artboard.get("height") / 2,
              150,
              true
            );
          } else if (drag.hasClass("object-img")) {
            selector.find("#load-image").addClass("loading-active");
            loadImage(
              drag.attr("data-file"),
              artboard.get("left") + artboard.get("width") / 2,
              artboard.get("top") + artboard.get("height") / 2,
              50,
              true
            );
          } else if (drag.hasClass("add-text")) {
            if (drag.attr("id") == "heading-text") {
              newTextbox(
                70,
                700,
                pmotionParams.t93,
                artboard.get("left") + artboard.get("width") / 2,
                artboard.get("top") + artboard.get("height") / 2,
                drag.width(),
                true,
                drag.attr("data-font")
              );
            } else if (drag.attr("id") == "subheading-text") {
              newTextbox(
                60,
                500,
                pmotionParams.t94,
                artboard.get("left") + artboard.get("width") / 2,
                artboard.get("top") + artboard.get("height") / 2,
                drag.width(),
                true,
                drag.attr("data-font")
              );
            } else if (drag.attr("id") == "body-text") {
              newTextbox(
                50,
                400,
                pmotionParams.t95,
                artboard.get("left") + artboard.get("width") / 2,
                artboard.get("top") + artboard.get("height") / 2,
                drag.width(),
                true,
                drag.attr("data-font")
              );
            } else {
              newTextbox(
                50,
                400,
                pmotionParams.t96,
                artboard.get("left") + artboard.get("width") / 2,
                artboard.get("top") + artboard.get("height") / 2,
                drag.width(),
                true,
                drag.attr("data-font")
              );
            }
          } else if (drag.hasClass("video-grid-item")) {
            selector.find("#load-video").addClass("loading-active");
            loadVideo(
              drag.attr("data-file"),
              artboard.get("left") + artboard.get("width") / 2,
              artboard.get("top") + artboard.get("height") / 2,
              true
            );
          }
        }
        drag.remove();
        save();
      }
      selector.on("mouseup", released).on("mousemove", dragging);
    }

    selector.on("mousedown", ".stock-img", function (e) {
      dragObject(e, $(this));
    });
    selector.on("mousedown", ".stock-video", function (e) {
      dragObject(e, $(this));
    });
    selector.on("mousedown", ".image-grid-img", function (e) {
      dragObject(e, $(this));
    });
    selector.on("mousedown", ".video-grid-img", function (e) {
      dragObject(e, $(this));
    });
    selector.on("mousedown", ".object-img", function (e) {
      dragObject(e, $(this));
    });
    selector.on("mousedown", ".object-svg", function (e) {
      dragObject(e, $(this));
    });
    selector.on("mousedown", ".add-text", function (e) {
      dragObject(e, $(this));
    });

    // Collapse library
    selector.on("click", ".tool-active", function () {
      selector.find("#browser").addClass("collapsed");
      selector.find("#canvas-area").addClass("canvas-full");
      selector.find(".tool-active").removeClass("tool-active");
      resizeCanvas();
    });

    selector.on("click", ".collapse", function () {
      selector.find("#browser").addClass("collapsed");
      selector.find("#canvas-area").addClass("canvas-full");
      selector.find(".tool-active").removeClass("tool-active");
      resizeCanvas();
    });

    // Set text preset
    selector.on("change", "#preset-picker", function () {
      var object = canvas.getActiveObject();
      animatedtext
        .find((x) => x.id == object.id)
        .setProp({ preset: $(this).val() }, canvas);
      save();
    });
    // Set text easing
    selector.on("change", "#easing-picker", function () {
      var object = canvas.getActiveObject();
      animatedtext
        .find((x) => x.id == object.id)
        .setProp({ easing: $(this).val() }, canvas);
      save();
    });

    // Download media from the panel
    function downloadMedia(e, item) {
      e.preventDefault();
      e.stopPropagation();
      var id = new Date().getTime();
      var imgData = item.parent().find("img").attr("data-file");
      var link = document.createElement("a");
      var blob = dataURLtoBlob(imgData);
      var objurl = URL.createObjectURL(blob);
      if (item.hasClass("svg")) {
        link.download = id + ".svg";
      } else if (item.hasClass("img")) {
        link.download = id + ".png";
      } else if (item.hasClass("video")) {
        link.download = id + ".mp4";
      }
      link.href = objurl;
      link.click();
    }
    selector.on("click", ".download-media", function (e) {
      downloadMedia(e, $(this));
    });

    // Delete media from the panel
    function deleteMedia(e, item) {
      e.preventDefault();
      e.stopPropagation();
      var key = item.parent().find("img").attr("data-key");
      deleteAsset(key);
    }
    selector.on("click", ".delete-media", function (e) {
      deleteMedia(e, $(this));
    });

    // Delete audio from the panel
    selector.on("click", ".audio-asset-delete", function (e) {
      e.preventDefault();
      e.stopPropagation();
      deleteAsset($(this).attr("data-id"));
      $(this).parent().parent().remove();
    });

    // Save layer name
    function saveLayerName() {
      if (selector.find(".name-active").length) {
        selector.find(".name-active").prop("readonly", true);
        if (selector.find(".name-active").val() == "") {
          selector.find(".name-active").val(pmotionParams.t139);
        }
        objects.find(
          (x) =>
            x.id ==
            selector.find(".name-active").parent().parent().attr("data-object")
        ).label = selector.find(".name-active").val();
        save();
        selector.find(".name-active").removeClass("name-active");
        if (window.getSelection) {
          if (window.getSelection().empty) {
            window.getSelection().empty();
          } else if (window.getSelection().removeAllRanges) {
            window.getSelection().removeAllRanges();
          }
        } else if (document.selection) {
          document.selection.empty();
        }
        editinglayer = false;
      }
    }
    selector.on("focusout", ".layer-custom-name", saveLayerName);

    // Zoom to specific level
    selector.on("click", ".zoom-item", function () {
      var zoom;
      if ($(this).attr("data-zoom") == "in") {
        zoom = parseFloat(canvas.getZoom()) + 0.05;
      } else if ($(this).attr("data-zoom") == "out") {
        zoom = parseFloat(canvas.getZoom()) - 0.05;
      } else {
        zoom = parseInt($(this).attr("data-zoom")) / 100;
      }
      canvas.setZoom(1);
      canvas.requestRenderAll();
      const vpw = canvas.width / zoom;
      const vph = canvas.height / zoom;
      const x = artboard.left + artboard.width / 2 - vpw / 2;
      const y = artboard.top + artboard.height / 2 - vph / 2;
      canvas.absolutePan({ x: x, y: y });
      canvas.setZoom(zoom);
      canvas.requestRenderAll();
      selector
        .find("#zoom-level .zoom-span")
        .html((canvas.getZoom() * 100).toFixed(0) + "%");
    });

    /* Adjust Zoom */
    function adjustZoom() {
      var zoomWidth = parseInt(artboard.get("width"));
      var zoomHeight = parseInt(artboard.get("height"));
      var canvasWidth = selector.find("#canvas-area").width();
      var canvasHeight = selector.find("#canvas-area").height();
      var currentZoom = canvas.getZoom() * 100;
      var requiredRatio = 100;
      var ratio = 1;
      var ratio2 = 0;
      if (zoomWidth < canvasWidth && zoomHeight < canvasHeight) {
        canvas.setZoom(1);
        canvas.requestRenderAll();
        const vpw = canvas.width / ratio.toFixed(2);
        const vph = canvas.height / ratio.toFixed(2);
        const x = artboard.left + artboard.width / 2 - vpw / 2;
        const y = artboard.top + artboard.height / 2 - vph / 2;
        canvas.absolutePan({ x: x, y: y });
        canvas.setZoom(1);
        canvas.requestRenderAll();
        selector.find("#zoom-level .zoom-span").html("100%");
      } else {
        if (zoomWidth > canvasWidth) {
          ratio = canvasWidth / zoomWidth;
          requiredRatio = ratio.toFixed(2) * 100;
          if (currentZoom > requiredRatio) {
            canvas.setZoom(1);
            canvas.requestRenderAll();
            const vpw = canvas.width / ratio.toFixed(2);
            const vph = canvas.height / ratio.toFixed(2);
            const x = artboard.left + artboard.width / 2 - vpw / 2;
            const y = artboard.top + artboard.height / 2 - vph / 2;
            canvas.absolutePan({ x: x, y: y });
            canvas.setZoom(ratio.toFixed(2));
            ratio2 = ratio.toFixed(2);
            canvas.requestRenderAll();
            selector
              .find("#zoom-level .zoom-span")
              .html(requiredRatio.toFixed(0) + "%");
          }
        }
        if (zoomHeight > canvasHeight) {
          ratio = canvasHeight / zoomHeight;
          requiredRatio = ratio.toFixed(2) * 100;
          if (currentZoom > requiredRatio) {
            if (ratio2 === 0 || ratio2 > ratio.toFixed(2)) {
              canvas.setZoom(1);
              canvas.requestRenderAll();
              const vpw = canvas.width / ratio.toFixed(2);
              const vph = canvas.height / ratio.toFixed(2);
              const x = artboard.left + artboard.width / 2 - vpw / 2;
              const y = artboard.top + artboard.height / 2 - vph / 2;
              canvas.absolutePan({ x: x, y: y });
              canvas.setZoom(ratio.toFixed(2));
              canvas.requestRenderAll();
              selector
                .find("#zoom-level .zoom-span")
                .html(requiredRatio.toFixed(0) + "%");
            }
          }
        }
      }
    }

    // Hide all modals
    function hideModals() {
      selector.find(".modal-open").removeClass("modal-open");
    }
    selector.find("#background-overlay").on("click", hideModals);

    // Open download modal
    function downloadModal() {
      if (!recording) {
        hideModals();
        selector.find("#download-modal").addClass("modal-open");
        selector.find("#background-overlay").addClass("modal-open");
      }
    }
    selector.find("#download").on("click", downloadModal);

    function searchInput(item) {
      var value = item.val().toLowerCase();
      if (value == "") {
        item.next().removeClass("show-delete");
      } else {
        item.next().addClass("show-delete");
      }
    }

    selector.on("click", "#pexels-video-search", function () {
      searchInput($(this));
    });
    selector.on("click", "#pexels-img-search", function () {
      searchInput($(this));
    });
    selector.on("click", "#pixabay-img-search", function () {
      searchInput($(this));
    });
    selector.on("click", "#pixabay-video-search", function () {
      searchInput($(this));
    });

    selector.on("click", ".delete-search", function () {
      $(this).parent().find("input").val("");
      $(this).parent().find("input").trigger("input");
      $(this).removeClass("show-delete");
    });

    /////////* PEXELS */////////

    // Video duration format
    function convertSecondsToMinutes(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const formattedTime = `${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

      return formattedTime;
    }

    // Handle API Errors
    function handleApiErrors(response) {
      if (!response.ok) {
        throw Error(response.status);
      }
      return response;
    }

    // Populate images
    function populatePexels(action, page) {
      var locale = sets.PexelsLanguage;
      var pagination = sets.PexelsPagination;
      var orientation = selector.find("#pexels-orientation").val();
      var color = selector.find("#pexels-color").val();
      var keyword = selector.find("#pexels-img-search").val();
      var url = "";
      var output = "";
      if (orientation == "" && color == "" && keyword == "") {
        url =
          "https://api.pexels.com/v1/curated?locale=" +
          locale +
          "&page=" +
          page +
          "&per_page=" +
          pagination;
      } else {
        url = "https://api.pexels.com/v1/search?locale=" + locale + "&";
        if (keyword != "") {
          keyword = encodeURIComponent(keyword);
          url += "query=" + keyword + "&";
        } else {
          url += "query=&";
        }
        if (orientation != "") {
          url += "orientation=" + orientation + "&";
        }
        if (color != "") {
          url += "color=" + color + "&";
        }
        url += "page=" + page + "&per_page=" + pagination;
      }
      var prefix = '<div id="pexels-img-grid" class="css-grid">';
      var suffix = "</div>";
      var button =
        '<button id="pexels-loadmore" type="button" class="btn btn-full primary" autocomplete="off" data-page="' +
        parseInt(page) +
        '">' +
        pmotionParams.t98 +
        "</button>";

      if (sets.apiCaching && sessionStorage.getItem(url)) {
        if (action == "search") {
          selector
            .find("#pexels-img-output")
            .html(prefix + sessionStorage.getItem(url) + suffix + button);
        } else {
          selector.find("#pexels-img-grid").append(sessionStorage.getItem(url));
          selector.find("#pexels-loadmore").remove();
          selector.find("#pexels-img-grid").after(button);
        }
        selector.find("#image-tool").css("pointer-events", "auto");
        selector.find("#image-tool").css("opacity", 1);
        lazyLoadInstance.update();
      } else {
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: sets.PexelsApiKey,
          },
          redirect: "follow",
        })
          .then(handleApiErrors)
          .then((response) => response.json())
          .then((data) => {
            var photos = data.photos;
            if (photos == "") {
              output =
                '<div class="notice notice-warning">' +
                pmotionParams.t97 +
                "</div>";
              if (action == "search") {
                selector.find("#pexels-img-output").html(output);
                selector.find("#pexels-loadmore").prop("disabled", false);
              } else {
                selector.find("#pexels-loadmore").prop("disabled", true);
              }
            } else {
              $.each(photos, function (index, val) {
                var url = val.url;
                var src = val.src;
                var thumb = src.tiny;
                var full = src[sets.PexelsImgSize];
                var alt = val.alt;
                output += '<div class="image-grid-item">';
                output +=
                  '<a href="' +
                  url +
                  '" class="stock-url" target="_blank"><span class="material-icons">info</span></a>';
                output += '<div class="img-wrap">';
                output += '<div class="img-loader"></div>';
                output +=
                  '<img class="lazy stock-img" draggable=false data-src="' +
                  thumb +
                  '" data-file="' +
                  full +
                  '" title="' +
                  alt +
                  '" />';
                output += "</div>";
                output += "</div>";
              });
              if (action == "search") {
                selector
                  .find("#pexels-img-output")
                  .html(prefix + output + suffix + button);
              } else {
                selector.find("#pexels-img-grid").append(output);
                selector.find("#pexels-loadmore").remove();
                selector.find("#pexels-img-grid").after(button);
              }
              if (sets.apiCaching) {
                sessionStorage.setItem(url, output);
              }
              lazyLoadInstance.update();
              selector.find("#image-tool").css("pointer-events", "auto");
              selector.find("#image-tool").css("opacity", 1);
            }
          })
          .catch((err) => {
            toastr.error(err, pmotionParams.t105);
            selector.find("#image-tool").css("pointer-events", "auto");
            selector.find("#image-tool").css("opacity", 1);
          });
      }
    }

    // Populate videos
    function populatePexelsVideos(action, page) {
      var locale = sets.PexelsLanguage;
      var pagination = sets.PexelsPagination;
      var orientation = selector.find("#pexels-video-orientation").val();
      var keyword = selector.find("#pexels-video-search").val();
      var url = "";
      var output = "";
      if (page != "") {
        url = page;
      } else if (orientation == "" && keyword == "") {
        url =
          "https://api.pexels.com/videos/popular?locale=" +
          locale +
          "&size=medium&per_page=" +
          pagination;
      } else {
        url =
          "https://api.pexels.com/videos/search?locale=" +
          locale +
          "&size=medium&";
        if (keyword != "") {
          keyword = encodeURIComponent(keyword);
          url += "query=" + keyword + "&";
        } else {
          url += "query=&";
        }
        if (orientation != "") {
          url += "orientation=" + orientation + "&";
        }
        url += "per_page=" + pagination;
      }
      var prefix = '<div id="pexels-video-grid" class="css-grid">';
      var suffix = "</div>";

      if (sets.apiCaching && sessionStorage.getItem(url)) {
        if (action == "search") {
          selector
            .find("#pexels-video-output")
            .html(prefix + sessionStorage.getItem(url) + suffix);
        } else {
          selector
            .find("#pexels-video-grid")
            .append(sessionStorage.getItem(url));
        }
        selector.find("#video-tool").css("pointer-events", "auto");
        selector.find("#video-tool").css("opacity", 1);
        lazyLoadInstance.update();
      } else {
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: sets.PexelsApiKey,
          },
          redirect: "follow",
        })
          .then(handleApiErrors)
          .then((response) => response.json())
          .then((data) => {
            var videos = data.videos;
            var button =
              '<button id="pexels-video-loadmore" type="button" class="btn btn-full primary" autocomplete="off" data-next="">' +
              pmotionParams.t98 +
              "</button>";
            if (data.next_page !== undefined) {
              button =
                '<button id="pexels-video-loadmore" type="button" class="btn btn-full primary" autocomplete="off" data-next="' +
                data.next_page +
                '">' +
                pmotionParams.t98 +
                "</button>";
            }
            if (videos == "") {
              output =
                '<div class="notice notice-warning">' +
                pmotionParams.t97 +
                "</div>";
              if (action == "search") {
                selector.find("#pexels-video-output").html(output);
                selector.find("#pexels-video-loadmore").prop("disabled", false);
              } else {
                selector.find("#pexels-video-loadmore").prop("disabled", true);
              }
            } else {
              $.each(videos, function (index, val) {
                var sizeFound = false;
                var full = val.video_files[0].link;
                $.each(val.video_files, function (index, val) {
                  if (!sizeFound) {
                    if (val.width == 1280) {
                      full = val.link;
                      sizeFound = true;
                    }
                  }
                });
                var url = val.url;
                var duration = val.duration;
                var thumb = val.video_pictures[0].picture;
                output += '<div class="image-grid-item">';
                output +=
                  '<a href="' +
                  url +
                  '" class="stock-url" target="_blank"><span class="material-icons">info</span></a>';
                output += '<div class="img-wrap">';
                output += '<div class="img-loader"></div>';
                output +=
                  '<img class="lazy stock-video" draggable=false data-src="' +
                  thumb +
                  '" data-file="' +
                  full +
                  '" />';
                output +=
                  '<div class="video-duration">' +
                  convertSecondsToMinutes(duration) +
                  "</div>";
                output += "</div>";
                output += "</div>";
              });
              if (action == "search") {
                selector
                  .find("#pexels-video-output")
                  .html(prefix + output + suffix);
              } else {
                selector.find("#pexels-video-grid").append(output);
              }
              if (sets.apiCaching) {
                sessionStorage.setItem(url, output);
              }
              lazyLoadInstance.update();
              selector.find("#pexels-video-loadmore").remove();
              selector.find("#pexels-video-output").append(button);
              selector.find("#video-tool").css("pointer-events", "auto");
              selector.find("#video-tool").css("opacity", 1);
            }
          })
          .catch((err) => {
            toastr.error(err, pmotionParams.t105);
            selector.find("#video-tool").css("pointer-events", "auto");
            selector.find("#video-tool").css("opacity", 1);
          });
      }
    }

    if (sets.PexelsApiKey != "") {
      // Pexels Images
      populatePexels("search", "1");

      selector.find("#pexels-img-search-btn").on("click", function () {
        selector.find("#image-tool").css("pointer-events", "none");
        selector.find("#image-tool").css("opacity", 0.7);
        populatePexels("search", "1");
      });

      selector
        .find("#pexels-img-output")
        .on("click", "#pexels-loadmore", function () {
          $(this).prop("disabled", true);
          selector.find("#image-tool").css("pointer-events", "none");
          selector.find("#image-tool").css("opacity", 0.7);
          populatePexels("loadmore", parseInt($(this).data("page")) + 1);
        });

      selector.find("#pexels-img-search").on("keyup input", function () {
        var val = $(this).val();
        if (val == "") {
          selector.find("#pexels-orientation").val("");
          selector.find("#pexels-color").val("");
          selector.find("#pexels-orientation").prop("disabled", true);
          selector.find("#pexels-color").prop("disabled", true);
        } else {
          selector.find("#pexels-orientation").prop("disabled", false);
          selector.find("#pexels-color").prop("disabled", false);
        }
      });

      // Pexels Videos
      populatePexelsVideos("search", "");

      selector.find("#pexels-video-search-btn").on("click", function () {
        selector.find("#video-tool").css("pointer-events", "none");
        selector.find("#video-tool").css("opacity", 0.7);
        populatePexelsVideos("search", "");
      });

      selector
        .find("#pexels-video-output")
        .on("click", "#pexels-video-loadmore", function () {
          var next = $(this).attr("data-next");
          if (next != "") {
            $(this).prop("disabled", true);
            selector.find("#video-tool").css("pointer-events", "none");
            selector.find("#video-tool").css("opacity", 0.7);
            populatePexelsVideos("loadmore", next);
          } else {
            $(this).prop("disabled", true);
          }
        });

      selector.find("#pexels-video-search").on("keyup input", function () {
        var val = $(this).val();
        if (val == "") {
          selector.find("#pexels-video-orientation").val("");
          selector.find("#pexels-video-orientation").prop("disabled", true);
        } else {
          selector.find("#pexels-video-orientation").prop("disabled", false);
        }
      });

      selector.on("click", "#pexels-videos-toggle", function () {
        if ($(this).hasClass("active")) {
          $(this).html(
            pmotionParams.t100 +
              ' <span class="material-icons">expand_more</span>'
          );
          selector.find("#pexels-video-options").addClass("d-none");
          $(this).removeClass("active");
        } else {
          $(this).html(
            pmotionParams.t101 +
              ' <span class="material-icons">expand_less</span>'
          );
          selector.find("#pexels-video-options").removeClass("d-none");
          $(this).addClass("active");
        }
      });

      selector.on("click", "#pexels-settings-toggle", function () {
        if ($(this).hasClass("active")) {
          $(this).html(
            pmotionParams.t100 +
              ' <span class="material-icons">expand_more</span>'
          );
          selector.find("#pexels-search-options").addClass("d-none");
          $(this).removeClass("active");
        } else {
          $(this).html(
            pmotionParams.t101 +
              ' <span class="material-icons">expand_less</span>'
          );
          selector.find("#pexels-search-options").removeClass("d-none");
          $(this).addClass("active");
        }
      });
    }

    /////////* PIXABAY */////////

    // Populate images
    function populatePixabay(action, page) {
      var orientation = selector
        .find("#pixabay-orientation")
        .find(":selected")
        .val();
      var color = selector.find("#pixabay-color").find(":selected").val();
      var keyword = selector.find("#pixabay-img-search").val();
      var category = selector.find("#pixabay-category").find(":selected").val();
      var language = sets.PixabayLanguage;
      var safesearch = sets.PixabaySafeSearch;
      var editorsChoice = sets.PixabayEditorsChice;
      var pagination = sets.PixabayPagination;
      var url = "";
      var output = "";
      if (orientation == "" && color == "" && keyword == "" && category == "") {
        url =
          "https://pixabay.com/api/?key=" +
          sets.PixabayApiKey +
          "&editors_choice=true&order=latest&image_type=photo&lang=" +
          language +
          "&safesearch=" +
          safesearch +
          "&page=" +
          page +
          "&per_page=" +
          pagination;
      } else {
        url =
          "https://pixabay.com/api/?key=" +
          sets.PixabayApiKey +
          "&image_type=photo&order=latest&lang=" +
          language +
          "&safesearch=" +
          safesearch +
          "&editors_choice=" +
          editorsChoice +
          "&";
        if (keyword != "") {
          keyword = encodeURIComponent(keyword);
          url += "q=" + keyword + "&";
        }
        if (orientation != "") {
          url += "orientation=" + orientation + "&";
        }
        if (color != "") {
          url += "color=" + color + "&";
        }
        if (category != "") {
          url += "category=" + category + "&";
        }
        url += "page=" + page + "&per_page=" + pagination;
      }
      var prefix = '<div id="pixabay-img-grid" class="css-grid">';
      var suffix = "</div>";
      var button =
        '<button id="pixabay-loadmore" type="button" class="btn btn-full primary" autocomplete="off" data-page="' +
        parseInt(page) +
        '">' +
        pmotionParams.t98 +
        "</button>";

      if (sets.apiCaching && sessionStorage.getItem(url)) {
        if (action == "search") {
          selector
            .find("#pixabay-img-output")
            .html(prefix + sessionStorage.getItem(url) + suffix + button);
        } else {
          selector
            .find("#pixabay-img-grid")
            .append(sessionStorage.getItem(url));
          selector.find("#pixabay-loadmore").remove();
          selector.find("#pixabay-img-grid").after(button);
        }
        selector.find("#image-tool").css("pointer-events", "auto");
        selector.find("#image-tool").css("opacity", 1);
        lazyLoadInstance.update();
      } else {
        $.ajax({
          url: url,
          type: "POST",
          timeout: 0,
          crossDomain: true,
          processData: false,
          contentType: false,
          success: function (data) {
            if (data) {
              if (parseInt(data.totalHits) > 0) {
                var photos = data.hits;
                $.each(photos, function (index, val) {
                  var url = val.pageURL;
                  var thumb = val.webformatURL;
                  var full = val.largeImageURL;
                  if (val.fullHDURL !== undefined) {
                    full = val.fullHDURL;
                  }
                  var alt = val.tags;
                  output += '<div class="image-grid-item">';
                  output +=
                    '<a href="' +
                    url +
                    '" class="stock-url" target="_blank"><span class="material-icons">info</span></a>';
                  output += '<div class="img-wrap">';
                  output += '<div class="img-loader"></div>';
                  output +=
                    '<img class="lazy stock-img" draggable=false data-src="' +
                    thumb +
                    '" data-file="' +
                    full +
                    '" title="' +
                    alt +
                    '" />';
                  output += "</div>";
                  output += "</div>";
                });
                if (action == "search") {
                  selector
                    .find("#pixabay-img-output")
                    .html(prefix + output + suffix + button);
                } else {
                  selector.find("#pixabay-img-grid").append(output);
                  selector.find("#pixabay-loadmore").remove();
                  selector.find("#pixabay-img-grid").after(button);
                }
                if (sets.apiCaching) {
                  sessionStorage.setItem(url, output);
                }
                lazyLoadInstance.update();
              } else {
                output =
                  '<div class="notice notice-warning">' +
                  pmotionParams.t97 +
                  "</div>";
                if (action == "search") {
                  selector.find("#pixabay-img-output").html(output);
                  selector.find("#pixabay-loadmore").prop("disabled", false);
                } else {
                  selector.find("#pixabay-loadmore").prop("disabled", true);
                }
              }
              selector.find("#image-tool").css("pointer-events", "auto");
              selector.find("#image-tool").css("opacity", 1);
            }
          },
          error: function (jqXHR, error, errorThrown) {
            if (jqXHR.status && jqXHR.status == 400) {
              toastr.error(jqXHR.responseText, pmotionParams.t105);
            } else {
              toastr.error(pmotionParams.t99, pmotionParams.t105);
            }
            selector.find("#image-tool").css("pointer-events", "auto");
            selector.find("#image-tool").css("opacity", 1);
            selector.find("#pixabay-loadmore").prop("disabled", false);
          },
        });
      }
    }

    // Populate videos
    function populatePixabayVideos(action, page) {
      var orientation = selector
        .find("#pixabay-orientation-video")
        .find(":selected")
        .val();
      var color = selector.find("#pixabay-color-video").find(":selected").val();
      var keyword = selector.find("#pixabay-video-search").val();
      var category = selector
        .find("#pixabay-category-video")
        .find(":selected")
        .val();
      var language = sets.PixabayLanguage;
      var safesearch = sets.PixabaySafeSearch;
      var editorsChoice = sets.PixabayEditorsChice;
      var pagination = sets.PixabayPagination;
      var url = "";
      var output = "";
      if (orientation == "" && color == "" && keyword == "" && category == "") {
        url =
          "https://pixabay.com/api/videos/?key=" +
          sets.PixabayApiKey +
          "&editors_choice=true&order=latest&video_type=all&lang=" +
          language +
          "&safesearch=" +
          safesearch +
          "&page=" +
          page +
          "&per_page=" +
          pagination;
      } else {
        url =
          "https://pixabay.com/api/videos/?key=" +
          sets.PixabayApiKey +
          "&video_type=all&order=latest&lang=" +
          language +
          "&safesearch=" +
          safesearch +
          "&editors_choice=" +
          editorsChoice +
          "&";
        if (keyword != "") {
          keyword = encodeURIComponent(keyword);
          url += "q=" + keyword + "&";
        }
        if (orientation != "") {
          url += "orientation=" + orientation + "&";
        }
        if (color != "") {
          url += "color=" + color + "&";
        }
        if (category != "") {
          url += "category=" + category + "&";
        }
        url += "page=" + page + "&per_page=" + pagination;
      }
      var prefix = '<div id="pixabay-video-grid" class="css-grid">';
      var suffix = "</div>";
      var button =
        '<button id="pixabay-video-loadmore" type="button" class="btn btn-full primary" autocomplete="off" data-page="' +
        parseInt(page) +
        '">' +
        pmotionParams.t98 +
        "</button>";

      if (sets.apiCaching && sessionStorage.getItem(url)) {
        if (action == "search") {
          selector
            .find("#pixabay-video-output")
            .html(prefix + sessionStorage.getItem(url) + suffix + button);
        } else {
          selector
            .find("#pixabay-video-grid")
            .append(sessionStorage.getItem(url));
          selector.find("#pixabay-video-loadmore").remove();
          selector.find("#pixabay-video-grid").after(button);
        }
        selector.find("#video-tool").css("pointer-events", "auto");
        selector.find("#video-tool").css("opacity", 1);
        lazyLoadInstance.update();
      } else {
        $.ajax({
          url: url,
          type: "POST",
          timeout: 0,
          crossDomain: true,
          processData: false,
          contentType: false,
          success: function (data) {
            if (data) {
              if (parseInt(data.totalHits) > 0) {
                var videos = data.hits;
                $.each(videos, function (index, val) {
                  var url = val.pageURL;
                  var duration = val.duration;
                  var thumb =
                    "https://i.vimeocdn.com/video/" +
                    val.picture_id +
                    "_295x166.jpg";
                  var full = val.videos.small.url;
                  if (val.videos.medium.url != "") {
                    full = val.videos.medium.url;
                  }
                  var alt = val.tags;
                  output += '<div class="image-grid-item">';
                  output +=
                    '<a href="' +
                    url +
                    '" class="stock-url" target="_blank"><span class="material-icons">info</span></a>';
                  output += '<div class="img-wrap">';
                  output += '<div class="img-loader"></div>';
                  output +=
                    '<img class="lazy stock-video" draggable=false data-src="' +
                    thumb +
                    '" data-file="' +
                    full +
                    '" title="' +
                    alt +
                    '" />';
                  output +=
                    '<div class="video-duration">' +
                    convertSecondsToMinutes(duration) +
                    "</div>";
                  output += "</div>";
                  output += "</div>";
                });
                if (action == "search") {
                  selector
                    .find("#pixabay-video-output")
                    .html(prefix + output + suffix + button);
                } else {
                  selector.find("#pixabay-video-grid").append(output);
                  selector.find("#pixabay-video-loadmore").remove();
                  selector.find("#pixabay-video-grid").after(button);
                }
                if (sets.apiCaching) {
                  sessionStorage.setItem(url, output);
                }
                lazyLoadInstance.update();
              } else {
                output =
                  '<div class="notice notice-warning">' +
                  pmotionParams.t97 +
                  "</div>";
                if (action == "search") {
                  selector.find("#pixabay-video-output").html(output);
                  selector
                    .find("#pixabay-video-loadmore")
                    .prop("disabled", false);
                } else {
                  selector
                    .find("#pixabay-video-loadmore")
                    .prop("disabled", true);
                }
              }
              selector.find("#video-tool").css("pointer-events", "auto");
              selector.find("#video-tool").css("opacity", 1);
            }
          },
          error: function (jqXHR, error, errorThrown) {
            if (jqXHR.status && jqXHR.status == 400) {
              toastr.error(jqXHR.responseText, pmotionParams.t105);
            } else {
              toastr.error(pmotionParams.t99, pmotionParams.t105);
            }
            selector.find("#video-tool").css("pointer-events", "auto");
            selector.find("#video-tool").css("opacity", 1);
            selector.find("#pixabay-video-loadmore").prop("disabled", false);
          },
        });
      }
    }

    if (sets.PixabayApiKey != "") {
      // Pixabay Images
      populatePixabay("search", "1");

      selector.find("#pixabay-img-search-btn").on("click", function () {
        selector.find("#image-tool").css("pointer-events", "none");
        selector.find("#image-tool").css("opacity", 0.7);
        populatePixabay("search", "1");
      });

      selector
        .find("#pixabay-img-output")
        .on("click", "#pixabay-loadmore", function () {
          $(this).prop("disabled", true);
          selector.find("#image-tool").css("pointer-events", "none");
          selector.find("#image-tool").css("opacity", 0.7);
          populatePixabay("loadmore", parseInt($(this).data("page")) + 1);
        });

      // Pixabay Videos
      populatePixabayVideos("search", "1");

      selector.find("#pixabay-video-search-btn").on("click", function () {
        selector.find("#video-tool").css("pointer-events", "none");
        selector.find("#video-tool").css("opacity", 0.7);
        populatePixabayVideos("search", "1");
      });

      selector
        .find("#pixabay-video-output")
        .on("click", "#pixabay-video-loadmore", function () {
          $(this).prop("disabled", true);
          selector.find("#video-tool").css("pointer-events", "none");
          selector.find("#video-tool").css("opacity", 0.7);
          populatePixabayVideos("loadmore", parseInt($(this).data("page")) + 1);
        });

      selector.on("click", "#pixabay-videos-toggle", function () {
        if ($(this).hasClass("active")) {
          $(this).html(
            pmotionParams.t100 +
              ' <span class="material-icons">expand_more</span>'
          );
          selector.find("#pixabay-video-options").addClass("d-none");
          $(this).removeClass("active");
        } else {
          $(this).html(
            pmotionParams.t101 +
              ' <span class="material-icons">expand_less</span>'
          );
          selector.find("#pixabay-video-options").removeClass("d-none");
          $(this).addClass("active");
        }
      });

      selector.on("click", "#pixabay-settings-toggle", function () {
        if ($(this).hasClass("active")) {
          $(this).html(
            pmotionParams.t100 +
              ' <span class="material-icons">expand_more</span>'
          );
          selector.find("#pixabay-search-options").addClass("d-none");
          $(this).removeClass("active");
        } else {
          $(this).html(
            pmotionParams.t101 +
              ' <span class="material-icons">expand_less</span>'
          );
          selector.find("#pixabay-search-options").removeClass("d-none");
          $(this).addClass("active");
        }
      });
    }

    // Replace audio background
    selector.on("click", ".audio-item", function () {
      var getObjects = canvas.getObjects();
      if (getObjects && getObjects.length > 0) {
        getObjects.forEach(function (obj) {
          if (obj.get("assetType") && obj.get("assetType") == "audio") {
            deleteObject(obj, canvas);
          }
        });
      }
      if ($(this).hasClass("audio-item-active")) {
        $(this).removeClass("audio-item-active");
      } else {
        selector.find(".audio-item-active").removeClass("audio-item-active");
        var src = $(this).attr("data-file");
        newAudioLayer(src, $(this));
        background_audio = new Audio(src);
        background_audio.crossOrigin = "anonymous";
        background_key = src;
        $(this).addClass("audio-item-active");
      }
    });

    // Delete audio button
    selector.on("click", ".delete-audio", function () {
      var obj = canvas.getActiveObject();
      deleteObject(obj, canvas);
      save();
    });

    // Audio preview
    function previewAudioBackground(e, item) {
      e.preventDefault();
      e.stopPropagation();
      var src = item.parent().attr("data-file");
      if (item.find("span").html() == "play_arrow") {
        temp_audio = new Audio(src);
        temp_audio.crossOrigin = "anonymous";
        temp_audio.currentTime = 0;
        temp_audio.play();
        item.find("span").html("pause");
      } else {
        if (temp_audio != false) {
          temp_audio.pause();
        }
        item.find("span").html("play_arrow");
      }
    }

    selector.on("click", ".audio-preview", function (e) {
      previewAudioBackground(e, $(this));
    });

    /////////* FILTERS */////////
    function checkFilter() {
      resetFilters();
      if (canvas.getActiveObject()) {
        var obj = canvas.getActiveObject();
        if (
          canvas.getActiveObjects().length == 1 &&
          (obj.type == "image" || obj.type == "video")
        ) {
          var value = "none";
          if (obj.filters.length > 0) {
            obj.filters.forEach(function (filter) {
              if (
                filter.type == "BlackWhite" ||
                filter.type == "Invert" ||
                filter.type == "Sepia" ||
                filter.type == "Kodachrome" ||
                filter.type == "Polaroid" ||
                filter.type == "Technicolor" ||
                filter.type == "Brownie" ||
                filter.type == "Grayscale" ||
                filter.type == "Vintage"
              ) {
                value = filter.type;
              } else if (filter.type == "Brightness") {
                selector
                  .find("#filter-brightness")
                  .val(filter.brightness * 100);
              } else if (filter.type == "Contrast") {
                selector.find("#filter-contrast").val(filter.contrast * 100);
              } else if (filter.type == "Vibrance") {
                selector.find("#filter-vibrance").val(filter.vibrance * 100);
              } else if (filter.type == "Saturation") {
                selector
                  .find("#filter-saturation")
                  .val(filter.saturation * 100);
              } else if (filter.type == "HueRotation") {
                selector.find("#filter-hue").val(filter.rotation * 100);
              } else if (filter.type == "Blur") {
                selector.find("#filter-blur").val(filter.blur * 100);
              } else if (filter.type == "Noise") {
                selector.find("#filter-noise").val(filter.noise);
              }
              selector.find("#filters-list").val(value);
            });
          } else {
            selector.find("#filters-list").val(value);
          }
          canvas.requestRenderAll();
        }
      }
    }
    function clearFilters() {
      if (canvas.getActiveObject()) {
        var obj = canvas.getActiveObject();
        obj.filters = $.grep(obj.filters, function (i) {
          return (
            i.type != "BlackWhite" &&
            i.type != "Invert" &&
            i.type != "Sepia" &&
            i.type != "Kodachrome" &&
            i.type != "Polaroid" &&
            i.type != "Technicolor" &&
            i.type != "Brownie" &&
            i.type != "Grayscale" &&
            i.type != "Vintage"
          );
        });
        canvas.requestRenderAll();
      }
    }
    function applyFilter(name) {
      if (canvas.getActiveObject()) {
        var obj = canvas.getActiveObject();
        if (name == "Grayscale") {
          obj.filters.push(new f.Grayscale());
        } else if (name == "Sepia") {
          obj.filters.push(new f.Sepia());
        } else if (name == "BlackWhite") {
          obj.filters.push(new f.BlackWhite());
        } else if (name == "Brownie") {
          obj.filters.push(new f.Brownie());
        } else if (name == "Vintage") {
          obj.filters.push(new f.Vintage());
        } else if (name == "Kodachrome") {
          obj.filters.push(new f.Kodachrome());
        } else if (name == "Technicolor") {
          obj.filters.push(new f.Technicolor());
        } else if (name == "Polaroid") {
          obj.filters.push(new f.Polaroid());
        } else if (name == "Invert") {
          obj.filters.push(new f.Invert());
        }
        obj.applyFilters();
        save();
      }
    }

    selector.on("change", "#filters-list", function () {
      var value = $(this).find(":selected").val();
      if (canvas.getActiveObject()) {
        clearFilters();
        if (value == "none") {
          canvas.getActiveObject().applyFilters();
          canvas.requestRenderAll();
        } else {
          applyFilter(value);
        }
      }
    });

    function resetFilters() {
      if (canvas.getActiveObject()) {
        var object = canvas.getActiveObject();
        if (object.filters) {
          if (object.filters.length > 0) {
            sliders.forEach(function (slider) {
              var name = "";
              if (slider.name == "filter-hue") {
                name = "HueRotation";
              } else if (slider.name == "filter-brightness") {
                name = "Brightness";
              } else if (slider.name == "filter-vibrance") {
                name = "Vibrance";
              } else if (slider.name == "filter-contrast") {
                name = "Contrast";
              } else if (slider.name == "filter-saturation") {
                name = "Saturation";
              } else if (slider.name == "filter-noise") {
                name = "Noise";
              } else if (slider.name == "filter-blur") {
                name = "Blur";
              }
              if (!object.filters.find((x) => x.type == name)) {
                slider.slider.setValue(0);
              }
            });
          } else {
            selector.find(".img-filters .rangeslider").each(function () {
              $(this).val(0);
            });
          }
        } else {
          selector.find(".img-filters .rangeslider").each(function () {
            $(this).val(0);
          });
        }
      }
    }
    selector.on("click", "#reset-filters", function () {
      selector.find("#filters-list").val("none");
      selector.find("#filters-list").trigger("change");
      selector.find(".img-filters .rangeslider").each(function () {
        $(this).val(0);
        $(this).trigger("input");
      });
      save();
    });

    function toggleSpeed(e) {
      e.stopPropagation();
      e.preventDefault();
      selector.find("#speed-settings").toggleClass("show-speed");
      selector.find("#speed-arrow").toggleClass("arrow-on");
      if (selector.find("#speed-arrow").hasClass("arrow-on")) {
        selector.find("#speed-arrow").html("expand_less");
      } else {
        selector.find("#speed-arrow").html("expand_more");
      }
    }
    selector.on("click", "#speed", toggleSpeed);

    selector.on("click", ".speed", function (e) {
      e.stopPropagation();
      e.preventDefault();
      speed = parseFloat($(this).attr("data-speed"));
      selector.find("#speed-text").html($(this).html());
      toggleSpeed(e);
      save();
    });

    // For debugging purposes
    db.config.debug = false;

    // Check if a project exists
    function checkDB() {
      getAssets();
      db.collection("projects")
        .get()
        .then((project) => {
          if (project.length == 0) {
            canvas.clipPath = null;
            const inst = canvas.toDatalessJSON(JSON_defaults);
            canvas.clipPath = artboard;
            db.collection("projects").add({
              id: 1,
              title: "Autosave",
              canvas: JSON.stringify(inst),
              keyframes: JSON.stringify(keyframes.slice()),
              p_keyframes: JSON.stringify(p_keyframes.slice()),
              objects: JSON.stringify(objects.slice()),
              colormode: colormode,
              speed: speed,
              audiosrc: false,
              duration: duration,
              currenttime: currenttime,
              layercount: layer_count,
              width: artboard.width,
              height: artboard.height,
              animatedtext: JSON.stringify(animatedtext),
              groups: JSON.stringify(groups),
            });
            checkstatus = true;
          } else {
            db.collection("projects")
              .doc({ id: 1 })
              .get()
              .then((document) => {
                if (document) {
                  loadProject(1);
                } else {
                  canvas.clipPath = null;
                  const inst = canvas.toDatalessJSON(JSON_defaults);
                  canvas.clipPath = artboard;
                  db.collection("projects").add({
                    id: 1,
                    title: "Autosave",
                    canvas: JSON.stringify(inst),
                    keyframes: JSON.stringify(keyframes.slice()),
                    p_keyframes: JSON.stringify(p_keyframes.slice()),
                    objects: JSON.stringify(objects.slice()),
                    colormode: colormode,
                    speed: speed,
                    audiosrc: false,
                    duration: duration,
                    currenttime: currenttime,
                    layercount: layer_count,
                    width: artboard.width,
                    height: artboard.height,
                    animatedtext: JSON.stringify(animatedtext),
                    groups: JSON.stringify(groups),
                  });
                  checkstatus = true;
                  uploaded_audios
                    .slice()
                    .reverse()
                    .forEach(function (item) {
                      selector
                        .find("#audio-list")
                        .prepend(
                          '<div class="audio-item" data-file="' +
                            item.src +
                            '"><div class="audio-preview"> <span class="material-icons">play_arrow</span> </div><div class="audio-info nomargin"> <div class="audio-info-title">' +
                            pmotionParams.t137 +
                            " " +
                            item.key +
                            '</div><button type="button" class="audio-asset-delete btn danger" data-id="' +
                            item.key +
                            '"><span class="material-icons">remove</span></button></div> </div>'
                        );
                    });
                }
              });
          }
        });
    }

    // Automatically save project (locally)
    function autoSave() {
      if (checkstatus) {
        canvas.clipPath = null;
        objects.forEach(async function (object) {
          var obj = canvas.getItemById(object.id);
          if (obj.filters) {
            if (obj.filters.length > 0) {
              object.filters = [];
              obj.filters.forEach(function (filter) {
                if (
                  filter.type == "BlackWhite" ||
                  filter.type == "Invert" ||
                  filter.type == "Sepia" ||
                  filter.type == "Kodachrome" ||
                  filter.type == "Polaroid" ||
                  filter.type == "Technicolor" ||
                  filter.type == "Brownie" ||
                  filter.type == "Grayscale" ||
                  filter.type == "Vintage"
                ) {
                  object.filters.push({ type: filter.type });
                } else if (filter.type == "Brightness") {
                  object.filters.push({
                    type: filter.type,
                    value: filter.brightness,
                  });
                } else if (filter.type == "Contrast") {
                  object.filters.push({
                    type: filter.type,
                    value: filter.contrast,
                  });
                } else if (filter.type == "Vibrance") {
                  object.filters.push({
                    type: filter.type,
                    value: filter.vibrance,
                  });
                } else if (filter.type == "Saturation") {
                  object.filters.push({
                    type: filter.type,
                    value: filter.saturation,
                  });
                } else if (filter.type == "HueRotation") {
                  object.filters.push({
                    type: filter.type,
                    value: filter.rotation,
                  });
                } else if (filter.type == "Blur") {
                  object.filters.push({
                    type: filter.type,
                    value: filter.blur,
                  });
                } else if (filter.type == "Noise") {
                  object.filters.push({
                    type: filter.type,
                    value: filter.noise,
                  });
                } else if (filter.type == "RemoveColor") {
                  object.filters.push({
                    type: filter.type,
                    distance: filter.distance,
                    color: filter.color,
                  });
                }
              });
              var backend = fabric.filterBackend;
              if (backend && backend.evictCachesForKey) {
                backend.evictCachesForKey(obj.cacheKey);
                backend.evictCachesForKey(obj.cacheKey + "_filtered");
              }
              if (
                obj.filters.length > 0 &&
                obj.get("id").indexOf("Video") >= 0
              ) {
                await obj.setElement(obj.saveElem);
              }
            } else {
              object.filters = [];
            }
          } else {
            object.filters = [];
          }
        });
        const inst = canvas.toDatalessJSON(JSON_defaults);
        canvas.clipPath = artboard;
        db.collection("projects")
          .doc({ id: 1 })
          .update({
            canvas: JSON.stringify(inst),
            keyframes: JSON.stringify(keyframes.slice()),
            p_keyframes: JSON.stringify(p_keyframes.slice()),
            objects: JSON.stringify(objects.slice()),
            colormode: colormode,
            duration: duration,
            currenttime: currenttime,
            layercount: layer_count,
            speed: speed,
            audiosrc: background_key,
            animatedtext: JSON.stringify(animatedtext),
            groups: JSON.stringify(groups),
            width: artboard.width,
            height: artboard.height,
          });
        objects.forEach(function (object) {
          replaceSource(canvas.getItemById(object.id), canvas);
        });
      }
    }

    var isSameSet = function (arr1, arr2) {
      return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
    };

    /* Load Project */
    function loadProject(id) {
      selector.find("#load-template").addClass("loading-active");
      db.collection("projects")
        .doc({ id: id })
        .get()
        .then((document) => {
          var project = document;
          keyframes = JSON.parse(project.keyframes);
          p_keyframes = JSON.parse(project.p_keyframes);
          objects = JSON.parse(project.objects);
          colormode = project.colormode;
          duration = project.duration;
          layer_count = project.layercount;
          speed = project.speed;
          animatedtext = JSON.parse(project.animatedtext);
          background_audio = false;
          background_key = project.audiosrc;
          if (background_key) {
            background_audio = new Audio(background_key);
            background_audio.crossOrigin = "anonymous";
            selector.find("#audio-list .audio-item").each(function () {
              if ($(this).attr("data-file") === background_key) {
                selector
                  .find(".audio-item-active")
                  .removeClass("audio-item-active");
                $(this).addClass("audio-item-active");
                return false;
              }
            });
          }
          uploaded_audios
            .slice()
            .reverse()
            .forEach(function (item) {
              selector
                .find("#audio-list")
                .prepend(
                  '<div class="audio-item" data-file="' +
                    item.src +
                    '"><div class="audio-preview"> <span class="material-icons">play_arrow</span> </div><div class="audio-info nomargin"> <div class="audio-info-title">' +
                    pmotionParams.t137 +
                    " " +
                    item.key +
                    '</div><button type="button" class="audio-asset-delete btn danger" data-id="' +
                    item.key +
                    '"><span class="material-icons">remove</span></button></div> </div>'
                );
            });
          if (animatedtext.length > 0) {
            animatedtext.forEach(function (text, index) {
              var temp = new AnimatedText(text.text, text.props);
              temp.assignTo(text.id);
              animatedtext[index] = temp;
            });
          }
          selector.find("#speed-text").html(speed.toFixed(1) + "x");
          groups = JSON.parse(project.groups);
          currenttime = 0;
          canvas.clipPath = null;
          canvas.clear();
          fabric.filterBackend = webglBackend;
          var projectCanvas = JSON.parse(project.canvas);
          undoRedoReset(projectCanvas);

          var getFonts = [];

          for (var i = 0; i < projectCanvas.objects.length; i++) {
            if (
              projectCanvas.objects[i].type == "i-text" ||
              projectCanvas.objects[i].type == "textbox"
            ) {
              if (
                getFonts.indexOf(projectCanvas.objects[i].fontFamily) === -1
              ) {
                getFonts.push(projectCanvas.objects[i].fontFamily);
              }
            }
            if (projectCanvas.objects[i].assetType == "animatedText") {
              if (
                getFonts.indexOf(
                  projectCanvas.objects[i].objects[0].fontFamily
                ) === -1
              ) {
                getFonts.push(projectCanvas.objects[i].objects[0].fontFamily);
              }
            }
          }

          var fontCount = getFonts.length;
          var fontI = 0;

          if (fontCount !== 0) {
            loadedFonts = loadedFonts.concat(getFonts);
            $.each(getFonts, function (index, val) {
              WebFont.load({
                google: {
                  families: [
                    val + ":regular,bold",
                    val + ":italic,regular,bold",
                  ],
                },
              });
              var fontNormal = new FontFaceObserver(val, {
                weight: "normal",
                style: "normal",
              });
              var fontBold = new FontFaceObserver(val, {
                weight: "bold",
                style: "normal",
              });
              var fontNormalItalic = new FontFaceObserver(val, {
                weight: "normal",
                style: "italic",
              });
              var fontBoldItalic = new FontFaceObserver(val, {
                weight: "bold",
                style: "italic",
              });
              Promise.all([
                fontNormal.load(null, 5000),
                fontBold.load(null, 5000),
                fontNormalItalic.load(null, 5000),
                fontBoldItalic.load(null, 5000),
              ])
                .then(function () {
                  fontI++;
                  if (fontI === fontCount) {
                    canvas.loadFromJSON(projectCanvas, function () {
                      canvas.clipPath = artboard;
                      if (canvas.getItemById("line_h")) {
                        canvas.getItemById("line_h").set({ opacity: 0 });
                        canvas.getItemById("line_v").set({ opacity: 0 });
                      }
                      canvas.requestRenderAll();
                      selector.find(".object-props").remove();
                      selector.find(".layer").remove();
                      objects.forEach(function (object) {
                        var animatethis = false;
                        if (object.animate.length > 5) {
                          if (isSameSet(object.animate, props)) {
                            animatethis = true;
                          }
                        }
                        renderLayer(canvas.getItemById(object.id), animatethis);
                        if (
                          !canvas.getItemById(object.id).get("assetType") ||
                          canvas.getItemById(object.id).get("assetType") !=
                            "audio"
                        ) {
                          props.forEach(function (prop) {
                            if (
                              prop != "top" &&
                              prop != "scaleY" &&
                              prop != "width" &&
                              prop != "height" &&
                              prop != "shadow.offsetX" &&
                              prop != "shadow.offsetY" &&
                              prop != "shadow.blur"
                            ) {
                              renderProp(prop, canvas.getItemById(object.id));
                            }
                          });
                          replaceSource(canvas.getItemById(object.id), canvas);
                        } else {
                          renderProp("volume", canvas.getItemById(object.id));
                        }
                      });
                      keyframes.forEach(function (keyframe) {
                        if (
                          keyframe.name != "top" &&
                          keyframe.name != "scaleY" &&
                          keyframe.name != "width" &&
                          keyframe.name != "height" &&
                          keyframe.name != "shadow.offsetX" &&
                          keyframe.name != "shadow.offsetY" &&
                          keyframe.name != "shadow.blur"
                        ) {
                          renderKeyframe(
                            canvas.getItemById(keyframe.id),
                            keyframe.name,
                            keyframe.t
                          );
                        }
                      });
                      artboard.set({
                        width: project.width,
                        height: project.height,
                      });
                      canvas.requestRenderAll();
                      resizeCanvas();
                      updatePanel();
                      if (animatedtext.length > 0) {
                        animatedtext.forEach(function (text, index) {
                          var item = canvas.getItemById(text.id);
                          text.reset(text.text, text.props, canvas, item);
                        });
                        undo = [];
                        undoarr = [];
                        redo = [];
                        redoarr = [];
                        selector.find("#undo").removeClass("history-active");
                        selector.find("#redo").removeClass("history-active");
                      }

                      // Set defaults
                      setDuration(duration);
                      setTimelineZoom(5);
                      checkstatus = true;

                      canvas.requestRenderAll();

                      animate(false, 0);
                      selector
                        .find("#load-template")
                        .removeClass("loading-active");
                    });
                  }
                })
                .catch(function (e) {
                  console.log(e);
                });
            });
          } else {
            canvas.loadFromJSON(projectCanvas, function () {
              canvas.clipPath = artboard;
              if (canvas.getItemById("line_h")) {
                canvas.getItemById("line_h").set({ opacity: 0 });
                canvas.getItemById("line_v").set({ opacity: 0 });
              }
              canvas.requestRenderAll();
              selector.find(".object-props").remove();
              selector.find(".layer").remove();
              objects.forEach(function (object) {
                var animatethis = false;
                if (object.animate.length > 5) {
                  if (isSameSet(object.animate, props)) {
                    animatethis = true;
                  }
                }
                renderLayer(canvas.getItemById(object.id), animatethis);
                if (
                  !canvas.getItemById(object.id).get("assetType") ||
                  canvas.getItemById(object.id).get("assetType") != "audio"
                ) {
                  props.forEach(function (prop) {
                    if (
                      prop != "top" &&
                      prop != "scaleY" &&
                      prop != "width" &&
                      prop != "height" &&
                      prop != "shadow.offsetX" &&
                      prop != "shadow.offsetY" &&
                      prop != "shadow.blur"
                    ) {
                      renderProp(prop, canvas.getItemById(object.id));
                    }
                  });
                  replaceSource(canvas.getItemById(object.id), canvas);
                } else {
                  renderProp("volume", canvas.getItemById(object.id));
                }
              });
              keyframes.forEach(function (keyframe) {
                if (
                  keyframe.name != "top" &&
                  keyframe.name != "scaleY" &&
                  keyframe.name != "width" &&
                  keyframe.name != "height" &&
                  keyframe.name != "shadow.offsetX" &&
                  keyframe.name != "shadow.offsetY" &&
                  keyframe.name != "shadow.blur"
                ) {
                  renderKeyframe(
                    canvas.getItemById(keyframe.id),
                    keyframe.name,
                    keyframe.t
                  );
                }
              });
              artboard.set({
                width: project.width,
                height: project.height,
              });
              canvas.requestRenderAll();
              resizeCanvas();
              updatePanel();
              if (animatedtext.length > 0) {
                animatedtext.forEach(function (text, index) {
                  var item = canvas.getItemById(text.id);
                  text.reset(text.text, text.props, canvas, item);
                });
              }
              // Set defaults
              setDuration(duration);
              setTimelineZoom(5);
              checkstatus = true;

              canvas.requestRenderAll();

              animate(false, 0);
              selector.find("#load-template").removeClass("loading-active");
            });
          }
        });
    }

    // Blob to Base64
    function blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    // Save File
    async function saveFile(thumbnail, file, type, name, place, hidden) {
      file = await blobToBase64(file);
      thumbnail = await blobToBase64(thumbnail);
      uploading = false;
      var key = Math.random().toString(36).substr(2, 9);
      db.collection("assets").add({
        key: key,
        src: file,
        thumb: thumbnail,
        name: name,
        type: type,
        hidden: hidden,
      });
      if (type === "image") {
        uploaded_images.push({
          src: file,
          thumb: thumbnail,
          key: key,
          type: "image",
          hidden: false,
        });
        populateGrid("images-tab");
      } else if (type === "video") {
        uploaded_videos.push({
          src: file,
          thumb: thumbnail,
          key: key,
          type: "video",
          hidden: false,
        });
        populateGrid("videos-tab");
      }
      selector
        .find("#upload-button")
        .html(
          '<span class="material-icons">file_upload</span>' + pmotionParams.t120
        );
      selector.find("#upload-button").removeClass("uploading");
      if (place) {
        loadImage(
          file,
          artboard.get("left") + artboard.get("width") / 2,
          artboard.get("top") + artboard.get("height") / 2,
          200
        );
      }
      save();
    }

    // Save stock image
    async function saveStockImage(url, xpos, ypos, width) {
      selector.find("#load-image").addClass("loading-active");
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          url = blob;
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            url = reader.result;
            loadImage(url, xpos, ypos, width, false);
          };
        });
    }

    // Save audio
    async function saveAudio(url) {
      selector.find(".audio-item-active").removeClass("audio-item-active");
      var reader = new FileReader();
      reader.readAsDataURL(url);
      reader.onloadend = function () {
        var getObjects = canvas.getObjects();
        if (getObjects && getObjects.length > 0) {
          getObjects.forEach(function (obj) {
            if (obj.get("assetType") && obj.get("assetType") == "audio") {
              deleteObject(obj, canvas);
            }
          });
        }
        var key = Math.random().toString(36).substr(2, 9);
        db.collection("assets").add({
          key: key,
          src: reader.result,
          name: key,
          type: "audio",
          hidden: true,
        });
        newAudioLayer(reader.result);
        selector
          .find("#audio-upload-button")
          .html(
            '<span class="material-icons">file_upload</span>' +
              pmotionParams.t102
          );
        selector.find("#audio-upload-button").removeClass("uploading");
        selector
          .find("#audio-list")
          .prepend(
            '<div class="audio-item audio-item-active" data-file="' +
              reader.result +
              '"><div class="audio-preview"> <span class="material-icons">play_arrow</span> </div><div class="audio-info nomargin"> <div class="audio-info-title">' +
              pmotionParams.t137 +
              " " +
              key +
              '</div> <button type="button" class="audio-asset-delete btn danger" data-id="' +
              key +
              '"><span class="material-icons">remove</span></button></div> </div>'
          );
        background_audio = new Audio(reader.result);
        background_audio.crossOrigin = "anonymous";
        background_key = reader.result;
      };
    }

    // Save stock video
    async function saveStockVideo(url, thumb, x, y) {
      selector.find("#load-video").addClass("loading-active");
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          var reader = new FileReader();
          var reader2 = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            fetch(thumb)
              .then((res) => res.blob())
              .then((blob2) => {
                reader2.readAsDataURL(blob2);
                reader2.onloadend = function () {
                  selector.find("#load-video").removeClass("loading-active");
                  url = reader.result;
                  loadVideo(url, x, y, false);
                };
              });
          };
        });
    }

    // Delete asset
    function deleteAsset(key) {
      db.collection("assets")
        .doc({ key: key })
        .get()
        .then((asset) => {
          db.collection("assets").doc({ key: key }).delete();
          if (asset.type == "image") {
            uploaded_images = uploaded_images.filter(function (obj) {
              return obj.key !== key;
            });
            populateGrid("images-tab");
          } else {
            uploaded_videos = uploaded_videos.filter(function (obj) {
              return obj.key !== key;
            });
            populateGrid("videos-tab");
          }
        });
    }

    // Get assets
    function getAssets() {
      db.collection("assets")
        .get()
        .then((assets) => {
          // Sometimes the assets aren't ready when importing
          if (assets === undefined) {
            getAssets();
          } else if (assets.length > 0) {
            assets.forEach(function (asset) {
              if (asset.type == "image") {
                uploaded_images.push({
                  src: asset.src,
                  thumb: asset.thumb,
                  key: asset.key,
                  type: "image",
                  hidden: asset.hidden,
                });
              } else if (asset.type == "video") {
                uploaded_videos.push({
                  src: asset.src,
                  thumb: asset.thumb,
                  key: asset.key,
                  type: "video",
                  hidden: asset.hidden,
                });
              } else if (asset.type == "audio") {
                uploaded_audios.push({
                  src: asset.src,
                  thumb: null,
                  key: asset.key,
                  type: "audio",
                  hidden: asset.hidden,
                });
              }
            });
          }
        });
    }

    selector
      .find("#template-library")
      .on("click", ".image-grid-item", function () {
        var url = sets.baseURL + $(this).attr("data-template");
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data.project === undefined) {
              toastr.error(pmotionParams.t122, pmotionParams.t105);
              return;
            }
            if (data.project.canvas.length > 0) {
              delete data.project.id;
              db.collection("projects")
                .doc({ id: 1 })
                .update(data.project)
                .then((response) => {
                  loadProject(1);
                });
            } else {
              toastr.error(pmotionParams.t103, pmotionParams.t105);
            }
          })
          .catch((error) => {
            toastr.error(error, pmotionParams.t105);
            selector.find("#load-template").removeClass("loading-active");
          });
      });

    // Import Project
    selector.on("change", "#import", function (e) {
      selector.find("#import-project").prop("disabled", true);
      var reader = new FileReader();
      reader.onload = function (ev) {
        var data = JSON.parse(reader.result);
        if (data.project === undefined) {
          toastr.error(pmotionParams.t122, pmotionParams.t105);
          return;
        }
        if (data.project.canvas.length > 0) {
          delete data.project.id;
          db.collection("projects")
            .doc({ id: 1 })
            .update(data.project)
            .then((response) => {
              selector.find("#import-project").prop("disabled", false);
              hideModals();
              loadProject(1);
            });
        } else {
          toastr.error(pmotionParams.t103, pmotionParams.t105);
        }
      };
      reader.readAsText(e.target.files[0]);
    });

    selector.on("click", "#import-project", function () {
      selector.find("#import").click();
    });

    // Export project
    selector.on("click", "#export-project", function () {
      $(this).prop("disabled", true);
      db.collection("projects")
        .get()
        .then((projects) => {
          if (projects.length > 0) {
            $.each(projects, function (index, val) {
              if (val.id === 1) {
                var exportarr = { project: val };
                var json = JSON.stringify(exportarr);
                var a = document.createElement("a");
                var file = new Blob([json], { type: "text/plain" });
                a.href = URL.createObjectURL(file);
                a.download = "template.json";
                a.click();
                selector.find("#export-project").prop("disabled", false);
                return;
              }
            });
          } else {
            toastr.error(pmotionParams.t104, pmotionParams.t105);
          }
        });
    });

    // Get saved projects
    function getProjects() {
      db.collection("projects")
        .get()
        .then((projects) => {
          var output = "";
          projects.reverse();
          $.each(projects, function (index, val) {
            if (val.id !== 1) {
              output +=
                '<div class="project-item" data-id="' +
                val.id +
                '"><div class="project-title"><input type="text" class="project-title-input" value="' +
                val.title +
                '" /></div><div class="project-btns"><button type="button" class="btn danger project-delete"><span class="material-icons">clear</span></button><button type="button" class="btn primary project-select"><span class="material-icons">done</span></button></div></div>';
            }
          });
          if (output == "") {
            selector
              .find("#projects-output")
              .after(
                '<div id="no-projects" class="notice notice-warning">' +
                  pmotionParams.t106 +
                  "</div>"
              );
          } else {
            selector.find("#no-projects").remove();
          }
          selector.find("#projects-output").html(output);
        });
    }
    getProjects();

    // Save project
    selector.on("click", "#save-project", function () {
      selector.find("#save-project").prop("disabled", true);
      const id = new Date().getTime();
      const inst = canvas.toDatalessJSON(JSON_defaults);
      canvas.clipPath = null;
      canvas.clipPath = artboard;
      db.collection("projects").add({
        id: id,
        title: id,
        canvas: JSON.stringify(inst),
        keyframes: JSON.stringify(keyframes.slice()),
        p_keyframes: JSON.stringify(p_keyframes.slice()),
        objects: JSON.stringify(objects.slice()),
        colormode: colormode,
        speed: speed,
        duration: duration,
        currenttime: currenttime,
        layercount: layer_count,
        width: artboard.width,
        height: artboard.height,
        audiosrc: background_key,
        animatedtext: JSON.stringify(animatedtext),
        groups: JSON.stringify(groups),
      });
      selector.find("#no-projects").remove();
      selector
        .find("#projects-output")
        .prepend(
          '<div class="project-item" data-id="' +
            id +
            '"><div class="project-title"><input type="text" class="project-title-input" value="' +
            id +
            '" /></div><div class="project-btns"><button type="button" class="btn danger project-delete"><span class="material-icons">clear</span></button><button type="button" class="btn primary project-select"><span class="material-icons">done</span></button></div></div>'
        );
      selector.find("#save-project").prop("disabled", false);
      save();
    });

    // Save project
    selector.on("click", ".project-select", function () {
      const id = parseInt($(this).parent().parent().attr("data-id"));
      loadProject(id);
    });

    // Delete project
    selector.on("click", ".project-delete", function () {
      $(this).prop("disabled", true);
      const id = parseInt($(this).parent().parent().attr("data-id"));
      $(this).parent().parent().remove();
      db.collection("projects").doc({ id: id }).delete();
      if (selector.find("#projects-output").is(":empty")) {
        selector
          .find("#projects-output")
          .after(
            '<div id="no-projects" class="notice notice-warning">' +
              pmotionParams.t106 +
              "</div>"
          );
      } else {
        selector.find("#no-projects").remove();
      }
    });

    // Update project title
    selector.on("focusout", ".project-title-input", function () {
      const title = $(this).val();
      const id = parseInt($(this).parent().parent().attr("data-id"));
      db.collection("projects").doc({ id: id }).update({
        title: title,
      });
    });

    // Delete all assets
    function deleteAssets() {
      if (window.confirm(pmotionParams.t110)) {
        db.collection("assets").delete();
        window.setTimeout(function () {
          location.reload();
        }, 1000);
      }
    }

    selector.on("click", "#delete-assets-button", deleteAssets);

    function clearProject() {
      if (window.confirm(pmotionParams.t111)) {
        db.collection("projects").doc({ id: 1 }).delete();
        window.setTimeout(function () {
          location.reload();
        }, 1000);
      }
    }
    selector.on("click", "#clear-project", clearProject);

    // Animate text
    function animateText(group, ms, play, props, cv, id) {
      var globaldelay = 0;
      var starttime = p_keyframes.find((x) => x.id == id).start;
      ms -= starttime;
      var length = group._objects.length;
      for (var i = 0; i < length; i++) {
        var index = i;
        if (props.order == "backward") {
          index = length - i - 1;
        }
        let left = group.item(index).defaultLeft;
        let top = group.item(index).defaultTop;
        let scaleX = group.item(index).defaultScaleX;
        let scaleY = group.item(index).defaultScaleY;
        var delay = i * duration;
        var duration = props.duration / length;
        var animation = {
          opacity: 0,
          top: top,
          left: left,
          scaleX: scaleX,
          scaleY: scaleY,
        };
        if (props.typeAnim == "letter") {
          delay = i * duration - 100;
        } else if (props.typeAnim == "word") {
          var wordsCount = 0;
          $.each(group._objects, function (index, val) {
            if (val.text == " ") {
              wordsCount++;
            }
          });
          if (group.item(index).text == " ") {
            globaldelay += props.duration / wordsCount - 100;
          }
          delay = globaldelay;
        }
        if (props.preset == "typewriter") {
          delay = i * duration;
          duration = 20;
        } else if (props.preset == "fade in") {
          animation.opacity = 0;
        } else if (props.preset == "slide top") {
          animation.top += 20;
        } else if (props.preset == "slide bottom") {
          animation.top -= 20;
        } else if (props.preset == "slide left") {
          animation.left += 20;
        } else if (props.preset == "slide right") {
          animation.left -= 20;
        } else if (props.preset == "scale") {
          animation.scaleX = 0;
          animation.scaleY = 0;
        } else if (props.preset == "shrink") {
          animation.scaleX = 1.5;
          animation.scaleY = 1.5;
        }
        if (delay < 0) {
          delay = 0;
        }
        if (duration < 20) {
          duration = 20;
        }
        var start = false;
        var instance = anime({
          targets: animation,
          delay: delay,
          opacity: 1,
          left: left,
          top: top,
          scaleX: scaleX,
          scaleY: scaleY,
          duration: duration,
          easing: props.easing,
          autoplay: play,
          update: function () {
            if (start && play) {
              group.item(index).set({
                opacity: animation.opacity,
                left: animation.left,
                top: animation.top,
                scaleX: animation.scaleX,
                scaleY: animation.scaleY,
              });
              cv.requestRenderAll();
            }
          },
          changeBegin: function () {
            start = true;
          },
        });
        instance.seek(ms);

        if (!play) {
          group.item(index).set({
            opacity: animation.opacity,
            left: animation.left,
            top: animation.top,
            scaleX: animation.scaleX,
            scaleY: animation.scaleY,
          });
        }
      }
      cv.requestRenderAll();
    }

    // Set animated text
    function setText(group, props, cv) {
      var length = group._objects.length;
      for (var i = 0; i < length; i++) {
        group.item(i).set({
          fill: props.fill,
          fontFamily: props.fontFamily,
          fontWeight: props.fontWeight,
        });
        cv.requestRenderAll();
      }
    }

    // Render text for animation
    function renderText(string, props, cv, id, isnew, start, obj) {
      var textOffset = 0;
      var scaleX = 1;
      var scaleY = 1;
      var angle = 0;
      var left = artboard.left + artboard.width / 2;
      var top = artboard.top + artboard.height / 2;
      if (obj) {
        scaleX = obj.scaleX;
        scaleY = obj.scaleY;
        angle = obj.angle;
        left = obj.left - artboard.left;
        top = obj.top - artboard.top;
      }
      var group = [];
      function renderLetter(letter) {
        var text = new fabric.Text(letter, {
          left: textOffset,
          top: 0,
          fill: props.fill,
          fontFamily: props.fontFamily,
          fontWeight: props.fontWeight,
          opacity: 1,
        });
        text.set({
          defaultLeft: text.left,
          defaultTop: text.top,
          defaultScaleX: 1,
          defaultScaleY: 1,
        });
        textOffset += text.get("width");
        return text;
      }
      for (var i = 0; i < string.length; i++) {
        group.push(renderLetter(string.charAt(i)));
      }
      var result = new fabric.Group(group, {
        cursorWidth: 1,
        stroke: "#000",
        strokeUniform: true,
        paintFirst: "stroke",
        strokeWidth: 0,
        originX: "center",
        originY: "center",
        left: left,
        top: top,
        cursorDuration: 1,
        cursorDelay: 250,
        assetType: "animatedText",
        id: id,
        strokeDashArray: false,
        inGroup: false,
        scaleX: scaleX,
        scaleY: scaleY,
        angle: angle,
      });
      if (isnew) {
        result.set({
          notnew: true,
          starttime: start,
        });
      }
      result.objectCaching = false;
      cv.add(result);
      cv.requestRenderAll();
      newLayer(result);
      result._objects.forEach(function (object, index) {
        result.item(index).set({
          defaultLeft: result.item(index).defaultLeft - result.width / 2,
          defaultTop: result.item(index).defaultTop - result.height / 2,
        });
      });
      cv.setActiveObject(result);
      cv.bringToFront(result);
      return result.id;
    }

    // Animated text class
    class AnimatedText {
      constructor(text, props) {
        this.text = text;
        this.props = props;
        this.id = "Text" + layer_count;
      }
      render(cv) {
        this.id = renderText(
          this.text,
          this.props,
          cv,
          this.id,
          false,
          0,
          false
        );
        animateText(
          cv.getItemById(this.id),
          currenttime,
          false,
          this.props,
          cv,
          this.id
        );
      }
      seek(ms, cv) {
        animateText(
          cv.getItemById(this.id),
          ms,
          false,
          this.props,
          cv,
          this.id
        );
      }
      play(cv) {
        animateText(cv.getItemById(this.id), 0, true, this.props, cv, this.id);
      }
      getObject(cv) {
        return cv.getItemById(this.id);
      }
      setProps(newprops, cv) {
        this.props = $.extend(this.props, newprops);
        setText(cv.getItemById(this.id), this.props, cv);
      }
      setProp(newprop) {
        $.extend(this.props, newprop);
      }
      reset(text, newprops, cv, obj) {
        var start = p_keyframes.find((x) => x.id == this.id).start;
        deleteObject(obj, cv, false);
        this.text = text;
        this.props = newprops;
        this.inst = renderText(text, this.props, cv, this.id, true, start, obj);
        animateText(obj, currenttime, false, this.props, cv, this.id);
        animate(false, currenttime);
      }
      assignTo(id, text, props) {
        this.id = id;
      }
    }

    async function renderAnim(time) {
      await recordAnimate(time * 1000);
    }

    function record() {
      selector.addClass("loading");
      selector.find("#download-real").addClass("downloading");
      if (
        selector.find("input[name=download-radio]:checked").val() == "image"
      ) {
        selector
          .find("#download-real")
          .html(
            '<div class="loader-wrap"><div class="loader-sm"></div></div>' +
              pmotionParams.t136
          );
        const format = selector.find("#image-select").find(":selected").val();
        updateRecordCanvas(false).then(
          (canvasrecord) => {
            canvasrecord.clone(function (cv) {
              cv.requestRenderAll();
              cv.setWidth(artboard.width);
              cv.setHeight(artboard.height);
              cv.width = artboard.width;
              cv.height = artboard.height;
              cv.setZoom(1);
              cv.requestRenderAll();
              const vpw = cv.width;
              const vph = cv.height;
              const x = artboard.left + artboard.width / 2 - vpw / 2;
              const y = artboard.top + artboard.height / 2 - vph / 2;
              cv.absolutePan({ x: x, y: y });
              cv.setZoom(1);
              cv.requestRenderAll();
              const dataURL = cv.toDataURL({
                format: format,
                enableRetinaScaling: false,
              });
              const link = document.createElement("a");
              link.download = name;
              link.href = dataURL;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              selector
                .find("#download-real")
                .html(
                  '<span class="material-icons">download</span>' +
                    pmotionParams.t135
                );
              selector.find("#download-real").removeClass("downloading");
              selector.removeClass("loading");
            });
          },
          function (error) {
            toastr.error(error, pmotionParams.t105);
          }
        );
      } else {
        updateRecordCanvas(true).then(
          (canvasrecord) => {
            if (!recording) {
              recording = true;
              paused = true;
              var FPS = 60;
              var aCtx = new AudioContext();
              var audioTimerLoop = function (frequency) {
                var freq = frequency / 1000;
                var silence = aCtx.createGain();
                silence.gain.value = 0;
                silence.connect(aCtx.destination);
                onOSCend();
                var stopped = false;
                function onOSCend() {
                  var osc = aCtx.createOscillator();
                  osc.onended = onOSCend;
                  osc.connect(silence);
                  osc.start(0);
                  osc.stop(aCtx.currentTime + freq);
                  renderAnim(aCtx.currentTime);
                  if (stopped) {
                    osc.onended = function () {
                      return;
                    };
                  }
                }
                return function () {
                  stopped = true;
                };
              };
              var stopAnim = audioTimerLoop(1000 / FPS);
              canvasrecord.discardActiveObject();
              var objCheck = canvasrecord
                .getObjects()
                .filter((element) => element.top < 0 || element.left < 0);
              if (objCheck.length == 0) {
                var activeselection = new fabric.ActiveSelection(
                  canvasrecord.getObjects()
                );
                canvasrecord.setActiveObject(activeselection);
                canvasrecord.requestRenderAll();
                canvasrecord.discardActiveObject();
              }
              var stream = document
                .getElementById("canvasrecord")
                .captureStream(FPS);

              if (
                selector.find("input[name=download-radio]:checked").val() ==
                "webm"
              ) {
                objects.forEach(function (object) {
                  if (
                    canvasrecord.getItemById(object.id).get("assetType") &&
                    canvasrecord.getItemById(object.id).get("assetType") ==
                      "video"
                  ) {
                    audio = $(
                      canvasrecord.getItemById(object.id).getElement()
                    )[0];
                  }
                });
                if (background_audio != false) {
                  audio = background_audio;
                }
                if (audio) {
                  audioSource = audioContext.createMediaElementSource(audio);
                  audioDestination =
                    audioContext.createMediaStreamDestination();
                  audioSource.connect(audioDestination);
                  stream.addTrack(audioDestination.stream.getAudioTracks()[0]);
                  if (background_audio != false) {
                    background_audio.currentTime = 0;
                    background_audio.play();
                  }
                }
              }

              var recorder;

              if (typeof MediaRecorder === "undefined") {
                window.MediaRecorder = {
                  isTypeSupported: function () {
                    return false;
                  },
                };
              }

              var mimeType = "video/webm";

              if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
                mimeType = "video/webm;codecs=vp9";
              }

              if (
                selector.find("input[name=download-radio]:checked").val() ==
                "webm"
              ) {
                selector.find("#download-progress").css("display", "flex");
                recorder = RecordRTC(stream, {
                  type: "video",
                  mimeType: mimeType,
                  timeSlice: 1000,
                  recorderType: MediaStreamRecorder,
                  disableLogs: false,
                  checkForInactiveTracks: false,
                  audioBitsPerSecond: -5000,
                  videoBitsPerSecond: -5000,
                  ondataavailable: function (blob) {
                    chunks.push(blob);
                  },
                });
              } else {
                selector.find("#download-gif-progress").css("display", "flex");
                recorder = RecordRTC(stream, {
                  type: "gif",
                  frameRate: FPS,
                  quality: parseInt(selector.find("#gif-fps").val()), // maximum 256 colors allowed by the GIF specification
                  width: parseInt(canvasrecord.width),
                  height: parseInt(canvasrecord.height),
                  onGifPreview: function (gifURL) {
                    selector.find("#download-gif-preview").attr("src", gifURL);
                  },
                });
              }
              (function progressLooper() {
                if (!recorderPlaying) {
                  recorderPlaying = true;
                  recorderTimer = 1;
                  selector.find("#progress-bar-width").css("width", "5%");
                  selector.find("#download-progress-desc").html("5%");
                  return;
                }
                var internal = recorder.getInternalRecorder();
                if (internal && internal.getArrayOfBlobs) {
                  var blob = new Blob(internal.getArrayOfBlobs(), {
                    type: "video/webm",
                  });
                  var total = (blob.size / recorderTimer) * (duration / 1000);
                  var current = (blob.size * 100) / total;
                  if (current.toFixed(2) !== "NaN") {
                    selector
                      .find("#progress-bar-width")
                      .css("width", current.toFixed(2) + "%");
                    selector
                      .find("#download-progress-desc")
                      .html(current.toFixed(2) + "%");
                  }
                  recorderTimer = recorderTimer + 1;
                }
                setTimeout(progressLooper, 1000);
              })();
              try {
                recorder.startRecording();
                window.setTimeout(function () {
                  recorder.stopRecording(function (blobURL) {
                    stopAnim();
                    recorderPlaying = false;
                    recording = false;
                    downloadRecording(blobURL);
                    selector.find("#seekbar").offset({
                      left:
                        offset_left +
                        selector.find("#inner-timeline").offset().left +
                        currenttime / timelinetime,
                    });
                    canvas.requestRenderAll();
                    console.log("Finished rendering");
                    window.setTimeout(function () {
                      if (background_audio != false) {
                        background_audio.pause();
                        background_audio.currentTime = 0;
                        animate(true, 0);
                      } else {
                        animate(false, 0);
                      }
                      selector.find("#skip-backward").trigger("click");
                      canvas.requestRenderAll();
                    }, 1000);
                  });
                }, duration);
              } catch (e) {
                recorder.stopRecording(function () {
                  recorderPlaying = false;
                  stopAnim();
                  window.setTimeout(function () {
                    selector.find("#seekbar").offset({
                      left:
                        offset_left +
                        selector.find("#inner-timeline").offset().left +
                        currenttime / timelinetime,
                    });
                    recording = false;
                    currenttime = 0;
                    if (background_audio != false) {
                      background_audio.pause();
                      background_audio.currentTime = 0;
                      animate(true, 0);
                    } else {
                      animate(false, 0);
                    }
                    selector.find("#skip-backward").trigger("click");
                    canvas.requestRenderAll();
                    resizeCanvas();
                    selector.find("#download-progress").css("display", "none");
                    selector
                      .find("#download-gif-progress")
                      .css("display", "none");
                    selector.find("#download-real").removeClass("downloading");
                    selector.find("#download-gif-preview").attr("src", "");
                    selector.removeClass("loading");
                  }, 1000);
                });
                toastr.error(e.message, pmotionParams.t105);
              }
            }
          },
          function (error) {
            toastr.error(error, pmotionParams.t105);
          }
        );
      }
    }

    selector.find("#download-real").on("click", record);

    // Download recording
    function downloadRecording(blobURL) {
      var url = "";
      var blob = "";
      if (selector.find("input[name=download-radio]:checked").val() == "webm") {
        if (chunks == []) {
          toastr.error(pmotionParams.t142, pmotionParams.t105);
          return;
        }
        blob = new File(chunks, "video.webm", {
          type: "video/webm",
        });
        url = URL.createObjectURL(blob);
        chunks = [];
      } else {
        url = blobURL;
        if (!url) {
          toastr.error(pmotionParams.t142, pmotionParams.t105);
          return;
        }
      }
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      recording = false;
      currenttime = 0;
      animate(false, 0);
      selector.find("#seekbar").offset({
        left:
          offset_left +
          selector.find("#inner-timeline").offset().left +
          currenttime / timelinetime,
      });
      canvas.requestRenderAll();
      resizeCanvas();
      selector.find("#download-progress").css("display", "none");
      selector.find("#download-gif-progress").css("display", "none");
      selector.find("#download-real").removeClass("downloading");
      selector.find("#download-gif-preview").attr("src", "");
      selector.removeClass("loading");
      updateRecordCanvas(false);
    }

    // Download radio
    selector.find("input[type=radio][name=download-radio]").change(function () {
      if ($(this).val() == "image") {
        selector.find("#gif-fps-select").addClass("d-none");
        selector.find("#image-format-select").removeClass("d-none");
      } else if ($(this).val() == "gif") {
        selector.find("#image-format-select").addClass("d-none");
        selector.find("#gif-fps-select").removeClass("d-none");
      } else {
        selector.find("#gif-fps-select").addClass("d-none");
        selector.find("#image-format-select").addClass("d-none");
      }
    });

    // Resize the canvas
    function resizeCanvas() {
      canvas.setHeight(selector.find("#canvas-area").height());
      canvas.setWidth(selector.find("#canvas-area").width());
      artboard.set({
        left: canvas.get("width") / 2 - artboard.get("width") / 2,
        top: canvas.get("height") / 2 - artboard.get("height") / 2,
      });
      canvas.requestRenderAll();
      adjustZoom();
      animate(false, currenttime);
      initLines();
    }
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();

    // Highlight layers when selecting objects in the canvas, scroll into view if needed
    function updateSelection(e) {
      var obj = e.selected;
      selector.find(".layer-selected").removeClass("layer-selected");
      for (var i = 0; i < obj.length; i++) {
        if (
          selector.find(".layer").length > 0 &&
          selector.find(".layer[data-object='" + obj[i].get("id") + "']")
            .length > 0
        ) {
          selector
            .find(".layer[data-object='" + obj[i].get("id") + "']")
            .addClass("layer-selected");
          if (e.e != undefined) {
            document
              .getElementsByClassName("layer-selected")[0]
              .scrollIntoView();
          }
        }
      }
    }

    // Dataurl to blob
    function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }

    // Object has been modified, automatically add a keyframe
    function autoKeyframe(object, e, multi) {
      if (e.action == "drag") {
        newKeyframe("left", object, currenttime, object.get("left"), true);
        newKeyframe("top", object, currenttime, object.get("top"), true);
      } else if (e.action == "scale") {
        newKeyframe("scaleX", object, currenttime, object.get("scaleX"), true);
        newKeyframe("scaleY", object, currenttime, object.get("scaleY"), true);
        newKeyframe("left", object, currenttime, object.get("left"), true);
        newKeyframe("top", object, currenttime, object.get("top"), true);
        newKeyframe("width", object, currenttime, object.get("width"), true);
        newKeyframe("height", object, currenttime, object.get("height"), true);
      } else if (e.action == "rotate") {
        newKeyframe("angle", object, currenttime, object.get("angle"), true);
        if (multi) {
          newKeyframe(
            "scaleX",
            object,
            currenttime,
            object.get("scaleX"),
            true
          );
          newKeyframe(
            "scaleY",
            object,
            currenttime,
            object.get("scaleY"),
            true
          );
          newKeyframe("width", object, currenttime, object.get("width"), true);
          newKeyframe("left", object, currenttime, object.get("left"), true);
          newKeyframe("top", object, currenttime, object.get("top"), true);
        }
      } else if (
        e.action == "resizing" ||
        e.action == "scaleX" ||
        e.action == "scaleY"
      ) {
        newKeyframe("scaleX", object, currenttime, object.get("scaleX"), true);
        newKeyframe("scaleY", object, currenttime, object.get("scaleY"), true);
        newKeyframe("left", object, currenttime, object.get("left"), true);
        newKeyframe("width", object, currenttime, object.get("width"), true);
        newKeyframe("top", object, currenttime, object.get("top"), true);
        newKeyframe("height", object, currenttime, object.get("height"), true);
      }
    }

    // Reselect
    function reselect(selection) {
      tempselection = false;
      if (selection.type == "activeSelection") {
        var objs = [];
        for (let so of selection._objects) {
          for (let obj of canvas.getObjects()) {
            if (obj.get("id") === so.get("id")) {
              objs.push(obj);
              break;
            }
          }
        }
        canvas.setActiveObject(
          new fabric.ActiveSelection(objs, {
            canvas: canvas,
          })
        );
        canvas.requestRenderAll();
      } else {
        if (selection.get("type") == "group") {
          canvas.setActiveObject(canvas.getItemById(selection.get("id")));
        } else {
          canvas.setActiveObject(selection);
        }
        canvas.requestRenderAll();
      }
    }

    // Regroup SVG
    function reGroup(id) {
      var objects = [];
      groups
        .find((x) => x.id == id)
        .objects.forEach(function (object) {
          objects.push(canvas.getItemById(object));
        });
      var activeselection = new fabric.ActiveSelection(objects);
      var newgroup = activeselection.toGroup();
      newgroup.set({
        id: id,
        objectCaching: false,
      });
      canvas.add(newgroup);
      canvas.requestRenderAll();
    }

    // Keep record canvas up to date
    function updateRecordCanvas(isanimated) {
      if (isanimated) {
        animate(false, duration);
      }
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      canvas.clipPath = null;
      var canvassave = canvas.toJSON(JSON_defaults);
      canvas.clipPath = artboard;

      return new Promise((resolve, reject) => {
        canvasrecord.loadFromJSON(canvassave, function () {
          if (canvasrecord.getItemById("center_h")) {
            canvasrecord.remove(canvasrecord.getItemById("center_h"));
            canvasrecord.remove(canvasrecord.getItemById("center_v"));
          }
          if (canvasrecord.getItemById("line_h")) {
            canvasrecord.remove(canvasrecord.getItemById("line_h"));
            canvasrecord.remove(canvasrecord.getItemById("line_v"));
          }
          canvasrecord.requestRenderAll();
          canvasrecord.setWidth(artboard.width);
          canvasrecord.setHeight(artboard.height);
          canvasrecord.width = artboard.width;
          canvasrecord.height = artboard.height;
          canvasrecord.requestRenderAll();
          objects.forEach(function (object) {
            if (isanimated) {
              if (animatedtext.length >= 1) {
                var text = animatedtext.find((x) => x.id == object.id);
                if (text !== undefined) {
                  text.reset(
                    text.text,
                    text.props,
                    canvasrecord,
                    canvasrecord.getItemById(object.id)
                  );
                }
              }
            }
            replaceSource(canvasrecord.getItemById(object.id), canvasrecord);
            replaceSource(canvas.getItemById(object.id), canvas);
          });
          canvasrecord.discardActiveObject();
          add_watermark(canvasrecord);
          canvasrecord.requestRenderAll();
          window.setTimeout(function () {
            resolve(canvasrecord);
          }, 1000);
        });
      });
    }

    // Save everything in the canvas (for undo/redo/autosave)
    function save() {
      redo = [];
      redoarr = [];
      if (state) {
        undo.push(state);
        undoarr.push(statearr);
      }
      canvas.clipPath = null;
      state = canvas.toJSON(JSON_defaults);
      canvas.clipPath = artboard;
      statearr = {
        keyframes: JSON.parse(JSON.stringify(keyframes)),
        p_keyframes: JSON.parse(JSON.stringify(p_keyframes)),
        objects: JSON.parse(JSON.stringify(objects)),
        colormode: colormode,
        speed: speed,
        audiosrc: background_key,
        duration: duration,
        currenttime: currenttime,
        layercount: layer_count,
        width: artboard.width,
        height: artboard.height,
        animatedtext: JSON.stringify(animatedtext),
        groups: JSON.stringify(groups),
      };
      if (undo.length >= 1) {
        selector.find("#undo").addClass("history-active");
      } else {
        selector.find("#undo").removeClass("history-active");
      }
      if (redo.length >= 1) {
        selector.find("#redo").addClass("history-active");
      } else {
        selector.find("#redo").removeClass("history-active");
      }
      autoSave();
      // updateRecordCanvas(false);
    }

    // Duplicate object
    function copyObject() {
      if (clipboard) {
        if (cliptype == "object") {
          if (clipboard.type == "activeSelection") {
            clipboard._objects.forEach(function (clone) {
              clone.clone(function (cloned) {
                cloned.set({
                  id: "Cloned" + layer_count,
                  // top: artboard.top + artboard.height / 2,
                  // left: artboard.left + artboard.width / 2,
                });
                canvas.add(cloned);
                canvas.requestRenderAll();
                newLayer(cloned);
                canvas.setActiveObject(cloned);
              });
            });
          } else {
            clipboard.clone(function (cloned) {
              cloned.set({
                id: "Cloned" + layer_count,
                // top: artboard.top + artboard.height / 2,
                // left: artboard.left + artboard.width / 2,
              });
              canvas.add(cloned);
              canvas.requestRenderAll();
              newLayer(cloned);
              canvas.setActiveObject(cloned);
            });
          }
          save();
        } else {
          copyKeyframes();
        }
      }
    }

    // Replace the source of an object when reloading the canvas (since Fabric needs a DOM reference for the objects)
    function replaceSource(object, cv) {
      if (object == null) {
        return false;
      }
      if (object.get("type") != "group") {
        if (object.type) {
          if (object.type == "image") {
            if (object.get("id").indexOf("Video") >= 0) {
              var vidObj = document.createElement("video");
              var vidSrc = document.createElement("source");
              vidSrc.src = object.get("source");
              vidObj.crossOrigin = "anonymous";
              vidObj.appendChild(vidSrc);
              vidObj.addEventListener("loadeddata", function () {
                vidObj.width = this.videoWidth;
                vidObj.height = this.videoHeight;
                vidObj.currentTime = 0;
                vidObj.muted = false;
                async function waitLoad() {
                  if (vidObj.readyState >= 3) {
                    object.setElement(vidObj);
                    object.saveElem = vidObj;
                    await cv.requestRenderAll();
                  } else {
                    window.setTimeout(function () {
                      waitLoad();
                    }, 100);
                  }
                }
                window.setTimeout(function () {
                  waitLoad();
                }, 100);
              });
              vidObj.currentTime = 0;
            } else {
              if (objects.find((x) => x.id == object.get("id")).filters) {
                if (
                  objects.find((x) => x.id == object.get("id")).filters.length >
                  0
                ) {
                  object.filters = [];
                  objects
                    .find((x) => x.id == object.get("id"))
                    .filters.forEach(function (filter) {
                      if (filter.type == "Sepia") {
                        object.filters.push(new f.Sepia());
                      } else if (filter.type == "Invert") {
                        object.filters.push(new f.Invert());
                      } else if (filter.type == "BlackWhite") {
                        object.filters.push(new f.BlackWhite());
                      } else if (filter.type == "Kodachrome") {
                        object.filters.push(new f.Kodachrome());
                      } else if (filter.type == "Polaroid") {
                        object.filters.push(new f.Polaroid());
                      } else if (filter.type == "Technicolor") {
                        object.filters.push(new f.Technicolor());
                      } else if (filter.type == "Vintage") {
                        object.filters.push(new f.Vintage());
                      } else if (filter.type == "Brownie") {
                        object.filters.push(new f.Brownie());
                      } else if (filter.type == "Grayscale") {
                        object.filters.push(new f.Grayscale());
                      } else if (filter.type == "Brightness") {
                        object.filters.push(
                          new f.Brightness({ brightness: filter.value })
                        );
                      } else if (filter.type == "Contrast") {
                        object.filters.push(
                          new f.Contrast({ contrast: filter.value })
                        );
                      } else if (filter.type == "Saturation") {
                        object.filters.push(
                          new f.Saturation({ saturation: filter.value })
                        );
                      } else if (filter.type == "Vibrance") {
                        object.filters.push(
                          new f.Vibrance({ vibrance: filter.value })
                        );
                      } else if (filter.type == "HueRotation") {
                        object.filters.push(
                          new f.HueRotation({ rotation: filter.value })
                        );
                      } else if (filter.type == "Noise") {
                        object.filters.push(
                          new f.Noise({ noise: filter.value })
                        );
                      } else if (filter.type == "Blur") {
                        object.filters.push(new f.Blur({ blur: filter.value }));
                      } else if (filter.type == "RemoveColor") {
                        object.filters.push(
                          new f.RemoveColor({
                            distance: filter.distance,
                            color: filter.color,
                          })
                        );
                      }
                    });
                  object.applyFilters();
                  // cv.requestRenderAll();
                } else {
                  object.filters = [];
                  object.applyFilters();
                  // cv.requestRenderAll();
                }
              }
            }
          }
        }
      }
    }

    function undoRedoReset(projectCanvas) {
      state = projectCanvas;
      statearr = {
        keyframes: JSON.parse(JSON.stringify(keyframes)),
        p_keyframes: JSON.parse(JSON.stringify(p_keyframes)),
        objects: JSON.parse(JSON.stringify(objects)),
        colormode: colormode,
        speed: speed,
        audiosrc: background_key,
        duration: duration,
        currenttime: currenttime,
        layercount: layer_count,
        width: artboard.width,
        height: artboard.height,
        animatedtext: JSON.stringify(animatedtext),
        groups: JSON.stringify(groups),
      };
      undo = [];
      undoarr = [];
      redo = [];
      redoarr = [];
      selector.find("#undo").removeClass("history-active");
      selector.find("#redo").removeClass("history-active");
    }

    // Perform undo/redo
    function undoRedo(newState, saveState, newArrState, saveArrState) {
      saveState.push(state);
      saveArrState.push(statearr);
      statearr = newArrState.pop();
      state = newState.pop();
      keyframes = statearr.keyframes;
      p_keyframes = statearr.p_keyframes;
      objects = statearr.objects;
      colormode = statearr.colormode;
      duration = statearr.duration;
      currenttime = statearr.currenttime;
      animatedtext = JSON.parse(statearr.animatedtext);
      canvas.clipPath = null;
      canvas.loadFromJSON(state, function () {
        canvas.clipPath = artboard;
        canvas.getItemById("line_h").set({ opacity: 0 });
        canvas.getItemById("line_v").set({ opacity: 0 });
        canvas.requestRenderAll();
        selector.find(".object-props").remove();
        selector.find(".layer").remove();
        objects.forEach(function (object) {
          replaceSource(canvas.getItemById(object.id), canvas);
          renderLayer(canvas.getItemById(object.id));
          props.forEach(function (prop) {
            if (
              prop != "top" &&
              prop != "scaleY" &&
              prop != "width" &&
              prop != "height" &&
              prop != "shadow.offsetX" &&
              prop != "shadow.offsetY" &&
              prop != "shadow.blur"
            ) {
              renderProp(prop, canvas.getItemById(object.id));
            }
          });
          if (animatedtext.length >= 1) {
            animatedtext.forEach(function (text, index) {
              var temp = new AnimatedText(text.text, text.props);
              temp.assignTo(text.id);
              animatedtext[index] = temp;
            });
            var text = animatedtext.find((x) => x.id == object.id);
            if (text !== undefined) {
              text.reset(
                text.text,
                text.props,
                canvas,
                canvas.getItemById(object.id)
              );
            }
          }
        });
        keyframes.forEach(function (keyframe) {
          if (
            keyframe.name != "top" &&
            keyframe.name != "scaleY" &&
            keyframe.name != "width" &&
            keyframe.name != "height" &&
            keyframe.name != "shadow.offsetX" &&
            keyframe.name != "shadow.offsetY" &&
            keyframe.name != "shadow.blur"
          ) {
            renderKeyframe(
              canvas.getItemById(keyframe.id),
              keyframe.name,
              keyframe.t
            );
          }
        });
        animate(false, currenttime);
      });
      if (undo.length >= 1) {
        selector.find("#undo").addClass("history-active");
      } else {
        selector.find("#undo").removeClass("history-active");
      }
      if (redo.length >= 1) {
        selector.find("#redo").addClass("history-active");
      } else {
        selector.find("#redo").removeClass("history-active");
      }
    }

    // Undo/redo buttons
    selector.on("click", "#undo", function () {
      if (undo.length >= 1) {
        undoRedo(undo, redo, undoarr, redoarr);
      }
    });
    selector.on("click", "#redo", function () {
      if (redo.length >= 1) {
        undoRedo(redo, undo, redoarr, undoarr);
      }
    });

    // Generate keyframes
    function keyframeChanges(object, id) {
      if (id == "object-x" || id == "object-y") {
        newKeyframe("left", object, currenttime, object.get("left"), true);
        newKeyframe("top", object, currenttime, object.get("top"), true);
      } else if (id == "object-w" || id == "object-h") {
        newKeyframe("scaleX", object, currenttime, object.get("scaleX"), true);
        newKeyframe("scaleY", object, currenttime, object.get("scaleY"), true);
        newKeyframe("width", object, currenttime, object.get("width"), true);
        newKeyframe("height", object, currenttime, object.get("height"), true);
      } else if (id == "object-r") {
        newKeyframe("angle", object, currenttime, object.get("angle"), true);
      } else if (id == "object-stroke") {
        newKeyframe("stroke", object, currenttime, object.get("stroke"), true);
        newKeyframe(
          "strokeWidth",
          object,
          currenttime,
          object.get("strokeWidth"),
          true
        );
      } else if (
        id == "object-shadow-x" ||
        id == "object-shadow-y" ||
        id == "object-blur"
      ) {
        newKeyframe(
          "shadow.color",
          object,
          currenttime,
          object.shadow.color,
          true
        );
        newKeyframe(
          "shadow.offsetX",
          object,
          currenttime,
          object.shadow.offsetX,
          true
        );
        newKeyframe(
          "shadow.offsetY",
          object,
          currenttime,
          object.shadow.offsetY,
          true
        );
        newKeyframe(
          "shadow.blur",
          object,
          currenttime,
          object.shadow.blur,
          true
        );
      }
      save();
    }

    // Play video
    function play() {
      paused = false;
      canvas.discardActiveObject();
      animate(true, currenttime);
      selector.find("#play-button").html("pause");
    }

    // Pause video
    function pause() {
      paused = true;
      selector.find("#play-button").html("play_arrow");
    }

    // Set object value (while animating)
    function setObjectValue(prop, object, value, inst) {
      if (object.get("type") != "group") {
        if (object.group) {
          var group = object.group;
          tempgroup = group._objects;
          group._restoreObjectsState();
          canvas.setActiveObject(group);
          inst.remove(canvas.getActiveObject());
          canvas.discardActiveObject();
          inst.requestRenderAll();
          for (var i = 0; i < tempgroup.length; i++) {
            inst.add(tempgroup[i]);
          }
        }
      }
      if (prop == "left" && !recording) {
        object.set(prop, value + artboard.get("left"));
      } else if (prop == "top" && !recording) {
        object.set(prop, value + artboard.get("top"));
      } else if (prop == "shadow.blur") {
        object.shadow.blur = value;
      } else if (prop == "shadow.color") {
        object.shadow.color = value;
      } else if (prop == "shadow.offsetX") {
        object.shadow.offsetX = value;
      } else if (prop == "shadow.offsetY") {
        object.shadow.offsetY = value;
      } else if (prop == "shadow.blur") {
        object.shadow.blur = value;
      } else if (object.get("type") != "group") {
        object.set(prop, value);
      } else if (prop != "width") {
        object.set(prop, value);
      }
      inst.requestRenderAll();
    }

    // Find last keyframe in time from same object & property
    function lastKeyframe(keyframe, index) {
      var temparr = keyframes.slice();
      temparr.sort(function (a, b) {
        return a.t - b.t;
      });
      temparr.length = temparr.findIndex((x) => x === keyframe);
      temparr.reverse();
      if (temparr.length == 0) {
        return false;
      } else {
        for (var i = 0; i < temparr.length; i++) {
          if (
            temparr[i].id == keyframe.id &&
            temparr[i].name == keyframe.name
          ) {
            return temparr[i];
          } else if (i == temparr.length - 1) {
            return false;
          }
        }
      }
    }

    // Check whether any keyframe exists for a certain property
    function checkAnyKeyframe(id, prop, inst) {
      const object = inst.getItemById(id);
      if (object.get("assetType") == "audio") {
        return false;
      }
      if (
        object.get("type") != "i-text" &&
        object.get("type") != "textbox" &&
        prop == "charSpacing"
      ) {
        return false;
      }
      if (
        object.get("type") == "group" &&
        (prop == "shadow.color" ||
          prop == "shadow.offsetX" ||
          prop == "shadow.offsetY" ||
          prop == "shadow.blur")
      ) {
        return false;
      }
      const keyarr2 = $.grep(keyframes, function (e) {
        return e.id == id && e.name == prop;
      });
      if (keyarr2.length == 0) {
        const value = objects
          .find((x) => x.id == id)
          .defaults.find((x) => x.name == prop).value;
        setObjectValue(prop, object, value, inst);
      }
    }

    // Check if parameter is a DOM element
    function isDomElem(el) {
      return el instanceof HTMLElement || el[0] instanceof HTMLElement
        ? true
        : false;
    }

    // Play videos when seeking/playing
    async function playVideos(time) {
      objects.forEach(async function (object) {
        object = canvas.getItemById(object.id);
        if (object == null) {
          return false;
        }
        var inst = canvas;
        var start = false;
        if (recording) {
          object = canvasrecord.getItemById(object.id);
          inst = canvasrecord;
        }
        if (
          object.get("id").indexOf("Video") >= 0 &&
          p_keyframes.find((x) => x.id == object.id).trimstart +
            p_keyframes.find((x) => x.id == object.id).start <=
            time &&
          p_keyframes.find((x) => x.id == object.id).end >= time
        ) {
          object.set("visible", true);
          inst.requestRenderAll();
          if ($(object.getElement())[0].paused == true) {
            $(object.getElement())[0].currentTime = parseFloat(
              (
                (time -
                  p_keyframes.find((x) => x.id == object.id).start +
                  p_keyframes.find((x) => x.id == object.id).trimstart) /
                1000
              ).toFixed(2)
            );
          }
          if (!recording) {
            var animation = {
              value: 0,
            };
            var instance = anime({
              targets: animation,
              value: [currenttime, duration],
              delay: 0,
              duration: duration,
              easing: "linear",
              autoplay: true,
              update: async function () {
                if (!paused && start) {
                  if ($(object.getElement())[0].tagName == "VIDEO") {
                    $(object.getElement())[0].play();
                  }
                  await inst.requestRenderAll();
                } else if (paused) {
                  if (
                    isDomElem($(object.getElement())[0]) &&
                    $(object.getElement())[0].tagName == "VIDEO"
                  ) {
                    $(object.getElement())[0].pause();
                  }
                  animation.value = duration + 1;
                  anime.remove(animation);
                }
              },
              changeBegin: function () {
                start = true;
              },
            });
            if (paused) {
              $(object.getElement())[0].currentTime = parseFloat(
                (
                  (time -
                    p_keyframes.find((x) => x.id == object.id).start +
                    p_keyframes.find((x) => x.id == object.id).trimstart) /
                  1000
                ).toFixed(2)
              );
              await inst.requestRenderAll();
            }
          } else {
            if ($(object.getElement())[0].paused == true) {
              $(object.getElement())[0].play();
              inst.requestRenderAll();
            }
          }
        } else if (object.get("id").indexOf("Video") >= 0) {
          $(object.getElement())[0].pause();
          object.set("visible", false);
          inst.requestRenderAll();
        }
      });
    }

    // Play background audio
    function playAudio(time) {
      objects.forEach(async function (object) {
        var start = false;
        var obj = canvas.getItemById(object.id);
        if (obj.get("assetType") == "audio") {
          var flag = false;
          var animation = {
            value: 0,
          };
          var instance = anime({
            targets: animation,
            value: [currenttime, duration],
            delay: 0,
            duration: duration,
            easing: "linear",
            autoplay: true,
            update: async function () {
              if (start && play && !paused) {
                if (
                  !flag &&
                  p_keyframes.find((x) => x.id == object.id).start <=
                    currenttime &&
                  p_keyframes.find((x) => x.id == object.id).end >= currenttime
                ) {
                  if (obj.get("src")) {
                    obj.get("src").currentTime =
                      (p_keyframes.find((x) => x.id == object.id).trimstart -
                        p_keyframes.find((x) => x.id == object.id).start +
                        currenttime) /
                      1000;
                    obj.get("src").volume = obj.get("volume");
                    obj.get("src").play();
                    flag = true;
                  } else {
                    var audio = new Audio(obj.get("audioSrc"));
                    obj.set("src", audio);
                    audio.volume = obj.get("volume");
                    audio.crossOrigin = "anonymous";
                    audio.currentTime =
                      (p_keyframes.find((x) => x.id == object.id).trimstart -
                        p_keyframes.find((x) => x.id == object.id).start +
                        currenttime) /
                      1000;
                    audio.play();
                    flag = true;
                  }
                } else if (
                  p_keyframes.find((x) => x.id == object.id).start >=
                    currenttime ||
                  p_keyframes.find((x) => x.id == object.id).end <= currenttime
                ) {
                  if (obj.get("src")) {
                    obj.get("src").pause();
                  }
                }
              } else if (paused) {
                if (obj.get("src")) {
                  obj.get("src").pause();
                  anime.remove(animation);
                }
              }
            },
            changeBegin: function () {
              start = true;
            },
          });
        }
      });
    }

    // Temp animate with render callback
    async function recordAnimate(time) {
      anime.speed = 1;
      currenttime = time;
      var inst = canvasrecord;
      if (animatedtext.length > 0) {
        animatedtext.forEach(function (text) {
          text.seek(time, inst);
          // inst.requestRenderAll();
        });
      }

      keyframes.forEach(function (keyframe, index) {
        // Find next keyframe in time from same object & property
        function nextKeyframe(keyframe, index) {
          var temparr = keyframes.slice();
          temparr.sort(function (a, b) {
            return a.t - b.t;
          });
          temparr.splice(0, temparr.findIndex((x) => x === keyframe) + 1);
          if (temparr.length == 0) {
            return false;
          } else {
            for (var i = 0; i < temparr.length; i++) {
              if (
                temparr[i].id == keyframe.id &&
                temparr[i].name == keyframe.name
              ) {
                return temparr[i];
              } else if (i == temparr.length - 1) {
                return false;
              }
            }
          }
        }
        // Regroup if needed (groups break to animate their children, then regroup after children have animated)
        if (groups.find((x) => x.id == keyframe.id)) {
          if (!inst.getItemById(keyframe.id)) {
            reGroup(keyframe.id);
          }
          const object = inst.getItemById(keyframe.id);
          const visible = object.get("visible");
          if (
            currenttime <
            p_keyframes.find((x) => x.id == keyframe.id).trimstart +
              p_keyframes.find((x) => x.id == keyframe.id).start
          ) {
            if (visible !== false) {
              object.set("visible", false);
              inst.requestRenderAll();
            }
          } else if (
            currenttime > p_keyframes.find((x) => x.id == keyframe.id).end ||
            currenttime > duration
          ) {
            if (visible !== false) {
              object.set("visible", false);
              inst.requestRenderAll();
            }
          } else {
            if (visible !== true) {
              object.set("visible", true);
              inst.requestRenderAll();
            }
          }
          if (
            currenttime >=
            p_keyframes.find((x) => x.id == keyframe.id).trimstart +
              p_keyframes.find((x) => x.id == keyframe.id).start
          ) {
            props.forEach(function (prop) {
              checkAnyKeyframe(keyframe.id, prop, inst);
            });
          }
        }

        // Copy of setObjectValue function, seems to perform better inside the function
        function setValue(prop, object, value, inst) {
          if (object.get("type") != "group") {
            if (object.group) {
              var group = object.group;
              tempgroup = group._objects;
              group._restoreObjectsState();
              inst.setActiveObject(group);
              inst.remove(inst.getActiveObject());
              inst.discardActiveObject();
              inst.requestRenderAll();
              for (var i = 0; i < tempgroup.length; i++) {
                inst.add(tempgroup[i]);
              }
            }
          }
          if (prop == "left" && !recording) {
            object.set(prop, value + artboard.get("left"));
          } else if (prop == "top" && !recording) {
            object.set(prop, value + artboard.get("top"));
          } else if (prop == "shadow.blur") {
            object.shadow.blur = value;
          } else if (prop == "shadow.color") {
            object.shadow.color = value;
          } else if (prop == "shadow.offsetX") {
            object.shadow.offsetX = value;
          } else if (prop == "shadow.offsetY") {
            object.shadow.offsetY = value;
          } else if (prop == "shadow.blur") {
            object.shadow.blur = value;
          } else if (object.get("type") != "group") {
            object.set(prop, value);
          } else if (prop != "width") {
            object.set(prop, value);
          }
          inst.requestRenderAll();
        }

        var object = inst.getItemById(keyframe.id);
        var visible = object.get("visible");
        if (
          keyframe.t >= time &&
          currenttime >=
            p_keyframes.find((x) => x.id == keyframe.id).trimstart +
              p_keyframes.find((x) => x.id == keyframe.id).start
        ) {
          var delay = 0;
          var start = false;
          var lasttime, lastprop;
          // Find last keyframe in time from same object & property
          var lastkey = lastKeyframe(keyframe, index);
          if (!lastkey) {
            lasttime = 0;
            lastprop = objects
              .find((x) => x.id == keyframe.id)
              .defaults.find((x) => x.name == keyframe.name).value;
          } else {
            lasttime = lastkey.t;
            lastprop = lastkey.value;
          }
          if (lastkey && lastkey.t >= time && !play) {
            return;
          }

          // Initiate the animation
          var animation = {
            value: lastprop,
          };
          var instance = anime({
            targets: animation,
            delay: delay,
            value: keyframe.value,
            duration: keyframe.t - lasttime,
            easing: keyframe.easing,
            autoplay: false,
            update: function () {
              if (start && !paused) {
                if (
                  currenttime <
                    p_keyframes.find((x) => x.id == keyframe.id).trimstart +
                      p_keyframes.find((x) => x.id == keyframe.id).start ||
                  currenttime >
                    p_keyframes.find((x) => x.id == keyframe.id).end ||
                  currenttime > duration
                ) {
                  if (visible !== false) {
                    object.set("visible", false);
                    inst.requestRenderAll();
                  }
                } else {
                  setValue(keyframe.name, object, animation.value, inst);
                  if (visible !== true) {
                    object.set("visible", true);
                    inst.requestRenderAll();
                  }
                }
              } else if (start && paused) {
                anime.remove(animation);
              }
            },
            changeBegin: function () {
              start = true;
            },
          });

          if (time - lasttime <= 0) {
            instance.seek(0);
          } else {
            instance.seek(time - lasttime);
          }

          if (
            parseFloat(lasttime) <= parseFloat(time) &&
            parseFloat(keyframe.t) >= parseFloat(time)
          ) {
            setValue(keyframe.name, object, animation.value, inst);
          }
        } else if (keyframe.t < time && !nextKeyframe(keyframe, index)) {
          var prop = keyframe.name;
          if (prop == "shadow.blur") {
            if (object.shadow.blur != keyframe.value) {
              setValue(keyframe.name, object, keyframe.value, inst);
            }
          } else if (prop == "shadow.color") {
            if (object.shadow.color != keyframe.value) {
              setValue(keyframe.name, object, keyframe.value, inst);
            }
          } else if (prop == "shadow.offsetX") {
            if (object.shadow.offsetX != keyframe.value) {
              setValue(keyframe.name, object, keyframe.value, inst);
            }
          } else if (prop == "shadow.offsetY") {
            if (object.shadow.offsetY != keyframe.value) {
              setValue(keyframe.name, object, keyframe.value, inst);
            }
          } else {
            if (object.get(prop) != keyframe.value) {
              setValue(keyframe.name, object, keyframe.value, inst);
            }
          }
        }
      });

      objects.forEach(function (object) {
        if (object.id.indexOf("Group") == -1) {
          const object2 = inst.getItemById(object.id);
          const visible = object2.get("visible");
          if (
            currenttime <
            p_keyframes.find((x) => x.id == object.id).trimstart +
              p_keyframes.find((x) => x.id == object2.id).start
          ) {
            if (visible !== false) {
              object2.set("visible", false);
              inst.requestRenderAll();
            }
          } else if (
            currenttime > p_keyframes.find((x) => x.id == object.id).end ||
            currenttime > duration
          ) {
            if (visible !== false) {
              object2.set("visible", false);
              inst.requestRenderAll();
            }
          } else {
            if (visible !== true) {
              object2.set("visible", true);
              inst.requestRenderAll();
            }
          }
          if (
            currenttime >=
            p_keyframes.find((x) => x.id == object.id).trimstart +
              p_keyframes.find((x) => x.id == object.id).start
          ) {
            props.forEach(function (prop) {
              checkAnyKeyframe(object.id, prop, inst);
            });
          }
        }
      });
      // inst.requestRenderAll();

      playVideos(time);
    }

    // Animate timeline (or seek to specific point in time)
    async function animate(play, time) {
      anime.speed = speed;
      if (!draggingPanel) {
        var inst = canvas;
        keyframes.forEach(function (keyframe, index) {
          // Find next keyframe in time from same object & property
          function nextKeyframe(keyframe, index) {
            var temparr = keyframes.slice();
            temparr.sort(function (a, b) {
              return a.t - b.t;
            });
            temparr.splice(0, temparr.findIndex((x) => x === keyframe) + 1);
            if (temparr.length == 0) {
              return false;
            } else {
              for (var i = 0; i < temparr.length; i++) {
                if (
                  temparr[i].id == keyframe.id &&
                  temparr[i].name == keyframe.name
                ) {
                  return temparr[i];
                } else if (i == temparr.length - 1) {
                  return false;
                }
              }
            }
          }
          // Regroup if needed (groups break to animate their children, then regroup after children have animated)
          if (groups.find((x) => x.id == keyframe.id)) {
            if (!inst.getItemById(keyframe.id)) {
              reGroup(keyframe.id);
            }
            const object = inst.getItemById(keyframe.id);
            const visible = object.get("visible");
            if (
              currenttime <
              p_keyframes.find((x) => x.id == keyframe.id).trimstart +
                p_keyframes.find((x) => x.id == keyframe.id).start
            ) {
              if (visible !== false) {
                object.set("visible", false);
                inst.requestRenderAll();
              }
            } else if (
              currenttime > p_keyframes.find((x) => x.id == keyframe.id).end ||
              currenttime > duration
            ) {
              if (visible !== false) {
                object.set("visible", false);
                inst.requestRenderAll();
              }
            } else {
              if (visible !== true) {
                object.set("visible", true);
                inst.requestRenderAll();
              }
            }
            if (
              currenttime >=
              p_keyframes.find((x) => x.id == keyframe.id).trimstart +
                p_keyframes.find((x) => x.id == keyframe.id).start
            ) {
              props.forEach(function (prop) {
                checkAnyKeyframe(keyframe.id, prop, inst);
              });
            }
          }

          // Copy of setObjectValue function, seems to perform better inside the function
          function setValue(prop, object, value, inst) {
            if (object.get("assetType") == "audio" && play) {
              if (object.get("src")) {
                object.get("src").volume = value;
                object.set("volume", value);
              }
              return false;
            }
            if (object.get("type") != "group") {
              if (object.group) {
                var group = object.group;
                tempgroup = group._objects;
                group._restoreObjectsState();
                inst.setActiveObject(group);
                inst.remove(inst.getActiveObject());
                inst.discardActiveObject();
                inst.requestRenderAll();
                for (var i = 0; i < tempgroup.length; i++) {
                  inst.add(tempgroup[i]);
                }
              }
            }
            if (prop == "left" && !recording) {
              object.set(prop, value + artboard.get("left"));
            } else if (prop == "top" && !recording) {
              object.set(prop, value + artboard.get("top"));
            } else if (prop == "shadow.blur") {
              object.shadow.blur = value;
            } else if (prop == "shadow.color") {
              object.shadow.color = value;
            } else if (prop == "shadow.offsetX") {
              object.shadow.offsetX = value;
            } else if (prop == "shadow.offsetY") {
              object.shadow.offsetY = value;
            } else if (prop == "shadow.blur") {
              object.shadow.blur = value;
            } else if (object.get("type") != "group") {
              object.set(prop, value);
            } else if (prop != "width") {
              object.set(prop, value);
            }
            inst.requestRenderAll();
          }

          var object = inst.getItemById(keyframe.id);
          var visible = object.get("visible");
          if (
            keyframe.t >= time &&
            currenttime >=
              p_keyframes.find((x) => x.id == keyframe.id).trimstart +
                p_keyframes.find((x) => x.id == keyframe.id).start
          ) {
            var delay = 0;
            var start = false;
            var lasttime, lastprop;
            // Find last keyframe in time from same object & property
            var lastkey = lastKeyframe(keyframe, index);
            if (!lastkey) {
              lasttime = 0;
              lastprop = objects
                .find((x) => x.id == keyframe.id)
                .defaults.find((x) => x.name == keyframe.name).value;
            } else {
              lasttime = lastkey.t;
              lastprop = lastkey.value;
            }
            if (lastkey && lastkey.t >= time && !play) {
              return;
            }
            // Set delay for the animation if playing
            if (play) {
              if (lasttime > currenttime) {
                delay = lasttime - time;
              }
            }
            // Initiate the animation
            var animation = {
              value: lastprop,
            };
            var instance = anime({
              targets: animation,
              delay: delay,
              value: keyframe.value,
              duration: keyframe.t - lasttime,
              easing: keyframe.easing,
              autoplay: false,
              update: function () {
                if (start && !paused) {
                  if (
                    currenttime <
                      p_keyframes.find((x) => x.id == keyframe.id).trimstart +
                        p_keyframes.find((x) => x.id == keyframe.id).start ||
                    currenttime >
                      p_keyframes.find((x) => x.id == keyframe.id).end ||
                    currenttime > duration
                  ) {
                    if (visible !== false) {
                      object.set("visible", false);
                      inst.requestRenderAll();
                    }
                  } else {
                    setValue(keyframe.name, object, animation.value, inst);
                    if (visible !== true) {
                      object.set("visible", true);
                      inst.requestRenderAll();
                    }
                  }
                } else if (start && paused) {
                  anime.remove(animation);
                }
              },
              changeBegin: function () {
                start = true;
              },
            });

            if (time - lasttime <= 0) {
              instance.seek(0);
            } else {
              instance.seek(time - lasttime);
            }

            if (play) {
              instance.play();
            } else if (
              parseFloat(lasttime) <= parseFloat(time) &&
              parseFloat(keyframe.t) >= parseFloat(time)
            ) {
              setValue(keyframe.name, object, animation.value, inst);
            }
          } else if (keyframe.t < time && !nextKeyframe(keyframe, index)) {
            var prop = keyframe.name;
            if (prop == "left" && !recording) {
              if (object.get("left") - artboard.get("left") != keyframe.value) {
                setValue(keyframe.name, object, keyframe.value, inst);
              }
            } else if (prop == "top" && !recording) {
              if (object.get("top") - artboard.get("top") != keyframe.value) {
                setValue(keyframe.name, object, keyframe.value, inst);
              }
            } else if (prop == "shadow.blur") {
              if (object.shadow.blur != keyframe.value) {
                setValue(keyframe.name, object, keyframe.value, inst);
              }
            } else if (prop == "shadow.color") {
              if (object.shadow.color != keyframe.value) {
                setValue(keyframe.name, object, keyframe.value, inst);
              }
            } else if (prop == "shadow.offsetX") {
              if (object.shadow.offsetX != keyframe.value) {
                setValue(keyframe.name, object, keyframe.value, inst);
              }
            } else if (prop == "shadow.offsetY") {
              if (object.shadow.offsetY != keyframe.value) {
                setValue(keyframe.name, object, keyframe.value, inst);
              }
            } else {
              if (object.get(prop) != keyframe.value) {
                setValue(keyframe.name, object, keyframe.value, inst);
              }
            }
          }
        });
        objects.forEach(function (object) {
          if (object.id.indexOf("Group") == -1) {
            const object2 = inst.getItemById(object.id);
            const visible = object2.get("visible");
            if (
              currenttime <
              p_keyframes.find((x) => x.id == object.id).trimstart +
                p_keyframes.find((x) => x.id == object.id).start
            ) {
              if (visible !== false) {
                object2.set("visible", false);
                inst.requestRenderAll();
              }
            } else if (
              currenttime > p_keyframes.find((x) => x.id == object.id).end ||
              currenttime > duration
            ) {
              if (visible !== false) {
                object2.set("visible", false);
                inst.requestRenderAll();
              }
            } else {
              if (visible !== true) {
                object2.set("visible", true);
                inst.requestRenderAll();
              }
            }
            if (
              currenttime >=
              p_keyframes.find((x) => x.id == object.id).trimstart +
                p_keyframes.find((x) => x.id == object.id).start
            ) {
              props.forEach(function (prop) {
                checkAnyKeyframe(object.id, prop, inst);
              });
            }
          }
        });
        // inst.requestRenderAll();

        if (animatedtext.length > 0) {
          animatedtext.forEach(function (text) {
            text.seek(currenttime, canvas);
            // inst.requestRenderAll();
          });
        }

        playVideos(time);
        if (play) {
          playAudio(time);
        }
        if (play && !paused) {
          var animation = {
            value: 0,
          };
          var main_instance = anime({
            targets: animation,
            value: [currenttime, duration],
            duration: duration - currenttime,
            easing: "linear",
            autoplay: true,
            update: function () {
              if (!paused) {
                currenttime = animation.value;
                if (animatedtext.length > 0) {
                  animatedtext.forEach(function (text) {
                    text.seek(currenttime, inst);
                    // inst.requestRenderAll();
                  });
                }
                objects.forEach(function (object) {
                  if (object.id.indexOf("Group") == -1) {
                    const object2 = inst.getItemById(object.id);
                    const visible = object2.get("visible");
                    if (
                      currenttime <
                      p_keyframes.find((x) => x.id == object.id).trimstart +
                        p_keyframes.find((x) => x.id == object.id).start
                    ) {
                      if (visible !== false) {
                        object2.set("visible", false);
                        inst.requestRenderAll();
                      }
                    } else if (
                      currenttime >
                        p_keyframes.find((x) => x.id == object.id).end ||
                      currenttime > duration
                    ) {
                      if (visible !== false) {
                        object2.set("visible", false);
                        inst.requestRenderAll();
                      }
                    } else {
                      if (visible !== true) {
                        object2.set("visible", true);
                        inst.requestRenderAll();
                      }
                    }
                    if (
                      currenttime >=
                      p_keyframes.find((x) => x.id == object.id).trimstart +
                        p_keyframes.find((x) => x.id == object.id).start
                    ) {
                      props.forEach(function (prop) {
                        checkAnyKeyframe(object.id, prop, inst);
                      });
                    }
                  }
                });
                if (!recording) {
                  renderTime();
                  selector.find("#seekbar").css({
                    left: currenttime / timelinetime + offset_left,
                  });
                }
              } else {
                pause();
                animation.value = duration + 1;
                anime.remove(animation);
              }
            },
            complete: function () {
              pause();
            },
          });
        } else if (paused) {
          currenttime = time;
        }
      }
    }

    // Render a keyframe
    function renderKeyframe(object, prop, time) {
      const color = objects.find((x) => x.id == object.id).color;
      if (prop == "shadow.color") {
        if (
          selector
            .find("#" + object.get("id"))
            .find(".shadowcolor")
            .is(":visible")
        ) {
          time =
            time -
            parseFloat(p_keyframes.find((x) => x.id == object.get("id")).start);
        }
        selector
          .find("#" + object.get("id"))
          .find(".shadowcolor")
          .prepend(
            "<div class='keyframe' data-time='" +
              time +
              "' data-object='" +
              object.get("id") +
              "' data-property='" +
              prop +
              "'></div>"
          );
        selector
          .find("#" + object.get("id"))
          .find(".shadowcolor")
          .find("[data-time='" + time + "']")
          .css({ left: time / timelinetime, background: color });
      } else {
        if (
          selector
            .find("#" + object.get("id"))
            .find("." + prop)
            .is(":visible")
        ) {
          time =
            time -
            parseFloat(p_keyframes.find((x) => x.id == object.get("id")).start);
        }
        selector
          .find("#" + object.get("id"))
          .find("." + prop)
          .prepend(
            "<div class='keyframe' data-time='" +
              time +
              "' data-object='" +
              object.get("id") +
              "' data-property='" +
              prop +
              "'></div>"
          );
        selector
          .find("#" + object.get("id"))
          .find("." + prop)
          .find("[data-time='" + time + "']")
          .css({ left: time / timelinetime, background: color });
      }
    }

    // Create a keyframe
    function newKeyframe(property, object, time, value, render) {
      // Check if property can be animated
      if (
        $.inArray(
          property,
          objects.find((x) => x.id == object.get("id")).animate
        ) != -1
      ) {
        const keyarr = $.grep(keyframes, function (e) {
          return (
            e.t == parseFloat(time) &&
            e.id == object.get("id") &&
            e.name == property
          );
        });
        const keyarr2 = $.grep(keyframes, function (e) {
          return e.id == object.get("id") && e.name == property;
        });
        if (keyarr2.length == 0) {
          if (property == "left") {
            objects
              .find((x) => x.id == object.get("id"))
              .defaults.find((x) => x.name == property).value =
              object.get(property) - artboard.get("left");
          } else if (property == "top") {
            objects
              .find((x) => x.id == object.get("id"))
              .defaults.find((x) => x.name == property).value =
              object.get(property) - artboard.get("top");
          } else {
            objects
              .find((x) => x.id == object.get("id"))
              .defaults.find((x) => x.name == property).value = value;
          }
        }
        if (keyarr.length == 0) {
          if (property == "left") {
            keyframes.push({
              t: time,
              name: property,
              value: value - artboard.get("left"),
              id: object.get("id"),
              easing: "linear",
            });
          } else if (property == "top") {
            keyframes.push({
              t: time,
              name: property,
              value: value - artboard.get("top"),
              id: object.get("id"),
              easing: "linear",
            });
          } else {
            keyframes.push({
              t: time,
              name: property,
              value: value,
              id: object.get("id"),
              easing: "linear",
            });
          }
          if (
            render &&
            property != "top" &&
            property != "scaleY" &&
            property != "width" &&
            property != "height" &&
            property != "stroke" &&
            property != "shadow.offsetX" &&
            property != "shadow.offsetY" &&
            property != "shadow.blur"
          ) {
            renderKeyframe(object, property, time);
          }
          keyframes.sort(function (a, b) {
            if (a.id.indexOf("Group") >= 0 && b.id.indexOf("Group") == -1) {
              return 1;
            } else if (
              b.id.indexOf("Group") >= 0 &&
              a.id.indexOf("Group") == -1
            ) {
              return -1;
            } else {
              return 0;
            }
          });
        } else if (render) {
          if (
            property != "top" &&
            property != "scaleY" &&
            property != "width" &&
            property != "height" &&
            property != "stroke" &&
            property != "shadow.offsetX" &&
            property != "shadow.offsetY" &&
            property != "shadow.blur"
          ) {
            updateKeyframe(
              selector
                .find("#" + object.get("id"))
                .find(
                  ".keyframe[data-time='" +
                    time +
                    "'][data-property='" +
                    property +
                    "']"
                ),
              true
            );
          }
        }
      } else {
        if (property == "left") {
          objects
            .find((x) => x.id == object.get("id"))
            .defaults.find((x) => x.name == property).value =
            object.get(property) - artboard.get("left");
        } else if (property == "top") {
          objects
            .find((x) => x.id == object.get("id"))
            .defaults.find((x) => x.name == property).value =
            object.get(property) - artboard.get("top");
        } else {
          objects
            .find((x) => x.id == object.get("id"))
            .defaults.find((x) => x.name == property).value = value;
        }
      }
    }

    // Freeze all properties
    selector.on("click", ".freeze", function (e) {
      var activeObj = canvas.getActiveObject();
      if (activeObj != null && activeObj.type == "activeSelection") {
        return;
      }
      e.stopPropagation();
      const object = canvas.getItemById(
        $(this).parent().parent().parent().attr("data-object")
      );
      if ($(this).hasClass("frozen")) {
        $(this).removeClass("frozen");
        objects.find((x) => x.id == object.get("id")).animate = [];
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id");
        });
        selector
          .find(".keyframe[data-object='" + object.get("id") + "']")
          .remove();
        $(this)
          .parent()
          .parent()
          .parent()
          .find(".freeze-prop")
          .removeClass("frozen");
      } else {
        $(this).addClass("frozen");
        objects.find((x) => x.id == object.get("id")).animate = [];
        if (object.get("assetType") == "audio") {
          objects.find((x) => x.id == object.get("id")).animate.push("volume");
          keyframes = $.grep(keyframes, function (e) {
            return e.id != object.get("id");
          });
          selector
            .find(".keyframe[data-object='" + object.get("id") + "']")
            .remove();
          $(this)
            .parent()
            .parent()
            .parent()
            .find(".freeze-prop")
            .removeClass("frozen");
          newKeyframe("volume", object, 0, 0.5, true);
        } else {
          props.forEach(function (prop) {
            objects.find((x) => x.id == object.get("id")).animate.push(prop);
          });
          keyframes = $.grep(keyframes, function (e) {
            return e.id != object.get("id");
          });
          selector
            .find(".keyframe[data-object='" + object.get("id") + "']")
            .remove();
          $(this)
            .parent()
            .parent()
            .parent()
            .find(".freeze-prop")
            .removeClass("frozen");
          props.forEach(function (prop) {
            if (prop == "charSpacing") {
              if (
                object.get("type") == "i-text" ||
                object.get("type") == "textbox"
              ) {
                newKeyframe(prop, object, 0, object.get(prop), true);
              }
            } else if (
              prop == "shadow.blur" ||
              prop == "shadow.offsetX" ||
              prop == "shadow.offsetY" ||
              prop == "shadow.color"
            ) {
              if (object.get("type") != "group") {
                if (prop == "shadow.color") {
                  newKeyframe(prop, object, 0, object.shadow.color, true);
                } else if (prop == "shadow.offsetX") {
                  newKeyframe(prop, object, 0, object.shadow.offsetX, true);
                } else if (prop == "shadow.offsetY") {
                  newKeyframe(prop, object, 0, object.shadow.offsetY, true);
                } else if (prop == "shadow.blur") {
                  newKeyframe(prop, object, 0, object.shadow.blur, true);
                }
              }
            } else {
              newKeyframe(prop, object, 0, object.get(prop), true);
            }
          });
        }
      }
      save();
    });

    function animateProp(prop, object) {
      objects.find((x) => x.id == object.get("id")).animate.push(prop);

      // Prop counterparts
      if (prop == "left") {
        objects.find((x) => x.id == object.get("id")).animate.push("top");
        newKeyframe("left", object, currenttime, object.get("left"), true);
        newKeyframe("top", object, currenttime, object.get("top"), true);
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "left").value =
          object.get("left") - artboard.get("left");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "top").value =
          object.get("top") - artboard.get("top");
      } else if (prop == "scaleX") {
        newKeyframe("scaleY", object, currenttime, object.get("scaleY"), true);
        newKeyframe("width", object, currenttime, object.get("width"), true);
        newKeyframe("height", object, currenttime, object.get("height"), true);
        objects.find((x) => x.id == object.get("id")).animate.push("scaleY");
        objects.find((x) => x.id == object.get("id")).animate.push("width");
        objects.find((x) => x.id == object.get("id")).animate.push("height");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "height").value =
          object.get("height");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "width").value = object.get("width");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "scaleY").value =
          object.get("scaleY");
      } else if (prop == "strokeWidth") {
        newKeyframe("stroke", object, currenttime, object.get("stroke"), true);
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "stroke").value =
          object.get("stroke");
        objects.find((x) => x.id == object.get("id")).animate.push("stroke");
      } else if (prop == "shadow.color") {
        newKeyframe(
          "shadow.color",
          object,
          currenttime,
          object.shadow.color,
          true
        );
        newKeyframe(
          "shadow.offsetX",
          object,
          currenttime,
          object.shadow.offsetX,
          true
        );
        newKeyframe(
          "shadow.offsetY",
          object,
          currenttime,
          object.shadow.offsetY,
          true
        );
        newKeyframe(
          "shadow.blur",
          object,
          currenttime,
          object.shadow.blur,
          true
        );
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "shadow.color").value =
          object.get("shadow.color");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "shadow.offsetX").value =
          object.get("shadow.offsetX");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "shadow.offsetY").value =
          object.get("shadow.offsetY");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "shadow.blur").value =
          object.get("shadow.blur");
        objects
          .find((x) => x.id == object.get("id"))
          .animate.push("shadow.offsetX");
        objects
          .find((x) => x.id == object.get("id"))
          .animate.push("shadow.offsetY");
        objects
          .find((x) => x.id == object.get("id"))
          .animate.push("shadow.blur");
      } else if (prop == "charSpacing") {
        newKeyframe(
          "charSpacing",
          object,
          currenttime,
          object.get("charSpacing"),
          true
        );
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "charSpacing").value =
          object.get("charSpacing");
        objects
          .find((x) => x.id == object.get("id"))
          .animate.push("charSpacing");
      }

      // Exception
      if (prop != "left" && prop != "shadow.color") {
        newKeyframe(prop, object, currenttime, object.get(prop), true);
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == prop).value = object.get(prop);
      }
    }

    function freezeProp(prop, object) {
      objects.find((x) => x.id == object.get("id")).animate = $.grep(
        objects.find((x) => x.id == object.get("id")).animate,
        function (e) {
          return e != prop;
        }
      );
      if (prop == "left") {
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e != "top";
          }
        );
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id") || e.name != "top";
        });
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "left").value =
          object.get("left") - artboard.get("left");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "top").value =
          object.get("top") - artboard.get("top");
      } else if (prop == "scaleX") {
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "height").value =
          object.get("height");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "width").value = object.get("width");
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "scaleY").value =
          object.get("scaleY");
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e != "scaleY";
          }
        );
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id") || e.name != "scaleY";
        });
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e != "width";
          }
        );
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id") || e.name != "width";
        });
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e != "height";
          }
        );
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id") || e.name != "height";
        });
      } else if (prop == "strokeWidth") {
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "stroke").value =
          object.get("stroke");
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e != "stroke";
          }
        );
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id") || e.name != "stroke";
        });
      } else if (prop == "shadow.color") {
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "shadow.offsetX").value =
          object.shadow.offsetX;
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "shadow.offsetY").value =
          object.shadow.offsetY;
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "shadow.blur").value =
          object.shadow.blur;
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id");
        });
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e;
          }
        );
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id") || e.name != "shadow.offsetX";
        });
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e != "shadow.offsetX";
          }
        );
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id") || e.name != "shadow.offsetY";
        });
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e != "shadow.offsetY";
          }
        );
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id") || e.name != "shadow.blur";
        });
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e != "shadow.blur";
          }
        );
      } else if (prop == "charSpacing") {
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == "charSpacing").value =
          object.get("charSpacing");
        objects.find((x) => x.id == object.get("id")).animate = $.grep(
          objects.find((x) => x.id == object.get("id")).animate,
          function (e) {
            return e != "charSpacing";
          }
        );
        keyframes = $.grep(keyframes, function (e) {
          return e.id != object.get("id") || e.name != "charSpacing";
        });
      }

      keyframes = $.grep(keyframes, function (e) {
        return e.id != object.get("id") || e.name != prop;
      });

      // Exception
      if (prop != "left" && prop != "shadow.color") {
        objects
          .find((x) => x.id == object.get("id"))
          .defaults.find((x) => x.name == prop).value = object.get(prop);
      }

      selector
        .find(
          ".keyframe[data-object='" +
            object.get("id") +
            "'][data-property='" +
            prop +
            "']"
        )
        .remove();
    }

    // Animation mode for property
    selector.on("click", ".freeze-prop", function (e) {
      e.stopPropagation();
      var prop = $(this).parent().attr("data-property");
      const object = canvas.getItemById(
        $(this).parent().parent().parent().attr("data-object")
      );
      if (prop == "position") {
        prop = "left";
      } else if (prop == "scale") {
        prop = "scaleX";
      } else if (prop == "stroke") {
        prop = "strokeWidth";
      } else if (prop == "shadow") {
        prop = "shadow.color";
      }

      // Check layer global "freezing" state
      if (
        $(this).parent().parent().parent().find(".freeze").hasClass("frozen")
      ) {
        objects.find((x) => x.id == object.get("id")).animate = [];
        $(this)
          .parent()
          .parent()
          .parent()
          .find(".freeze")
          .removeClass("frozen");

        // Stop animating all props except selected
        var propmatch = [
          prop,
          "scaleY",
          "width",
          "height",
          "top",
          "stroke",
          "shadow.offsetX",
          "shadow.offsetY",
          "shadow.blur",
        ];
        props.forEach(function (p) {
          if ($.inArray(p, propmatch) == -1) {
            if (
              (object.get("type") == "i-text" ||
                object.get("type") == "textbox") &&
              p == "charSpacing"
            ) {
              freezeProp(p, object);
            } else if (p != "charSpacing") {
              freezeProp(p, object);
            }
          }
        });
      }

      // Turn off clock -> Stop animating
      if ($(this).hasClass("frozen")) {
        $(this).removeClass("frozen");
        freezeProp(prop, object);
        // Turn on clock -> Animate
      } else {
        $(this).addClass("frozen");
        animateProp(prop, object);
      }
      save();
    });

    // Lock layer
    selector.on("click", ".lock", function (e) {
      e.stopPropagation();
      const object = canvas.getItemById(
        $(this).parent().parent().parent().attr("data-object")
      );
      if ($(this).hasClass("locked")) {
        $(this).html("lock_open");
        $(this).removeClass("locked");
        object.lockMovementX = true;
        object.lockMovementY = true;
        object.lockRotation = true;
        $(this).parent().parent().parent().attr("draggable", true);
      } else {
        $(this).html("lock");
        $(this).addClass("locked");
        object.lockMovementX = true;
        object.lockMovementY = true;
        object.lockRotation = true;
        if (canvas.getActiveObject() == object) {
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
        $(this).parent().parent().parent().attr("draggable", false);
      }
      save();
    });

    // Render a layer
    function renderLayer(object, animate = false) {
      selector.find("#layer-inner-list").removeClass("nolayers");
      selector.find("#nolayers").addClass("yaylayers");
      const color = objects.find((x) => x.id == object.get("id")).color;
      var src = "";
      var classlock = "";
      var icon = "lock_open";
      var freeze = "freeze";
      var tcolor;
      if (object.get("type") == "image") {
        if (object.get("assetType") && object.get("assetType") == "video") {
          tcolor = sets.videoLayerColor;
        } else {
          tcolor = sets.imageLayerColor;
        }
      } else if (
        object.get("type") == "i-text" ||
        object.get("type") == "textbox"
      ) {
        tcolor = sets.textLayerColor;
      } else if (
        object.get("type") == "rect" ||
        object.get("type") == "group" ||
        object.get("type") == "circle" ||
        object.get("type") == "polygon" ||
        object.get("type") == "path"
      ) {
        tcolor = sets.shapeLayerColor;
        if (
          object.get("assetType") &&
          object.get("assetType") == "animatedText"
        ) {
          tcolor = sets.animatedTextLayerColor;
        } else if (
          object.get("assetType") &&
          object.get("assetType") == "audio"
        ) {
          tcolor = sets.audioLayerColor;
        }
      }
      if (object.get("type") == "i-text" || object.get("type") == "textbox") {
        src = "title";
      } else if (
        object.get("type") == "rect" ||
        object.get("type") == "group" ||
        object.get("type") == "circle" ||
        object.get("type") == "polygon" ||
        object.get("type") == "path"
      ) {
        src = "star";
        if (
          object.get("assetType") &&
          object.get("assetType") == "animatedText"
        ) {
          src = "title";
        }
        if (object.get("assetType") && object.get("assetType") == "audio") {
          src = "volume_up";
        }
      } else if (object.get("type") == "image") {
        if (object.get("assetType") && object.get("assetType") == "video") {
          src = "videocam";
        } else {
          src = "image";
        }
      } else if (
        object.get("assetType") &&
        object.get("assetType") == "audio"
      ) {
        src = "volume_up";
      } else {
        src = "star";
      }
      if (object.lockMovementX == true) {
        classlock = "locked";
        icon = "lock";
      }
      if (animate != false) {
        freeze = "freeze frozen";
      }
      const leftoffset =
        p_keyframes.find((x) => x.id == object.get("id")).trimstart /
        timelinetime;
      const width =
        (p_keyframes.find((x) => x.id == object.get("id")).end -
          p_keyframes.find((x) => x.id == object.get("id")).trimstart) /
        timelinetime;
      selector
        .find("#inner-timeline")
        .prepend(
          "<div class='object-props' id='" +
            object.get("id") +
            "' style='width:" +
            (p_keyframes.find((x) => x.id == object.get("id")).end -
              p_keyframes.find((x) => x.id == object.get("id")).start) /
              timelinetime +
            "px'><div class='row main-row'><div class='row-el' style='background-color:" +
            color +
            "'><div class='trim-row' style='left:" +
            leftoffset +
            "px;width:" +
            width +
            "px'></div></div></div></div>"
        );
      if (object.get("assetType") && object.get("assetType") == "audio") {
        object.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
        });
        selector
          .find("#layer-inner-list:not(.nolayer)")
          .prepend(
            '<div class="layer" data-object="' +
              object.get("id") +
              '"><div class="layer-name"><span class="material-icons droparrow" style="color:' +
              tcolor +
              ';">arrow_right</span><span class="material-icons layer-object-icon" style="color:' +
              tcolor +
              ';">' +
              src +
              '</span><input class="layer-custom-name" value="' +
              objects.find((x) => x.id == object.get("id")).label +
              '" readonly></span><div class="layer-options"><span class="material-icons ' +
              freeze +
              '" title="' +
              pmotionParams.t112 +
              '">watch_later</span></div></div><div class="properties"></div></div>'
          );
      } else {
        selector
          .find("#layer-inner-list:not(.nolayer)")
          .prepend(
            '<div class="layer" data-object="' +
              object.get("id") +
              '"><div class="layer-name"><span class="material-icons droparrow" style="color:' +
              tcolor +
              ';">arrow_right</span><span class="material-icons layer-object-icon" style="color:' +
              tcolor +
              ';">' +
              src +
              '</span><input class="layer-custom-name" value="' +
              objects.find((x) => x.id == object.get("id")).label +
              '" readonly></span><div class="layer-options"><span class="material-icons lock ' +
              classlock +
              '" title="Lock layer">' +
              icon +
              '</span><span class="material-icons ' +
              freeze +
              '" title="' +
              pmotionParams.t112 +
              '">watch_later</span></div></div><div class="properties"></div></div>'
          );
      }
      selector
        .find(".layer[data-object='" + object.get("id") + "']")
        .find(".properties")
        .toggle();
      setTimelineZoom(timelinetime);
      sortable("#layer-inner-list:not(.nolayer)", {
        placeholderClass: "hovering",
        copy: true,
        customDragImage: (draggedElement, elementOffset, event) => {
          return {
            element: document.getElementById("nothing"),
            posX: event.pageX - elementOffset.left,
            posY: event.pageY - elementOffset.top,
          };
        },
      });
      if (object.lockMovementX == true) {
        selector
          .find(".layer[data-object='" + object.get("id") + "']")
          .attr("draggable", false);
      }
    }

    // Render a property
    function renderProp(prop, object) {
      if (prop == "shadow.color") {
        prop = "shadowcolor";
      }
      selector
        .find("#" + object.get("id"))
        .append(
          "<div class='row " +
            prop +
            " keyframe-row' data-object='" +
            object.get("id") +
            "'><div class='row-el'></div></div>"
        );
      if (prop == "left") {
        selector
          .find(".layer[data-object='" + object.get("id") + "']")
          .find(".properties")
          .append(
            "<div class='property-name' data-property='position'><span class='property-keyframe'></span>Position</div>"
          );
      } else if (prop == "scaleX") {
        selector
          .find(".layer[data-object='" + object.get("id") + "']")
          .find(".properties")
          .append(
            "<div class='property-name' data-property='scale'><span class='property-keyframe'></span>Scale</div>"
          );
      } else if (prop == "strokeWidth") {
        selector
          .find(".layer[data-object='" + object.get("id") + "']")
          .find(".properties")
          .append(
            "<div class='property-name' data-property='stroke'><span class='property-keyframe'></span>Stroke</div>"
          );
      } else if (prop == "shadowcolor") {
        selector
          .find(".layer[data-object='" + object.get("id") + "']")
          .find(".properties")
          .append(
            "<div class='property-name' data-property='shadow'><span class='property-keyframe'></span>Shadow</div>"
          );
      } else if (prop == "charSpacing") {
        selector
          .find(".layer[data-object='" + object.get("id") + "']")
          .find(".properties")
          .append(
            "<div class='property-name' data-property='charSpacing'><span class='property-keyframe'></span>Text</div>"
          );
      } else {
        selector
          .find(".layer[data-object='" + object.get("id") + "']")
          .find(".properties")
          .append(
            "<div class='property-name' data-property='" +
              prop +
              "'><span class='property-keyframe'></span>" +
              prop +
              "</div>"
          );
      }
      selector
        .find("#" + object.get("id"))
        .find(".keyframe-row" + "." + prop)
        .toggle();
    }

    // Create a layer
    function newLayer(object) {
      layer_count++;
      var color;
      if (object.get("type") == "image") {
        if (object.get("assetType") && object.get("assetType") == "video") {
          color = sets.videoLayerColor;
        } else {
          color = sets.imageLayerColor;
        }
      } else if (
        object.get("type") == "i-text" ||
        object.get("type") == "textbox"
      ) {
        color = sets.textLayerColor;
      } else if (
        object.get("type") == "rect" ||
        object.get("type") == "group" ||
        object.get("type") == "circle" ||
        object.get("type") == "polygon" ||
        object.get("type") == "path"
      ) {
        color = sets.shapeLayerColor;
        if (
          object.get("assetType") &&
          object.get("assetType") == "animatedText"
        ) {
          color = sets.animatedTextLayerColor;
        } else if (
          object.get("assetType") &&
          object.get("assetType") == "audio"
        ) {
          color = sets.audioLayerColor;
        }
      }
      if (
        (object.get("assetType") && object.get("assetType") == "video") ||
        (object.get("assetType") && object.get("assetType") == "audio")
      ) {
        objects.push({
          object: object,
          id: object.get("id"),
          label: object.get("id"),
          color: color,
          defaults: [],
          locked: [],
          mask: "none",
          start: 0,
          end: object.get("duration"),
        });
        if (object.get("duration") < duration) {
          p_keyframes.push({
            start: 0,
            end: object.get("duration"),
            trimstart: 0,
            trimend: object.get("duration"),
            object: object,
            id: object.get("id"),
          });
        } else {
          p_keyframes.push({
            start: 0,
            end: duration,
            trimstart: 0,
            trimend: duration,
            object: object,
            id: object.get("id"),
          });
        }
      } else {
        objects.push({
          object: object,
          id: object.get("id"),
          label: object.get("id"),
          color: color,
          defaults: [],
          locked: [],
          mask: "none",
        });
        if (object.get("notnew")) {
          p_keyframes.push({
            start: object.get("starttime"),
            end: duration - object.get("starttime"),
            trimstart: 0,
            trimend: duration - currenttime,
            object: object,
            id: object.get("id"),
          });
        } else {
          p_keyframes.push({
            start: 0,
            end: duration,
            trimstart: 0,
            trimend: duration,
            object: object,
            id: object.get("id"),
          });
        }
      }
      renderLayer(object);

      if (!object.get("assetType") || object.get("assetType") != "audio") {
        props.forEach(function (prop) {
          if (prop == "charSpacing") {
            if (
              object.get("type") == "i-text" ||
              object.get("type") == "textbox"
            ) {
              renderProp(prop, object);
              objects
                .find((x) => x.id == object.id)
                .defaults.push({ name: prop, value: object.get(prop) });
            }
          } else if (
            prop == "shadow.blur" ||
            prop == "shadow.offsetX" ||
            prop == "shadow.offsetY" ||
            prop == "shadow.color"
          ) {
            if (object.get("type") != "group") {
              if (prop == "shadow.color") {
                renderProp(prop, object);
                objects
                  .find((x) => x.id == object.id)
                  .defaults.push({
                    name: prop,
                    value: object.shadow.color,
                  });
              } else if (prop == "shadow.blur") {
                objects
                  .find((x) => x.id == object.id)
                  .defaults.push({
                    name: prop,
                    value: object.shadow.blur,
                  });
              } else if (prop == "shadow.offsetX") {
                objects
                  .find((x) => x.id == object.id)
                  .defaults.push({
                    name: prop,
                    value: object.shadow.offsetX,
                  });
              } else if (prop == "shadow.offsetY") {
                objects
                  .find((x) => x.id == object.id)
                  .defaults.push({
                    name: prop,
                    value: object.shadow.offsetY,
                  });
              }
            }
          } else {
            if (
              prop != "top" &&
              prop != "scaleY" &&
              prop != "stroke" &&
              prop != "width" &&
              prop != "height"
            ) {
              renderProp(prop, object);
            }
            objects
              .find((x) => x.id == object.id)
              .defaults.push({ name: prop, value: object.get(prop) });
          }
        });
      } else {
        renderProp("volume", object);
        objects
          .find((x) => x.id == object.id)
          .defaults.push({ name: "volume", value: 0.5 });
      }
      selector.find(".layer-selected").removeClass("layer-selected");
      selector
        .find(".layer[data-object='" + object.get("id") + "']")
        .addClass("layer-selected");
      document.getElementsByClassName("layer-selected")[0].scrollIntoView();
      objects.find((x) => x.id == object.id).animate = [];
      // animate(false, 0);
      if (object.get("type") == "image") {
        if (object.get("assetType") && object.get("assetType") == "video") {
          newKeyframe("top", object, 0, object.get("top"), true);
        }
      }
      // save();
      checkFilter();
    }

    // Add a (complex) SVG shape to the canvas
    function newSVG(svg, x, y, width, center) {
      fabric.loadSVGFromURL(svg, function (objects, options) {
        var newsvg = objects[0];
        if (objects.length > 1) {
          newsvg = fabric.util.groupSVGElements(objects, options);
        }
        newsvg.set({
          id: "Shape" + layer_count,
          stroke: "#000",
          left: x,
          top: y,
          strokeWidth: 0,
          strokeUniform: true,
          originX: "center",
          originY: "center",
          strokeDashArray: false,
          absolutePositioned: true,
          paintFirst: "stroke",
          objectCaching: true,
          sourcePath: svg,
          assetType: "svg",
          inGroup: false,
          shadow: {
            color: "#000",
            offsetX: 0,
            offsetY: 0,
            blur: 0,
            opacity: 0,
          },
        });
        newsvg.scaleToWidth(width);
        newsvg.set({
          scaleX: parseFloat(newsvg.get("scaleX").toFixed(2)),
          scaleY: parseFloat(newsvg.get("scaleY").toFixed(2)),
        });
        canvas.add(newsvg);
        newLayer(newsvg);
        canvas.setActiveObject(newsvg);
        canvas.bringToFront(newsvg);
        canvas.requestRenderAll();
        if (center) {
          newsvg.set("left", artboard.get("left") + artboard.get("width") / 2);
          newsvg.set("top", artboard.get("top") + artboard.get("height") / 2);
          canvas.requestRenderAll();
        }
      });
    }

    function newSVGstring(svg, x, y, width, center) {
      fabric.loadSVGFromString(svg, function (objects, options) {
        var newsvg = fabric.util.groupSVGElements(objects, options);
        const encodedData = window.btoa(svg);
        const dataURL = `data:image/svg+xml;base64,${encodedData}`;
        newsvg.set({
          id: "Shape" + layer_count,
          stroke: "#000",
          left: x,
          top: y,
          strokeWidth: 0,
          strokeUniform: true,
          originX: "center",
          originY: "center",
          strokeDashArray: false,
          absolutePositioned: true,
          paintFirst: "stroke",
          objectCaching: true,
          sourcePath: dataURL,
          assetType: "svg",
          inGroup: false,
          shadow: {
            color: "#000",
            offsetX: 0,
            offsetY: 0,
            blur: 0,
            opacity: 0,
          },
        });
        newsvg.scaleToWidth(width);
        newsvg.set({
          scaleX: parseFloat(newsvg.get("scaleX").toFixed(2)),
          scaleY: parseFloat(newsvg.get("scaleY").toFixed(2)),
        });
        canvas.add(newsvg);
        newLayer(newsvg);
        canvas.setActiveObject(newsvg);
        canvas.bringToFront(newsvg);
        canvas.requestRenderAll();
        if (center) {
          newsvg.set("left", artboard.get("left") + artboard.get("width") / 2);
          newsvg.set("top", artboard.get("top") + artboard.get("height") / 2);
          canvas.requestRenderAll();
        }
      });
    }

    function setFillColors() {
      var obj = canvas.getActiveObject();
      if (obj._objects) {
        var colors = [];
        $.each(obj._objects, function (index, val) {
          if (colors.indexOf(val.get("fill")) === -1) {
            colors.push(val.get("fill"));
          }
        });
        $.each(colors, function (index, color) {
          var count = index + 1;
          if (typeof color === "string" || color instanceof String) {
            var output =
              '<div class="control-wrap"><label class="control-label">Color ' +
              count +
              '</label><div class="control"><div class="colorpicker-box"></div><input id="customsvg-color-' +
              count +
              '" data-color="' +
              color +
              '" class="form-field svg-picker" autocomplete="off" value="' +
              color +
              '" readonly /></div></div>';
            selector.find("#custom-svg-colors").append(output);
            Pickr.create({
              el: "#customsvg-color-" + count,
              theme: "nano",
              inline: false,
              autoReposition: false,
              defaultRepresentation: "RGBA",
              useAsButton: true,
              default: color,
              swatches: sets.colorpickerSwatches,
              components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                  hex: true,
                  rgba: true,
                  hsla: false,
                  hsva: false,
                  cmyk: false,
                  input: true,
                  clear: false,
                  save: false,
                },
              },
            })
              .on("change", (color, source, instance) => {
                var oldColor = selector
                  .find("#customsvg-color-" + count)
                  .attr("data-color");
                var obj = canvas.getActiveObject();
                if (obj._objects) {
                  for (var i = 0; i < obj._objects.length; i++) {
                    if (obj._objects[i].fill == oldColor) {
                      obj._objects[i].set({
                        fill: color.toHEXA().toString(),
                      });
                    }
                  }
                  selector
                    .find("#customsvg-color-" + count)
                    .val(color.toHEXA().toString());
                  selector
                    .find("#customsvg-color-" + count)
                    .attr("data-color", color.toHEXA().toString());
                  selector
                    .find("#customsvg-color-" + count)
                    .parent()
                    .find(".colorpicker-box")
                    .css("background", color.toHEXA().toString());
                }
                canvas.requestRenderAll();
                save();
              })
              .on("show", (color, instance) => {
                var rect = selector
                  .find(".svg-picker:focus")[0]
                  .getBoundingClientRect();
                var top = rect.top + rect.height + 5;
                const style = instance.getRoot().app.style;
                style.left = rect.left + "px";
                style.top = top + "px";
              });
            selector
              .find("#customsvg-color-" + count)
              .parent()
              .find(".colorpicker-box")
              .css("background", color);
          }
        });
      }
    }

    /* Load More Shapes */
    selector.on("click", ".object-more", function () {
      var btn = $(this);
      var offset = parseInt(btn.attr("data-offset"));
      var folder = btn.attr("data-folder");
      var count = parseInt(btn.attr("data-count"));
      btn.html(pmotionParams.t113);
      btn.prop("disabled", true);
      for (var i = offset; i < count; i++) {
        var item =
          '<div class="grid-item new"><img class="object-svg" draggable="false" src="' +
          folder +
          i +
          '.svg" data-file="' +
          folder +
          i +
          '.svg" /></div>';
        $(this).prev().append(item);
      }
      $(this).after(
        '<button type="button" class="btn object-more-toggle toggle-active">' +
          pmotionParams.t115 +
          '<span class="material-icons">expand_less</span></div>'
      );
      btn.remove();
    });

    selector.on("click", ".object-more-toggle", function () {
      var gridItems = $(this).prev().find(".new");
      if ($(this).hasClass("toggle-active")) {
        gridItems.hide();
        $(this).html(
          pmotionParams.t114 + '<span class="material-icons">expand_more</span>'
        );
        $(this).removeClass("toggle-active");
      } else {
        gridItems.show();
        $(this).html(
          pmotionParams.t115 + '<span class="material-icons">expand_less</span>'
        );
        $(this).addClass("toggle-active");
      }
    });

    // Load a video
    function loadVideo(src, x, y, center) {
      var vidObj = document.createElement("video");
      var vidSrc = document.createElement("source");
      vidSrc.src = src;
      vidObj.crossOrigin = "anonymous";
      vidObj.appendChild(vidSrc);
      vidObj.addEventListener("loadeddata", function () {
        vidObj.width = this.videoWidth;
        vidObj.height = this.videoHeight;
        vidObj.currentTime = 0;
        vidObj.muted = false;
        async function waitLoad() {
          if (vidObj.readyState >= 3) {
            var newvid = new fabric.Image(vidObj, {
              left: x,
              top: y,
              width: vidObj.width,
              height: vidObj.height,
              originX: "center",
              originY: "center",
              backgroundColor: "rgba(255,255,255,0)",
              cursorWidth: 1,
              stroke: "#000",
              strokeUniform: true,
              paintFirst: "stroke",
              strokeWidth: 0,
              cursorDuration: 1,
              cursorDelay: 250,
              source: src,
              duration: vidObj.duration * 1000,
              assetType: "video",
              id: "Video" + layer_count,
              objectCaching: false,
              strokeDashArray: false,
              inGroup: false,
              shadow: {
                color: "#000",
                offsetX: 0,
                offsetY: 0,
                blur: 0,
                opacity: 0,
              },
            });
            newvid.saveElem = newvid.getElement();
            canvas.add(newvid);
            newvid.setElement(vidObj);
            if (newvid.get("width") > artboard.get("width")) {
              newvid.scaleToWidth(artboard.get("width") / 2);
            }
            if (center) {
              newvid.set("left", x);
              newvid.set("top", y);
              canvas.requestRenderAll();
            }
            canvas.bringToFront(newvid);
            if (window.duration < newvid.duration + currenttime) {
              window.duration =
                ((newvid.duration + currenttime) / 1000).toFixed(2) * 1000;
            }
            newLayer(newvid);
            canvas.setActiveObject(newvid);
            selector.find("#load-video").removeClass("loading-active");
            await canvas.requestRenderAll();
          } else {
            window.setTimeout(function () {
              waitLoad();
            }, 100);
            selector.find("#load-video").removeClass("loading-active");
          }
        }
        window.setTimeout(function () {
          waitLoad();
        }, 100);
      });
      vidObj.currentTime = 0;
    }

    // Check that crop controls are inside image
    function checkCrop(obj) {
      if (obj.isContainedWithinObject(cropobj)) {
        croptop = obj.get("top");
        cropleft = obj.get("left");
        cropscalex = obj.get("scaleX");
        cropscaley = obj.get("scaleY");
      } else {
        obj.top = croptop;
        obj.left = cropleft;
        obj.scaleX = cropscalex;
        obj.scaleY = cropscaley;
        obj.setCoords();
        obj.saveState();
      }
      obj.set({
        borderColor: "#4affff",
      });
      canvas.requestRenderAll();
      crop(canvas.getItemById("cropped"));
    }

    // Perform a crop
    function crop(obj) {
      var crop = canvas.getItemById("crop");
      cropobj.setCoords();
      crop.setCoords();
      var cleft =
        crop.get("left") - (crop.get("width") * crop.get("scaleX")) / 2;
      var ctop =
        crop.get("top") - (crop.get("height") * crop.get("scaleY")) / 2;
      var height =
        (crop.get("height") / cropobj.get("scaleY")) * crop.get("scaleY");
      var width =
        (crop.get("width") / cropobj.get("scaleX")) * crop.get("scaleX");
      var img_height = cropobj.get("height") * cropobj.get("scaleY");
      var img_width = cropobj.get("width") * cropobj.get("scaleX");
      var left =
        cleft -
        (cropobj.get("left") -
          (cropobj.get("width") * cropobj.get("scaleX")) / 2);
      var top =
        ctop -
        (cropobj.get("top") -
          (cropobj.get("height") * cropobj.get("scaleY")) / 2);
      if (left < 0 && top > 0) {
        obj
          .set({ cropY: top / cropobj.get("scaleY"), height: height })
          .setCoords();
        canvas.requestRenderAll();
        obj.set({
          top: ctop + (obj.get("height") * obj.get("scaleY")) / 2,
        });
        canvas.requestRenderAll();
      } else if (top < 0 && left > 0) {
        obj
          .set({ cropX: left / cropobj.get("scaleX"), width: width })
          .setCoords();
        canvas.requestRenderAll();
        obj.set({
          left: cleft + (obj.get("width") * obj.get("scaleX")) / 2,
        });
        canvas.requestRenderAll();
      } else if (top > 0 && left > 0) {
        obj
          .set({
            cropX: left / cropobj.get("scaleX"),
            cropY: top / cropobj.get("scaleY"),
            height: height,
            width: width,
          })
          .setCoords();
        canvas.requestRenderAll();
        obj.set({
          left: cleft + (obj.get("width") * obj.get("scaleX")) / 2,
          top: ctop + (obj.get("height") * obj.get("scaleY")) / 2,
        });
        canvas.requestRenderAll();
      }
      if (obj.get("id") != "cropped") {
        canvas.remove(crop);
        canvas.remove(canvas.getItemById("overlay"));
        canvas.remove(canvas.getItemById("cropped"));
        cropping = false;
        resetControls();
        canvas.uniformScaling = true;
        canvas.requestRenderAll();
        newKeyframe("scaleX", obj, currenttime, obj.get("scaleX"), true);
        newKeyframe("scaleY", obj, currenttime, obj.get("scaleY"), true);
        newKeyframe("width", obj, currenttime, obj.get("width"), true);
        newKeyframe("height", obj, currenttime, obj.get("width"), true);
        newKeyframe("left", obj, currenttime, obj.get("left"), true);
        newKeyframe("top", obj, currenttime, obj.get("top"), true);
        selector.find("#properties-overlay").hide();
        save();
      }
      canvas.requestRenderAll();
    }

    var tlcrop = new Image();
    tlcrop.src = "assets/tlcrop.svg";
    var trcrop = new Image();
    trcrop.src = "assets/trcrop.svg";
    var blcrop = new Image();
    blcrop.src = "assets/blcrop.svg";
    var brcrop = new Image();
    brcrop.src = "assets/brcrop.svg";

    function overlay() {
      canvas.add(
        new fabric.Rect({
          left: artboard.left,
          top: artboard.top,
          originX: "left",
          originY: "top",
          width: artboard.width,
          height: artboard.height,
          fill: "rgba(0,0,0,0.5)",
          selectable: false,
          id: "overlay",
        })
      );
    }

    // Start cropping an image
    function cropImage(object) {
      if (!cropping) {
        selector.find("#properties-overlay").show();
        cropping = true;
        cropobj = object;
        canvas.uniformScaling = false;
        cropobj.setCoords();
        var left =
          cropobj.get("left") -
          (cropobj.get("width") * cropobj.get("scaleX")) / 2;
        var top =
          cropobj.get("top") -
          (cropobj.get("height") * cropobj.get("scaleY")) / 2;
        var cropx = cropobj.get("cropX");
        var cropy = cropobj.get("cropY");
        overlay();
        var cropUI = new fabric.Rect({
          left: object.get("left"),
          top: object.get("top"),
          width: object.get("width") * object.get("scaleX") - 5,
          height: object.get("height") * object.get("scaleY") - 5,
          originX: "center",
          originY: "center",
          id: "crop",
          fill: "rgba(0,0,0,0)",
          shadow: {
            color: "black",
            offsetX: 0,
            offsetY: 0,
            blur: 0,
            opacity: 0,
          },
        });
        cropobj.clone(function (cloned) {
          cloned.set({
            id: "cropped",
            selectable: false,
            originX: "center",
            originY: "center",
          });
          canvas.add(cloned);
          canvas.bringToFront(cloned);
          canvas.bringToFront(cropUI);
          canvas.requestRenderAll();
          cropobj = object;
        });
        cropobj
          .set({
            cropX: 0,
            cropY: 0,
            width: cropobj.get("ogWidth"),
            height: cropobj.get("ogHeight"),
          })
          .setCoords();
        canvas.requestRenderAll();
        cropobj.set({
          left:
            left +
            (cropobj.get("width") * cropobj.get("scaleX")) / 2 -
            cropx * cropobj.get("scaleX"),
          top:
            top +
            (cropobj.get("height") * cropobj.get("scaleY")) / 2 -
            cropy * cropobj.get("scaleY"),
        });
        cropUI.setControlsVisibility({
          mt: false,
          mb: false,
          mr: false,
          ml: false,
          mtr: false,
          deleteControl: false,
          cloneControl: false,
        });
        cropUI.controls.tl = new fabric.Control({
          x: -0.5,
          y: -0.5,
          offsetX: 3,
          offsetY: 3,
          cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
          actionHandler: fabric.controlsUtils.scalingEqually,
          render: function (ctx, left, top, styleOverride, fabricObject) {
            const wsize = 27;
            const hsize = 27;
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
            ctx.drawImage(tlcrop, -wsize / 2, -hsize / 2, wsize, hsize);
            ctx.restore();
          },
        });
        cropUI.controls.tr = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetX: -3,
          offsetY: 3,
          cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
          actionHandler: fabric.controlsUtils.scalingEqually,
          render: function (ctx, left, top, styleOverride, fabricObject) {
            const wsize = 27;
            const hsize = 27;
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
            ctx.drawImage(trcrop, -wsize / 2, -hsize / 2, wsize, hsize);
            ctx.restore();
          },
        });
        cropUI.controls.bl = new fabric.Control({
          x: -0.5,
          y: 0.5,
          offsetX: 3,
          offsetY: -3,
          cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
          actionHandler: fabric.controlsUtils.scalingEqually,
          render: function (ctx, left, top, styleOverride, fabricObject) {
            const wsize = 27;
            const hsize = 27;
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
            ctx.drawImage(blcrop, -wsize / 2, -hsize / 2, wsize, hsize);
            ctx.restore();
          },
        });
        cropUI.controls.br = new fabric.Control({
          x: 0.5,
          y: 0.5,
          offsetX: -3,
          offsetY: -3,
          cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
          actionHandler: fabric.controlsUtils.scalingEqually,
          render: function (ctx, left, top, styleOverride, fabricObject) {
            const wsize = 27;
            const hsize = 27;
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
            ctx.drawImage(brcrop, -wsize / 2, -hsize / 2, wsize, hsize);
            ctx.restore();
          },
        });
        canvas.add(cropUI);
        canvas.setActiveObject(cropUI);
        canvas.requestRenderAll();
        cropleft = cropUI.get("left");
        croptop = cropUI.get("top");
        cropscalex = cropUI.get("scaleX") - 0.03;
        cropscaley = cropUI.get("scaleY") - 0.03;
      }
    }
    selector.on("click", "#crop-image", function () {
      if (canvas.getActiveObject()) {
        cropImage(canvas.getActiveObject());
      }
    });

    // Add an image to the canvas
    function newImage(file, x, y, width, center) {
      var newimg = new fabric.Image(file, {
        left: x,
        top: y,
        originX: "center",
        originY: "center",
        stroke: "#000",
        strokeUniform: true,
        strokeWidth: 0,
        paintFirst: "stroke",
        absolutePositioned: true,
        id: "Image" + layer_count,
        inGroup: false,
        strokeDashArray: false,
        objectCaching: true,
        shadow: {
          color: "black",
          offsetX: 0,
          offsetY: 0,
          blur: 0,
          opacity: 0,
        },
      });
      canvas.add(newimg);
      newimg.scaleToWidth(width);
      newimg.set({
        scaleX: parseFloat(newimg.get("scaleX").toFixed(2)),
        scaleY: parseFloat(newimg.get("scaleY").toFixed(2)),
        ogWidth: newimg.get("width"),
        ogHeight: newimg.get("height"),
      });
      canvas.bringToFront(newimg);
      canvas.requestRenderAll();
      newLayer(newimg);
      canvas.setActiveObject(newimg);
      if (center) {
        newimg.set("left", x);
        newimg.set("top", y);
        canvas.requestRenderAll();
      }
      selector.find("#load-image").removeClass("loading-active");
    }

    function loadImage(src, x, y, width, center) {
      var image = new Image();
      image.onload = function (img) {
        newImage(image, x, y, width, center);
      };
      image.src = src;
    }

    // Create video thumbnail
    function createVideoThumbnail(file, max, seekTo, isURL) {
      return new Promise((resolve, reject) => {
        const videoPlayer = document.createElement("video");
        if (isURL) {
          videoPlayer.setAttribute("src", file);
        } else {
          videoPlayer.setAttribute("src", URL.createObjectURL(file));
        }
        videoPlayer.setAttribute("crossorigin", "anonymous");
        videoPlayer.load();
        videoPlayer.addEventListener(pmotionParams.t105, (ex) => {
          reject(pmotionParams.t116, ex);
        });
        videoPlayer.addEventListener("loadedmetadata", () => {
          if (videoPlayer.duration < seekTo) {
            reject(pmotionParams.t117);
            return;
          }
          setTimeout(() => {
            videoPlayer.currentTime = seekTo;
          }, 200);
          videoPlayer.addEventListener("seeked", () => {
            var oc = document.createElement("canvas");
            var octx = oc.getContext("2d");
            oc.width = videoPlayer.videoWidth;
            oc.height = videoPlayer.videoheight;
            octx.drawImage(videoPlayer, 0, 0);
            if (videoPlayer.videoWidth > videoPlayer.videoHeight) {
              oc.height =
                (videoPlayer.videoHeight / videoPlayer.videoWidth) * max;
              oc.width = max;
            } else {
              oc.width =
                (videoPlayer.videoWidth / videoPlayer.videoHeight) * max;
              oc.height = max;
            }
            octx.drawImage(oc, 0, 0, oc.width, oc.height);
            octx.drawImage(videoPlayer, 0, 0, oc.width, oc.height);
            resolve(oc.toDataURL());
          });
        });
      });
    }

    // Create image thumbnail
    function createThumbnail(file, max) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (event) {
          var img = new Image();
          img.onload = function () {
            if (img.width > max) {
              var oc = document.createElement("canvas");
              var octx = oc.getContext("2d");
              oc.width = img.width;
              oc.height = img.height;
              octx.drawImage(img, 0, 0);
              if (img.width > img.height) {
                oc.height = (img.height / img.width) * max;
                oc.width = max;
              } else {
                oc.width = (img.width / img.height) * max;
                oc.height = max;
              }
              octx.drawImage(oc, 0, 0, oc.width, oc.height);
              octx.drawImage(img, 0, 0, oc.width, oc.height);
              resolve(oc.toDataURL());
            } else {
              resolve(img.src);
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // DataURI to blob
    function dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    }

    // Upload from url
    async function uploadFromURL() {
      var url = selector.find("#upload-link-input").val();
      let file = await fetch(url).then((r) => r.blob());
      if (file.type.split("/")[0] === "image") {
        selector.find("#upload-link-input").val("");
        selector.find(".upload-show").removeClass("upload-show");
        createThumbnail(file, 250).then(function (data) {
          saveFile(
            dataURItoBlob(data),
            file,
            file.type.split("/")[0],
            "temp",
            false,
            false
          );
        });
      } else if (file.type.split("/")[0] === "video") {
        selector.find(".upload-show").removeClass("upload-show");
        createVideoThumbnail(file, 250, 0, false).then(function (data) {
          saveFile(
            dataURItoBlob(data),
            file,
            file.type.split("/")[0],
            "temp",
            false,
            false
          );
        });
        selector.find("#upload-link-input").val("");
      } else {
        alert(pmotionParams.t118);
      }
    }
    selector.on("click", "#upload-link-add", uploadFromURL);

    // Handle Upload
    function handleUpload(custom = false) {
      var files2;
      if (custom == false) {
        files2 = selector.find("#filepick").get(0).files;
      } else {
        files2 = custom.originalEvent.dataTransfer.files;
      }
      if (files2) {
        Array.from(files2).forEach((file) => {
          uploading = true;
          if (file.size / 1024 / 1024 <= sets.maxUploadLimit) {
            selector
              .find("#upload-button")
              .html(
                "<span class='material-icons'>file_upload</span>" +
                  pmotionParams.t119
              );
            selector.find("#upload-button").addClass("uploading");
            if (
              file.type === "image/png" ||
              file.type === "image/jpg" ||
              file.type === "image/jpeg" ||
              file.type === "image/svg+xml"
            ) {
              selector.find(".upload-show").removeClass("upload-show");
              createThumbnail(file, 250).then(function (data) {
                saveFile(
                  dataURItoBlob(data),
                  file,
                  file.type.split("/")[0],
                  "temp",
                  false,
                  false
                );
              });
            } else if (
              file.type === "video/mp4" ||
              file.type === "video/webm"
            ) {
              selector.find(".upload-show").removeClass("upload-show");
              createVideoThumbnail(file, 250, 0, false).then(function (data) {
                saveFile(
                  dataURItoBlob(data),
                  file,
                  file.type.split("/")[0],
                  "temp",
                  false,
                  false
                );
              });
            } else {
              toastr.error("File type not accepted.", pmotionParams.t105);
              selector
                .find("#upload-button")
                .html(
                  '<span class="material-icons">file_upload</span>' +
                    pmotionParams.t120
                );
              selector.find("#upload-button").removeClass("uploading");
            }
          } else {
            toastr.error(pmotionParams.t105, pmotionParams.t121);
          }
        });
        if (files2.length == 1) {
          if (files2[0].type.split("/")[0] === "image") {
            selector.find("#images-tab").trigger("click");
          } else if (files2[0].type.split("/")[0] === "video") {
            selector.find("#videos-tab").trigger("click");
          } else if (files2[0].type.split("/")[0] === "audio") {
            selector.find("#audio-tool-select").trigger("click");
          }
        }
      }
    }
    selector.on("change", "#filepick", function () {
      handleUpload(false);
    });

    // Upload audio
    function audioUpload() {
      const files = selector.find("#filepick2").get(0).files;
      if (files) {
        if (files.length == 1) {
          if (files[0].type.split("/")[0] === "audio") {
            if (files[0].size / 1024 / 1024 <= sets.maxUploadLimit) {
              selector
                .find("#audio-upload-button")
                .html(
                  '<span class="material-icons">file_upload</span>' +
                    pmotionParams.t119
                );
              selector.find("#audio-upload-button").addClass("uploading");
              saveAudio(files[0]);
            } else {
              alert(pmotionParams.t121);
            }
          } else {
            alert(pmotionParams.t103);
          }
        }
      }
    }
    selector.on("change", "#filepick2", audioUpload);

    // Change text format
    selector.on("click", ".format-text", function () {
      var isselected = false;
      if (!canvas.getActiveObject().isEditing) {
        canvas.getActiveObject().enterEditing();
        canvas.getActiveObject().selectAll();
        isselected = true;
      }
      if ($(this).hasClass("format-text-active")) {
        if ($(this).attr("id") == "format-bold") {
          canvas.getActiveObject().setSelectionStyles({ fontWeight: "normal" });
        } else if ($(this).attr("id") == "format-italic") {
          canvas.getActiveObject().setSelectionStyles({ fontStyle: "normal" });
        } else if ($(this).attr("id") == "format-underline") {
          canvas.getActiveObject().setSelectionStyles({ underline: false });
        } else {
          canvas.getActiveObject().setSelectionStyles({ linethrough: false });
        }
        $(this).removeClass("format-text-active");
      } else {
        $(this).addClass("format-text-active");
        if ($(this).attr("id") == "format-bold") {
          canvas.getActiveObject().setSelectionStyles({ fontWeight: "bold" });
        } else if ($(this).attr("id") == "format-italic") {
          canvas.getActiveObject().setSelectionStyles({ fontStyle: "italic" });
        } else if ($(this).attr("id") == "format-underline") {
          canvas.getActiveObject().setSelectionStyles({ underline: true });
        } else {
          canvas.getActiveObject().setSelectionStyles({ linethrough: true });
        }
      }
      if (isselected) {
        canvas.getActiveObject().exitEditing();
      }
      canvas.requestRenderAll();
      save();
    });

    // Change text alignment
    selector.on("click", ".align-text", function () {
      var textalign;
      selector.find(".align-text-active").removeClass("align-text-active");
      $(this).addClass("align-text-active");
      if ($(this).attr("id") == "align-text-left") {
        textalign = "left";
      } else if ($(this).attr("id") == "align-text-center") {
        textalign = "center";
      } else if ($(this).attr("id") == "align-text-right") {
        textalign = "right";
      } else {
        textalign = "justify";
      }
      canvas.getActiveObject().set({ textAlign: textalign });
      canvas.requestRenderAll();
      save();
    });

    // Change font weight
    selector.on("change", "#anim-weight", function () {
      var fontWeight = $(this).find(":selected").val();
      var object = canvas.getActiveObject();
      animatedtext
        .find((x) => x.id == object.id)
        .reset(
          animatedtext.find((x) => x.id == object.id).text,
          $.extend(animatedtext.find((x) => x.id == object.id).props, {
            fontWeight: fontWeight,
          }),
          canvas,
          object
        );
      canvas.requestRenderAll();
      save();
    });

    // Change font
    selector.on("change", "#font-picker", function () {
      var font = $(this).val();
      if (canvas.getActiveObject().get("assetType")) {
        WebFont.load({
          google: {
            families: [font + ":italic,regular,bold"],
          },
          active: () => {
            var object = canvas.getActiveObject();
            animatedtext
              .find((x) => x.id == object.id)
              .reset(
                animatedtext.find((x) => x.id == object.id).text,
                $.extend(animatedtext.find((x) => x.id == object.id).props, {
                  fontFamily: font,
                }),
                canvas,
                object
              );
            canvas.requestRenderAll();
            save();
          },
        });
      } else {
        WebFont.load({
          google: {
            families: [font + ":italic,regular,bold"],
          },
          active: () => {
            canvas.getActiveObject().set("fontFamily", font);
            canvas.requestRenderAll();
            save();
          },
        });
      }
    });

    // Create an audio layer
    function newAudioLayer(src, element) {
      var audio = new Audio(src);
      var id = "Audio" + layer_count;
      audio.crossOrigin = "anonymous";
      audio.addEventListener("loadeddata", () => {
        var nullobject = new fabric.Rect({
          id: id,
          width: 10,
          height: 10,
          audioSrc: src,
          duration: audio.duration * 1000,
          opacity: 0,
          selectable: false,
          volume: 0.5,
          assetType: "audio",
          shadow: {
            color: "#000",
            offsetX: 0,
            offsetY: 0,
            blur: 0,
            opacity: 0,
          },
          hasControls: false,
          borderColor: "transparent",
        });
        canvas.add(nullobject);
        newLayer(nullobject);
      });
    }

    // Create a textbox
    function newTextbox(fontsize, fontweight, text, x, y, width, center, font) {
      var newtext = new fabric.IText(text, {
        left: x,
        top: y,
        originX: "center",
        originY: "center",
        fontFamily: "Roboto",
        fill: "#000",
        fontSize: fontsize,
        fontWeight: fontweight,
        textAlign: "center",
        cursorWidth: 1,
        stroke: "#000",
        strokeWidth: 0,
        cursorDuration: 1,
        paintFirst: "stroke",
        objectCaching: false,
        absolutePositioned: true,
        strokeUniform: true,
        inGroup: false,
        cursorDelay: 250,
        strokeDashArray: false,
        editingBorderColor: "rgba(74, 255, 255, 0.4)",
        id: "Text" + layer_count,
        shadow: {
          color: "#000",
          offsetX: 0,
          offsetY: 0,
          blur: 0,
          opacity: 0,
        },
      });
      newtext.setControlsVisibility({
        mt: false,
        mb: false,
      });
      canvas.add(newtext);
      newLayer(newtext);
      canvas.setActiveObject(newtext);
      canvas.bringToFront(newtext);
      canvas.requestRenderAll();
      if (center) {
        newtext.set("left", artboard.get("left") + artboard.get("width") / 2);
        newtext.set("top", artboard.get("top") + artboard.get("height") / 2);
        canvas.requestRenderAll();
      }
      canvas.getActiveObject().set("fontFamily", font);
      canvas.requestRenderAll();
    }

    function deleteObject(object, cv, def = true) {
      if (object.get("assetType") == "animatedText" && def) {
        animatedtext = $.grep(animatedtext, function (a) {
          return a.id != object.id;
        });
      }
      selector.find(".layer[data-object='" + object.get("id") + "']").remove();
      selector.find("#" + object.get("id")).remove();
      keyframes = $.grep(keyframes, function (e) {
        return e.id != object.get("id");
      });
      p_keyframes = $.grep(p_keyframes, function (e) {
        return e.id != object.get("id");
      });
      objects = $.grep(objects, function (e) {
        return e.id != object.get("id");
      });
      cv.remove(object);
      cv.requestRenderAll();
      cv.discardActiveObject();
      // save();
      if (objects.length == 0) {
        selector.find("#layer-inner-list").addClass("nolayers");
        selector.find("#nolayers").removeClass("yaylayers");
      }
    }

    // Delete selected object
    function deleteSelection() {
      if (canvas.getActiveObject() && !canvas.getActiveObject().isEditing) {
        const selection = canvas.getActiveObject();
        if (selection.type == "activeSelection") {
          canvas.discardActiveObject();
          selection._objects.forEach(function (object) {
            deleteObject(object, canvas);
          });
        } else {
          deleteObject(canvas.getActiveObject(), canvas);
        }
      }
    }

    // Expand / collapse layer
    selector.on("click", ".droparrow", function () {
      const layerid = $(this).parent().parent().attr("data-object");
      $(this).parent().parent().find(".properties").toggle();
      $(this).parent().parent().find(".droparrow").toggleClass("layeron");
      $(this).parent().parent().find(".droparrow").html("arrow_right");
      $(this).parent().parent().find(".layeron").html("arrow_drop_down");
      selector.find(".keyframe-row[data-object='" + layerid + "']").toggle();
      setTimelineZoom(timelinetime);
    });

    // Select layer
    selector.on("click", ".layer-name", function (e) {
      if (!$(e.target).hasClass("droparrow")) {
        const layerid = $(this).parent().attr("data-object");
        selector.find(".layer-selected").removeClass("layer-selected");
        $(this).parent().addClass("layer-selected");
        canvas.discardActiveObject();
        canvas.setActiveObject(canvas.getItemById(layerid));
      }
    });

    // Set video duration
    function setDuration(length) {
      selector.find("#inner-timeline").css("width", length / timelinetime + 50);
      selector.find("#inner-seekarea").css("width", length / timelinetime + 50);
      duration = length;
      var minutes = Math.floor(duration / 1000 / 60);
      var seconds = (duration / 1000 - minutes * 60).toFixed(2);
      selector
        .find("#total-time input")
        .val(
          ("0" + minutes).slice(-2) +
            ":" +
            ("0" + Math.floor(seconds)).slice(-2) +
            ":" +
            ("0" + Math.floor((seconds % 1) * 100)).slice(-2)
        );
      selector.find(".object-props").each(function () {
        $(this).css(
          "width",
          duration / timelinetime -
            p_keyframes.find((x) => x.id == $(this).attr("id")).start /
              timelinetime +
            "px"
        );
        p_keyframes.find((x) => x.id == $(this).attr("id")).end = duration;
        if (
          p_keyframes.find((x) => x.id == $(this).attr("id")).trimend >
          p_keyframes.find((x) => x.id == $(this).attr("id")).end
        ) {
          p_keyframes.find((x) => x.id == $(this).attr("id")).trimend =
            duration;
          $(this)
            .find(".trim-row")
            .css(
              "width",
              duration / timelinetime -
                p_keyframes.find((x) => x.id == $(this).attr("id")).trimstart /
                  timelinetime +
                "px"
            );
        }
      });
      setTimelineZoom(timelinetime);
    }

    // Render time markers
    function renderTimeMarkers() {
      var renderoffset = 1000 / timelinetime - 20;
      var timenumber = 0;
      var modulo = 1;
      if (timelinetime > 18) {
        modulo = 5;
      } else if (timelinetime > 12) {
        modulo = 2;
      }
      selector.find("#time-numbers").html("");
      selector
        .find("#time-numbers")
        .append(
          "<div class='time-number' style='margin-left:" +
            offset_left +
            "px'>" +
            timenumber +
            "s<span></span></div>"
        );
      timenumber++;
      while (timenumber * 1000 <= duration) {
        selector
          .find("#time-numbers")
          .append(
            "<div class='time-number' style='margin-left:" +
              renderoffset +
              "px'>" +
              timenumber +
              "s<span></span></div>"
          );
        if (timenumber % modulo != 0) {
          selector.find(".time-number:last-child()").css("opacity", "0");
        }
        timenumber++;
      }
    }

    // Change timeline zoom level
    function setTimelineZoom(time) {
      selector.find(".object-props").each(function () {
        $(this).offset({
          left:
            p_keyframes.find((x) => x.id == $(this).attr("id")).start / time +
            selector.find("#inner-timeline").offset().left +
            offset_left,
        });
        $(this).css({ width: ($(this).width() * timelinetime) / time });
        $(this)
          .find(".trim-row")
          .css({
            left:
              p_keyframes.find((x) => x.id == $(this).attr("id")).trimstart /
              time,
          });
        $(this)
          .find(".trim-row")
          .css({
            width: ($(this).find(".trim-row").width() * timelinetime) / time,
          });
      });
      timelinetime = time;
      selector.find(".keyframe").each(function () {
        $(this).offset({
          left:
            $(this).attr("data-time") / timelinetime +
            selector.find("#inner-timeline").offset().left +
            offset_left,
        });
      });
      selector.find("#seekbar").offset({
        left:
          selector.find("#inner-timeline").offset().left +
          currenttime / timelinetime +
          offset_left,
      });
      selector
        .find("#inner-timeline")
        .css({ width: duration / timelinetime + 50 });
      selector.find("#inner-seekarea").css({
        minWidth: duration / timelinetime + 50,
      });
      renderTimeMarkers();
    }

    function removeKeyframe() {
      keyframes = $.grep(keyframes, function (e) {
        return (
          e.t != selectedkeyframe.attr("data-time") ||
          e.id != selectedkeyframe.attr("data-object") ||
          e.name != selectedkeyframe.attr("data-property")
        );
      });
      if (selectedkeyframe.attr("data-property") == "left") {
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != selectedkeyframe.attr("data-time") ||
            e.id != selectedkeyframe.attr("data-object") ||
            e.name != "top"
          );
        });
      } else if (selectedkeyframe.attr("data-property") == "scaleX") {
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != selectedkeyframe.attr("data-time") ||
            e.id != selectedkeyframe.attr("data-object") ||
            e.name != "scaleY"
          );
        });
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != selectedkeyframe.attr("data-time") ||
            e.id != selectedkeyframe.attr("data-object") ||
            e.name != "width"
          );
        });
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != selectedkeyframe.attr("data-time") ||
            e.id != selectedkeyframe.attr("data-object") ||
            e.name != "height"
          );
        });
      } else if (selectedkeyframe.attr("data-property") == "strokeWidth") {
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != selectedkeyframe.attr("data-time") ||
            e.id != selectedkeyframe.attr("data-object") ||
            e.name != "stroke"
          );
        });
      } else if (selectedkeyframe.attr("data-property") == "shadow.color") {
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != selectedkeyframe.attr("data-time") ||
            e.id != selectedkeyframe.attr("data-object") ||
            e.name != "shadow.blur"
          );
        });
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != selectedkeyframe.attr("data-time") ||
            e.id != selectedkeyframe.attr("data-object") ||
            e.name != "shadow.offsetX"
          );
        });
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != selectedkeyframe.attr("data-time") ||
            e.id != selectedkeyframe.attr("data-object") ||
            e.name != "shadow.offsetY"
          );
        });
      } else if (selectedkeyframe.attr("data-property") == "charSpacing") {
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != selectedkeyframe.attr("data-time") ||
            e.id != selectedkeyframe.attr("data-object") ||
            e.name != "charSpacing"
          );
        });
      }
      selectedkeyframe.remove();
      selector.find("#keyframe-properties").removeClass("show-properties");
    }

    // Delete a keyframe
    function deleteKeyframe() {
      if (shiftkeys.length > 0) {
        shiftkeys.forEach(function (key) {
          selectedkeyframe = $(key.keyframe);
          removeKeyframe();
        });
        shiftkeys = [];
      } else {
        removeKeyframe();
      }
      animate(false, currenttime);
      save();
    }
    selector.on("click", "#delete-keyframe", deleteKeyframe);

    // Copy keyframes
    function copyKeyframes() {
      clipboard.sort(function (a, b) {
        return a.t - b.t;
      });
      var inittime = clipboard[0].t;
      clipboard.forEach(function (keyframe) {
        var newtime = keyframe.t - inittime + currenttime;
        newKeyframe(
          keyframe.name,
          canvas.getItemById(keyframe.id),
          newtime,
          keyframe.value,
          true
        );
        var keyprop = keyframe.name;
        var keyarr2 = "";
        if (keyprop == "left") {
          keyarr2 = $.grep(keyframes, function (e) {
            return e.t == keyframe.t && e.id == keyframe.id && e.name == "top";
          });
          newKeyframe(
            "top",
            canvas.getItemById(keyframe.id),
            newtime,
            keyarr2[0].value,
            true
          );
        } else if (keyprop == "scaleX") {
          keyarr2 = $.grep(keyframes, function (e) {
            return (
              e.t == keyframe.t && e.id == keyframe.id && e.name == "scaleY"
            );
          });
          newKeyframe(
            "scaleY",
            canvas.getItemById(keyframe.id),
            newtime,
            keyarr2[0].value,
            true
          );
          keyarr2 = $.grep(keyframes, function (e) {
            return (
              e.t == keyframe.t && e.id == keyframe.id && e.name == "width"
            );
          });
          if (keyarr2.length > 0) {
            newKeyframe(
              "width",
              canvas.getItemById(keyframe.id),
              newtime,
              keyarr2[0].value,
              true
            );
          }
          keyarr2 = $.grep(keyframes, function (e) {
            return (
              e.t == keyframe.t && e.id == keyframe.id && e.name == "height"
            );
          });
          if (keyarr2.length > 0) {
            newKeyframe(
              "height",
              canvas.getItemById(keyframe.id),
              newtime,
              keyarr2[0].value,
              true
            );
          }
        } else if (keyprop == "strokeWidth") {
          keyarr2 = $.grep(keyframes, function (e) {
            return (
              e.t == keyframe.t && e.id == keyframe.id && e.name == "stroke"
            );
          });
          newKeyframe(
            "stroke",
            canvas.getItemById(keyframe.id),
            newtime,
            keyarr2[0].value,
            true
          );
        } else if (keyprop == "charSpacing") {
          keyarr2 = $.grep(keyframes, function (e) {
            return (
              e.t == keyframe.t &&
              e.id == keyframe.id &&
              e.name == "charSpacing"
            );
          });
          newKeyframe(
            "charSpacing",
            canvas.getItemByid(keyframe.id),
            newtime,
            keyarr2[0].value,
            true
          );
        } else if (keyprop == "shadow.color") {
          keyarr2 = $.grep(keyframes, function (e) {
            return (
              e.t == keyframe.t &&
              e.id == keyframe.id &&
              e.name == "shadow.offsetX"
            );
          });
          newKeyframe(
            "shadow.offsetX",
            canvas.getItemById(keyframe.id),
            newtime,
            keyarr2[0].value,
            true
          );
          keyarr2 = $.grep(keyframes, function (e) {
            return (
              e.t == keyframe.t &&
              e.id == keyframe.id &&
              e.name == "shadow.offsetY"
            );
          });

          newKeyframe(
            "shadow.offsetY",
            canvas.getItemById(keyframe.id),
            newtime,
            keyarr2[0].value,
            true
          );
          keyarr2 = $.grep(keyframes, function (e) {
            return (
              e.t == keyframe.t &&
              e.id == keyframe.id &&
              e.name == "shadow.blur"
            );
          });
          newKeyframe(
            "shadow.blur",
            canvas.getItemById(keyframe.id),
            newtime,
            keyarr2[0].value,
            true
          );
        }
        save();
      });
    }

    // Update keyframe (after dragging)
    function updateKeyframe(drag, newval, offset) {
      var time = parseFloat((drag.position().left * timelinetime).toFixed(1));
      const keyprop = drag.attr("data-property");
      const keytime = drag.attr("data-time");
      const keyarr = $.grep(keyframes, function (e) {
        return (
          e.t == parseFloat(keytime) &&
          e.id == drag.attr("data-object") &&
          e.name == keyprop
        );
      });
      const keyobj = canvas.getItemById(keyarr[0].id);
      time =
        parseFloat(p_keyframes.find((x) => x.id == keyobj.get("id")).start) +
        time;
      if (newval) {
        time = currenttime;
      }
      var keyval = keyarr[0].value;
      if (newval) {
        if (keyprop == "shadow.color") {
          keyval = keyobj.shadow.color;
        } else {
          keyval = keyobj.get(keyprop);
        }
      } else if (keyprop == "left") {
        keyval = keyval + artboard.get("left");
      }
      keyframes = $.grep(keyframes, function (e) {
        return (
          e.t != parseFloat(keytime) ||
          e.id != drag.attr("data-object") ||
          e.name != keyprop
        );
      });
      newKeyframe(keyprop, keyobj, time, keyval, false);
      var keyarr2 = "";
      var keyval2 = "";
      if (keyprop == "left") {
        keyarr2 = $.grep(keyframes, function (e) {
          return (
            e.t == parseFloat(keytime) &&
            e.id == drag.attr("data-object") &&
            e.name == "top"
          );
        });
        keyval2 = keyarr2[0].value + artboard.get("top");
        if (newval) {
          keyval2 = canvas.getItemById(keyarr2[0].id).get("top");
        }
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != parseFloat(keytime) ||
            e.id != drag.attr("data-object") ||
            e.name != "top"
          );
        });
        newKeyframe("top", keyobj, time, keyval2, false);
      } else if (keyprop == "scaleX") {
        keyarr2 = $.grep(keyframes, function (e) {
          return (
            e.t == parseFloat(keytime) &&
            e.id == drag.attr("data-object") &&
            e.name == "scaleY"
          );
        });
        keyval2 = keyarr2[0].value;
        if (newval) {
          keyval2 = canvas.getItemById(keyarr2[0].id).get("scaleY");
        }
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != parseFloat(keytime) ||
            e.id != drag.attr("data-object") ||
            e.name != "scaleY"
          );
        });
        newKeyframe("scaleY", keyobj, time, keyval2, false);
        keyarr2 = $.grep(keyframes, function (e) {
          return (
            e.t == parseFloat(keytime) &&
            e.id == drag.attr("data-object") &&
            e.name == "width"
          );
        });
        if (keyarr2.length > 0) {
          keyval2 = keyarr2[0].value;
          if (newval) {
            keyval2 = canvas.getItemById(keyarr2[0].id).get("width");
          }
          keyframes = $.grep(keyframes, function (e) {
            return (
              e.t != parseFloat(keytime) ||
              e.id != drag.attr("data-object") ||
              e.name != "width"
            );
          });
          newKeyframe("width", keyobj, time, keyval2, false);
        }
        keyarr2 = $.grep(keyframes, function (e) {
          return (
            e.t == parseFloat(keytime) &&
            e.id == drag.attr("data-object") &&
            e.name == "height"
          );
        });
        if (keyarr2.length > 0) {
          keyval2 = keyarr2[0].value;
          if (newval) {
            keyval2 = canvas.getItemById(keyarr2[0].id).get("height");
          }
          keyframes = $.grep(keyframes, function (e) {
            return (
              e.t != parseFloat(keytime) ||
              e.id != drag.attr("data-object") ||
              e.name != "height"
            );
          });
          newKeyframe("height", keyobj, time, keyval2, false);
        }
      } else if (keyprop == "strokeWidth") {
        keyarr2 = $.grep(keyframes, function (e) {
          return (
            e.t == parseFloat(keytime) &&
            e.id == drag.attr("data-object") &&
            e.name == "stroke"
          );
        });
        keyval2 = keyarr2[0].value;
        if (newval) {
          keyval2 = canvas.getItemById(keyarr2[0].id).get("stroke");
        }
        keyframes = $.grep(keyframes, function (e) {
          return (
            e.t != parseFloat(keytime) ||
            e.id != drag.attr("data-object") ||
            e.name != "stroke"
          );
        });
        newKeyframe("stroke", keyobj, time, keyval2, false);
      }
      if (offset) {
        drag.attr("data-time", time);
      } else {
        drag.attr(
          "data-time",
          time + p_keyframes.find((x) => x.id == keyarr[0].id).start
        );
      }
      keyframes.sort(function (a, b) {
        if (a.id.indexOf("Group") >= 0 && b.id.indexOf("Group") == -1) {
          return 1;
        } else if (b.id.indexOf("Group") >= 0 && a.id.indexOf("Group") == -1) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    function keyframeSnap(drag) {
      if (shiftkeys.length == 0) {
        if (
          drag.offset().left > selector.find("#seekbar").offset().left - 5 &&
          drag.offset().left < selector.find("#seekbar").offset().left + 5
        ) {
          drag.offset({ left: selector.find("#seekbar").offset().left });
          selector.find("#line-snap").offset({
            left: selector.find("#seekbar").offset().left,
            top: drag.parent().parent().offset().top,
          });
          selector.find("#line-snap").css({
            height: drag.parent().parent().height(),
          });
          selector.find("#line-snap").addClass("line-active");
        } else {
          drag
            .parent()
            .parent()
            .find(".keyframe")
            .each(function (index) {
              if (!drag.is($(this))) {
                if (
                  drag.offset().left > $(this).offset().left - 5 &&
                  drag.offset().left < $(this).offset().left + 5
                ) {
                  drag.offset({ left: $(this).offset().left });
                  selector.find("#line-snap").offset({
                    left: $(this).offset().left,
                    top: drag.parent().parent().offset().top,
                  });
                  selector.find("#line-snap").css({
                    height: drag.parent().parent().height(),
                  });
                  selector.find("#line-snap").addClass("line-active");
                  return false;
                }
              }
              if (index == selector.find(".keyframe").length - 1) {
                selector.find("#line-snap").removeClass("line-active");
              }
            });
        }
      }
    }

    // Dragging a keyframe
    selector.on("mousedown", ".keyframe", function (e) {
      if (e.which == 3) {
        return false;
      }
      e.stopPropagation();
      e.preventDefault();
      var inst = this;
      var drag = $(this);
      var pageX = e.pageX;
      var offset = $(this).offset();
      var move = false;
      if (e.shiftKey) {
        if (!$(this).hasClass("keyframe-selected")) {
          shiftkeys.push({
            keyframe: this,
            offset: $(this).offset().left,
          });
          $(this).addClass("keyframe-selected");
        } else {
          shiftkeys = $.grep(shiftkeys, function (e) {
            return e.keyframe != this;
          });
          $(this).removeClass("keyframe-selected");
        }
      }
      if (shiftkeys.length > 0) {
        shiftkeys.forEach(function (key) {
          key.offset = $(key.keyframe).offset().left;
        });
      }
      function draggingKeyframe(e) {
        move = true;
        var left = offset.left + (e.pageX - pageX);
        if (shiftkeys.length == 0) {
          if (left > selector.find("#timearea").offset().left + offset_left) {
            drag.offset({ left: left });
          } else {
            drag.offset({
              left: selector.find("#timearea").offset().left + offset_left,
            });
          }
          keyframeSnap(drag);
        } else {
          shiftkeys.forEach(function (key) {
            if (key.keyframe != inst) {
              $(key.keyframe).offset({
                left: key.offset + (e.pageX - pageX),
              });
              keyframeSnap($(key.keyframe));
            } else {
              drag.offset({ left: left });
              keyframeSnap(drag);
            }
          });
        }
      }
      function releasedKeyframe(e) {
        selector
          .off("mousemove", draggingKeyframe)
          .off("mouseup", releasedKeyframe);
        selector.find("#line-snap").removeClass("line-active");
        if (move) {
          if (shiftkeys.length == 0) {
            // Check for 60FPS playback, 16ms "slots"
            var time = parseFloat(
              (drag.position().left * timelinetime).toFixed(1)
            );
            if (time % 16.666 != 0) {
              drag.offset({
                left:
                  (Math.ceil(time / 16.666) * 16.666) / timelinetime +
                  drag.parent().offset().left,
              });
              updateKeyframe(drag, false);
            } else {
              updateKeyframe(drag, false);
            }
          } else {
            shiftkeys.forEach(function (key) {
              // Check for 60FPS playback, 16ms "slots"
              var time = parseFloat(
                ($(key.keyframe).position().left * timelinetime).toFixed(1)
              );
              if (time % 16.666 != 0) {
                $(key.keyframe).offset({
                  left:
                    (Math.ceil(time / 16.666) * 16.666) / timelinetime +
                    $(key.keyframe).parent().offset().left,
                });
                updateKeyframe($(key.keyframe), false);
              } else {
                updateKeyframe($(key.keyframe), false);
              }
            });
          }
        } else if (!e.shiftDown) {
          keyframeProperties(inst);
        }
        move = false;
        selector.find(".line-active").removeClass("line-active");
        save();
      }
      selector
        .on("mouseup", releasedKeyframe)
        .on("mousemove", draggingKeyframe);
    });

    // Render current time in the playback area
    function renderTime() {
      var minutes = Math.floor(currenttime / 1000 / 60);
      var seconds = (currenttime / 1000 - minutes * 60).toFixed(2);
      selector
        .find("#current-time input")
        .val(
          ("0" + minutes).slice(-2) +
            ":" +
            ("0" + Math.floor(seconds)).slice(-2) +
            ":" +
            ("0" + Math.floor((seconds % 1) * 100)).slice(-2)
        );
    }

    // Update current time (and account for frame "slots")
    function updateTime(drag, check) {
      if (selector.find("#timeline").scrollLeft() > offset_left) {
        currenttime = parseFloat(
          (
            (drag.position().left +
              selector.find("#timeline").scrollLeft() -
              offset_left) *
            timelinetime
          ).toFixed(1)
        );
      } else {
        currenttime = parseFloat(
          (
            (drag.position().left +
              selector.find("#timeline").scrollLeft() -
              offset_left) *
            timelinetime
          ).toFixed(1)
        );
      }
      // Check for 60FPS playback, 16ms "slots"
      if (currenttime % 16.666 != 0 && !check) {
        currenttime = Math.ceil(currenttime / 16.666) * 16.666;
      }
      renderTime();
      pause();
      animate(false, currenttime);
    }

    // Dragging the seekbar
    selector.on("mousedown", "#seekbar", function (e) {
      if (e.which == 3) {
        return false;
      }
      var drag = $(this);
      var pageX = e.pageX;
      var offset = $(this).offset();
      tempselection = canvas.getActiveObject();
      canvas.discardActiveObject();
      function dragging(e) {
        paused = true;
        var left = offset.left + (e.pageX - pageX);
        if (
          left > selector.find("#timearea").offset().left + offset_left &&
          left - selector.find("#timearea").offset().left <
            duration / timelinetime + offset_left
        ) {
          drag.offset({ left: left });
        } else if (
          left <
          selector.find("#timearea").offset().left + offset_left
        ) {
          drag.offset({
            left: offset_left + selector.find("#timearea").offset().left,
          });
        }
        if (selector.find("#timeline").scrollLeft() > offset_left) {
          currenttime = parseFloat(
            (
              (drag.position().left +
                selector.find("#timeline").scrollLeft() -
                offset_left) *
              timelinetime
            ).toFixed(1)
          );
        } else {
          currenttime = parseFloat(
            (
              (drag.position().left +
                selector.find("#timeline").scrollLeft() -
                offset_left) *
              timelinetime
            ).toFixed(1)
          );
        }
        animate(false, currenttime);
        seeking = true;
        renderTime();
      }
      function released(e) {
        selector.off("mousemove", dragging).off("mouseup", released);
        updateTime(drag, false);
        seeking = false;
        if (tempselection && tempselection.type != "activeSelection") {
          reselect(tempselection);
        }
        updatePanelValues();
      }
      selector.on("mouseup", released).on("mousemove", dragging);
    });

    // Dragging layer horizontally
    selector.on("mousedown", ".main-row", function (e) {
      if (e.which == 3) {
        return false;
      }
      var drag = $(this).parent();
      var drag2 = $(this).find(".trim-row");
      var target = e.target;
      var pageX = e.pageX;
      var offset = drag.offset();
      var offset2 = drag2.offset();
      var initwidth = drag2.width();
      var initpos = drag2.position().left;
      var opened = false;
      var trim = "no";
      // Trim layer to hovered area
      if (e.metaKey) {
        if (e.shiftKey) {
          if (drag2.position().left + e.pageX >= 0) {
            drag2.offset({
              left:
                hovertime / timelinetime -
                p_keyframes.find((x) => x.id == drag.attr("id")).trimstart /
                  timelinetime +
                offset2.left,
            });
            const leftval = parseFloat(
              (drag2.position().left * timelinetime).toFixed(1)
            );
            p_keyframes.find((x) => x.id == drag.attr("id")).trimstart =
              leftval;
            drag2.css({
              width:
                (p_keyframes.find((x) => x.id == drag.attr("id")).trimend -
                  p_keyframes.find((x) => x.id == drag.attr("id")).trimstart) /
                timelinetime,
            });
            return false;
          }
        } else {
          if (
            hovertime + p_keyframes.find((x) => x.id == drag.attr("id")).start <
            duration
          ) {
            drag2.css({
              width:
                hovertime / timelinetime -
                p_keyframes.find((x) => x.id == drag.attr("id")).trimstart /
                  timelinetime,
            });
            save();
            p_keyframes.find((x) => x.id == drag.attr("id")).end = hovertime;
            p_keyframes.find((x) => x.id == drag.attr("id")).trimend =
              hovertime;
          }
          return false;
        }
      }
      if (pageX - $(this).find(".trim-row").offset().left < 7) {
        trim = "left";
      } else if (
        pageX - $(this).find(".trim-row").offset().left >
        $(this).find(".trim-row").width() - 7
      ) {
        trim = "right";
      }
      function dragging(e) {
        if (trim == "no") {
          var left = offset.left + (e.pageX - pageX);
          if (
            left >
            selector.find("#timearea").offset().left +
              offset_left -
              selector.find("#timeline").scrollLeft()
          ) {
            drag.offset({ left: left });
          } else if (
            left + selector.find("#timeline").scrollLeft() <
            selector.find("#timearea").offset().left + offset_left
          ) {
            drag.css({ left: offset_left });
          }
          p_keyframes.find((x) => x.id == drag.attr("id")).start = parseFloat(
            (
              (drag.position().left -
                offset_left +
                selector.find("#timeline").scrollLeft()) *
              timelinetime
            ).toFixed(1)
          );
          p_keyframes.find((x) => x.id == drag.attr("id")).end = parseFloat(
            (
              (drag.position().left +
                drag.width() -
                offset_left +
                selector.find("#timeline").scrollLeft()) *
              timelinetime
            ).toFixed(1)
          );
          if (
            selector
              .find(".keyframe-row[data-object='" + drag.attr("id") + "']")
              .is(":hidden")
          ) {
            opened = true;
            selector
              .find(".layer[data-object='" + drag.attr("id") + "']")
              .find(".properties")
              .toggle();
            selector
              .find(".layer[data-object='" + drag.attr("id") + "']")
              .find(".properties")
              .toggleClass("layeron");
            selector
              .find(".keyframe-row[data-object='" + drag.attr("id") + "']")
              .toggle();
            setTimelineZoom(timelinetime);
          }
          drag.find(".keyframe").each(function () {
            updateKeyframe($(this), false, true);
          });
          animate(false, currenttime);
        } else if (trim == "left") {
          if (drag2.position().left + (e.pageX - pageX) >= 0) {
            drag2.offset({
              left: offset2.left + (e.pageX - pageX),
            });
            drag2.css({
              width: initwidth - (-initpos + drag2.position().left),
            });
            const leftval = parseFloat(
              (drag2.position().left * timelinetime).toFixed(1)
            );
            p_keyframes.find((x) => x.id == drag.attr("id")).trimstart =
              leftval;
          }
        } else if (trim == "right") {
          if (initwidth + (e.pageX - pageX) < duration / timelinetime) {
            drag2.css({
              width: initwidth + (e.pageX - pageX),
            });
          } else {
            drag2.css({
              width:
                duration / timelinetime -
                drag.position().left -
                selector.find("#timeline").scrollLeft() +
                offset_left,
            });
          }
          const rightval = parseFloat(
            ((drag2.position().left + drag2.width()) * timelinetime).toFixed(1)
          );
          p_keyframes.find((x) => x.id == drag.attr("id")).end = rightval;
          p_keyframes.find((x) => x.id == drag.attr("id")).trimend = rightval;
        }
      }
      function released(e) {
        selector.off("mousemove", dragging).off("mouseup", released);
        if (opened) {
          selector
            .find(".layer[data-object='" + drag.attr("id") + "']")
            .find(".properties")
            .toggle();
          selector
            .find(".layer[data-object='" + drag.attr("id") + "']")
            .find(".properties")
            .toggleClass("layeron");
          selector
            .find(".keyframe-row[data-object='" + drag.attr("id") + "']")
            .toggle();
          setTimelineZoom(timelinetime);
        }
        animate(false, currenttime);
        save();
      }
      selector.on("mouseup", released).on("mousemove", dragging);
    });

    function resetHeight() {
      var top = $(window).height() - oldtimelinepos - 91;
      selector
        .find("#browser")
        .css("height", "calc(100% - " + (top + 95) + "px)");
      selector.find("#timearea").css("height", top);
      selector.find("#layer-list").css("height", top);
      selector
        .find("#canvas-area")
        .css("height", "calc(100% - " + (top + 97) + "px)");
      selector
        .find("#properties")
        .css("height", "calc(100% - " + (top + 97) + "px)");
      selector.find("#timeline-handle").css("bottom", top + 101);
      resizeCanvas();
    }

    // Dragging timeline vertically
    function dragTimeline(e) {
      oldtimelinepos = e.pageY;
      if (e.which == 3) {
        return false;
      }
      function draggingKeyframe(e) {
        oldtimelinepos = e.pageY;
        resetHeight(e);
      }
      function releasedKeyframe(e) {
        selector
          .off("mousemove", draggingKeyframe)
          .off("mouseup", releasedKeyframe);
      }
      selector
        .on("mouseup", releasedKeyframe)
        .on("mousemove", draggingKeyframe);
    }

    selector.on("mousedown", "#timeline-handle", dragTimeline);

    oldtimelinepos =
      $(window).height() - 92 - selector.find("#timearea").height();

    // Sync scrolling (vertical)
    function syncScroll(el1, el2) {
      var $el1 = $(el1);
      var $el2 = $(el2);
      var forcedScroll = false;
      $el1.scroll(function () {
        performScroll($el1, $el2);
      });
      $el2.scroll(function () {
        performScroll($el2, $el1);
      });

      function performScroll($scrolled, $toScroll) {
        if (forcedScroll) return (forcedScroll = false);
        var percent =
          ($scrolled.scrollTop() /
            ($scrolled[0].scrollHeight - $scrolled.outerHeight())) *
          100;
        setScrollTopFromPercent($toScroll, percent);
      }

      function setScrollTopFromPercent($el, percent) {
        var scrollTopPos =
          (percent / 100) * ($el[0].scrollHeight - $el.outerHeight());
        forcedScroll = true;
        $el.scrollTop(scrollTopPos);
      }
    }

    // Sync scrolling (horizontal)
    function syncScrollHoz(el1, el2) {
      var $el1 = $(el1);
      var $el2 = $(el2);
      var forcedScroll = false;
      $el1.scroll(function () {
        performScroll($el1, $el2);
      });
      $el2.scroll(function () {
        performScroll($el2, $el1);
      });

      function performScroll($scrolled, $toScroll) {
        if (forcedScroll) return (forcedScroll = false);
        var percent = ($scrolled.scrollLeft() / $scrolled.outerWidth()) * 100;
        setScrollLeftFromPercent($toScroll, percent);
      }

      function setScrollLeftFromPercent($el, percent) {
        var scrollLeftPos = (percent / 100) * $el.outerWidth();
        forcedScroll = true;
        $el.scrollLeft(scrollLeftPos);
      }
    }

    // Show keyframe properties
    function keyframeProperties(inst) {
      if (!shiftdown) {
        selectedkeyframe = $(inst);
        const popup = selector.find("#keyframe-properties");
        var keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == selectedkeyframe.attr("data-property")
          );
        });
        selector.find("#easing select").val(keyarr[0].easing);
        selector.find("#easing select").trigger("change");
        popup.css({
          left: $(inst).offset().left - popup.width() / 2,
          top: $(inst).offset().top - popup.height() - 20,
        });
        popup.addClass("show-properties");
        $(inst).addClass("keyframe-selected");
      }
    }

    // Apply easing to keyframe
    selector.on("change", "#easing select", function () {
      var keyarr = keyframes.filter(function (e) {
        return (
          e.t == selectedkeyframe.attr("data-time") &&
          e.id == selectedkeyframe.attr("data-object") &&
          e.name == selectedkeyframe.attr("data-property")
        );
      });
      keyarr[0].easing = selector
        .find("#easing select")
        .find(":selected")
        .val();
      if (selectedkeyframe.attr("data-property") == "left") {
        keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == "top"
          );
        });
        keyarr[0].easing = selector
          .find("#easing select")
          .find(":selected")
          .val();
      } else if (selectedkeyframe.attr("data-property") == "scaleX") {
        keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == "scaleY"
          );
        });
        keyarr[0].easing = selector
          .find("#easing select")
          .find(":selected")
          .val();
        keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == "width"
          );
        });
        keyarr[0].easing = selector
          .find("#easing select")
          .find(":selected")
          .val();
        keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == "height"
          );
        });
        keyarr[0].easing = selector
          .find("#easing select")
          .find(":selected")
          .val();
      } else if (selectedkeyframe.attr("data-property") == "strokeWidth") {
        keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == "stroke"
          );
        });
        keyarr[0].easing = selector
          .find("#easing select")
          .find(":selected")
          .val();
      } else if (selectedkeyframe.attr("data-property") == "shadow.color") {
        keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == "shadow.offsetX"
          );
        });
        keyarr[0].easing = selector
          .find("#easing select")
          .find(":selected")
          .val();
        keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == "shadow.offsetY"
          );
        });
        keyarr[0].easing = selector
          .find("#easing select")
          .find(":selected")
          .val();
        keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == "shadow.blur"
          );
        });
        keyarr[0].easing = selector
          .find("#easing select")
          .find(":selected")
          .val();
      } else if (selectedkeyframe.attr("data-property") == "charSpacing") {
        keyarr = keyframes.filter(function (e) {
          return (
            e.t == selectedkeyframe.attr("data-time") &&
            e.id == selectedkeyframe.attr("data-object") &&
            e.name == "charSpacing"
          );
        });
        keyarr[0].easing = selector
          .find("#easing select")
          .find(":selected")
          .val();
      }
      selector.find("#keyframe-properties").removeClass("show-properties");
      selectedkeyframe.removeClass("keyframe-selected");
      save();
    });

    // Click on seek area to seek
    function seekTo(e) {
      if ($(e.target).hasClass("keyframe")) {
        return false;
      }
      paused = true;
      if (selector.find("#seekarea").scrollLeft() > offset_left) {
        currenttime = parseFloat(
          (
            (e.pageX +
              selector.find("#seekarea").scrollLeft() -
              selector.find("#timearea").offset().left -
              offset_left) *
            timelinetime
          ).toFixed(1)
        );
      } else {
        currenttime = parseFloat(
          (
            (e.pageX +
              selector.find("#seekarea").scrollLeft() -
              selector.find("#timearea").offset().left -
              offset_left) *
            timelinetime
          ).toFixed(1)
        );
      }
      if (currenttime < 0) {
        currenttime = 0;
      }
      // Check for 60FPS playback, 16ms "slots"
      if (currenttime % 16.666 != 0) {
        currenttime = Math.ceil(currenttime / 16.666) * 16.666;
      }
      renderTime();
      selector.find("#seekbar").offset({
        left:
          offset_left +
          selector.find("#inner-timeline").offset().left +
          currenttime / timelinetime,
      });
      animate(false, currenttime);
      updatePanelValues();
    }
    selector.on("click", "#seekevents", function (e) {
      seekTo(e);
    });
    selector.on("click", "#timearea", function (e) {
      seekTo(e);
    });

    function hideSeekbar() {
      selector.find("#seek-hover").css({ opacity: 0 });
    }

    function followCursor(e) {
      selector.find("#seek-hover").css({ opacity: 0.3 });
      if (selector.find("#seekarea").scrollLeft() > offset_left) {
        hovertime = parseFloat(
          (
            (e.pageX +
              selector.find("#seekarea").scrollLeft() -
              selector.find("#timearea").offset().left -
              offset_left) *
            timelinetime
          ).toFixed(1)
        );
      } else {
        hovertime = parseFloat(
          (
            (e.pageX +
              selector.find("#seekarea").scrollLeft() -
              selector.find("#timearea").offset().left -
              offset_left) *
            timelinetime
          ).toFixed(1)
        );
      }
      if (
        e.pageX >=
        offset_left + selector.find("#inner-timeline").offset().left
      ) {
        selector.find("#seek-hover").offset({ left: e.pageX });
      }
    }
    selector.on("mousemove", "#timearea", followCursor);
    selector.on("mousemove", "#seekevents", followCursor);
    selector.on("mousemove", "#toolbar", hideSeekbar);
    selector.on("mousemove", "#canvas-area", hideSeekbar);
    selector.on("mousemove", "#browser", hideSeekbar);
    selector.on("mousemove", "#properties", hideSeekbar);
    selector.on("mousemove", "#controls", hideSeekbar);

    // Order layers
    function orderLayers() {
      selector.find(".layer").each(function (index) {
        const object = canvas.getItemById($(this).attr("data-object"));
        canvas.sendToBack(object);
        canvas.requestRenderAll();
        objects.splice(
          selector.find(".layer").length - index - 1,
          0,
          objects.splice(
            objects.findIndex((x) => x.id == object.get("id")),
            1
          )[0]
        );
      });
      save();
    }

    // Hand tool
    selector.on("click", "#hand-tool", function () {
      if ($(this).hasClass("hand-active")) {
        $(this).removeClass("hand-active");
        handtool = false;
        canvas.defaultCursor = "default";
        canvas.requestRenderAll();
      } else {
        $(this).addClass("hand-active");
        handtool = true;
        canvas.defaultCursor = "grab";
        canvas.requestRenderAll();
      }
    });
    // Set defaults
    setDuration(duration);
    checkDB();

    // An object is added to the canvas
    canvas.on("object:added", function (e) {
      var obj = e.target;
      addDeleteIcon(obj);
      addCloneIcon(obj);
      if (obj.get("assetType") == "audio") {
        obj.set("borderColor", "transparent");
      }
    });
    // An object is removed from the canvas
    canvas.on("object:removed", function (e) {
      var obj = e.target;
      if (obj.get("assetType") && obj.get("assetType") == "audio") {
        selector.find(".audio-item-active").removeClass("audio-item-active");
        canvas.discardActiveObject();
        background_audio = false;
        background_key = false;
      }
    });
    // An object is being moved in the canvas
    canvas.on("object:moving", function (e) {
      e.target.hasControls = false;
      centerLines(e);
      if (cropping) {
        if (canvas.getItemById("crop").isContainedWithinObject(cropobj)) {
          cropleft = canvas.getItemById("crop").get("left");
          croptop = canvas.getItemById("crop").get("top");
          cropscalex = canvas.getItemById("crop").get("scaleX");
          cropscaley = canvas.getItemById("crop").get("scaleY");
        }
        crop(canvas.getItemById("cropped"));
      } else if (lockmovement && e.e.shiftKey && canvas.getActiveObject()) {
        if (canvasx < shiftx + 30 && canvasx > shiftx - 30) {
          canvas.getActiveObject().set({ left: shiftx });
          canvas.getActiveObject().lockMovementX = true;
          canvas.getActiveObject().lockMovementY = false;
        } else {
          canvas.getActiveObject().set({ top: shifty });
          canvas.getActiveObject().lockMovementX = false;
          canvas.getActiveObject().lockMovementY = true;
        }
      } else if (canvas.getActiveObject() && !e.e.shiftKey) {
        lockmovement = false;
        canvas.getActiveObject().lockMovementX = false;
        canvas.getActiveObject().lockMovementY = false;
      }
    });

    // An object is being scaled in the canvas
    canvas.on("object:scaling", function (e) {
      e.target.hasControls = false;
      centerLines(e);
      if (cropping) {
        var cropID = canvas.getItemById("crop");
        if (cropID.isContainedWithinObject(cropobj)) {
          cropleft = cropID.get("left");
          croptop = cropID.get("top");
          cropscalex = cropID.get("scaleX");
          cropscaley = cropID.get("scaleY");
        }
        crop(canvas.getItemById("cropped"));
      }
    });

    // An object is being rotated in the canvas
    canvas.on("object:rotating", function (e) {
      if (e.e.shiftKey) {
        canvas.getActiveObject().snapAngle = 15;
      } else {
        canvas.getActiveObject().snapAngle = 0;
      }
      e.target.hasControls = false;
    });

    // An object has been modified in the canvas
    canvas.on("object:modified", function (e) {
      e.target.hasControls = true;
      if (!editinggroup && !cropping) {
        canvas.getActiveObject().lockMovementX = false;
        canvas.getActiveObject().lockMovementY = false;
        canvas.requestRenderAll();
        if (e.target.type == "activeSelection") {
          const tempselection = canvas.getActiveObject();
          canvas.discardActiveObject();
          e.target._objects.forEach(function (object) {
            autoKeyframe(object, e, true);
          });
          reselect(tempselection);
        } else {
          autoKeyframe(e.target, e, false);
        }
        updatePanelValues();
        save();
      }
      if (cropping) {
        var obj = e.target;
        checkCrop(obj);
      }
    });

    // A selection has been updated in the canvas
    canvas.on("selection:updated", function (e) {
      updatePanel(true);
      updatePanelValues();
      updateSelection(e);
    });

    // A selection has been made in the canvas
    canvas.on("selection:created", function (e) {
      if (e.selected.length > 1 && currenttime !== 0) {
        canvas.discardActiveObject();
        return;
      }
      shiftx = canvas.getActiveObject().get("left");
      shifty = canvas.getActiveObject().get("top");
      if (!editingpanel) {
        updatePanel(true);
      }
      updateSelection(e);
      canvas.requestRenderAll();
    });

    // A selection has been cleared in the canvas
    canvas.on("selection:cleared", function (e) {
      if (!editingpanel && !setting) {
        updatePanel(false);
      }
      selector.find(".layer-selected").removeClass("layer-selected");
      if (cropping) {
        crop(cropobj);
      }
    });

    function kFormatter(num) {
      return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
        : Math.sign(num) * Math.abs(num);
    }

    // Zoom in/out of the canvas
    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      selector
        .find("#zoom-level .zoom-span")
        .html(kFormatter((zoom * 100).toFixed(0)) + "%");
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // Start panning if space is down or hand tool is enabled
    canvas.on("mouse:down", function (opt) {
      var e = opt.e;
      if (spaceDown || handtool) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
      if (opt.target) {
        opt.target.hasControls = true;
        wip = false;
      }
    });

    // Pan while dragging mouse
    canvas.on("mouse:move", function (opt) {
      var pointer = canvas.getPointer(opt.e);
      canvasx = pointer.x;
      canvasy = pointer.y;
      if (this.isDragging) {
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });

    // Stop panning
    canvas.on("mouse:up", function (opt) {
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
      line_h.opacity = 0;
      line_v.opacity = 0;
    });

    // Detect mouse over canvas (for dragging objects from the library)
    canvas.on("mouse:move", function (e) {
      overCanvas = true;
    });
    canvas.on("mouse:out", function (e) {
      overCanvas = false;
      if (wip) {
        e.target.hasControls = true;
        canvas.discardActiveObject();
        wip = false;
        canvas.requestRenderAll();
      }
    });

    // Key event handling
    $(document)
      .keyup(function (e) {
        // Delete object/keyframe
        if (
          (e.keyCode == 46 ||
            e.key == "Delete" ||
            e.code == "Delete" ||
            e.key == "Backspace") &&
          !focus &&
          !editinglayer
        ) {
          if (
            selector.find(".show-properties").length > 0 ||
            shiftkeys.length > 0
          ) {
            deleteKeyframe();
          } else {
            deleteSelection();
          }
        }
      })
      .keydown(function (e) {
        var obj = false;
        var step = 2;
        if (canvas.getActiveObject()) {
          obj = canvas.getActiveObject();
        }
        // Left arrow key (move object to the left)
        if (e.keyCode === 37 && obj) {
          // Bigger step if shift is down
          if (e.shiftKey) {
            step = 7;
          }
          obj.left = obj.left - step;
          canvas.requestRenderAll();
          if (obj.type == "activeSelection") {
            canvas.discardActiveObject();
            obj._objects.forEach(function (object) {
              autoKeyframe(object, { action: "drag" }, true);
            });
            reselect(obj);
          } else {
            autoKeyframe(obj, { action: "drag" }, false);
          }
        }
        // Up arrow key (move object up)
        if (e.keyCode === 38 && obj) {
          // Bigger step if shift is down
          if (e.shiftKey) {
            step = 7;
          }
          obj.top = obj.top - step;
          canvas.requestRenderAll();
          if (obj.type == "activeSelection") {
            canvas.discardActiveObject();
            obj._objects.forEach(function (object) {
              autoKeyframe(object, { action: "drag" }, true);
            });
            reselect(obj);
          } else {
            autoKeyframe(obj, { action: "drag" }, false);
          }
        }
        // Right arrow key  (move object to the right)
        if (e.keyCode === 39 && obj) {
          // Bigger step if shift is down
          if (e.shiftKey) {
            step = 7;
          }
          obj.left = obj.left + step;
          canvas.requestRenderAll();
          if (obj.type == "activeSelection") {
            canvas.discardActiveObject();
            obj._objects.forEach(function (object) {
              autoKeyframe(object, { action: "drag" }, true);
            });
            reselect(obj);
          } else {
            autoKeyframe(obj, { action: "drag" }, false);
          }
        }
        // Down arrow key   (move object down)
        if (e.keyCode === 40 && obj) {
          // Bigger step if shift is down
          if (e.shiftKey) {
            step = 7;
          }
          obj.top = obj.top + step;
          canvas.requestRenderAll();
          if (obj.type == "activeSelection") {
            canvas.discardActiveObject();
            obj._objects.forEach(function (object) {
              autoKeyframe(object, { action: "drag" }, true);
            });
            reselect(obj);
          } else {
            autoKeyframe(obj, { action: "drag" }, false);
          }
        }
      });

    // Stop cropping when clicking on the blacked out properties panel
    selector.on("click", "#crop-selection", function () {
      if (cropping) {
        canvas.discardActiveObject();
      }
    });

    // Playback
    selector.on("click", "#play-button", function () {
      if (paused) {
        play();
      } else {
        pause();
      }
    });

    // Detect when not clicking on certain elements
    selector.on("mousedown", function (e) {
      // De-select keyframes
      if (
        !selector.find("#keyframe-properties").is(e.target) &&
        selector.find("#keyframe-properties").has(e.target).length === 0 &&
        !selector.find(".keyframe").is(e.target) &&
        selector.find(".keyframe").has(e.target).length === 0
      ) {
        selector.find("#keyframe-properties").removeClass("show-properties");
        selector.find(".keyframe-selected").removeClass("keyframe-selected");
        shiftkeys = [];
      }

      // Hide color picker
      if (
        !selector.find(".object-color").is(e.target) &&
        selector.find(".object-color").has(e.target).length === 0 &&
        !selector.find(".pcr-app").is(e.target) &&
        selector.find(".prc-app").has(e.target).length === 0 &&
        !selector.find(".pcr-selection").is(e.target) &&
        selector.find(".pcr-selection").has(e.target).length === 0 &&
        !selector.find(".pcr-swatches").is(e.target) &&
        selector.find(".pcr-swatches").has(e.target).length === 0 &&
        !selector.find(".pcr-interaction").is(e.target) &&
        selector.find(".pcr-interaction").has(e.target).length === 0
      ) {
        o_fill.hide();
      }

      // Hide speed settings
      if (
        !selector.find("#speed").is(e.target) &&
        selector.find("#speed").has(e.target).length === 0
      ) {
        selector.find("#speed-settings").removeClass("show-speed");
        selector.find("#speed-arrow").removeClass("arrow-on");
      }
    });

    // Detect focus on an input in the properties
    $(document)
      .on("focus", ".form-field", function () {
        focus = true;
      })
      .on("focusout", function () {
        focus = false;
      });

    // Skip to the beginning or end
    selector.on("click", "#skip-backward", function () {
      animate(false, 0);
      selector.find("#seekbar").offset({
        left:
          offset_left +
          selector.find("#inner-timeline").offset().left +
          currenttime / timelinetime,
      });
      selector.find("#current-time input").val("00:00:00");
    });

    selector.on("click", "#skip-forward", function () {
      animate(false, duration);
      selector.find("#seekbar").offset({
        left:
          offset_left +
          selector.find("#inner-timeline").offset().left +
          currenttime / timelinetime,
      });
      selector.find("#current-time input").val("00:00:00");
      selector.find("#total-time input").val("00:0" + timelinetime + ":00");
    });

    // Change layer name
    selector.on("dblclick", ".layer-custom-name", function () {
      $(this).prop("readonly", false);
      $(this).addClass("name-active");
      $(this).focus();
      document.execCommand("selectAll", false, null);
      editinglayer = true;
    });

    // Trigger file picker when clicking the upload button
    selector.on("click", "#upload-button", function () {
      selector.find("#upload-popup").addClass("upload-show");
    });

    selector.on("click", "#upload-overlay", function () {
      selector.find(".upload-show").removeClass("upload-show");
    });

    selector.on("click", "#upload-popup-close", function () {
      selector.find(".upload-show").removeClass("upload-show");
    });

    selector.on("click", "#upload-drop-area", function () {
      selector.find("#filepick").click();
    });

    selector.on("dragover", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    selector.on("dragover", "#upload-drop-area", function (e) {
      e.preventDefault();
      e.stopPropagation();
      selector.find("#upload-drop-area").addClass("dropping");
    });

    selector.on("dragenter", "#upload-drop-area", function (e) {
      e.preventDefault();
      e.stopPropagation();
      selector.find("#upload-drop-area").addClass("dropping");
    });

    selector.on("drop", function (e) {
      e.preventDefault();
      e.stopPropagation();
      selector.find("#upload-drop-area").removeClass("dropping");
      handleUpload(e);
    });

    selector.on("dragleave", function () {
      selector.find("#upload-drop-area").removeClass("dropping");
    });

    selector.on("dragend", function () {
      selector.find("#upload-drop-area").removeClass("dropping");
    });

    // Upload or remove background audio
    selector.on("click", "#audio-upload-button", function () {
      selector.find("#filepick2").click();
    });

    // Sync scrolling for the timeline
    syncScroll(
      selector.find("#layer-inner-list:not(.nolayer)"),
      selector.find("#timeline")
    );
    syncScrollHoz(selector.find("#timeline"), selector.find("#seekarea"));

    // Initialize layer sorting
    sortable("#layer-inner-list:not(.nolayer)", {
      customDragImage: (draggedElement, elementOffset, event) => {
        return {
          element: document.getElementById("nothing"),
          posX: event.pageX - elementOffset.left,
          posY: event.pageY - elementOffset.top,
        };
      },
    })[0].addEventListener("sortstop", function (e) {
      const id = $(e.detail.item).attr("data-object");
      const previd = $(e.detail.item).prev().attr("data-object");
      if (selector.find(".sortable-dragging").length == 1) {
        selector.find(".sortable-dragging").remove();
        if (previd == undefined) {
          selector.find("#inner-timeline").prepend($("#" + id));
        } else {
          $("#" + id).insertAfter($("#" + previd));
        }
        orderLayers();
      }
    });

    // Initialize properties panel
    updatePanel(false);

    // Load default fonts
    selector.find("#text-tool-select").one("click", function () {
      WebFont.load({
        google: {
          families: [
            "Montserrat",
            "Poppins",
            "Playfair Display",
            "Merriweather",
            "IBM Plex Serif",
            "Roboto Mono",
            "Inconsolata",
            "Source Code Pro",
            "Dancing Script",
            "Pacifico",
            "Indie Flower",
            "Lobster",
            "Bebas Neue",
            "Titan One",
          ],
        },
      });
    });

    /* QR CODE */

    var qrCodeColorFields = [
      "#qrcode-fill",
      "#qrcode-back",
      "#qrcode-label-color",
    ];
    $.each(qrCodeColorFields, function (index, field) {
      Pickr.create({
        el: field,
        theme: "nano",
        inline: false,
        autoReposition: false,
        defaultRepresentation: "RGBA",
        default: $(field).val(),
        useAsButton: true,
        swatches: sets.colorpickerSwatches,
        components: {
          preview: true,
          opacity: true,
          hue: true,
          interaction: {
            hex: true,
            rgba: true,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            clear: false,
            save: false,
          },
        },
      })
        .on("init", (instance) => {
          var val = $(field).val();
          $(field).parent().find(".colorpicker-box").css("background", val);
        })
        .on("change", (color, source, instance) => {
          $(field).val(color.toHEXA().toString());
          $(field)
            .parent()
            .find(".colorpicker-box")
            .css("background", color.toHEXA().toString());
          $(field).trigger("change");
        })
        .on("show", (color, instance) => {
          var rect = selector
            .find(".app-colorpicker:focus")[0]
            .getBoundingClientRect();
          var top = rect.top + rect.height + 5;
          const style = instance.getRoot().app.style;
          style.left = rect.left + "px";
          style.top = top + "px";
        });
    });

    function qrcodePreview() {
      var qrcode = kjua({
        text: selector.find("#qrcode-text").val(),
        render: "svg",
        size: 300,
        fill: selector.find("#qrcode-fill").val(),
        back: selector.find("#qrcode-back").val(),
        rounded: selector.find("#qrcode-rounded").val(),
        mode: "label", // modes: 'plain', 'label' or 'image'
        label: selector.find("#qrcode-label").val(),
        fontname: "sans",
        fontcolor: selector.find("#qrcode-label-color").val(),
        mSize: selector.find("#qrcode-label-size").val(),
        mPosX: selector.find("#qrcode-label-position-x").val(),
        mPosY: selector.find("#qrcode-label-position-y").val(),
      });
      return qrcode;
    }

    selector.find("#generate-qr-code").on("click", function () {
      var qrcode = kjua({
        text: selector.find("#qrcode-text").val(),
        render: "svg",
        size: 300,
        fill: selector.find("#qrcode-fill").val(),
        back: selector.find("#qrcode-back").val(),
        rounded: selector.find("#qrcode-rounded").val(),
        mode: "label", // modes: 'plain', 'label' or 'image'
        label: selector.find("#qrcode-label").val(),
        fontname: "sans",
        fontcolor: selector.find("#qrcode-label-color").val(),
        mSize: selector.find("#qrcode-label-size").val(),
        mPosX: selector.find("#qrcode-label-position-x").val(),
        mPosY: selector.find("#qrcode-label-position-y").val(),
      });

      var serializer = new XMLSerializer();
      var svgStr = serializer.serializeToString(qrcode);
      var x = artboard.get("left") + artboard.get("width") / 2;
      var y = artboard.get("top") + artboard.get("height") / 2;
      newSVGstring(svgStr, x, y, 300, true);
    });

    selector.find("#qrcode-tool-select").one("click", function () {
      selector.find("#qrcode-preview").html(qrcodePreview());
    });

    selector
      .find('#qrcode-settings input[type="text"]')
      .on("input", function () {
        var qrcode = qrcodePreview();
        selector.find("#qrcode-preview").html(qrcode);
      });

    selector
      .find("#qrcode-settings .app-colorpicker")
      .bind("change", function () {
        var qrcode = qrcodePreview();
        selector.find("#qrcode-preview").html(qrcode);
      });

    selector
      .find("#qrcode-settings input[type=range]")
      .bind("input click", function () {
        var qrcode = qrcodePreview();
        selector.find("#qrcode-preview").html(qrcode);
      });

    /* Load Material Icons */
    var materialIcons = new FontFaceObserver("Material Icons");
    materialIcons
      .load(null, 10000)
      .then(function () {
        selector.find("#main-loader").fadeOut(200);
        selector.removeClass("loading");
      })
      .catch(function (e) {
        console.log(e);
        selector.find("#main-loader").fadeOut(200);
        selector.removeClass("loading");
      });

    //////////////////////* CUSTOM FUNCTIONS *//////////////////////

    sets.customFunctions.call(
      this,
      selector,
      canvas,
      canvasrecord,
      lazyLoadInstance
    );
  };
})(jQuery);
