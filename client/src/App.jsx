import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductListPage from "./components/ProductListPage";
import ProductDetailPage from "./components/ProductDetailPage";
import ShoppingCart from "./components/ShoppingCart";
import ShippingAddressForm from "./components/ShippingAddressForm";
import SigninPage from "./components/signinPage";
import SignupPage from "./components/signupPage";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/delivery-address" element={<ShippingAddressForm />} />
        
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/header" element={<Header />} />
          <Route path="/footer" element={<Footer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
