const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const TYPES = require('tedious').TYPES;
const tp = require('tedious-promises')

const keys = require("../config/keys.js");

class sqlServer {
	tpQuery(sqlQuery, callback){
		tp.setConnectionConfig(keys.sqlServer);
		return tp.sql(sqlQuery)
		.execute()
	}
	tpSP(sqlQuery, callback){
		tp.setConnectionConfig(keys.sqlServer);
		return tp.sql(sqlQuery)
		.callProcedure()
	}
}

module.exports = {
	sqlServer: sqlServer
}