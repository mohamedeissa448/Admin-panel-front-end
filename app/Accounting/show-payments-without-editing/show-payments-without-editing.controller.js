(function() {
    'use strict';

    angular
        .module('accounting')
        .controller('ShowPaymentsWithoutEditingForPurchasingController', ShowPaymentsWithoutEditingForPurchasingController);

    /* @ngInject */
    function ShowPaymentsWithoutEditingForPurchasingController($mdToast,$mdDialog,UserService, triLoaderService,$http,itemToPay) {
        var vm = this;
        vm.logedUser = UserService.getCurrentUser();
        vm.itemToPay=itemToPay;
        $http({
            method: "post",
            url: "http://35.246.143.96:3111/getAllPaymentsForSpecificProductPurchasing",//35.246.143.96:3111
            data: { Product_Purchasing_ID : itemToPay._id }
          }).then(function(data) {
            vm.payments = data.data
            console.log("payments",vm.payments)
            vm.cashPayments=[];
            vm.chequePayments=[];
            angular.forEach(vm.payments, function(item, index) {
                console.log(item, index);
                if(item.Payment_Method_Name== "cash"){
                    console.log("x",item.Cash_Payment.Paying_Date)
                    item.Cash_Payment.Paying_Date= new Date(item.Cash_Payment.Paying_Date);
                    vm.cashPayments.push(item);
                }else if(item.Payment_Method_Name== "cheque"){
                    item.Cheque_Payment.Cheque_Details.Cheque_Date= new Date(item.Cheque_Payment.Cheque_Details.Cheque_Date);
                    vm.chequePayments.push(item);
                }
              });
            angular.forEach(function(element){
                console.log("el",element)
            })
          },
            function(error) {
              console.log(error);
            }
          );
        vm.paymentData={}
       /* vm.SubmitData=function(form){
            console.log("vm.cashPayments",vm.cashPayments)
            console.log("vm.chequePayments",vm.chequePayments)
           
                $http({
                    method:"POST",
                    url:"http://35.246.143.96:3111/updatePaymentsForAspecificPurchasingProduct",//35.246.143.96:3111
                    data : {
                         cashPayments: vm.cashPayments,
                         chequePayments:vm.chequePayments
                        }
                }).then(function(reposne){
                    if(reposne.data.message == true){
                        showAddToast('payments updated successfully',$mdToast); 
                    }else{
                        showAddErrorToast("Something went wrong,Please try again later",$mdToast);
                    }
                    $mdDialog.hide();
                    triLoaderService.setLoaderActive(false);

                });
            }*/
        
        vm.CloseForm = function(){
            
                $mdDialog.hide();
                console.log("closed")
            
        }
        function ConfirmCloseDialog(){
            var Result;
            $mdDialog.show({
                multiple: true,skipHide: true,
                controllerAs:'confirmDialog',
                bindToController: true,
                controller: function($mdDialog){
                    var vmc = this;
                    vmc.closeform = function closeform(){
                        $mdDialog.hide();
                        Result =  true;
                    }
                    vmc.hide = function hide(){
                        $mdDialog.hide();
                        Result = false;
                    }
                  }
                ,template: GetConfirmCloseTemplate()
            }).then(function() {
                if(Result){
                    $mdDialog.hide();
                }
            });
        }
    }

})();