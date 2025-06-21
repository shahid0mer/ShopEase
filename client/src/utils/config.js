export const BASE_URL = import.meta.env.VITE_API_BASE_URL_PRODUCTION;

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
