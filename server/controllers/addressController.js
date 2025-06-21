import Address from "../models/Address.js";

// add address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;
    await Address.create({ ...address, user_id: req.user._id });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get address : /api/address/view
export const viewAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ user_id: userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//view single Address : /api/addres/:id
export const viewSingleAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!address)
      return res.json({ success: false, message: "Address not found" });

    res.json({ success: true, address });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// update Address : /api/address/update
export const updateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;

    const existing = await Address.findOne({
      _id: req.params.id,
      user_id: userId,
    });
    if (!existing)
      return res.json({ success: false, message: "Unauthorized or not found" });

    if (address.isDefault) {
      await Address.updateMany({ user_id: userId }, { isDefault: false });
    }

    const updated = await Address.findByIdAndUpdate(req.params.id, address, {
      new: true,
    });
    res.json({ success: true, address: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Delete ADresss : /api/address/delete
export const deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!deleted)
      return res.json({
        success: false,
        message: "Address not found or unauthorized",
      });

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// for setting default Address /api/address/setdef
export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!address)
      return res.json({
        success: false,
        message: "Address not found or unauthorized",
      });

    await Address.updateMany({ user_id: req.user._id }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    res.json({ success: true, message: "Default address set successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// for gettingt Address /api/address/getdef
export const getDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      user_id: req.user._id,
      isDefault: true,
    });
    if (!address)
      return res.json({ success: false, message: "No default address found" });

    res.json({ success: true, address });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
