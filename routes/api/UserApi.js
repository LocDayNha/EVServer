var express = require('express');
var router = express.Router();
var userModel = require("../../components/user/UserModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
var sendMail = require("../util/mail");

const { validation } = require("../validation/User");

//localhost:3000/user/register
router.post("/register", [validation.validationRegister], async function (req, res, next) {
    try {
        const { email, password } = req.body;

        const userMail = await userModel.findOne({ email: email });
        if (userMail) {
            console.log("Email đã được đăng ký");
            return res.status(400).json({ result: false, message: "Email đã được đăng ký" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();

        let timeNow = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let dayNow = `${day}/${month}/${year}`;

        const register = { email, password: hash, createAt: `${dayNow} : ${timeNow}`, isVerified: false };
        const user = new userModel(register);
        await user.save();
        return res.status(200).json({ status: true, message: "Đăng ký thành công" });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/user/login
router.post("/login", [validation.validationLogin], async function (req, res, next) {
    try {
        const { email, password } = req.body;

        const userMail = await userModel.findOne({ email: email });

        if (!userMail) {
            return res.status(400).json({ status: false, message: "Email chưa được đăng ký" });
        } else {
            const result = bcrypt.compareSync(password, userMail.password);

            if (result) {
                const { password, ...newUser } = userMail._doc;
                const token = JWT.sign({ newUser }, "LOCDAYNHA", {
                    expiresIn: "1h",
                });
                const returnData = {
                    error: false,
                    responseTimestamp: new Date(),
                    statusCode: 200,
                    data: {
                        token: token,
                        user: newUser,
                    },
                };
                return res.status(200).json({ status: true, message: "Đăng nhập thành công", returnData });
            } else {
                return res.status(400).json({ status: false, message: "Sai email hoặc mật khẩu" });
            }
        }
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/user/sent-code
router.post("/sent-code", async function (req, res, next) {
    try {
        const { email } = req.body;

        const verifyCode = Math.floor(1000 + Math.random() * 9000);

        try {
            const subject = "Mã xác thực EV Application";
            const content = `
              <div
                  style="font-family: Arial, sans-serif;background-color: #fff;padding: 20px;border-radius: 10px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);max-width: 600px;width: 50%;">
                  <div class="email-content">
                      <h1 style="color: #333;
                  text-align: center;
                  font-size: 24px;">Mã Xác Minh</h1>
                      <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 20px 0; text-align: center;">
                          Nhập mã này trên màn hình để xác minh danh tính:</p>
                      <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 20px 0; text-align: center; display: block;
                  background-color: #f0f0f0;font-size: 32px;font-weight: bold;text-align: center;padding: 10px;margin: 20px auto;width: 150px;border-radius: 8px;letter-spacing: 5px;">
                          ${verifyCode}</p>
                      <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 20px 0; text-align: center;">
                          Mã này sẽ hết hạn trong thời gian ngắn. Hãy sử dụng nó sớm.</p>
                  </div>
              </div>
                  `;

            const mailOptions = {
                from: "EV Application <phoenixrestaurant13@gmail.com>", // Người gửi
                to: email, // Người nhận
                subject: subject, // Tiêu đề
                html: content, // Nội dung HTML
            };

            await sendMail.transporter.sendMail(mailOptions);
            return res.status(200).json({ status: true, message: "Gửi mã xác minh thành công", verifyCode });
        } catch (err) {
            return res.status(400).json({ status: false, message: "Gửi mail thất bại" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/user/verify
router.post("/verify", async function (req, res, next) {
    try {
        const { codeInput, codeResult, email } = req.body;

        const user = await userModel.findOne({ email: email });

        if (codeInput === codeResult) {
            user.isVerified = true;
            await user.save();
            return res.status(200).json({ status: true, message: "Xác minh thành công" });
        } else {
            return res.status(400).json({ status: true, message: "Xác minh thất bại" });
        }
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/user/forgotpass
router.post("/forgotpass", [validation.validationForgot], async function (req, res, next) {
    try {
        const { email, password, password2 } = req.body;

        const userMail = await userModel.findOne({ email: email });

        if (password === password2) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            userMail.password = hash;
            await userMail.save();
            return res.status(200).json({ status: true, message: "Cập nhật thành công" });
        } else {
            return res.status(400).json({ status: true, message: "Cập nhật thất bại" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/user/getInforUser
router.get("/getInforUser", async function (req, res, next) {
    try {
        const { id } = req.body;
        const user = await userModel.findById(id);
        return res.status(200).json({ status: true, message: "Thông tin người dùng", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/user/updateInforUser
router.post("/updateInforUser", [validation.validationUpdateProfile], async function (req, res, next) {
    try {
        const { id } = req.body;
        const user = await userModel.findById(id);

        const { name, address, phoneNumber, gender, birth, image } = req.body;

        if (user) {
            user.name = name ? name : user.name;
            user.address = address ? address : user.address;
            user.phoneNumber = phoneNumber ? phoneNumber : user.phoneNumber;
            user.gender = gender ? gender : user.gender;
            user.birth = birth ? birth : user.birth;
            user.image = image ? image : user.image;

            await user.save();

            return res.status(200).json({ status: true, message: "Cập nhật thành công", user });
        } else {
            return res.status(400).json({ status: false, message: "Cập nhật thất bại" });
        }
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/user/test
router.post("/test", async function (req, res, next) {
    try {
        const currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();

        let timeNow = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let dayNow = `${day}/${month}/${year}`;

        // let createAt = `${dayNow} : ${timeNow}`;

        return res.status(200).json({ status: true, message: "Đăng ký thành công", timeNow, dayNow, createAt: `${dayNow} : ${timeNow}` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Loi he thong" });
    }
});


module.exports = router;