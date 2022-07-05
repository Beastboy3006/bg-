const express = require('express');
const cds = require('@sap/cds')
const Sdk = require('@dynatrace/oneagent-sdk')
const DynaT = Sdk.createInstance()
console.log(DynaT.getCurrentState())

const proxy = require('@sap/cds-odata-v2-adapter-proxy')
global.__base = __dirname + "/"
console.log(global.__base)
console.log(`CDS Custom Boostrap from /srv/server.js`)




process.on('uncaughtException', function (err) {
    console.error(err.name + ': ' + err.message, err.stack.replace(/.*\n/, '\n')) // eslint-disable-line
})







// delegate to default server.js:
module.exports = async (o) => {
    o.port = process.env.PORT || 4004
    //API route (Disabled by default)
    o.baseDir = global.__base
    o.routes = []

    const express = require('express')
    var app = express()
    app.use(express.json())
    app.use(express.urlencoded({extended:false}))
    const crossOriginResourcePolicy = require("cross-origin-resource-policy");
    app.use(crossOriginResourcePolicy({ policy: "cross-origin" }));
    app.use(crossOriginResourcePolicy({ policy: "same-site" }));

    

    var cors = require('cors');
    var helmet = require('helmet');
    app.use(cors({
        origin: "*"
    }));
    app.use(helmet({
    
        crossOriginResourcePolicy: false,


    }))
    app.use(function (_req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
    });





    app.express = express
    app.baseDir = o.baseDir

    o.app = app

    const path = require('path')
    const fileExists = require('fs').existsSync
    let expressFile = path.join(app.baseDir, 'server/express.js')
    if (fileExists(expressFile)) {
        await require(expressFile)(app)
    }



    o.app.httpServer = await cds.server(o)
    //Load routes
    const glob = require('glob')
    let routesDir = path.join(global.__base, 'routes/**/*.js')
    let files = glob.sync(routesDir)
    
    this.routerFiles = files;
    if (files.length !== 0) {
        for (let file of files) {
            await require(file)(app, o.app.httpServer)
        }
    }

    return o.app.httpServer
}  