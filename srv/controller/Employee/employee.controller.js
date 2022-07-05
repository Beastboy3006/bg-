/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

// import connection requirements
const { client, connectionParams } = require('../../config/dbConfig.js');
const TABLE_NAME = "FORM1";
const { v4: getUserId } = require('uuid');
const fs = require('fs')
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk')
let getRequest = async ({ requestQuery }) => {

    let response = null;

    let getFromDB = () => {
        return new Promise((resolve, reject) => {
            //connect to database
            const connection = client.createConnection();
            connection.connect(connectionParams, (error) => {
                console.log("Connection Established.");
                if (!error) {
                    // execute connection
                    if (TABLE_NAME !== undefined) {
                        let filterStatement = "";
                        const initialFilterStatement = filterStatement;
                        if (requestQuery !== undefined) {
                            const queryKeys = Object.keys(requestQuery);
                            for (const key of queryKeys) {
                                if (filterStatement === initialFilterStatement) {
                                    filterStatement += "WHERE "
                                }
                                else {
                                    filterStatement += "AND "
                                }
                                filterStatement += `"${key}"=${requestQuery[key]} `
                            }
                        }
                        let statement = `SELECT * FROM "${TABLE_NAME}" ${filterStatement}`;
                        console.log(statement);
                        connection.exec(statement, (err, result) => {
                            if (!err) {
                                connection.disconnect();
                                // console.log(result);
                                response = result;
                                resolve();
                            } else {
                                connection.disconnect();
                                console.log(err);
                                response = {
                                    "error": err
                                };
                                resolve();
                            }
                        });
                    }
                    else {
                        connection.disconnect();
                        response = {
                            "error": "Invalid request."
                        };
                        resolve();
                    }

                } else {
                    connection.disconnect();
                    console.log(error)
                    response = {
                        "error": error
                    };
                    resolve();
                }
            });
        });
    }

    await getFromDB();

    return response;
}

let postRequest = async ({ requestBody }) => {
    let response = [];

    let postToDB = (body) => {
        return new Promise(function (resolve, reject) {
            //connect to database
            const connection = client.createConnection();
            connection.connect(connectionParams, (error) => {
                console.log("Connection Established.");
                if (!error) {
                    // execute connection
                    if (TABLE_NAME !== undefined && requestBody !== undefined) {
                        let fieldKeys = [];
                        fieldKeys = Object.keys(body);
                        let fieldHeaderQuery = "";
                        for (const fieldKey of fieldKeys) {
                            if (fieldHeaderQuery !== "") {
                                fieldHeaderQuery += ", ";
                            }
                            fieldHeaderQuery += `"${fieldKey}"`;
                        }

                        let fieldValues = [];
                        fieldValues = Object.values(body);
                        let fieldValueQuery = "";
                        for (const fieldValue of fieldValues) {
                            if (fieldValueQuery !== "") {
                                fieldValueQuery += ", ";
                            }
                            fieldValueQuery += `'${fieldValue}'`;
                        }

                        let statement = `INSERT INTO "${TABLE_NAME}" (${fieldHeaderQuery}) VALUES (${fieldValueQuery})`;
                        console.log(statement);
                        connection.exec(statement, (err, result) => {
                            if (!err) {
                                connection.disconnect();
                                // console.log(result);
                                response.push(result);
                                resolve();
                            } else {
                                connection.disconnect();
                                console.log(err);
                                response.push({
                                    "error": err
                                });
                                resolve();
                            }
                        });
                    }
                    else {
                        connection.disconnect();
                        response.push({
                            "error": "Invalid request."
                        });
                        resolve();
                    }

                } else {
                    connection.disconnect();
                    console.log(error)
                    response.push({
                        "error": error
                    });
                    resolve();
                }
            });
        });
    };

    let postParallel = async (arrayOfBody) => {
        let listOfFunctions = [];
        for (const data of arrayOfBody) {
            listOfFunctions.push(postToDB(data));
        };
        await Promise.all(listOfFunctions);
    }

    if (requestBody && requestBody[0]) {
        await postParallel(requestBody);
    } else {
        await postToDB(requestBody);
    }

    return response;
}

