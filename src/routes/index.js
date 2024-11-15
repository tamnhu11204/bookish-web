import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import LogInPage from "../pages/LogInPage/LogInPage";
<<<<<<< HEAD
import ShoppingCartPage from "../pages/ShoppingCartPage/ShoppingCartPage"
import DeliveryAddress from "../pages/DeliveryAddress/DeliveryAddress";
import PromoCodeSelectionPage from "../pages/PromoSelectionPage/PromoSelectionPage";
=======
import BookPurchasingTrendPage from "../pages/BookPurchasingTrendPage/BookPurchasingTrendPage";
import CatagoryPage from "../pages/CatagoryPage/CatagoryPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
>>>>>>> d543b92e31528d3e950729894fce3b343ebbf6f8

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

]

