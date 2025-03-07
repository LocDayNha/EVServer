var express = require('express');
var router = express.Router();
var carModel = require("../../components/car/CarModel");

//localhost:3000/car/addNew
router.post("/addNew", async function (req, res, next) {
    try {
        const { brand_id, name } = req.body;

        const currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();

        let timeNow = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let dayNow = `${day}/${month}/${year}`;
        const addNew = { brand_id, name, createAt: `${dayNow} : ${timeNow}` };

        await carModel.create(addNew);
        return res.status(200).json({ status: true, message: "Thêm mới thành công", addNew });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/car/get
router.get("/get", async function (req, res, next) {
    try {
        const data = await carModel.find({ isActive: true }).populate('brand_id');

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

//localhost:3000/car/getbyId
router.post("/getbyId", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await carModel.findOne({ _id: id, isActive: true }).populate('brand_id');

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

//localhost:3000/car/getbyIdBrand
router.post("/getbyIdBrand", async function (req, res, next) {
    try {
        const { brand_id } = req.body;

        const data = await carModel.find({ brand_id: brand_id, isActive: true }).populate('brand_id');

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

//localhost:3000/car/update
router.post("/update", async function (req, res, next) {
    try {
        const { id, name } = req.body;

        const itemEdit = await carModel.findById(id);

        if (itemEdit) {
            itemEdit.name = name ? name : itemEdit.name;
            await itemEdit.save();
            return res.status(200).json({ status: true, message: "Cập nhật thành công" });
        } else {
            return res.status(400).json({ status: false, message: "Cập nhật thất bại" });
        }

    }
    catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/car/activeUpdate
router.post("/activeUpdate", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await carModel.findById(id);

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