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
		userName: "anndrajs",
		password: "Al3ssandr0",
		server: "optmgt.database.windows.net",
		options: {
            database: "optmgt",
            encrypt: true,
			rowCollectionOnRequestCompletion: true,
			rowCollectionOnDone: true
		}
	},
	cookieKey: process.env.cookieKey,
	cookieSecret: process.env.cookieSecret,
	MAIL_USER: 'info@optimumpps.co.uk',
	MAIL_PASSWORD: '0ptimumPP5201602',
	MAIL_HOST: 'smtp.office365.com',
	MAIL_PORT: 587,
	MAIL_USE_TLS: true
}
