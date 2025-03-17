import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login"

export default function Router() {
  const Layout = () => {
    return (
      <>
        <main>
          <Outlet />
        </main>
      </>
    );
  };

  const BrowserRoutes = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };
  return <BrowserRoutes />;
}
