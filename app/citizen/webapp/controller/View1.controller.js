sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.citizen.controller.View1", {
            onInit: function () {

            },
            onClick: function () {
                var that = this;
                debugger;
               
                var oModel = {
                    Firstname: this.getView().byId("idInp1").mProperties.value,
                    middlename: this.getView().byId("idInp2").mProperties.value,
                    lastname: this.getView().byId("idInp3").mProperties.value,
                    email: this.getView().byId("idInp4").mProperties.value,
                    phoneno: Number(this.getView().byId("idInp5").mProperties.value)



                }
                console.log(oModel);

                this.getView().byId("idInp1").setEnabled(false);
                this.getView().byId("idInp2").setEnabled(false);
                this.getView().byId("idInp3").setEnabled(false);
                this.getView().byId("idInp4").setEnabled(false);
                this.getView().byId("idInp5").setEnabled(false);

                this.getView().byId("idButtn2").setEnabled(true);
                this.getView().byId("idButtn1").setEnabled(false);

                $.ajax({
                    url: "https://port4004-workspaces-ws-sbhd6.us10.trial.applicationstudio.cloud.sap/add",
                    type: 'POST',
                    data: oModel,
                    dataType: "json",
                    // contentType: 'application/json',
                    success: function (data) {
                        console.log("success" + data);
                        
                that.globalModel = that.getOwnerComponent().getModel("globalModel");
            
            
            that.globalModel.data = data.sn;
            console.log(that.globalModel.data);
                    },
                    error: function (e) {
                        console.log("error: " + e);
                    }
                });

                
            

            },
            onClickPrint: function () {
                // var oModel = {
                //     Firstname: this.getView().byId("idInp1").mProperties.value,
                //     middlename: this.getView().byId("idInp2").mProperties.value,
                //     lastname: this.getView().byId("idInp3").mProperties.value,
                //     email: this.getView().byId("idInp4").mProperties.value,
                //     phoneno: Number(this.getView().byId("idInp5").mProperties.value)



                // }
                // $.ajax({
                //     url: "https://port4004-workspaces-ws-sbhd6.us10.trial.applicationstudio.cloud.sap/downloadSingle",
                //     type: 'POST',
                //     data: oModel,
                //     //dataType: "json",
                //     // contentType: 'application/json',
                //     success: function (data) {
                //         console.log("success" + data);
                //         var blob = new Blob([data]);
                //         var link = document.createElement('a');
                //         link.href = window.URL.createObjectURL(blob);
                //         link.download = "test.pdf";
                //         link.click();
                       

                //     },
                //     error: function (e) {
                //         console.log("error: " + e);
                //     }
                // });
                var doc = new jsPDF();
                doc.text(20, 20, "FirstName:\t " + this.getView().byId("idInp1").mProperties.value);
                doc.text(20, 30, "MiddleName:\t " + this.getView().byId("idInp2").mProperties.value);
                doc.text(20, 40, "LastName:\t " + this.getView().byId("idInp3").mProperties.value);
                doc.text(20, 50, "Email:\t " + this.getView().byId("idInp4").mProperties.value);
                doc.text(20, 60, "Phone:\t" + this.getView().byId("idInp5").mProperties.value );
                doc.save('sheet.pdf');
            }
        });
    });
