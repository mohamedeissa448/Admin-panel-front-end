(function() {
  "use strict";

  angular
    .module("manageproduct")
    .controller("DeclineCommentProductController", DeclineCommentProductController);

  /* @ngInject */
  function DeclineCommentProductController(
    $mdToast,
    $mdDialog,
    UserService,
    triLoaderService,
    $http,
    ItemToEdit
  ) {
    var vm = this;
    vm.isLoading = true;
    vm.ProductName = ItemToEdit.Product_Name;
    //if (UserService.ifUserHasPermission("ApproveProductData")) {
    vm.isLoading = false;
    vm.User_Code = UserService.getCurrentUser().id;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/getDeclinedProductComment", //http://35.246.143.96:3111
        data: {
          Product_Code: ItemToEdit.Product_Code //product that person checked
        }
      }).then(function(data) {
        vm.DeclinedUser = data.data.DeclinedUser;
        vm.Decline_Comment =data.data.Decline_Comment
      });
   
   
    vm.CloseForm = function() {
      $mdDialog.hide();
    };
    //} else {
    //}
  }
})();
