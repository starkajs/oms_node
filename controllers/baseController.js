exports.myMiddleware = (req, res, next) => {
    req.name = 'Andrew';
    next();
}

exports.homePage = (req, res) => {
    res.render('base', {
        title: 'Optimum Management System'
    });
}