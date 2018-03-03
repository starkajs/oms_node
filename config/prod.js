module.exports = {
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
	AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
	AZURE_TENANT: process.env.AZURE_TENANT,
	AZURE_RESOURCE: process.env.AZURE_RESOURCE,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_SERVER: process.env.DB_SERVER,
	sqlServer: {
		userName: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		server: process.env.DB_SERVER,
		options: {
            database: process.env.DB,
            encrypt: true,
			rowCollectionOnRequestCompletion: true,
			rowCollectionOnDone: true
		}
	},
	cookieKey: process.env.cookieKey,
	cookieSecret: process.env.cookieSecret,
	MAIL_USER: process.env.MAIL_USER,
	MAIL_PASSWORD: process.env.MAIL_PASSWORD,
	MAIL_HOST: process.env.MAIL_HOST,
	MAIL_PORT: process.env.MAIL_PORT,
	MAIL_USE_TLS: true,
	FREEAGENT_IDENTIFIER: process.env.FREEAGENT_IDENTIFIER,
    FREEAGENT_SECRET: process.env.FREEAGENT_SECRET,
    FREEAGENT_REDIRECT_URI: process.env.FREEAGENT_REDIRECT_URI
}
