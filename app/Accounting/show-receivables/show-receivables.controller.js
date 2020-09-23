(function() {
    'use strict';

    angular
        .module('accounting')
        .controller('ShowReceivablesForSellingController', ShowReceivablesForSellingController);

    /* @ngInject */
    function ShowReceivablesForSellingController($mdToast,$mdDialog,UserService, triLoaderService,$http,itemToGetPaid) {
        var vm = this;
        vm.logedUser = UserService.getCurrentUser();
        vm.itemToGetPaid=itemToGetPaid;
        $http({
            method: "post",
            url: "http://35.246.143.96:3111/getAllReceivablesForSpecificProductSelling",//35.246.143.96:3111
            data: { Product_Selling_ID : itemToGetPaid._id }
          }).then(function(data) {
            vm.receivables = data.data
            console.log("receivables",vm.receivables)
            vm.cashPayments=[];
            vm.chequePayments=[];
            angular.forEach(vm.receivables, function(item, index) {
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
          
          },
            function(error) {
              console.log(error);
            }
          );
        vm.paymentData={}
        vm.SubmitData=function(form){
            var Cash_Payment={
                Paying_Date: vm.Cash_Amount_Of_Paying,
                Amount_Of_Paying: vm.Cash_Amount_Of_Paying,
                HigChem_Receiving_Cash_Number: vm.Cash_HigChem_Receiving_Cash_Number,
                Customer_Delivering_Cash_Number: vm.Cash_Customer_Delivering_Cash_Number,
                HigChem_Safe_Keeper_Name: vm.Cash_HigChem_Safe_Keeper_Name,
                Customer_Deliverer_Info:{
                    Name: vm.Cash_Name,
                    Address: vm.Cash_Address,
                    ID_Number: vm.Cash_ID_Number,
                    Position: vm.Cash_Position
                }   
              }
            console.log("Cash_Payment",Cash_Payment)
            var Cheque_Payment={
                Cheque_Date:vm.Cheque_Date,
                Amount_Of_Paying: vm.Cheque_Amount_Of_Paying,
                HigChem_Receiving_Cheque_Number: vm.Cheque_HigChem_Receiving_Cheque_Number,
                Customer_Delivering_Cheque_Number: vm.Cheque_Customer_Delivering_Cheque_Number,
                HigChem_Safe_Keeper_Name: vm.Cheque_HigChem_Safe_Keeper_Name,
                Customer_Deliverer_Info:{
                    Name: vm.Cheque_Name,
                    Address: vm.Cheque_Address,
                    ID_Number: vm.Cheque_ID_Number,
                    Position: vm.Cheque_Position,
                },
                Cheque_Details :{
                    Bank_Name :vm.Bank_Name,
                    Bank_Branch :vm.Bank_Branch,
                    Cheque_Number :vm.Cheque_Number,
                    Cheque_Date: vm.Cheque_Date
                }
            }
            console.log("Cheque_Payment",Cheque_Payment)
            //we need to determine what the type of the payment: 'cash' or 'cheque'
            //if(it is cheque that means that Cash_Payment.Amount_Of_Paying is undefined)
            //if(it is cash that means that Cheque_Payment.Amount_Of_Paying is undefined)
            if(Cash_Payment.Amount_Of_Paying){
                vm.paymentData.Payment_Method_Name = "cash";
                vm.paymentData.Cash_Payment=Cash_Payment;
            }else if(Cheque_Payment.Amount_Of_Paying){
                vm.paymentData.Payment_Method_Name = "cheque";
                vm.paymentData.Cheque_Payment=Cheque_Payment

            }
           
            vm.paymentData.User_Code = vm.logedUser.id;
            vm.paymentData.Product_Selling_ID = itemToGetPaid._id;

               /* $http({
                    method:"POST",
                    url:"http://35.246.143.96:3111/addPayment",//35.246.143.96:3111
                    data : { paymentData: vm.paymentData }
                }).then(function(reposne){
                    if(reposne.data.message == true){
                        showAddToast('payment added successfully',$mdToast); 
                    }else{
                        showAddErrorToast("Something went wrong,Please try again later",$mdToast);
                    }
                    $mdDialog.hide();
                    triLoaderService.setLoaderActive(false);

                });*/
            }
        
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