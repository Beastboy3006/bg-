/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict"

module.exports = (app) => {

    const employeeController = require('../controller/Employee/employee.controller');
  
    
    app.get('/display', employeeController.getTable)
    app.post('/add', employeeController.postTable)
    app.get('/downloadPDF',employeeController.getPdf)
    app.post('/downloadSingle',employeeController.getPdf)
    app.put('/update', employeeController.updateTable)
    
app.delete('/delete',employeeController.deleteTable)

    return app;

}