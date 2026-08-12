import Product from "../models/Product.js";

// The same SKU is served to both doors, but a consumer response never carries
// the rate card. Stripping happens here, on the way out, so there is no way to
// leak wholesale pricing by crafting a request.
export function serializeForTrack(product, track) {
  const plain = product.toObject ? product.toObject() : product;

  if (track === "wholesale") return plain;

  const { wholesale, spec, ...rest } = plain;
  return {
    ...rest,
    // spec sheet downloads are a wholesale feature; the numbers stay public
    spec: { ...spec, specSheetUrl: "" },
    wholesale: null,
  };
}

export async function getAllProducts(req, res) {
  try {
    const { category, chain, search, seasonal } = req.query;

    const filter = { isActive: true };
    if (category && category !== "all") filter.category = category;
    if (chain && chain !== "all") filter.chain = chain;
    if (seasonal === "true") filter["seasonal.isSeasonal"] = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { "cutGuide.whatItIs": { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      track: req.track,
      products: products.map((p) => serializeForTrack(p, req.track)),
    });
  } catch (error) {
    console.error("Error in getAllProducts controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found!" });
    res.json({
      track: req.track,
      product: serializeForTrack(product, req.track),
    });
  } catch (error) {
    console.error("Error in getProductById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createProduct(req, res) {
  try {
    const product = new Product(req.body); //model

    //save to database
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error in createProduct controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProduct(req, res) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" }); //status by default 200
  } catch (error) {
    console.error("Error in deleteProduct controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
