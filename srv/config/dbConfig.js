/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */

"use strict";

const client = require("@sap/hana-client");
//Lookup HANA DB Connection from Bound HDB Container Service
const xsenv = require("@sap/xsenv");
const hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
//Create DB connection with options from the bound service
const connectionParams = {
	serverNode: hanaOptions.hana.host + ":" + hanaOptions.hana.port,
	uid: hanaOptions.hana.user,
	pwd: hanaOptions.hana.password,
	CURRENTSCHEMA: hanaOptions.hana.schema
};

module.exports = {
	client,
	connectionParams
};