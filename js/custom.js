(function ($) {
  "use strict";
  $(document).ready(function () {
    $("#pmotion").pmotion({
      baseURL: "./", // The url of the main directory. For example; "http://www.mysite.com/pmotion/"
      PexelsApiKey: "axlPK8aEYYZUDBnnVQgJSi7O3CZz9FzWmukMBd5IEv1BYtWPo4N3SRiv", // Your Pexels API key. @see https://www.pexels.com/api/documentation/
      PexelsPagination: 20, // Max. number of images to show.
      PexelsLanguage: "en-US", // The locale of the search you are performing. The current supported locales are: 'en-US' 'pt-BR' 'es-ES' 'ca-ES' 'de-DE' 'it-IT' 'fr-FR' 'sv-SE' 'id-ID' 'pl-PL' 'ja-JP' 'zh-TW' 'zh-CN' 'ko-KR' 'th-TH' 'nl-NL' 'hu-HU' 'vi-VN' 'cs-CZ' 'da-DK' 'fi-FI' 'uk-UA' 'el-GR' 'ro-RO' 'nb-NO' 'sk-SK' 'tr-TR' 'ru-RU'
      PexelsImgSize: "large2x", // Valid image sizes are; original large2x large medium small portrait landscape
      PixabayApiKey: "32756145-7a39f50f52b2ecf245285be92", // Your Pixabay API key. @see https://pixabay.com/api/docs/
      PixabayPagination: 20, // Max. number of images to show.
      PixabayLanguage: "en", // The locale of the search you are performing. Accepted values: cs, da, de, en, es, fr, id, it, hu, nl, no, pl, pt, ro, sk, fi, sv, tr, vi, th, bg, ru, el, ja, ko, zh
      PixabaySafeSearch: "false", // A flag indicating that only images suitable for all ages should be returned. Accepted values: "true", "false".
      PixabayEditorsChice: "false", // Select images that have received an Editor's Choice award. Accepted values: "true", "false".
      apiCaching: true, // Browser caching for API requests. Boolean value: true or false
      maxUploadLimit: 10, // Maximum allowed file upload size (MB)
      canvasWidth: 1080, // Default canvas width (px)
      canvasHeight: 1080, // Default canvas height (px)
      fontFamily: "Roboto", // Change only if you've changed the default font family from CSS
      borderColor: "#000000", // Color of controlling borders of an object (when it's active).
      borderScaleFactor: 2, // Scale factor of object's controlling borders bigger number will make a thicker border border is 1, so this is basically a border thickness since there is no way to change the border itself.
      borderOpacityWhenMoving: 0.5, // Opacity of object's controlling borders when object is active and moving.
      cornerColor: "#FFFFFF", // Color of controlling corners of an object (when it's active).
      cornerSize: 12, // Size of object's controlling corners (in pixels).
      cornerStyle: "circle", // Specify style of control, 'rect' or 'circle'.
      cornerStrokeColor: "#000000", // Color of controlling corners of an object (when it's active and transparentCorners false).
      borderDashArray: [4, 4], // Array specifying dash pattern of an object's borders (hasBorder must be true).
      editingBorderColor: "rgba(0,0,0,0.5)", // Editing object border color.
      backgroundColor: "#888888", // Default canvas background color
      imageLayerColor: "#1B9AAA", // Image layer color on the timeline
      videoLayerColor: "#DAA89B", // Video layer color on the timeline
      textLayerColor: "#84A9C0", // Text layer color on the timeline
      shapeLayerColor: "#87D68D", // Shape layer color on the timeline
      animatedTextLayerColor: "#87D68D", // Animated text layer color on the timeline
      audioLayerColor: "#E2EB98", // Audio layer color on the timeline
      watermark: false, // true or false
      watermarkText: "Made with Pmotion", // The watermark text
      watermarkFontFamily: "Roboto", // The font must be loaded on the first page load or must be a web safe font
      watermarkFontStyle: "normal", // Possible values: "", "normal", "italic" or "oblique".
      watermarkFontColor: "#000", // Watermark font color
      watermarkFontSize: 40, // Watermark font size (int)
      watermarkFontWeight: "bold", // e.g. bold, normal, 400, 700
      watermarkBackgroundColor: "#FFF", // Watermark background color
      watermarkLocation: "bottom-right", // Possible values: "bottom-right",
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
      ], // Canvas preset; [Ratio (string), Width (int), Height (int)]
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
      ], // Colorpicker swatches (rgb, rgba or hex)

      //////////////////////* CUSTOM FUNCTIONS *//////////////////////

      customFunctions: function (
        selector,
        canvas,
        canvasrecord,
        lazyLoadInstance
      ) {
        /**
         * @see http://fabricjs.com/fabric-intro-part-1#canvas
         * You may need to update "lazyLoadInstance" if you are going to populate items of a grid with ajax.
         * lazyLoadInstance.update();
         * @see https://github.com/verlok/vanilla-lazyload
         */
      },
    });
  });
})(jQuery);
