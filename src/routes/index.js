import AccountTab from "../pages/AdminPage/AccountTab";
import AdminPage from "../pages/AdminPage/AdminPage";
import BookPurchasingTrendPage from "../pages/BookPurchasingTrendPage/BookPurchasingTrendPage";
import CatagoryPage from "../pages/CatagoryPage/CatagoryPage";
import ComparisonPage from "../pages/ComparisonPage/ComparisonPage";
import DeliveryAddress from "../pages/DeliveryAddress/DeliveryAddress";
import DiscountPage from "../pages/DiscountPage/DiscountPage";
import HomePage from "../pages/HomePage/HomePage";
import LogInPage from "../pages/LogInPage/LogInPage";
import NewBookPage from "../pages/NewBookPage/NewBookPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderDetailsPage from "../pages/OrderDetailsPage/OrderDetailsPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import PromoCodeSelectionPage from "../pages/PromoSelectionPage/PromoSelectionPage";
import ShoppingCartPage from "../pages/ShoppingCartPage/ShoppingCartPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import InstructionPage from "../pages/InstructionPage/InstructionPage";
import PolicyPage from "../pages/PolicyPage/PolicyPage";

export const routes =[
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
        
        
    },

    {
        path: '/signup',
        page: SignUpPage,
        //isShowHeader: true
    },

    {
        path: '/login',
        page: LogInPage,
        isShowFooter: true
    },

    {
        path: '/bookpurchasingtrend',
        page: BookPurchasingTrendPage,
        isShowHeader: true
    },

    {
        path: '/newbook',
        page: NewBookPage,
        isShowHeader: true
    },

    {
        path: '/category',
        page: CatagoryPage,
        isShowHeader: true
    },

    {
        path: '/product-detail/:id',
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
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true
    },

    {
        path: '/discount',
        page: DiscountPage,
        isShowHeader: true
    },
    {
        path: '/order-detail/:id',
        page: OrderDetailsPage,
        isShowHeader: true
    },
    {
        path: '/search',
        page: SearchPage,
        isShowHeader: true
    },

    {
        path: '/instruction',
        page: InstructionPage,
        isShowHeader: true
    },
    {
        path: '/policy',
        page: PolicyPage,
        isShowHeader: true
    },

    //////////////////////admin//////////////////////

    {
        path: '/admin',
        page: AdminPage,
        //isShowHeader: true,
        isPrivate: true
    },

    {
        path: '/admin-profile',
        page: AccountTab,
        isPrivate: true
    },

]

