import express from "express";
import { AuthController } from "../controller/auth.controller.js";
import { UserAuth, adminAuth } from "../middleware/auth.middleware.js";
import { 
  createMainCategory, 
  getAllMainCategory, 
  getMainCategoryById, 
  updateMainCategoryById, 
  deleteMainCategoryById 
} from "../controller/mainCategory.controller.js";
import { 
  createCategory, 
  getAllCategory, 
  getCategoryById, 
  updateCategoryById, 
  deleteCategoryById,
  getCategoriesByMainCategoryId
} from "../controller/category.controller.js";
import { 
  createSubCategory, 
  getAllSubCategory, 
  getSubCategoryById, 
  updateSubCategoryById, 
  deleteSubCategoryById,
  getSubCategoriesByCategoryId
} from "../controller/subCategory.controller.js";
import { 
  createInsideSubCategory, 
  getAllInsideSubCategory, 
  getInsideSubCategoryById, 
  updateInsideSubCategoryById, 
  deleteInsideSubCategoryById,
  getInsideSubCategoriesBySubCategoryId
} from "../controller/insideSubCategory.controller.js";

const router = express.Router();

// --- Auth Routes ---
router.post("/auth/send-otp", AuthController.sendOtp);
router.post("/auth/verify-otp", AuthController.verifyOtp);
router.post("/auth/refresh-token", AuthController.refreshAccessToken);
router.get("/auth/me", UserAuth, AuthController.getUser);
router.post("/auth/update-fcm", UserAuth, AuthController.updateFcmToken);

// --- Main Category Routes ---
router.post("/main-category/create", UserAuth, adminAuth, createMainCategory);
router.get("/main-category/get-all", getAllMainCategory);
router.get("/main-category/get-by-id/:id", getMainCategoryById);
router.put("/main-category/update/:id", UserAuth, adminAuth, updateMainCategoryById);
router.delete("/main-category/delete/:id", UserAuth, adminAuth, deleteMainCategoryById);

// --- Category Routes ---
router.post("/category/create", UserAuth, adminAuth, createCategory);
router.get("/category/get-all", getAllCategory);
router.get("/category/get-by-id/:id", getCategoryById);
router.get("/category/get-by-main-category/:mainCategoryId", getCategoriesByMainCategoryId);
router.put("/category/update/:id", UserAuth, adminAuth, updateCategoryById);
router.delete("/category/delete/:id", UserAuth, adminAuth, deleteCategoryById);

// --- Sub Category Routes ---
router.post("/sub-category/create", UserAuth, adminAuth, createSubCategory);
router.get("/sub-category/get-all", getAllSubCategory);
router.get("/sub-category/get-by-id/:id", getSubCategoryById);
router.get("/sub-category/get-by-category/:categoryId", getSubCategoriesByCategoryId);
router.put("/sub-category/update/:id", UserAuth, adminAuth, updateSubCategoryById);
router.delete("/sub-category/delete/:id", UserAuth, adminAuth, deleteSubCategoryById);

// --- Inside Sub Category Routes ---
router.post("/inside-sub-category/create", UserAuth, adminAuth, createInsideSubCategory);
router.get("/inside-sub-category/get-all", getAllInsideSubCategory);
router.get("/inside-sub-category/get-by-id/:id", getInsideSubCategoryById);
router.get("/inside-sub-category/get-by-sub-category/:subCategoryId", getInsideSubCategoriesBySubCategoryId);
router.put("/inside-sub-category/update/:id", UserAuth, adminAuth, updateInsideSubCategoryById);
router.delete("/inside-sub-category/delete/:id", UserAuth, adminAuth, deleteInsideSubCategoryById);

export default router;