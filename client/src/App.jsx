import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductListPage from "./components/ProductListPage";
import ProductDetailPage from "./components/ProductDetailPage";
import ShoppingCart from "./components/ShoppingCart";
import ShippingAddressForm from "./components/ShippingAddressForm";
import SigninPage from "./components/signinPage";
import SignupPage from "./components/signupPage";
import Header from "./components/header";
import Footer from "./components/footer";
import OrderConformation from "./components/orderConfirmation";
import TutorialsPage from "./components/TutorialsPage";
import FullBlogPost from "./components/FullBlogPost";
import BlogPage from "./components/BlogPage";

function App() {
  return (
    <>
      <BrowserRouter>
    <Header/>
        <Routes>
          <Route path="/product-list" element={<ProductListPage />} />
          <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/" element={<SigninPage />} />
          <Route path="/delivery-address" element={<ShippingAddressForm />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/header" element={<Header />} />
          <Route path="/order-confirm" element={<OrderConformation />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogcontent/:id" element={<FullBlogPost />} />
        </Routes>
    <Footer/>
      </BrowserRouter>

    </>
  );
}

export default App;
