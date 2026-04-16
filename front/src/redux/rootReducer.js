import { combineReducers } from "redux";
import authReducer from "./slice/auth.slice.js";
import categoryReducer from "./slice/category.slice.js";
import productReducer from "./slice/product.slice.js";
import orderReducer from "./slice/order.slice.js";

export const rootReducer = combineReducers({
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    order: orderReducer,
});