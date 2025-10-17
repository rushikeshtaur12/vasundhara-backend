import Brand from '../models/Brand.js';
import Vehicle from '../models/Vehicle.js';
import fs from 'fs';

// Helper to delete image
const deleteImage = (filePath) => {
  if (!filePath) return;
  const fullPath = `./uploads/${filePath}`; // make sure path points to uploads folder
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

// ------------------------- CREATE BRAND + VEHICLES -------------------------
export const createBrand = async (req, res) => {
  try {
    const { name, year, is_exist, country, vehicles } = req.body;

    const brandFile = req.files.find(f => f.fieldname === 'brandImage');

    const brand = new Brand({
      name,
      year,
      is_exist,
      country,
      image: brandFile ? brandFile.filename : null
    });
    await brand.save();

    //  Handle vehicles dynamically
    let vehiclesData = [];
    if (vehicles) {
      const parsedVehicles = JSON.parse(vehicles);

      for (let v of parsedVehicles) {
        const vehicleFile = req.files.find(f => f.fieldname === `vehicleImage_${v.tempId}`);

        const vehicle = new Vehicle({
          brandId: brand._id,
          name: v.name,
          color: v.color,
          price: v.price,
          image: vehicleFile ? vehicleFile.filename : null
        });

        await vehicle.save();
        vehiclesData.push(vehicle);
        console.log(req.files)
      }
    }

    res.status(201).json({ brand, vehicles: vehiclesData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ------------------------- GET ALL BRANDS + VEHICLES -------------------------
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().lean();
    const vehicles = await Vehicle.find().lean();
    const data = brands.map(b => ({
      ...b,
      vehicles: vehicles.filter(v => v.brandId.toString() === b._id.toString())
    }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ------------------------- UPDATE BRAND + VEHICLES -------------------------
export const updateBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { name, year, is_exist, country, vehicles } = req.body;

    //  Find brand
    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    // Update brand fields if provided
    if (name !== undefined) brand.name = name;
    if (year !== undefined) brand.year = Number(year);
    if (is_exist !== undefined) brand.is_exist = is_exist === 'true' || is_exist === true;
    if (country !== undefined) brand.country = country;

    // Update brand image if provided
    const brandFile = req.files.find(f => f.fieldname === 'brandImage');
    if (brandFile) {
      if (brand.image) deleteImage(brand.image);
      brand.image = brandFile.filename;
    }
    await brand.save();

    // Update or create vehicles
    if (vehicles) {
      const parsedVehicles = JSON.parse(vehicles);

      for (let v of parsedVehicles) {
        const vehicleFile = req.files.find(f => f.fieldname === `vehicleImage_${v.tempId}`);

        if (v.id) {
          // Update existing vehicle
          const vehicle = await Vehicle.findById(v.id);
          if (!vehicle) continue;

          if (v.name !== undefined) vehicle.name = v.name;
          if (v.price !== undefined) vehicle.price = Number(v.price);
          if (v.color !== undefined) vehicle.color = Array.isArray(v.color) ? v.color : JSON.parse(v.color);

          if (vehicleFile) {
            if (vehicle.image) deleteImage(vehicle.image);
            vehicle.image = vehicleFile.filename;
          }

          await vehicle.save();
        } else {
          // Create new vehicle
          const newVehicle = new Vehicle({
            brandId: brand._id,
            name: v.name,
            price: Number(v.price),
            color: Array.isArray(v.color) ? v.color : JSON.parse(v.color || "[]"),
            image: vehicleFile ? vehicleFile.filename : null
          });

          await newVehicle.save();
        }
      }
    }

    // Delete vehicles if requested
    if (req.body.vehiclesToDelete) {
      let vehiclesToDelete = [];
      try {
        vehiclesToDelete = JSON.parse(req.body.vehiclesToDelete);
      } catch (err) {
        console.warn("vehiclesToDelete parse error:", err);
      }

      for (let vId of vehiclesToDelete) {
        const vehicle = await Vehicle.findById(vId);
        if (vehicle) {
          if (vehicle.image) deleteImage(vehicle.image);
          await Vehicle.deleteOne({ _id: vehicle._id });
        }
      }
    }

    res.json({ message: 'Brand and vehicles updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ------------------------- DELETE BRAND + VEHICLES -------------------------
export const deleteBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    if (brand.image) deleteImage(brand.image);

    const vehicles = await Vehicle.find({ brandId });
    for (const v of vehicles) {
      if (v.image) deleteImage(v.image);
      await Vehicle.deleteOne({ _id: v._id });
    }

    await Brand.deleteOne({ _id: brand._id });

    res.json({ message: 'Brand and associated vehicles deleted' });
  } catch (err) {
    console.error('Error in deleteBrand:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ------------------------- SOFT DELETE BRAND + VEHICLES -------------------------
export const softDeleteBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    brand.is_exist = false;
    await brand.save();

    await Vehicle.updateMany({ brandId }, { $set: { is_exist: false } });

    res.json({ message: 'Brand and associated vehicles soft deleted' });
  } catch (err) {
    console.error('Error in softDeleteBrand:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
