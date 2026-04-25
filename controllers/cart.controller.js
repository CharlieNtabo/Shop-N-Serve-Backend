import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      " name price image ",
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    const cartWithLineTotals = {
      ...cart.toObject(),
      items: cart.items.map((item) => ({
        ...item.toObject(),
        lineTotals: item.unitPrice * item.quantity,
      })),
    };

    res.status(200).json({ cart: cartWithLineTotals });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product NOT Found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity,
        unitPrice: product.price,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    await cart.save();

    res
      .status(200)
      .json({ message: "Successfully added product to cart", cart });
  } catch (error) {
    console.error("Error trying to add product to cart", error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === null) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }
    if (quantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be at least one." });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product Not Found in Cart" });
    }

    cart.items[itemIndex].quantity = quantity;

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error in updating cart:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product Not Found in Cart" });
    }

    cart.items.splice(itemIndex, 1);
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    await cart.save();
    res.status(200).json({ message: "Product removed from cart successfully.", cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ messsage: "Failed to remove product from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    console.error("Error trying to clear cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
