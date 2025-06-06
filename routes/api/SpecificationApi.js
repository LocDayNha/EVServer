var express = require('express');
var router = express.Router();
var specificationModel = require("../../components/specification/SpecificationModel");

//localhost:3000/specification/addNew
router.post("/addNew", async function (req, res, next) {
    try {
        const { user_id, vehicle, port_id, kw, slot, price, type } = req.body;

        const currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();

        let timeNow = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let dayNow = `${day}/${month}/${year}`;
        const addNew = { user_id, vehicle, port_id, kw, slot, price, type, createAt: `${dayNow} : ${timeNow}` };

        const newSpecification = await specificationModel.create(addNew);
        const data = await specificationModel
            .findById(newSpecification._id)
            .populate([
                {
                    path: 'vehicle.vehicle_id',
                    model: 'vehicle',
                    select: 'name'
                },
            ])
            .populate("port_id");
        return res.status(200).json({ status: true, message: "Thêm mới thành công", data });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/specification/get
router.get("/get", async function (req, res, next) {
    try {
        const data = await specificationModel.find({ isActive: true }).populate([
            { path: 'user_id', select: '-password' },
            {
                path: 'vehicle.vehicle_id',
                model: 'vehicle',
                select: 'name'
            },
            { path: 'port_id' }
        ]);

        return res.status(200).json({ status: true, message: "Danh sách:", data });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/specification/getById
router.get("/getById", async function (req, res, next) {
    try {
        const { id } = req.body;
        const data = await specificationModel.findOne({ _id: id, isActive: true }).populate([
            { path: 'user_id', select: '-password' },
            {
                path: 'vehicle.vehicle_id',
                model: 'vehicle',
                select: 'name'
            },
            { path: 'port_id' }
        ]);

        if (data) {
            return res.status(200).json({ status: true, message: "Danh sách theo Id:", data });
        } else {
            return res.status(400).json({ status: false, message: "Sai Id" });
        }
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/specification/getByIdUser
router.get("/getByIdUser", async function (req, res, next) {
    try {
        const { user_id } = req.body;
        const data = await specificationModel.find({ user_id: user_id, isActive: true }).populate([
            { path: 'user_id', select: '-password' },
            {
                path: 'vehicle.vehicle_id',
                model: 'vehicle',
                select: 'name'
            },
            { path: 'port_id' }
        ]);

        if (data) {
            return res.status(200).json({ status: true, message: "Danh sách theo Id:", data });
        } else {
            return res.status(400).json({ status: false, message: "Sai Id" });
        }
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/specification/update
router.post("/update", async function (req, res, next) {
    try {
        const { id } = req.body;
        const { vehicle, port_id, kw, slot, price, type } = req.body;

        const itemEdit = await specificationModel.findById(id);

        if (itemEdit) {
            itemEdit.vehicle = vehicle ? vehicle : itemEdit.vehicle;
            itemEdit.port_id = port_id ? port_id : itemEdit.port_id;
            itemEdit.kw = kw ? kw : itemEdit.kw;
            itemEdit.slot = slot ? slot : itemEdit.slot;
            itemEdit.price = price ? price : itemEdit.price;
            itemEdit.type = type ? type : itemEdit.type;
            await itemEdit.save();
            const data = await specificationModel
                .findById(itemEdit._id)
                .populate([
                    {
                        path: 'vehicle.vehicle_id',
                        model: 'vehicle',
                        select: 'name'
                    },
                ])
                .populate("port_id");
            return res.status(200).json({ status: true, message: "Cập nhật thành công", data });
        } else {
            return res.status(400).json({ status: false, message: "Cập nhật thất bại" });
        }

    }
    catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/specification/deleteById
router.delete('/deleteById', async function (req, res, next) {
    try {
        const { id } = req.body;
        await specificationModel.findByIdAndDelete(id);
        return res.status(200).json({ status: true, message: "Xóa thành công" });
    } catch (error) {
        return res.status(500).json({ status: true, message: "Xóa thất bại" });
    }
});

module.exports = router;