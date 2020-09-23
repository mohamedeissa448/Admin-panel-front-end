(function() {
  "use strict";

  angular
    .module("stores")
    .controller("ManageStoragePlacesController", ManageStoragePlacesController);

  /* @ngInject */
  function ManageStoragePlacesController($window,UserService, $mdToast, triLoaderService,$filter,$http, $state,$mdDialog) {
    var vm = this;
    vm.StoreLocations = [];
    vm.SelectedStoreCode = "";
    vm.FirstLevelTitle = "" ;
    vm.TREE_DATA = [] ;
    vm.isLoading = true;

    vm.CurrentUser = UserService.getCurrentUser();
    vm.storeProductGrid = angular.element(document.querySelector("#jsGrid"));
    vm.alphabetArray = genCharArray("a", "z");

    function createJsGrid() {
      vm.storeProductGrid.jsGrid({
        width: "1400",
        height: "70vh",
        autoload: false,
        sorting: true,
        selecting: false,
        paging: true,
        inserting: false,
        editing: false,
        pageIndex: 1,
        pageSize: 20,
        pageButtonCount: 15,
        data: vm.storeProductslist,
        fields: [
          {title: "Product Code",name: "Product_Code",align: "center",type: "number",width: 30},
          
        ]
      });
    }

    vm.retriveStoragePlaces= function() {

      $http({
        method: "get",
        url: "http://localhost:4000/storagePlaces/getAll",//35.246.143.96:3111
      }).then(function(response) {
        var storeDocuments = response.data ;
        vm.StoreLocations = storeDocuments.filter(function(it) { return !(it.StoragePlace_Parent)} );
        if(vm.StoreLocations.length > 0){
          vm.SelectedStoreCode = this.StoreLocations[0]._id;
          this.FirstLevelTitle = this.StoreLocations[0].StoragePlace_SubLevelTitle;
          var storageHierarchy = this.storagePlacesService.buildStorePlaceHierarchy(storeDocuments,this.SelectedStoreCode)
          vm.TREE_DATA = storageHierarchy;
          this.dataSource.data = this.TREE_DATA;

        }
        vm.isLoading = false;
      },
        function(error) {
          console.log(error);
        }
      );
    }
    vm.retriveStoragePlaces();

    vm.updateHierarchy =function (){
      $http({
        method: "get",
        url: "http://localhost:4000/storagePlaces/getAll",//35.246.143.96:3111
      }).then(function(response) {
        var storeDocuments = response.data;
        let storageHierarchy = this.storagePlacesService.buildStorePlaceHierarchy(storeDocuments,this.SelectedStoreCode)
        this.TREE_DATA = storageHierarchy;
        this.dataSource.data = this.TREE_DATA;
      });
    }
    vm.changeStoreLocation = function(){
      if(this.SelectedStoreCode == 0){
        return;
      }
      let IndexOfSelectedStore = this.StoreLocations.findIndex(function(x) {return x._id === this.SelectedStoreCode } )
      this.FirstLevelTitle = this.StoreLocations[IndexOfSelectedStore].StoragePlace_SubLevelTitle;
      this.updateHierarchy();
    }
    vm.SelectedStoreIdentifier = function (){
      let IndexOfSelectedStore = this.StoreLocations.findIndex(function(x) {return x._id === this.SelectedStoreCode } )
      return this.StoreLocations[IndexOfSelectedStore].StoragePlace_Identifier;
    }

    vm.buildStorePlaceHierarchy =function(StorePlacesArray,SelectedStoreCode){
      let storageHierarchy = StorePlacesArray.filter(function(it) {return  it.StoragePlace_Parent == SelectedStoreCode});
      angular.forEach(storageHierarchy, function(firestLevelitem, key) {
        firestLevelitem.Childrens = [];
        firestLevelitem.Childrens = StorePlacesArray.filter(function(it) {return it.StoragePlace_Parent == firestLevelitem._id} );
        angular.forEach(firestLevelitem.Childrens, function(SecondLevelitem, key) {
          SecondLevelitem.Childrens = [];
          SecondLevelitem.Childrens = StorePlacesArray.filter(function(it) {return it.StoragePlace_Parent == SecondLevelitem._id} );
          angular.forEach(SecondLevelitem.Childrens, function(ThairdLevelitem, key) {
            ThairdLevelitem.Childrens = [];
            ThairdLevelitem.Childrens = StorePlacesArray.filter(function(it) {return it.StoragePlace_Parent == ThairdLevelitem._id}) ; 
            angular.forEach(ThairdLevelitem.Childrens, function(FourthLevelitem, key) {
              FourthLevelitem.Childrens = [];
              FourthLevelitem.Childrens = StorePlacesArray.filter(function(it) {return it.StoragePlace_Parent == FourthLevelitem._id} ); 
              angular.forEach(FourthLevelitem.Childrens, function(FifthLevelitem, key) {
                FifthLevelitem.Childrens = [];
                FifthLevelitem.Childrens = StorePlacesArray.filter(function(it) {return it.StoragePlace_Parent == FifthLevelitem._id} ); 
    
              });
            });
          });
  
        });
      });
        
      return storageHierarchy;
    }
    vm.getStoragePath =function(StorePlacesArray, ParentID){
      let PathArray = [];
      let IndexOfFirstParent = StorePlacesArray.findIndex(function (x) {return x._id === ParentID} );
      PathArray.push(StorePlacesArray[IndexOfFirstParent].StoragePlace_DisplayName);
      if(StorePlacesArray[IndexOfFirstParent].StoragePlace_Parent){
        let IndexOfSecondParent = StorePlacesArray.findIndex(function (x) { return x._id === StorePlacesArray[IndexOfFirstParent].StoragePlace_Parent} );
        PathArray.push(StorePlacesArray[IndexOfSecondParent].StoragePlace_DisplayName);
        if(StorePlacesArray[IndexOfSecondParent].StoragePlace_Parent){
          let IndexOfThirdParent = StorePlacesArray.findIndex(function (x) {return x._id === StorePlacesArray[IndexOfSecondParent].StoragePlace_Parent} );
          PathArray.push(StorePlacesArray[IndexOfThirdParent].StoragePlace_DisplayName);
          if(StorePlacesArray[IndexOfThirdParent].StoragePlace_Parent){
            let IndexOfFourthParent = StorePlacesArray.findIndex(function (x) {return x._id === StorePlacesArray[IndexOfThirdParent].StoragePlace_Parent} );
            PathArray.push(StorePlacesArray[IndexOfFourthParent].StoragePlace_DisplayName);
            if(StorePlacesArray[IndexOfFourthParent].StoragePlace_Parent){
              let IndexOfFifthParent = StorePlacesArray.findIndex(function (x) { return x._id === StorePlacesArray[IndexOfFourthParent].StoragePlace_Parent} );
              PathArray.push(StorePlacesArray[IndexOfFifthParent].StoragePlace_DisplayName);
            }
          }
        }
      }
      PathArray = PathArray.reverse();
      return PathArray.join(" » ")
    }
    
    vm.AddNewStoreLocation = function(){
      console.log("ff")
      var item = {
        title       : "Add New Store Location",
        StoreLevel  : "StoreLocation" ,
        ParentIdentifier: ""
      };
      $mdDialog.show({
        controller: "AddStoreLocation",
        controllerAs: "vm",
        templateUrl: "app/stores/storage-places/add-store-location.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
         // vm.storeProductGrid.innerHTML = "";
          //vm.retriveStoragePlaces();
        },
        locals: {
          itemToAdd: item
        }
      });
    }

    vm.AddSubLevelStoreLocation = function(levelName,parentID,ParentIdentifier){
      console.log("AddSubLevelStoreLocation")
      var item = {
        title       : "Add New ",
        StoreLevel  : "SubLevel" ,
        parentID    : parentID,
        ParentIdentifier: ParentIdentifier
      };
      $mdDialog.show({
        controller: "AddStoreLocation",
        controllerAs: "vm",
        templateUrl: "app/stores/storage-places/add-store-location.tmpl.html",
        clickOutsideToClose: false,
        focusOnOpen: false,
        //targetEvent: $event,
        onRemoving: function(event, removePromise) {
          console.log("event",event)
          if(data.DataChanged && data.StoreLevel == "SubLevel"){
            vm.updateHierarchy();
          }
        },
        locals: {
          itemToAdd: item
        }
      });
    }


  }
})();
