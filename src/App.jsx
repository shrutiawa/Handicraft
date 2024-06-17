import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductListPage from "./components/ProductListPage";
import ProductDetailPage from "./components/ProductDetailPage";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<ProductListPage />} />
        <Route path="/product" element={<ProductDetailPage />} />
        

       
  </Routes>
  </BrowserRouter>
    </>
  );
}

export default App;
