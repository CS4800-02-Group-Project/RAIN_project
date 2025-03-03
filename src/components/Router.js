import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import Dashboard from "src\pages\Dashboard.js";

// added just in case but not used, used for correct pathing of different pages

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
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };
  return <BrowserRoutes />;
}
