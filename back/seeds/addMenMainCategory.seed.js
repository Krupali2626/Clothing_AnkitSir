import dotenv from "dotenv";
import MainCategory from "../model/mainCategory.model.js";
import { connectDB } from "../DB/connectdb.js";

dotenv.config();

const addMenMainCategory = async () => {
    try {
        await connectDB(process.env.DB_URL);
        console.log("🔗 Connected to Database");

        // Check if MEN main category already exists
        const existingMen = await MainCategory.findOne({ mainCategoryName: "MEN" });

        if (existingMen) {
            console.log("ℹ️  MEN main category already exists");
        } else {
            const menCategory = await MainCategory.create({
                mainCategoryName: "MEN",
                mainCategoryImage: ""
            });
            console.log(`✅ Created MEN Main Category with ID: ${menCategory._id}`);
        }

        console.log("\n🎉 Done!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

addMenMainCategory();
