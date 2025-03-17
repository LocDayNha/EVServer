var express = require('express');
var router = express.Router();
var brandModel = require("../../components/brand/BrandModel");
const { validation } = require("../validation/Brand");

//localhost:3000/brand/addNew
router.post("/addNew", [validation.validationAddnew], async function (req, res, next) {
    try {
        const { name, image } = req.body;

        const currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();

        let timeNow = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let dayNow = `${day}/${month}/${year}`;
        const addNew = { name, image, createAt: `${dayNow} : ${timeNow}` };

        const normalizedName = validation.removeVietnameseTones(name);

        const dataBrand = await brandModel.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });

        if (!dataBrand || validation.removeVietnameseTones(dataBrand.name) !== normalizedName) {
            await brandModel.create(addNew);
            return res.status(200).json({ status: true, message: "Thêm mới thành công" });
        } else {
            return res.status(400).json({ status: false, message: "Đã có dữ liệu" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/brand/get
router.get("/get", async function (req, res, next) {
    try {
        const data = await brandModel.find({ isActive: true });

        if (data.length > 0) {
            data.sort((a, b) => (a.name === "Không" ? -1 : b.name === "Không" ? 1 : 0));
            return res.status(200).json({ status: true, message: "Dữ liệu:", data });
        } else if (!data || data.length === 0) {
            return res.status(200).json({ status: true, message: "Chưa có dữ liệu" });
        } else {
            return res.status(400).json({ status: false, message: "Lấy dữ liệu thất bại" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/brand/getbyId
router.get("/getbyId", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await brandModel.findOne({ _id: id, isActive: true });

        if (data) {
            return res.status(200).json({ status: true, message: "Dữ liệu:", data });
        } else {
            return res.status(400).json({ status: false, message: "Lấy dữ liệu thất bại" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/brand/update
router.post("/update", [validation.validationAddnew], async function (req, res, next) {
    try {
        const { id, name } = req.body;

        const itemEdit = await brandModel.findById(id);
        if (itemEdit) {
            itemEdit.name = name ? name : itemEdit.name;

            const normalizedName = validation.removeVietnameseTones(name);

            const dataBrand = await brandModel.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });

            if (!dataBrand || validation.removeVietnameseTones(dataBrand.name) !== normalizedName) {
                await itemEdit.save();
                return res.status(200).json({ status: true, message: "Cập nhật thành công" });
            } else {
                return res.status(400).json({ status: false, message: "Đã có dữ liệu" });
            }

        } else {
            return res.status(400).json({ "status": false, "message": "Cập nhật thất bại" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/brand/activeUpdate
router.post("/activeUpdate", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await brandModel.findById(id);

        if (data) {
            data.isActive = !data.isActive;
            await data.save();

            return res.status(200).json({
                status: true,
                message: data.isActive ? "Bật hoạt động" : "Tắt hoạt động",
                data
            });
        } else {
            return res.status(400).json({ status: false, message: "Không đúng Id" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

module.exports = router;