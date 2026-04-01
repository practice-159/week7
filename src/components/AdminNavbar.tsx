import { Link } from "react-router";
const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <span>Navbar</span>
        {/* <Link to="/" className="navbar-brand">
          Navbar
        </Link> */}
        <button
          type="button"
          aria-expanded="false"
          data-bs-toggle="collapse"
          aria-controls="navbarNav"
          className="navbar-toggler"
          data-bs-target="#navbarNav"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="navbarNav" className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                前臺首頁
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/products" className="nav-link">
                後台產品列表
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/orders" className="nav-link">
                後台訂單列表
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
