import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { CategoriesPage } from "./app/categories/CategoriesPage";
import { OrdersPage } from "./app/orders/OrdersPage";
import { ProductsPage } from "./app/products/ProductsPage";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex gap-2 border-b border-gray-200 bg-white px-6 py-4">
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `rounded-xl px-3 py-1.5 text-sm ${
              isActive ? "bg-sky-50 font-semibold text-sky-600" : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          Proizvodi
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `rounded-xl px-3 py-1.5 text-sm ${
              isActive ? "bg-sky-50 font-semibold text-sky-600" : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          Kategorije
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `rounded-xl px-3 py-1.5 text-sm ${
              isActive ? "bg-sky-50 font-semibold text-sky-600" : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          Narudžbe
        </NavLink>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
