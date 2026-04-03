import productModel from "../model/product.model.js";

const getBadge = (product) => {
  const daysOld = (Date.now() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24);

  if (product.sold > 50) return "BEST";
  if (product.view > 100) return "FAV";
  if (daysOld <= 15) return "NEW";

  return null;
};

export default async function updateProductBadge(productId) {
  try {
    const product = await productModel.findById(productId);
    if (!product) return;

    const newBadge = getBadge(product);

    console.log(`Product: ${product.name}, Old Badge: ${product.badge}, New Badge: ${newBadge}`);

    if (product.badge !== newBadge) {
      // Use findByIdAndUpdate to avoid recursion if the post-save hook is triggered again on save()
      await productModel.findByIdAndUpdate(productId, { badge: newBadge });
      console.log("Badge updated!");
    }
  } catch (err) {
    console.error("Badge Calculation Error:", err);
  }
}