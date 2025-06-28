export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PRODUCT_URI = `${BASE_URL}/api/product/add`;
export const GET_SELLER_PRODUCTS_URL = `${BASE_URL}/api/seller/viewall`;
export const CHANGE_STOCK_URI = `${BASE_URL}/api/product/update`;

export const CATEGORY_URI = `${BASE_URL}/api/category/view`;

export const LOGIN_URL = `${BASE_URL}/api/user/login`;
export const REGISTER_URL = `${BASE_URL}/api/user/register`;
export const UPGRADE_USER = `${BASE_URL}/api/user/upgraderole`;
export const GET_PROFILE = `${BASE_URL}/api/user/profile`;
export const LOGOUT_USER = `${BASE_URL}/api/user/logout`;
export const CHECK_AUTH = `${BASE_URL}/api/user/is-auth`;
export const CHANGE_PASSWORD = `${BASE_URL}/api/user/change-password`;
export const UPDATE_PROFILE = `${BASE_URL}/api/user/updateprofile`;
export const ADD_ADDR = `${BASE_URL}/api/address/add`;
export const GET_ADDR = `${BASE_URL}/api/address/view`;
export const CREATE_ORDER = `${BASE_URL}/api/order/create`;
export const SINGLE_ORDER = `${BASE_URL}/api/order/createsingle`;
export const ORDER_COD = `${BASE_URL}/api/order/cod`;
export const ONLINE_ORDER = `${BASE_URL}/api/payment/create`;
export const RAZOR_KEY = `${BASE_URL}/api/key/razorkey`;
export const CART_CHECKOUT = `${BASE_URL}/api/order/createcart`;
export const VER_CART = `${BASE_URL}/api/order/verifycart`;
export const GET_CAROUSAL = `${BASE_URL}/api/carousal/get`;
