import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { ArticlesPage } from "./app/articles/ArticlesPage";
import { GroupsPage } from "./app/groups/GroupsPage";
import { IssuesPage } from "./app/issues/IssuesPage";
import { ReceiptsPage } from "./app/receipts/ReceiptsPage";
import { SuppliersPage } from "./app/suppliers/SuppliersPage";

const navItems = [
  { to: "/articles", label: "Artikli" },
  { to: "/groups", label: "Grupe artikala" },
  { to: "/receipts", label: "Ulazi" },
  { to: "/issues", label: "Izlazi" },
  { to: "/suppliers", label: "Dobavljači" },
];

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex flex-wrap gap-2 border-b border-gray-200 bg-white px-6 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-xl px-3 py-1.5 text-sm ${
                isActive ? "bg-sky-50 font-semibold text-sky-600" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/articles" replace />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/receipts" element={<ReceiptsPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
