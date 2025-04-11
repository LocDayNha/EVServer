var express = require('express');
var router = express.Router();

var servicesModel = require("../../components/services/ServicesModel");
const { validation } = require("../validation/Services");

//localhost:3000/services/addNew
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

        const dataservices = await servicesModel.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });

        if (!dataservices || validation.removeVietnameseTones(dataservices.name) !== normalizedName) {
            await servicesModel.create(addNew);
            return res.status(200).json({ status: true, message: "Thêm mới thành công" });
        } else {
            return res.status(400).json({ status: false, message: "Đã có dữ liệu" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/services/get
router.get("/get", async function (req, res, next) {
    try {
        const data = await servicesModel.find({ isActive: true });

        if (data) {
            return res.status(200).json({ status: true, message: "Dữ liệu:", data });
        } else if (data.length = 0) {
            return res.status(200).json({ status: true, message: "Chưa có dữ liệu" });
        } else {
            return res.status(400).json({ status: false, message: "Lấy dữ liệu thất bại" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/services/getAll
router.get("/getAll", async function (req, res, next) {
    try {
        const data = await servicesModel.find();

        if (data) {
            return res.status(200).json({ status: true, message: "Dữ liệu:", data });
        } else if (data.length = 0) {
            return res.status(200).json({ status: true, message: "Chưa có dữ liệu" });
        } else {
            return res.status(400).json({ status: false, message: "Lấy dữ liệu thất bại" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/services/getbyId
router.get("/getbyId", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await servicesModel.findOne({ _id: id, isActive: true });

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

//localhost:3000/services/update
router.post("/update", [validation.validationAddnew], async function (req, res, next) {
    try {
        const { id, name, image } = req.body;

        const itemEdit = await servicesModel.findById(id);

        const normalizedName = validation.removeVietnameseTones(name);

        const dataServices = await servicesModel.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });

        if (!dataServices || validation.removeVietnameseTones(dataServices.name) !== normalizedName) {
            itemEdit.name = name ? name : itemEdit.name;
            itemEdit.image = image ? image : itemEdit.image;
            await itemEdit.save();
            return res.status(200).json({ status: true, message: "Cập nhật thành công" });
        } else {
            return res.status(400).json({ status: false, message: "Đã có dữ liệu" });
        }

    }
    catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/services/activeUpdate
router.post("/activeUpdate", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await servicesModel.findById(id);

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