let updateRequest = async ({ requestBody, condition }) => {
    let response = [];

    let updateToDB = () => {
        return new Promise(function (resolve, reject) {
            //connect to database
            const connection = client.createConnection();
            connection.connect(connectionParams, (error) => {
                console.log("Connection Established.");
                if (!error) {
                    // execute connection
                    if (TABLE_NAME !== undefined) {
                        let filterStatement = "";
                        const initialFilterStatement = filterStatement;
                        if (condition !== undefined) {
                            const queryKeys = Object.keys(condition);
                            for (const key of queryKeys) {
                                if (filterStatement === initialFilterStatement) {
                                    filterStatement += "WHERE "
                                }
                                else {
                                    filterStatement += "AND "
                                }
                                let value;
                                if (typeof condition[key] === "string") {
                                    value = `'${condition[key]}'`; // enclosed with single quotes
                                }
                                else {
                                    value = `${condition[key]}`;
                                }
                                filterStatement += `"${key}"=${value} `
                            }
                        }

                        let requestBodyStatement = "";
                        const initialrequestBodyStatement = requestBodyStatement;
                        if (requestBody !== undefined) {
                            const requestBodyKeys = Object.keys(requestBody);
                            for (const key of requestBodyKeys) {
                                if (requestBodyStatement === initialrequestBodyStatement) {
                                    requestBodyStatement += "SET "
                                }
                                else {
                                    requestBodyStatement += ", "
                                }
                                let value;
                                if (typeof requestBody[key] === "string") {
                                    value = `'${requestBody[key]}'`; // enclosed with single quotes
                                }
                                else if (typeof requestBody[key] === "object") {
                                    console.log("Object catched");
                                    value = `'${JSON.stringify(requestBody[key])}'`;
                                }
                                else {
                                    value = `${requestBody[key]}`;
                                }
                                requestBodyStatement += `"${key}"=${value} `
                            }
                        }
                        let statement = `UPDATE "${TABLE_NAME}" ${requestBodyStatement}  ${filterStatement}`;

                        console.log(statement);
                        connection.exec(statement, (err, result) => {
                            if (!err) {
                                connection.disconnect();
                                // console.log(result);
                                response = [];
                                if (err) {
                                    response = {
                                        "error": err
                                    };
                                    resolve();
                                }
                                else {
                                    response = result;
                                    resolve();
                                }
                            } else {
                                connection.disconnect();
                                console.log(err);
                                response = {
                                    "error": err
                                };
                                resolve();
                            }
                        });
                    }
                    else {
                        connection.disconnect();
                        response = {
                            "error": "Invalid request."
                        };
                        resolve();
                    }

                } else {
                    connection.disconnect();
                    console.log(error)
                    response = {
                        "error": error
                    };
                    resolve();
                }
            });
        });
    };

    await updateToDB();

    return response;
}

let deleteRequest = async ({ requestQuery }) => {

    let response = null;

    let clearDB = () => {
        return new Promise((resolve, reject) => {
            //connect to database
            const connection = client.createConnection();
            connection.connect(connectionParams, (error) => {
                console.log("Connection Established.");
                if (!error) {
                    // execute connection
                    if (TABLE_NAME !== undefined) {
                        let filterStatement = "";
                        const initialFilterStatement = filterStatement;
                        if (requestQuery !== undefined) {
                            const queryKeys = Object.keys(requestQuery);
                            for (const key of queryKeys) {
                                if (filterStatement === initialFilterStatement) {
                                    filterStatement += "WHERE "
                                }
                                else {
                                    filterStatement += "AND "
                                }
                                filterStatement += `"${key}"=${requestQuery[key]} `
                            }
                        }
                        const statement = `DELETE FROM "${TABLE_NAME}" ${filterStatement}`;
                        console.log(statement);
                        connection.exec(statement, (err, result) => {
                            if (!err) {
                                connection.disconnect();
                                // console.log(result);
                                response = result;
                                resolve();
                            } else {
                                connection.disconnect();
                                console.log(err);
                                response = {
                                    "error": err
                                };
                                resolve();
                            }
                        });
                    }
                    else {
                        connection.disconnect();
                        response = {
                            "error": "Invalid request."
                        };
                        resolve();
                    }

                } else {
                    connection.disconnect();
                    console.log(error)
                    response = {
                        "error": error
                    };
                    resolve();
                }
            });
        });
    }

    await clearDB();

    return response;
}

