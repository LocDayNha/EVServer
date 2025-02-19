var express = require('express');
var router = express.Router();
var stationModel = require('../../components/station/StationModel');
var portModel = require('../../components/port/PortModel');
var vehicleModel = require('../../components/vehicle/VehicleModel');
const axios = require('axios');

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

//localhost:3000/station/
router.get("/getByisActive", async function (req, res, next) {
    try {
        const { isActive } = req.body;

        if (!isActive) {
            return res.status(400).json({ status: false, message: "Thiếu isActive!" });
        }

        const data = await stationModel.find({ isActive: isActive }).populate([
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

//localhost:3000/station/updateisActive
router.post("/updateisActive", async function (req, res, next) {
    try {
        const { id } = req.body;
        const { isActive } = req.body;

        const itemEdit = await stationModel.findById(id);

        if (itemEdit) {
            itemEdit.isActive = isActive ? isActive : itemEdit.isActive;
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

//localhost:3000/station/testGoogleMapTrack
router.post("/testGoogleMapTrack", async function (req, res) {
    try {
        const { addressStart, addressEnd, lat1, lng1, lat2, lng2 } = req.body;

        let origin, destination;

        if (addressStart) {
            origin = encodeURIComponent(addressStart);
        } else if (lat1 && lng1) {
            origin = `${lat1},${lng1}`;
        } else {
            return res.status(400).json({ status: false, message: "Thiếu dữ liệu điểm xuất phát" });
        }

        if (addressEnd) {
            destination = encodeURIComponent(addressEnd);
        } else if (lat2 && lng2) {
            destination = `${lat2},${lng2}`;
        } else {
            return res.status(400).json({ status: false, message: "Thiếu dữ liệu điểm đến" });
        }

        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;

        return res.status(200).json({
            status: true,
            message: "Thành công",
            url: url
        });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/station/testGoogleMapAddressEncoding
router.post("/testGoogleMapAddressEncoding", async function (req, res) {
    try {
        const { address, lat1, lng1 } = req.body;

        const apiKey = process.env.GOOGLE_MAP_API_KEY;
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}`;
        let response;

        if (address) {
            // Convert address to lat/lng
            response = await axios.get(geocodingUrl, {
                params: { address: address }
            });

            if (response.data.status === 'OK') {
                const { lat, lng } = response.data.results[0].geometry.location;
                return res.status(200).json({
                    status: true,
                    message: "Thành công",
                    lat,
                    lng
                });
            } else {
                return res.status(400).json({ status: false, message: "Không tìm thấy tọa độ cho địa chỉ này!" });
            }
        } else if (lat1 && lng1) {

            const reverseGeocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&latlng=${lat1},${lng1}`;
            response = await axios.get(reverseGeocodingUrl);

            if (response.data.status === 'OK') {
                const address = response.data.results[0].formatted_address;
                return res.status(200).json({
                    status: true,
                    message: "Thành công",
                    address
                });
            } else {
                return res.status(400).json({ status: false, message: "Không tìm thấy địa chỉ cho tọa độ này!" });
            }
        } else {
            return res.status(400).json({ status: false, message: "Vui lòng cung cấp địa chỉ hoặc tọa độ!" });
        }
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

module.exports = router;