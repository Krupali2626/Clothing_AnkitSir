import ProductVariant from "../model/productVariant.model.js";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse } from "../utils/Response.utils.js";

// @desc    Get low stock alerts
// @route   GET /inventory/low-stock
// @access  Admin
export const getLowStockAlerts = async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 10;
        
        // Find variants where ANY option's stock is below the threshold
        // Or if there are no options, the variant's stock itself is below threshold
        const lowStockVariants = await ProductVariant.find({
            $or: [
                { 'options.stock': { $lt: threshold } },
                { 
                    $and: [
                        { options: { $size: 0 } },
                        { stock: { $lt: threshold } }
                    ]
                }
            ]
        }).populate("productId", "name mainCategory category subCategory").lean();

        // Format the response to highlight specifically which options are low
        const formattedAlerts = [];
        
        for (const variant of lowStockVariants) {
            if (variant.options && variant.options.length > 0) {
                for (const option of variant.options) {
                    if (option.stock < threshold) {
                        formattedAlerts.push({
                            variantId: variant._id,
                            productId: variant.productId?._id,
                            productName: variant.productId?.name || 'Unknown Product',
                            color: variant.color,
                            sku: option.sku || variant.sku,
                            size: option.size,
                            stock: option.stock,
                            threshold
                        });
                    }
                }
            } else if (variant.stock < threshold) {
                formattedAlerts.push({
                    variantId: variant._id,
                    productId: variant.productId?._id,
                    productName: variant.productId?.name || 'Unknown Product',
                    color: variant.color,
                    sku: variant.sku,
                    size: 'N/A',
                    stock: variant.stock,
                    threshold
                });
            }
        }

        return sendSuccessResponse(res, "Low stock alerts fetched successfully", formattedAlerts);
    } catch (error) {
        return sendErrorResponse(res, 500, "Error fetching low stock alerts", error);
    }
};

// @desc    Bulk update stock levels
// @route   PUT /inventory/bulk-update
// @access  Admin
// Expects body: { updates: [{ variantId: "...", size: "...", newStock: 50 }, ...] }
export const bulkUpdateStock = async (req, res) => {
    try {
        const { updates } = req.body;
        
        if (!updates || !Array.isArray(updates) || updates.length === 0) {
            return sendBadRequestResponse(res, "Please provide an array of stock updates");
        }

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const update of updates) {
            try {
                const { variantId, size, newStock } = update;
                
                if (newStock === undefined || newStock < 0) {
                    throw new Error("Invalid stock value");
                }

                const variant = await ProductVariant.findById(variantId);
                if (!variant) {
                    throw new Error("Variant not found");
                }

                if (size && size !== 'N/A') {
                    const option = variant.options.find(opt => opt.size === size);
                    if (option) {
                        option.stock = newStock;
                        await variant.save();
                        results.success++;
                    } else {
                        throw new Error(`Size ${size} not found in variant`);
                    }
                } else {
                    variant.stock = newStock;
                    await variant.save();
                    results.success++;
                }
            } catch (err) {
                results.failed++;
                results.errors.push({
                    update,
                    error: err.message
                });
            }
        }

        return sendSuccessResponse(res, "Bulk stock update completed", results);
    } catch (error) {
        return sendErrorResponse(res, 500, "Error during bulk stock update", error);
    }
};
