//const flatten = require("gulp-flatten");

(function () {
    'use strict';

    angular
        .module('purchasing')
        .controller('ViewPurchasingProductDocumentsController', ViewPurchasingProductDocumentsController);

    /* @ngInject */
    function ViewPurchasingProductDocumentsController($mdToast, $mdDialog,$scope, triLoaderService,UserService, $http, itemToViewItsDocuments) {
      var vm = this;
      vm.logedUser = UserService.getCurrentUser();
      vm.SendOrder = {};
      console.log("ItemToEdit",itemToViewItsDocuments)
      vm.Product_Name=itemToViewItsDocuments.Product_Name;
      vm.Product_Code=itemToViewItsDocuments.Product_Code;
      function transformChip(chip) {
        if (angular.isObject(chip)) {
          return chip;
        } else {
          return null;
        }
      }
  
      vm.productDocuments = [];
        vm.filesToUpload=[];
        $http({
          method: "post",
          url: "http://35.246.143.96:3111/product/getDocuments",
          data: {Product_Code : vm.Product_Code}
        }).then(function(data) {
          if(data.data.Product_Documents && data.data.Product_Documents.length>0)
          vm.productDocuments = data.data.Product_Documents;
        });
    
        /*angular.forEach(ItemToEdit.CustomerOrder_Products, function(element, key) {
          console.log("e", element, "key", key);
          vm.productDocuments.push({
            Order_Product_Name: element.Order_Product_Name,
            Order_Product: element.Order_Product,
          });
        });*/
        vm.AddproductDocument = function() {
            console.log("$scope.files",$scope.files)
            vm.filesToUpload.push($scope.files[0])
            var document = {
                'Document_Name'         :$scope.files[0].name,
               'Document_Description'   :vm.Document_Description,
               'Document_End_Date'      :vm.Document_End_Date
           
            };
            vm.productDocuments.push(document);
            console.log("document",document);
            console.log("vm.filesToUpload",vm.filesToUpload);
            //clear form data
            vm.Document_Description="";
            vm.Document_End_Date=""
        };
  
        vm.DeleteRequest = function(document) {
          console.log("document", document);
          if(document['_id']){
            $http({
              method: "post",
              url: "http://35.246.143.96:3111/product/deleteDocument",
              data: {
                Product_Code : vm.Product_Code,
                documentID: document['_id'],
                Document_Url:document['Document_Url']
              }
            }).then(function(data) {
              if(data.data.message == true){
                    showAddToast("Document deleted Successfully", $mdToast)
                    vm.productDocuments.splice(vm.productDocuments.indexOf(document), 1);
                    var indexToRemove=0
                    angular.forEach(vm.filesToUpload,function(file,index){
                      if(file.name==document.Document_Name){
                        indexToRemove=index
                      }
                    })
                    vm.filesToUpload.splice(indexToRemove, 1);
                    console.log("after delete productDocuments", vm.productDocuments);
                    console.log("after delete filesToUpload", vm.filesToUpload);
                  }
              else{
                    showAddErrorToast('Something Went Wrong,Please try again later..',$mdToast);
                 }
            });
          }else{
            showAddToast("Document deleted Successfully", $mdToast)
                    vm.productDocuments.splice(vm.productDocuments.indexOf(document), 1);
                    var indexToRemove=0
                    angular.forEach(vm.filesToUpload,function(file,index){
                      if(file.name==document.Document_Name){
                        indexToRemove=index
                      }
                    })
                    vm.filesToUpload.splice(indexToRemove, 1);
                    console.log("after delete productDocuments", vm.productDocuments);
                    console.log("after delete filesToUpload", vm.filesToUpload);
          }
          
        };
  
      vm.CloseUpdateDocuments = function() {
        $mdDialog.hide();
      };
      vm.SubmitRequest = function() {
        triLoaderService.setLoaderActive(true);
        var fd=new FormData();
             //console.log("$scope.files",$scope.files);
             angular.forEach(vm.filesToUpload,function(file){
                 console.log("file inside",file)
             fd.append('file',file);
             });
             fd.append('Product_Code',vm.Product_Code);
             fd.append('productDocuments',JSON.stringify(vm.productDocuments));
             console.log("vm.productDocuments",vm.productDocuments)

             console.log("fd",fd)
            $http.post('http://35.246.143.96:3111/product/addDocuments',
              fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}                     
                 }) 
                 .then(function(data){
                      if(data.data.message == true)
                      showAddToast("Documents Updated Successfully", $mdToast);
                    else{
                    showAddToast("Something Went Wrong,Please try again later..", $mdToast);
                  }
                  triLoaderService.setLoaderActive(false);
                })  
                vm.CloseUpdateDocuments()
      };
    }
})();