(function() {
  "use strict";

  angular
    .module("stores")
    .controller("viewIncreaseInventoryDetails", viewIncreaseInventoryDetails);

  /* @ngInject */
  function viewIncreaseInventoryDetails(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService,
    id
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }
    $http({
      method: "post",
      url: "http://localhost:4000/increaseInventory/getOneById",
      data: {_id : id }
    }).then(function(response) {
      vm.IncreaseInventory_Date = response.data.IncreaseInventory_Date ;
      vm.IncreaseInventory_SysDate = response.data.IncreaseInventory_SysDate ;
      vm.IncreaseInventory_Note = response.data.IncreaseInventory_Note ;
      vm.IncreaseInventory_DoneBy_User = response.data.IncreaseInventory_DoneBy_User ;
      vm.IncreaseInventory_Products = response.data.IncreaseInventory_Products ;
    });

      
    vm.CloseIncreaseInventory = function() {
      $mdDialog.hide();
    };
    
  }
})();
