import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// View Cart : /api/cart
export const cartView = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id"
    );

    if (!cart) {
      return res.json({ success: true, cart: { items: [] } });
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to Cart : /api/cart/add
export const addCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.json({
        success: false,
        message: "Missing product or quantity",
      });
    }

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = new Cart({
        user_id: userId,
        items: [{ product_id, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === product_id
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product_id, quantity });
      }
    }

    await cart.save();
    res.json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update Cart : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Find the item by its unique _id within the cart's items array
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.markModified("items");
      await cart.save();

      // Populate product_id before sending back the updated cart
      // This ensures the frontend gets the full product details again
      const updatedCart = await Cart.findOne({ user_id: userId }).populate(
        "items.product_id"
      );

      return res.json({
        success: true,
        message: "Cart updated",
        cart: updatedCart,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove Item from Cart : /api/cart/remove
export const removeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemIdToRemove = req.params.itemId;

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemIdToRemove
    );

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart for this user",
      });
    }

    cart.markModified("items");
    await cart.save();

    const updatedCart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id"
    );

    return res.json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Clear Entire Cart : /api/cart/clear
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndUpdate({ user_id: userId }, { $set: { items: [] } });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
