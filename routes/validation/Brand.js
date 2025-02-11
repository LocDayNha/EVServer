const validationAddnew = async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ status: false, message: "Trống dữ liệu" });
    }

    if (/^\s|\s$/.test(name) || name.trim().length <= 0) {
        return res.status(400).json({ status: false, message: "Dữ liệu không hợp lệ" });
    }

    name = name.replace(/\s+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂễỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪửữựỳỵỷỹ]+$/u;
    if (!nameRegex.test(name)) {
        return res.status(400).json({ status: false, message: "Nhập chữ cái" });
    }

    return next();
};

const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
};

module.exports = {
    validation: {
        validationAddnew,
        removeVietnameseTones
    }
};