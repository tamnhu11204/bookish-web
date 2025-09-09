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
import ForgotPassword from "../pages/ForgotPasswordPage/ForgotPassword";
import EnterOTP from "../pages/ForgotPasswordPage/EnterOTP";
import EnterNewPassword from "../pages/ForgotPasswordPage/EnterNewPassword";
import AdminChatPage from "../pages/AdminChat/AdminChatPage";
import ReviewFeedbackChatbot from "../pages/ReviewFeedbackChatbot/ReviewFeedbackChatbot";
import FavoriteProducts from "../pages/ProfilePage/ProductTab";
import AboutUsPage from "../pages/AboutUsPage/AboutUsPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/signup',
        page: SignUpPage,
    },
    {
        path: '/login',
        page: LogInPage,
        isShowHeader: false,
    },
    {
        path: '/bookpurchasingtrend',
        page: BookPurchasingTrendPage,
        isShowHeader: true,
    },
    {
        path: '/newbook',
        page: NewBookPage,
        isShowHeader: true,
    },
    {
        path: '/category',
        page: CatagoryPage,
        isShowHeader: true,
    },
    {
        path: '/about-us',
        page: AboutUsPage,
        isShowHeader: true,
    },
    {
        path: '/product-detail/:id',
        page: ProductDetailPage,
        isShowHeader: true,
    },
    {
        path: '*',
        page: NotFoundPage,
    },
    {
        path: '/shoppingcart',
        page: ShoppingCartPage,
        isShowHeader: true,
    },
    {
        path: '/deliveryaddress',
        page: DeliveryAddress,
        isShowHeader: true,
    },
    {
        path: '/promoselection',
        page: PromoCodeSelectionPage,
        isShowHeader: true,
    },
    {
        path: '/comparison',
        page: ComparisonPage,
        isShowHeader: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true,
    },
    {
        path: '/discount',
        page: DiscountPage,
        isShowHeader: true,
    },
    {
        path: '/order-detail/:id',
        page: OrderDetailsPage,
        isShowHeader: true,
    },
    {
        path: '/search',
        page: SearchPage,
        isShowHeader: true,
    },
    {
        path: '/instruction',
        page: InstructionPage,
        isShowHeader: true,
    },
    {
        path: '/policy',
        page: PolicyPage,
        isShowHeader: true,
    },
    {
        path: '/forgot-password',
        page: ForgotPassword,
    },
    {
        path: '/forgot-password/enter-otp',
        page: EnterOTP,
    },
    {
        path: '/forgot-password/new-password',
        page: EnterNewPassword,
    },
    {
        path: '/review-feedback',
        page: ReviewFeedbackChatbot,
        isShowHeader: true,
    },
    {
        path: '/favorite-products',
        page: FavoriteProducts,
        isShowHeader: true,
    },
    // Admin routes
    {
        path: '/admin/:tab?',
        page: AdminPage,
        isPrivate: true,
    },
    {
        path: '/admin/livechat',
        page: AdminChatPage,
        isShowHeader: true,
        isPrivate: true,
    },
    {
        path: '/admin-profile',
        page: AccountTab,
        isPrivate: true,
    },
];