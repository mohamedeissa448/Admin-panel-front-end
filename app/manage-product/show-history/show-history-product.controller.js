(function() {
  "use strict";

  angular
    .module("manageproduct")
    .controller("ShowHistoryProductController", ShowHistoryProductController);

  /* @ngInject */
  function ShowHistoryProductController(
    $mdToast,
    $mdDialog,
    UserService,
    triLoaderService,
    $http,
    history
  ) {
    var vm = this;
    vm.history = history;
    vm.checkedDates = [];
    console.log("history",history)
    angular.forEach(vm.history, function(item, index) {
      console.log(item, index);
      vm.checkedDates.push(item["Product_EditingTime"]);
    });
    vm.SubmitData = function(form) {
      console.log("form");
    };
    vm.CloseForm = function() {
      $mdDialog.hide();
    };
    vm.ShowHistory = function(item) {
      vm.selectedDate = item;
      vm.SelectedHistoryData = vm.history;
    };
  }
})();
