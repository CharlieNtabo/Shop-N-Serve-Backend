import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return req.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, discountPrice, description, category, countInStock } =
      req.body;

    const images = req.files?.map((file) => file.path) || [];

    if (
      !name ||
      !price ||
      !discountPrice ||
      !description ||
      !category ||
      !countInStock ||
      images.length === 0
    ) {
      return res.status(400).json({ message: "Insert the required fields" });
    }

    const product = new Product({
      name,
      price,
      discountPrice: discountPrice || 0,
      description,
      category,
      countInStock: countInStock || 0,
      images,
    });

    if (!product) {
      return res.status(400).json({ message: "No product was created" });
    }

    await product.save();
    res.status(200).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error in creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const { name, price, discountPrice, description, category, countInStock } =
      req.body;
    const images = req.files?.map((file) => file.path) || [];

    const product = await Product.findById(productId);

    if (name) product.name = name;
    if (price) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (description) product.description = description;
    if (category) product.category = category;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (images.length > 0) product.images = [...product.images, ...images];

    const updatedProduct = await product.save();
    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("There was an error in updating the product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("There was an error deleting this product:", error);
    res.status(500).json({ message: "Server error" });
  }
};
