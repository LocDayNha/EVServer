var express = require('express');
var router = express.Router();
var ratingModel = require("../../components/rating/RatingModel");

//localhost:3000/rating/addNew
router.post("/addNew", async function (req, res, next) {
    try {
        const { user_id, station_id, content, star } = req.body;

        const currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();

        let timeNow = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let dayNow = `${day}/${month}/${year}`;
        const addNew = { user_id, station_id, content, star, createAt: `${dayNow} : ${timeNow}` };

        await ratingModel.create(addNew);
        return res.status(200).json({ status: true, message: "Thêm mới thành công", addNew });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/rating/getByIdStation
router.post("/getByIdStation", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await ratingModel.find({ station_id: id, isActive: true }).populate([{ path: 'user_id', select: 'name image' }]);

        return res.status(200).json({ status: true, message: "Danh sách:", data });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/rating/update
router.post("/update", async function (req, res, next) {
    try {
        const { id } = req.body;
        const { content } = req.body;

        const itemEdit = await ratingModel.findById(id);

        if (itemEdit) {
            itemEdit.content = content ? content : itemEdit.content;
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

//localhost:3000/rating/activeUpdate
router.post("/activeUpdate", async function (req, res, next) {
    try {
        const { id } = req.body;

        const data = await ratingModel.findById(id);

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