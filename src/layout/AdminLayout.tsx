import { Outlet } from "react-router";

import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = () => {
  return (
    <>
      <header>
        <AdminNavbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
};

export default AdminLayout;
