import Brand from '../models/Brand.js';
import Vehicle from '../models/Vehicle.js';
import fs from 'fs';

// Helper to delete image
const deleteImage = (filePath) => {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

// Create Brand + Vehicles
export const createBrand = async (req, res) => {
  try {
    const { name, year, is_exist, country, vehicles } = req.body;

    const brand = new Brand({
      name,
      year,
      is_exist,
      country,
      image: req.files?.brandImage ? req.files.brandImage[0].path : null
    });
    await brand.save();

    let vehiclesData = [];
    if (vehicles) {
      const parsedVehicles = JSON.parse(vehicles);
      for (let v of parsedVehicles) {
        const vehicleFile = req.files?.[`vehicleImage_${v.tempId}`];
        const vehicle = new Vehicle({
          brandId: brand._id,
          name: v.name,
          color: v.color,
          price: v.price,
          image: vehicleFile ? vehicleFile[0].path : null
        });
        await vehicle.save();
        vehiclesData.push(vehicle);
      }
    }

    res.status(201).json({ brand, vehicles: vehiclesData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Brands + Vehicles
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
    res.status(500).json({ message: 'Server error' });
  }
};


// update
export const updateBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { name, year, is_exist, country, vehicles } = req.body;

    // 1️⃣ Find brand
    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    // 2️⃣ Update brand fields if provided
    if (name !== undefined) brand.name = name;
    if (year !== undefined) brand.year = Number(year);
    if (is_exist !== undefined) brand.is_exist = is_exist === 'true' || is_exist === true;
    if (country !== undefined) brand.country = country;

    // 3️⃣ Update brand image if provided
    if (req.files?.brandImage) {
      if (brand.image) deleteImage(brand.image);
      brand.image = req.files.brandImage[0].path;
    }

    await brand.save();

    // 4️⃣ Update or create vehicles
    if (vehicles) {
      const parsedVehicles = JSON.parse(vehicles);

      for (let v of parsedVehicles) {
        const vehicleFile = req.files?.[`vehicleImage_${v.tempId}`];

        if (v.id) {
          // Update existing vehicle
          const vehicle = await Vehicle.findById(v.id);
          if (!vehicle) continue;

          if (v.name !== undefined) vehicle.name = v.name;
          if (v.price !== undefined) vehicle.price = Number(v.price);
          if (v.color !== undefined) vehicle.color = Array.isArray(v.color) ? v.color : JSON.parse(v.color);

          if (vehicleFile) {
            if (vehicle.image) deleteImage(vehicle.image);
            vehicle.image = vehicleFile[0].path;
          }

          await vehicle.save();
        } else {
          // Create new vehicle
          const newVehicle = new Vehicle({
            brandId: brand._id,
            name: v.name,
            price: Number(v.price),
            color: Array.isArray(v.color) ? v.color : JSON.parse(v.color || "[]"),
            image: vehicleFile ? vehicleFile[0].path : null,
          });

          await newVehicle.save();
        }
      }
    }

    res.json({ message: 'Brand and vehicles updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Delete Brand + Vehicles
export const deleteBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    // Find the brand
    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    // Delete brand image if exists
    if (brand.image) deleteImage(brand.image);

    // Find vehicles
    const vehicles = await Vehicle.find({ brandId });

    for (const v of vehicles) {
      if (v.image) deleteImage(v.image);
      // Use deleteOne instead of remove()
      await Vehicle.deleteOne({ _id: v._id });
    }

    // Delete brand
    await Brand.deleteOne({ _id: brand._id });

    res.json({ message: 'Brand and associated vehicles deleted' });
  } catch (err) {
    console.error('Error in deleteBrand:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// soft delete
export const softDeleteBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    // Mark brand as deleted
    brand.is_exist = false;
    await brand.save();

    // Mark all vehicles as deleted
    await Vehicle.updateMany({ brandId }, { $set: { is_exist: false } });

    res.json({ message: 'Brand and associated vehicles soft deleted' });
  } catch (err) {
    console.error('Error in softDeleteBrand:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


