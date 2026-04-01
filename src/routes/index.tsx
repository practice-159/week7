import { createHashRouter } from "react-router";

import Login from "../views/Login";
import Cart from "../views/front/Cart";
import Home from "../views/front/Home";
import Products from "../views/front/Products";
import NotFound from "../views/front/NotFound";
import Checkout from "../views/front/Checkout";
import AdminLayout from "../layout/AdminLayout";
import AdminOrders from "../views/admin/AdminOrders";
import FrontendLayout from "../layout/FrontendLayout";
import SingleProduct from "../views/front/SingleProduct";
import AdminProducts from "../views/admin/AdminProducts";
import ProtectedRoute from "../components/ProtectedRoute";

const routes = [
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
const router = createHashRouter(routes);

export default router;
