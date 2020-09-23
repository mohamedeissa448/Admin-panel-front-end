(function() {
    'use strict';

    angular
        .module('accounting')
        .controller('PayForPurchasingController', PayForPurchasingController);

    /* @ngInject */
    function PayForPurchasingController($mdToast,$mdDialog,UserService, triLoaderService,$http,itemToPay) {
        var vm = this;
        vm.logedUser = UserService.getCurrentUser();
        console.log(" vm.logedUser",vm.logedUser)
        vm.itemToPay=itemToPay
        //initialize prices table of purchasing
        $http({
            method: "Post",
            url: "http://35.246.143.96:3111/getOnePurchasingProductById",
            data: {_id:itemToPay._id}
          })
            .then(function(data) {
              vm.ProductPurchasing = data.data[0];
              console.log("vm.ProductPurchasing",vm.ProductPurchasing)
              vm.cashPayments=vm.ProductPurchasing.Cash_Payments;
              vm.chequePayments= vm.ProductPurchasing.Cheque_Payments;
            });
        vm.paymentData={}
        vm.SubmitData=function(form){
            var Cash_Payment={
                Paying_Date: vm.Cash_Paying_Date,
                Amount_Of_Paying: vm.Cash_Amount_Of_Paying,
                HigChem_Delivering_Cash_Number: vm.Cash_HigChem_Delivering_Cash_Number,
                Supplier_Recieving_Cash_Number: vm.Cash_Supplier_Recieving_Cash_Number,
                HigChem_Safe_Keeper_Name: vm.Cash_HigChem_Safe_Keeper_Name,
                Supplier_Reciever_Info:{
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
                HigChem_Delivering_Cheque_Number: vm.Cheque_HigChem_Delivering_Cheque_Number,
                Supplier_Recieving_Cheque_Number: vm.Cheque_Supplier_Recieving_Cheque_Number,
                HigChem_Safe_Keeper_Name: vm.Cheque_HigChem_Safe_Keeper_Name,
                Supplier_Reciever_Info:{
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
           
            vm.paymentData.Payment_CreatedByUser = vm.logedUser.mongoID;
            vm.paymentData.Product_Purchasing_ID = itemToPay._id;

                $http({
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

                });
            }
            vm.CloseForm = function(){
            
                $mdDialog.hide();
            
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
        
}
)();