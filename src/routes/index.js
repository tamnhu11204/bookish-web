import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import LogInPage from "../pages/LogInPage/LogInPage";
import ShoppingCartPage from "../pages/ShoppingCartPage/ShoppingCartPage"
import DeliveryAddress from "../pages/DeliveryAddress/DeliveryAddress";
import PromoCodeSelectionPage from "../pages/PromoSelectionPage/PromoSelectionPage";

export const routes =[
    {
        path: '/homepage',
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