exports.getTable = async (req, res) => {
    const parameters = {
        "requestQuery": req.query
    }
    const data = await getRequest(parameters);
    if (data && !data.error) {
        res.type("application/json").status(200).send({
            "data": data
        });
    } else if (data && data.error) {
        res.type("application/json").status(500).send({
            "error": data.error
        })
    } else {
        res.type("application/json").status(500).send({
            "error": "Something went wrong"
        })
    }
}

exports.postTable = async (req, res) => {

    const parameters = {
        "requestBody": req.body
    }
    parameters.requestBody.SNO = getUserId();

    const data = await postRequest(parameters);
    if (data && !data.error) {
        res.type("application/json").status(200).send({
            "response": data
        });
    } else if (data && data.error) {
        res.type("application/json").status(500).send({
            "error": data.error
        })
    } else {
        res.type("application/json").status(500).send({
            "error": "Something went wrong"
        })
    }
}

exports.updateTable = async (req, res) => {
    const parameters = {
        "condition": req.body.condition,
        "requestBody": req.body.requestBody
    }

    const data = await updateRequest(parameters);
    if (data && data >= 1) {
        res.type("application/json").status(200).send({
            "updatedRecords": data,
            "message": "Data updated successfully"
        });
    }
    else if (data === 0) {
        res.type("application/json").status(200).send({
            "updatedRecords": data,
            "message": "No data found in the request."
        });
    }
    else if (data && data.error) {
        res.type("application/json").status(500).send({
            "error": data.error
        })
    } else {

        res.type("application/json").status(500).send({
            "error": "Something went wrong"
        })
    }
}

exports.deleteTable = async (req, res) => {
    const parameters = {
        "requestQuery": req.query
    }
    const data = await deleteRequest(parameters);
    if (data && !data.error) {
        res.type("application/json").status(200).send({
            "message": "Data Deleted Successfully",
            "response": data
        });
    } else if (data && data.error) {
        res.type("application/json").status(500).send({
            "error": data.error
        })
    } else {
        res.type("application/json").status(500).send({
            "message": "Something went wrong",
            "error": data
        })
    }
}

exports.getPdf = async (req, res) => {
    try {
        // Initial setup, create credentials instance.
        const credentials = PDFServicesSdk.Credentials
            .serviceAccountCredentialsBuilder()
            .fromFile("srv/pdfservices-api-credentials.json")
            .build();

        // Setup input data for the document merge process
        const parameters = {
            "requestQuery": req.query
        }
        var data = await getRequest(parameters);
        console.log(data)
        let jsonDataForMerge = data[0];

        // Create an ExecutionContext using credentials
        const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

        // Create a new DocumentMerge options instance
        const documentMerge = PDFServicesSdk.DocumentMerge,
            documentMergeOptions = documentMerge.options,
            options = new documentMergeOptions.DocumentMergeOptions(jsonDataForMerge, documentMergeOptions.OutputFormat.PDF);

        // Create a new operation instance using the options instance
        const documentMergeOperation = documentMerge.Operation.createNew(options)

        // Set operation input document template from a source file.
        const input = PDFServicesSdk.FileRef.createFromLocalFile('srv/Customer.docx');
        documentMergeOperation.setInput(input);

        // Execute the operation and Save the result to the specified location.
        documentMergeOperation.execute(executionContext)
            .then(async (result) => {
                await result.saveAsFile(`srv/output/${data[0].Firstname}.pdf`)
                var file = fs.createReadStream(`srv/output/${data[0].Firstname}.pdf`);
                file.pipe(res)
                fs.unlinkSync(`srv/output/${data[0].Firstname}.pdf`)
            }
               
                // res.send(result)
            )
            .catch(err => {
                if (err instanceof PDFServicesSdk.Error.ServiceApiError
                    || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                    console.log('Exception encountered while executing operation', err);
                } else {
                    console.log('Exception encountered while executing operation', err);
                }
            });
        // var file = fs.createReadStream(`srv/output/${data[0].Firstname}.pdf`);
        // var stat = fs.statSync(`srv/output/${data[0].Firstname}.pdf`);
        // res.setHeader('Content-Length', stat.size);
        // res.setHeader('Content-Type', 'application/pdf');
       
        // file.pipe(res);
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
        res.send(err)
    }
}