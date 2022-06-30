import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage, CartPage, TransactionPage, UserProfile, OrderPage } from "./pages/customer";
import { AdminLogin, AdminRegister, AdminTransactions, AdminProducts, AdminOrders } from "./pages/admin";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/admin/" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/transactions/" element={<AdminTransactions />} />
          <Route path="/admin/products/" element={<AdminProducts />} />
          <Route path="/admin/orders/" element={<AdminOrders />} />
          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;