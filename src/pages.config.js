import PriceComparison from './pages/PriceComparison';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Profile from './pages/Profile';
import ShoppingLists from './pages/ShoppingLists';
import Scanner from './pages/Scanner';
import Home from './pages/Home';
import ShoppingListDetail from './pages/ShoppingListDetail';
import Login from './pages/Login';
import UsernameSetup from './pages/UsernameSetup';
import StoreDetail from './pages/StoreDetail';
import __Layout from './Layout.jsx';

export const PAGES = {
    "PriceComparison": PriceComparison,
    "ProductDetail": ProductDetail,
    "Products": Products,
    "Profile": Profile,
    "ShoppingLists": ShoppingLists,
    "Scanner": Scanner,
    "Home": Home,
    "ShoppingListDetail": ShoppingListDetail,
    "Login": Login,
    "UsernameSetup": UsernameSetup,
    "StoreDetail": StoreDetail,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
