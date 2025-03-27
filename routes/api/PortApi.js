var express = require('express');
var router = express.Router();
var portModel = require("../../components/port/PortModel");

//localhost:3000/port/addNew
router.post("/addNew", async function (req, res, next) {
    try {
        const { name, type, image } = req.body;

        const currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();

        let timeNow = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let dayNow = `${day}/${month}/${year}`;
        const addNew = { name, type, image, createAt: `${dayNow} : ${timeNow}` };

        await portModel.create(addNew);
        return res.status(200).json({ status: true, message: "Thêm mới thành công", addNew });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/port/get
router.get("/get", async function (req, res, next) {
    try {
        const data = await portModel.find({ isActive: true });

        // nếu name là ổ điện thì sếp ở trên đầu

        if (data.length > 0) {
            data.sort((a, b) => (a.name === "Ổ điện" ? -1 : b.name === "Ổ điện" ? 1 : 0));
            return res.status(200).json({ status: true, message: "Dữ liệu:", data });
        } else if (!data || data.length === 0) {
            return res.status(200).json({ status: true, message: "Chưa có dữ liệu", data: [] });
        } else {
            return res.status(400).json({ status: false, message: "Lấy dữ liệu thất bại" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/port/getAll
router.get("/getAll", async function (req, res, next) {
    try {
        const data = await portModel.find();

        // nếu name là ổ điện thì sếp ở trên đầu

        if (data.length > 0) {
            data.sort((a, b) => (a.name === "Ổ điện" ? -1 : b.name === "Ổ điện" ? 1 : 0));
            return res.status(200).json({ status: true, message: "Dữ liệu:", data });
        } else if (!data || data.length === 0) {
            return res.status(200).json({ status: true, message: "Chưa có dữ liệu", data: [] });
        } else {
            return res.status(400).json({ status: false, message: "Lấy dữ liệu thất bại" });
        }

    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/port/getbyId
router.get("/getbyId", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await portModel.findOne({ _id: id, isActive: true });

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

//localhost:3000/port/update
router.post("/update", async function (req, res, next) {
    try {
        const { id, name, type, image } = req.body;

        const itemEdit = await portModel.findById(id);

        if (itemEdit) {
            itemEdit.name = name ? name : itemEdit.name;
            itemEdit.type = type ? type : itemEdit.type;
            itemEdit.image = image ? image : itemEdit.image;
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

//localhost:3000/port/activeUpdate
router.post("/activeUpdate", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await portModel.findById(id);

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