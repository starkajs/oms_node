module.exports = {
    GOOGLE_CLIENT_ID: '355438076650-aqg10n5enooqup3o2akg24mctq47ai99.apps.googleusercontent.com',
	GOOGLE_CLIENT_SECRET: 'Nqvva_P6UETX05wVGvDjXdpP',
	//GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	//GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AZURE_CLIENT_ID: '5381c92d-a996-4164-b866-dfde24e9a5e3',
    AZURE_CLIENT_SECRET: 'yoWnq44wGZkl4pcmHvo6V7GDi+nn/1p2hFRfUzYu6ZU=',
    AZURE_TENANT: 'ebfb652e-f609-41e9-8382-b6dc6cf94590',
    AZURE_RESOURCE: 'https://graph.windows.net',
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
	cookieKey: 'asdflkdajsfladsjfldaksjfdsa',
	cookieSecret: 'asdflkdajsfladsjfldaksjfdsa'
}
