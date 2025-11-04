export const uploadMultipleImages = async (req, res) => {
  try {
    const images = req.files.map((file) => file.path);
    if (!images) {
      return res.status(400).json({ message: "No images found" });
    }

    res.status(200).json({ message: "Images uploaded successfully", images });
  } catch (error) {
    console.error("Error in uploading images:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
