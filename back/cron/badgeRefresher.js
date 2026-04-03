import productModel from "../model/product.model.js";
import updateProductBadge from "./badgeUpdater.js";

export default async function refreshAllBadges() {
  try {
    const products = await productModel.find({});
    console.log(`Refreshing badges for ${products.length} products...`);
  
    for (let product of products) {
      await updateProductBadge(product._id);
    }

    console.log("All product badges refreshed.");
  } catch (err) {
    console.error("Daily Badge Refresh Error:", err);
  }
}
