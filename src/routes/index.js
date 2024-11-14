import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import LogInPage from "../pages/LogInPage/LogInPage";
import BookPurchasingTrendPage from "../pages/BookPurchasingTrendPage/BookPurchasingTrendPage";
import CatagoryPage from "../pages/CatagoryPage/CatagoryPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";

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
    }
]

