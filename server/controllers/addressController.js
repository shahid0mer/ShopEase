import Address from "../models/Address.js";

// add address : /api/address/add
// Add Address : POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;

    const createdAddress = await Address.create({
      ...address,
      user_id: req.user._id,
    });

    res.status(201).json({
      success: true,
      address: createdAddress,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// View All Addresses : GET /api/address/view
export const viewAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ user_id: userId });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// View Single Address : GET /api/address/:id
export const viewSingleAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });

    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Address : PUT /api/address/update/:id
export const updateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;

    const existing = await Address.findOne({
      _id: req.params.id,
      user_id: userId,
    });

    if (!existing)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized or not found" });

    if (address.isDefault) {
      await Address.updateMany({ user_id: userId }, { isDefault: false });
    }

    const updated = await Address.findByIdAndUpdate(req.params.id, address, {
      new: true,
    });

    res.status(200).json({ success: true, address: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Address : DELETE /api/address/delete/:id
export const deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Address not found or unauthorized" });

    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Set Default Address : PATCH /api/address/setdef/:id
export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "Address not found or unauthorized" });

    await Address.updateMany({ user_id: req.user._id }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      address,
      message: "Default address set successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Default Address : GET /api/address/getdef
export const getDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      user_id: req.user._id,
      isDefault: true,
    });

    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "No default address found" });

    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
