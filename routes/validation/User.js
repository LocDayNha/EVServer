const validationRegister = async (req, res, next) => {
    const { email, password, password2 } = req.body;

    if (!email || !password || !password2) {
        return res.status(400).json({ result: false, message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ result: false, message: 'Email không hợp lệ' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            result: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm cả chữ cái in hoa, chữ cái thường và số'
        });
    }

    if (password !== password2) {
        return res.status(400).json({ result: false, message: 'Mật khẩu và xác nhận mật khẩu không khớp' });
    }

    return next();
};

const validationLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ result: false, message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ result: false, message: 'Email không hợp lệ' });
    }

    return next();
};

const validationForgot = async (req, res, next) => {
    const { password, password2 } = req.body;

    if (!password || !password2) {
        return res.status(400).json({ result: false, message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            result: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm cả chữ cái in hoa, chữ cái thường và số'
        });
    }

    if (password !== password2) {
        return res.status(400).json({ result: false, message: 'Mật khẩu và xác nhận mật khẩu không khớp' });
    }

    return next();
};

const validationUpdateProfile = async (req, res, next) => {
    const { name, phoneNumber, image } = req.body;

    const nameRegex = /^[\p{L}\s]{5,}$/u;
    const phoneNumberRegex = /^(\+84|84|0)[35789][0-9]{8}$/;

    if (!name && !phoneNumber && !image) {
        return res.status(400).json({ result: false, message: 'Vui lòng nhập thông tin' });
    } else if (name) {
        if (!nameRegex.test(name)) {
            return res.status(400).json({ result: false, message: 'Tên phải có ít nhất 5 ký tự và không chứa ký tự đặc biệt' });
        }
    } else if (phoneNumber) {
        if (!phoneNumberRegex.test(phoneNumber)) {
            return res.status(400).json({ result: false, message: 'Số điện thoại không hợp lệ' });
        }
    }

    return next();
};

module.exports = {
    validation: {
        validationRegister,
        validationLogin,
        validationForgot,
        validationUpdateProfile
    }
};