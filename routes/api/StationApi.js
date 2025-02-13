var express = require('express');
var router = express.Router();
var stationModel = require('../../components/station/StationModel');
var portModel = require('../../components/port/PortModel');
var vehicleModel = require('../../components/vehicle/VehicleModel');

//localhost:3000/station/addNew
router.post("/addNew", async function (req, res, next) {
    try {
        const { user_id, brand_id, specification, service, name, location, lat, lng, time, note } = req.body;

        const currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();

        let timeNow = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let dayNow = `${day}/${month}/${year}`;
        const addNew = { user_id, brand_id, specification, service, name, location, lat, lng, time, note, createAt: `${dayNow} : ${timeNow}` };

        await stationModel.create(addNew);
        return res.status(200).json({ status: true, message: "Thêm mới thành công", addNew });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/station/getByIdUser
router.get("/getByIdUser", async function (req, res, next) {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ status: false, message: "Thiếu user_id!" });
        }

        const data = await stationModel.find({ user_id: user_id }).populate([
            { path: 'user_id', select: 'name image address' },
            { path: 'brand_id', select: 'name' },
            {
                path: 'specification.specification_id',
                model: 'specification',
                populate: [
                    { path: 'vehicle_id', model: 'vehicle', select: 'name' },
                    { path: 'port_id', model: 'port', select: 'name type image' }
                ]
            },
            {
                path: 'service.service_id',
                model: 'service',
                select: 'name'
            }
        ]);

        if (data) {
            return res.status(200).json({ status: true, message: "Danh sách:", data });
        } else {
            return res.status(404).json({ status: false, message: "Không tìm thấy dữ liệu!" });
        }

    } catch (error) {
        console.error("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
});

//localhost:3000/station/getById
router.get("/getById", async function (req, res, next) {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, message: "Thiếu user_id!" });
        }

        const data = await stationModel.findById(id).populate([
            { path: 'user_id', select: 'name image address' },
            { path: 'brand_id', select: 'name' },
            {
                path: 'specification.specification_id',
                model: 'specification',
                populate: [
                    { path: 'vehicle_id', model: 'vehicle', select: 'name' },
                    { path: 'port_id', model: 'port', select: 'name type image' }
                ]
            },
            {
                path: 'service.service_id',
                model: 'service',
                select: 'name'
            }
        ]);

        if (data) {
            return res.status(200).json({ status: true, message: "Danh sách:", data });
        } else {
            return res.status(404).json({ status: false, message: "Không tìm thấy dữ liệu!" });
        }

    } catch (error) {
        console.error("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
});

//localhost:3000/station/update
router.post("/update", async function (req, res, next) {
    try {
        const { id } = req.body;
        const { brand_id, name, location, lat, lng, time, note } = req.body;

        const itemEdit = await stationModel.findById(id);

        if (itemEdit) {
            itemEdit.brand_id = brand_id ? brand_id : itemEdit.brand_id;
            itemEdit.name = name ? name : itemEdit.name;
            itemEdit.location = location ? location : itemEdit.location;
            itemEdit.lat = lat ? lat : itemEdit.lat;
            itemEdit.lng = lng ? lng : itemEdit.lng;
            itemEdit.time = time ? time : itemEdit.time;
            itemEdit.note = note ? note : itemEdit.note;

// thực hiện thay đổi thông tin dịch vụ

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

//localhost:3000/station/testGoogleMap
router.post("/testGoogleMap", async function (req, res, next) {
    try {
        const { lat1, lng1, lat2, lng2 } = req.body;

        if (!lat1 || !lng1 || !lat2 || !lng2) {
            return res.status(400).json({ status: false, message: "All coordinates (lat1, lng1, lat2, lng2) are required." });
        }
        // Klm
        const getDistanceInKm = (lat1, lng1, lat2, lng2) => {
            const toRad = (value) => (value * Math.PI) / 180;
            const R = 6371;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        let distanceInKm = getDistanceInKm(lat1, lng1, lat2, lng2);
        distanceInKm = Math.round(distanceInKm * 10) / 10;

        const googleMapsLocation = `https://www.google.com/maps?q=${lat1},${lng1}`;
        const googleMapsTrack = `https://www.google.com/maps/dir/${lat1},${lng1}/${lat2},${lng2}`;
        return res.status(200).json({ status: true, googleMapsTrack, distanceInKm });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

module.exports = router;