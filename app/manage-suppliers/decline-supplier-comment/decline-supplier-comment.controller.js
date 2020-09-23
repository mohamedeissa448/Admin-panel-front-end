(function() {
  "use strict";

  angular
    .module("managesuppliers")
    .controller("DeclineCommentSupplierController", DeclineCommentSupplierController);

  /* @ngInject */
  function DeclineCommentSupplierController(
    $mdToast,
    $mdDialog,
    UserService,
    triLoaderService,
    $http,
    ItemToEdit
  ) {
    var vm = this;
    vm.isLoading = true;
      vm.User_Code = UserService.getCurrentUser().id;
      vm.SupplierName = ItemToEdit.Supplier_Name;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/getDeclinedSupplierComment", //http://35.246.143.96:3111
        data: {
          Supplier_Code: ItemToEdit.Supplier_Code //product that person checked
        }
      }).then(function(data) {
        vm.isLoading = false;
        vm.DeclinedUser = data.data.DeclinedUser;
        vm.Decline_Comment =data.data.Decline_Comment
      });

    vm.CloseForm = function() {
      $mdDialog.hide();
    };
  }
})();
