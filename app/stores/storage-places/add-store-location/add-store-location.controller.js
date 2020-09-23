(function() {
  "use strict";

  angular
    .module("stores")
    .controller("AddStoreLocation", AddStoreLocation);

  /* @ngInject */
  function AddStoreLocation($window,UserService, $mdToast, triLoaderService,$filter,$http, $state,$mdDialog,itemToAdd) {
    var vm = this;
    vm.CurrentUser = UserService.getCurrentUser();
     vm.StoreLocationData = {} ;

     vm.ParentIdentifier = itemToAdd.ParentIdentifier ;
     vm.StoreLevel = itemToAdd.StoreLevel ;
     vm.ParentID = itemToAdd.ParentID ;
     vm.DialogTitle = itemToAdd.title;

    vm.SubmitData = function(){
        triLoaderService.setLoaderActive(true);
        vm.StoreLocationData.StoragePlace_Identifier = vm.ParentIdentifier + vm.StoreLocationData.StoragePlace_Identifier;
        if(vm.StoreLevel=="SubLevel")
          vm.StoreLocationData.StoragePlace_Parent = vm.ParentID;
        console.log(vm.StoreLocationData)
        $http({
            method:'POST',
            url:'http://localhost:4000/storagePlaces/addStoragePlace',
            data :JSON.stringify(vm.StoreLocationData)
        }).then(function(data){
            if (data.data.message==true) {
                showAddToast('Store location Saved Successfully',$mdToast);
                triLoaderService.setLoaderActive(false);
            }else{
                showAddErrorToast("Faild to save this store location",$mdToast);
                triLoaderService.setLoaderActive(false);
            }
        });

    };

  }
})();
