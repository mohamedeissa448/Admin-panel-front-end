(function() {
  "use strict";

  angular
    .module("managecustomers")
    .controller("DeclineCommentCustomerController", DeclineCommentCustomerController);

  /* @ngInject */
  function DeclineCommentCustomerController(
    $mdToast,
    $mdDialog,
    UserService,
    triLoaderService,
    $http,
    ItemToEdit
  ) {
    var vm = this;
    vm.isLoading = true;
    vm.CustomerName = ItemToEdit.Customer_Name;
      vm.isLoading = false;
      vm.User_Code = UserService.getCurrentUser().id;
      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/getDeclinedCustomerComment", //http://35.246.143.96:3111
        data: {
          Customer_Code: ItemToEdit.Customer_Code //product that person checked
        }
      }).then(function(data) {
        vm.DeclinedUser = data.data.DeclinedUser;
        vm.Decline_Comment =data.data.Decline_Comment
      });
      vm.CloseForm = function() {
        $mdDialog.hide();
      };
    
  }
})();
