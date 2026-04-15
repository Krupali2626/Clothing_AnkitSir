import dotenv from "dotenv";
import MainCategory from "../model/mainCategory.model.js";
import { connectDB } from "../DB/connectdb.js";

dotenv.config();

const listMainCategories = async () => {
    try {
        await connectDB(process.env.DB_URL);
        console.log("🔗 Connected to Database\n");

        const mainCategories = await MainCategory.find({});

        console.log("📋 Existing Main Categories:");
        mainCategories.forEach(cat => {
            console.log(`  - ${cat.mainCategoryName} (slug: ${cat.slug}, ID: ${cat._id})`);
        });

        console.log(`\n✅ Total: ${mainCategories.length} main categories`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

listMainCategories();
