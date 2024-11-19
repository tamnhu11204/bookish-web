import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import LogInPage from "../pages/LogInPage/LogInPage";
import ShoppingCartPage from "../pages/ShoppingCartPage/ShoppingCartPage"
import DeliveryAddress from "../pages/DeliveryAddress/DeliveryAddress";
import PromoCodeSelectionPage from "../pages/PromoSelectionPage/PromoSelectionPage";
import BookPurchasingTrendPage from "../pages/BookPurchasingTrendPage/BookPurchasingTrendPage";
import CatagoryPage from "../pages/CatagoryPage/CatagoryPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ComparisonPage from "../pages/ComparisonPage/ComparisonPage";
import RatingProductPage from "../pages/RatingProduct/RatingProduct"

import OrderPage from "../pages/OrderPage/OrderPage";
import AdminPage from "../pages/AdminPage/AdminPage";

export const routes =[
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },

    {
        path: '/signup',
        page: SignUpPage,
        isShowHeader: true
    },

    {
        path: '/login',
        page: LogInPage,
        isShowHeader: true
    },

    {
        path: '/bookpurchasingtrend',
        page: BookPurchasingTrendPage,
        isShowHeader: true
    },

    {
        path: '/catagory',
        page: CatagoryPage,
        isShowHeader: true
    },

    {
        path: '/productdetail',
        page: ProductDetailPage,
        isShowHeader: true
    },

    {
        path: "*",
        page: NotFoundPage
    },

    {
        path: '/shoppingcart',
        page: ShoppingCartPage,
        isShowHeader: true
    },

    {
        path: '/deliveryaddress',
        page: DeliveryAddress,
        isShowHeader: true
    },

    {
        path: '/promoselection',
        page: PromoCodeSelectionPage,
        isShowHeader: true
    },

    {
        path: '/comparison',
        page: ComparisonPage,
        isShowHeader: true
    },

    {

        path: '/ratingproduct',
        page: RatingProductPage,

    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },

    {
        path: '/admin',
        page: AdminPage,
        isShowHeader: true
    },

]

