const validateAccess = (req, res, next) => {
    const accessKey = req.headers['access-key'];
    const userName = req.headers['user-name'];
    
    if (!accessKey || !userName) {
        res.send('<h4>Acess Denied!!! \n Access Key Required. Please contact <code>Yekiasabani@gmail.com</code> to get yours.</h4>');
        return;
    }
    if (accessKey != process.env.ACCESS_KEY || userName != process.env.USER_NAME) {
        res.send('<h4>Acess Denied!!! \n Access Key Invalid or it might be expired. Please contact <code>Yekiasabani@gmail.com</code> for helps.</h4>');
        return;
    }
    next();
}

module.exports = validateAccess;