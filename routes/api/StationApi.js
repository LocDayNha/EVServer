require("dotenv").config();
var express = require('express');
var router = express.Router();
var stationModel = require('../../components/station/StationModel');
var portModel = require('../../components/port/PortModel');
var vehicleModel = require('../../components/vehicle/VehicleModel');
const axios = require('axios');

function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

//localhost:3000/station/addNew
router.post("/addNew", async function (req, res, next) {
    try {
        const { user_id, brand_id, specification, service, brandcar, image, name, location, address, access, lat, lng, time, note } = req.body;

        const currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();

        let timeNow = currentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let dayNow = `${day}/${month}/${year}`;
        const addNew = { user_id, brand_id, specification, service, brandcar, image, name, location, address, access, lat, lng, time, note, createAt: `${dayNow} : ${timeNow}` };

        await stationModel.create(addNew);
        return res.status(200).json({ status: true, message: "Thêm mới thành công", addNew });
    } catch (error) {
        console.log("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống !" });
    }
});

//localhost:3000/station/get
router.get("/get", async function (req, res, next) {
    try {
        const data = await stationModel.find({ isActive: 2 }).populate([
            { path: 'user_id', select: 'name image address' },
            { path: 'brand_id', select: 'name image' },
            { path: 'address', select: 'name image' },
            {
                path: 'specification.specification_id',
                model: 'specification',
                populate: [
                    { path: 'vehicle.vehicle_id', model: 'vehicle', select: 'name' },
                    { path: 'port_id', model: 'port', select: 'name type image' }
                ]
            },
            {
                path: 'service.service_id',
                model: 'service',
                select: 'name image'
            },
            {
                path: 'brandcar.brandcar_id',
                model: 'brandcar',
                select: 'name image'
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

//localhost:3000/station/getByActive
router.post("/getByActive", async function (req, res, next) {
    try {
        const { isActive } = req.body;

        const data = await stationModel.find({ isActive: isActive }).populate([
            { path: 'user_id', select: 'name image address' },
            { path: 'brand_id', select: 'name image' },
            { path: 'address', select: 'name image' },
            {
                path: 'specification.specification_id',
                model: 'specification',
                populate: [
                    { path: 'vehicle.vehicle_id', model: 'vehicle', select: 'name' },
                    { path: 'port_id', model: 'port', select: 'name type image' }
                ]
            },
            {
                path: 'service.service_id',
                model: 'service',
                select: 'name image'
            },
            {
                path: 'brandcar.brandcar_id',
                model: 'brandcar',
                select: 'name image'
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

//localhost:3000/station/getByIdUser
router.post("/getByIdUser", async function (req, res, next) {
    try {
        const { user_id, isActive } = req.body;

        if (!user_id || !isActive) {
            return res.status(400).json({ status: false, message: "Thiếu dữ liệu" });
        }

        const data = await stationModel.find({ user_id: user_id, isActive: isActive }).populate([
            { path: 'user_id', select: 'name image address' },
            { path: 'brand_id', select: 'name image' },
            { path: 'address', select: 'name image' },
            {
                path: 'specification.specification_id',
                model: 'specification',
                populate: [
                    { path: 'vehicle.vehicle_id', model: 'vehicle', select: 'name' },
                    { path: 'port_id', model: 'port', select: 'name type image' }
                ]
            },
            {
                path: 'service.service_id',
                model: 'service',
                select: 'name'
            },
            {
                path: 'brandcar.brandcar_id',
                model: 'brandcar',
                select: 'name image'
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

//localhost:3000/station/getByNearStaion
router.post("/getByNearStaion", async function (req, res, next) {
    try {
        const { myLat, myLng } = req.body;
        const apiKey = process.env.GOOGLE_MAP_API_KEY;

        const dataRespon = await stationModel.find({ isActive: 2 }).populate([
            { path: 'user_id', select: 'name image address' },
            { path: 'brand_id', select: 'name image' },
            { path: 'address', select: 'name image' },
            {
                path: 'specification.specification_id',
                model: 'specification',
                populate: [
                    { path: 'vehicle.vehicle_id', model: 'vehicle', select: 'name' },
                    { path: 'port_id', model: 'port', select: 'name type image' }
                ]
            },
            {
                path: 'service.service_id',
                model: 'service',
                select: 'name'
            },
            {
                path: 'brandcar.brandcar_id',
                model: 'brandcar',
                select: 'name image'
            }
        ]);

        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }

        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            const R = 6371;
            const dLat = deg2rad(lat2 - lat1);
            const dLon = deg2rad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            return distance;
        }

        const nearbyStations = dataRespon.filter(station => {
            const stationLat = station.lat;
            const stationLng = station.lng;
            const distance = getDistanceFromLatLonInKm(myLat, myLng, stationLat, stationLng);
            station.distance = distance;
            return distance <= 5;
        });

        return res.status(200).json({ status: true, message: "Dữ liệu:", data: nearbyStations });
    } catch (error) {
        console.error("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
});

//localhost:3000/station/getByAddress
router.post("/getByAddress", async function (req, res, next) {
    try {
        const { address } = req.body;
        const apiKey = process.env.GOOGLE_MAP_API_KEY;

        const dataRespon = await stationModel.find({ isActive: 2 }).populate([
            { path: 'user_id', select: 'name image address' },
            { path: 'brand_id', select: 'name image' },
            { path: 'address', select: 'name image' },
            {
                path: 'specification.specification_id',
                model: 'specification',
                populate: [
                    { path: 'vehicle.vehicle_id', model: 'vehicle', select: 'name' },
                    { path: 'port_id', model: 'port', select: 'name type image' }
                ]
            },
            {
                path: 'service.service_id',
                model: 'service',
                select: 'name'
            },
            {
                path: 'brandcar.brandcar_id',
                model: 'brandcar',
                select: 'name image'
            }
        ]);

        const normalizedInput = normalizeString(address);

        const filteredStations = dataRespon.filter(station => {
            const normalizedLocation = normalizeString(station.location);
            return normalizedLocation.includes(normalizedInput);
        });

        return res.status(200).json({ status: true, message: "Danh sách:", filteredStations });

    } catch (error) {
        console.error("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
});

//localhost:3000/station/getByOption
router.post("/getByOption", async function (req, res, next) {
    try {
        const { vehicle, brand, electric, port, output } = req.body;
        // vehicle: "Tất cả" hoặc "Xe máy điện" hoặc "Ô tô điện"
        // brand: "Tất cả" hoặc tên hãng cụ thể (Vinfast, Pega, KIA, MG, …)
        // electric: "Tất cả" hoặc "AC" hoặc "DC"
        // port: "Tất cả" hoặc một chuỗi hoặc mảng, ví dụ "J1772" hoặc ["J1772", "CCS1"]
        // output: "Tất cả" hoặc "Sạc thường" (1-19), "Sạc nhanh" (20-49), "Sạc siêu nhanh" (50-350)

        const apiKey = process.env.GOOGLE_MAP_API_KEY;

        const dataRespon = await stationModel.find({ isActive: 2 }).populate([
            { path: 'user_id', select: 'name image address' },
            { path: 'brand_id', select: 'name image' },
            { path: 'address', select: 'name image' },
            {
                path: 'specification.specification_id',
                model: 'specification',
                populate: [
                    { path: 'vehicle.vehicle_id', model: 'vehicle', select: 'name' },
                    { path: 'port_id', model: 'port', select: 'name type image' }
                ]
            },
            {
                path: 'service.service_id',
                model: 'service',
                select: 'name'
            },
            {
                path: 'brandcar.brandcar_id',
                model: 'brandcar',
                select: 'name image'
            }
        ]);

        const filteredStations = dataRespon.filter(station => {
            if (brand && brand !== "Tất cả") {
                if (!station.brand_id || station.brand_id.name !== brand) {
                    return false;
                }
            }

            const matchedSpecs = station.specification.filter(spec => {
                const specData = spec.specification_id;
                if (!specData) return false;

                if (vehicle && vehicle !== "Tất cả") {
                    if (!specData.vehicle_id || specData.vehicle_id.name !== vehicle) {
                        return false;
                    }
                }

                if (electric && electric !== "Tất cả") {
                    if (!specData.port_id || specData.port_id.type !== electric) {
                        return false;
                    }
                }

                if (port && port !== "Tất cả" && port.length > 0) {
                    if (Array.isArray(port)) {
                        if (!specData.port_id || !port.includes(specData.port_id.name)) {
                            return false;
                        }
                    } else {
                        if (!specData.port_id || specData.port_id.name !== port) {
                            return false;
                        }
                    }
                }

                if (output && output !== "Tất cả") {
                    const kw = specData.kw;
                    if (output === "Sạc thường" && (kw < 1 || kw > 19)) {
                        return false;
                    }
                    if (output === "Sạc nhanh" && (kw < 20 || kw > 49)) {
                        return false;
                    }
                    if (output === "Sạc siêu nhanh" && (kw < 50 || kw > 350)) {
                        return false;
                    }
                }

                return true;
            });


            return matchedSpecs.length > 0;
        });

        return res.status(200).json({ status: true, message: "Dữ liệu:", data: filteredStations });
    } catch (error) {
        console.error("error:", error);
        return res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
});

// Hàm tính khoảng cách giữa hai tọa độ (Haversine formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Hàm kiểm tra trạm sạc có nằm gần tuyến đường không
function isStationOnRoute(station, route, maxDistance = 2) {
    return route.some(point => getDistanceFromLatLonInKm(point.lat, point.lng, station.lat, station.lng) <= maxDistance);
}

// Lọc các trạm sạc nằm trong phạm vi nhất định từ tuyến đường
function filterStationsNearRoute(stations, route, maxDistance = 2) {
    return stations.filter(station => isStationOnRoute(station, route, maxDistance));
}

// API tìm trạm sạc theo tuyến đường
router.post("/getByTravel", async (req, res) => {
    try {
        const { outputEV, myLat, myLng, toLat, toLng } = req.body;

        if (!myLat || !myLng || !toLat || !toLng || !outputEV || outputEV <= 0) {
            return res.status(400).json({ status: false, message: "Thiếu thông tin đầu vào hoặc outputEV không hợp lệ!" });
        }

        let origin = `${myLng},${myLat}`;
        let destination = `${toLng},${toLat}`;
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=geojson`;

        const [directionsResponse, stations] = await Promise.all([
            axios.get(osrmUrl),
            stationModel.find({ isActive: 2 }).populate([
                { path: 'user_id', select: 'name image address' },
                { path: 'brand_id', select: 'name image' },
                { path: 'address', select: 'name image' },
                {
                    path: 'specification.specification_id',
                    model: 'specification',
                    populate: [
                        { path: 'vehicle.vehicle_id', model: 'vehicle', select: 'name' },
                        { path: 'port_id', model: 'port', select: 'name type image' }
                    ]
                },
                {
                    path: 'service.service_id',
                    model: 'service',
                    select: 'name'
                },
                {
                    path: 'brandcar.brandcar_id',
                    model: 'brandcar',
                    select: 'name image'
                }
            ])
        ]);

        if (!directionsResponse.data.routes.length) {
            return res.status(400).json({ status: false, message: "Không tìm thấy tuyến đường!" });
        }

        const route = directionsResponse.data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));

        console.log("Tổng số trạm sạc trong DB:", stations.length);

        // Lọc trước các trạm sạc gần tuyến đường để giảm số lần tính toán
        let nearbyStations = filterStationsNearRoute(stations, route);

        console.log("Số trạm gần tuyến đường:", nearbyStations.length);

        // Chia trạm sạc theo từng chặng
        const filteredStations = [];
        for (let i = 1; i <= stations.length; i++) {
            const minDistance = outputEV * i - 5;
            const maxDistance = outputEV * i + 5;

            const stationsInRange = nearbyStations.filter(station => {
                const distanceFromStart = getDistanceFromLatLonInKm(myLat, myLng, station.lat, station.lng);
                return distanceFromStart >= minDistance && distanceFromStart <= maxDistance;
            });

            if (stationsInRange.length > 0) {
                // Ưu tiên trạm có công suất cao hơn hoặc trạm gần nhất
                stationsInRange.sort((a, b) => {
                    return getDistanceFromLatLonInKm(myLat, myLng, a.lat, a.lng) - getDistanceFromLatLonInKm(myLat, myLng, b.lat, b.lng);
                });
                filteredStations.push(stationsInRange[0]);
            }
        }

        console.log("Số trạm sau khi lọc:", filteredStations.length);

        res.status(200).json({
            status: true,
            message: "Danh sách trạm sạc trong phạm vi xe có thể di chuyển:",
            data: filteredStations
        });
    } catch (error) {
        console.error("Lỗi hệ thống:", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
});

//localhost:3000/station/getById
router.post("/getById", async function (req, res, next) {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, message: "Thiếu id!" });
        }

        const data = await stationModel.findById(id).populate([
            { path: 'user_id', select: 'name image address' },
            { path: 'brand_id', select: 'name image' },
            { path: 'address', select: 'name image' },
            {
                path: 'specification.specification_id',
                model: 'specification',
                populate: [
                    { path: 'vehicle.vehicle_id', model: 'vehicle', select: 'name' },
                    { path: 'port_id', model: 'port', select: 'name type image' }
                ]
            },
            {
                path: 'service.service_id',
                model: 'service',
                select: 'name image'
            },
            {
                path: 'brandcar.brandcar_id',
                model: 'brandcar',
                select: 'name image'
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
        const { brand_id, specification, service, brandcar, image, name, location, address, access, lat, lng, time, note } = req.body;

        const itemEdit = await stationModel.findById(id);

        if (itemEdit) {
            itemEdit.brand_id = brand_id ? brand_id : itemEdit.brand_id;
            itemEdit.specification = specification ? specification : itemEdit.specification;
            itemEdit.service = service ? service : itemEdit.service;
            itemEdit.brandcar = brandcar ? brandcar : itemEdit.brandcar;
            itemEdit.image = image ? image : itemEdit.image;
            itemEdit.name = name ? name : itemEdit.name;
            itemEdit.location = location ? location : itemEdit.location;
            itemEdit.address = address ? address : itemEdit.address;
            itemEdit.access = access ? access : itemEdit.access;
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

//localhost:3000/station/update2
router.post("/update2", async function (req, res, next) {
    try {
        const { id } = req.body;
        const { specification } = req.body;

        const itemEdit = await stationModel.findById(id);

        if (itemEdit) {

            itemEdit.specification = specification ? specification : itemEdit.specification;

            await itemEdit.save();
            return res.status(200).json({ status: true, message: "Cập nhật thành công", itemEdit });
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