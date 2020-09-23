(function() {
  "use strict";

  angular
    .module("app", [
      "ui.router",
      "triangular",
      "ngAnimate",
      "ngCookies",
      "ngSanitize",
      "ngMessages",
      "ngMaterial",
      "googlechart",
      "chart.js",
      "linkify",
      "ui.calendar",
      "angularMoment",
      "textAngular",
      "uiGmapgoogle-maps",
      "hljs",
      "md.data.table",
      angularDragula(angular),
      "ngFileUpload",
      "nvd3",

      "app.translate",
      // only need one language?  if you want to turn off translations
      // comment out or remove the 'app.translate', line above
      "app.permission",
      "manageuser",
      "dashboard",
      "manageproduct",
      "managesuppliers",
      "managecustomers",
      "nonoauthentication",
      "sys-setup",
      "pricerequest",
      "sendoffer",
      "customerorder",
      "stores",
      "purchasing",
      "accounting",
      "sales",
      "access-externally",
      "managecompanies",
      "manage-bills",
      "manageorders"
    ])

    // set a constant for the API we are connecting to
    .constant("API_CONFIG", {
      url: "http://triangular-api.oxygenna.com/"
    })
  
})();
