import axios from "axios";
import * as bootstrap from "bootstrap";
import { useRef, useState, useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";

import type { Product } from "../../types/cartProductType";

import { useMessage } from "../../hooks/useMessage";
import SingleProductModal from "../../components/SingleProductModal";

const API_PATH = import.meta.env.VITE_API_PATH;
const API_BASE_URL = import.meta.env.VITE_API_BASE;

const Products = () => {
  const [products, setProducts] = useState<Product[]>(); // 產品列表
  const [loadingState, setLoadingState] = useState(""); // 產品列表的按鈕載入狀態
  const [product, setProduct] = useState<Product>(); // 單一產品詳細資料
  const productModal = useRef<bootstrap.Modal | null>(null); // 產品modal
  const productModalRef = useRef<HTMLDivElement | null>(null);
  const { showError, showSuccess } = useMessage();

  // 查看產品詳情
  const handleView = async (id: string) => {
    // navigate(`/product/${id}`);
    setLoadingState(id);
    try {
      const url = `${API_BASE_URL}/v2/api/${API_PATH}/product/${id}`;
      const response = await axios.get(url);
      setProduct(response.data.product);
      productModal.current?.show();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    } finally {
      setLoadingState("");
    }
  };

  // 加入購物車
  const addCart = async (id: string, num: number = 1) => {
    const data = {
      qty: num,
      product_id: id,
    };
    try {
      setLoadingState(id);
      const url = `${API_BASE_URL}/v2/api/${API_PATH}/cart`;
      const response = await axios.post(url, { data });
      showSuccess(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    } finally {
      setLoadingState("");
    }
  };

  useEffect(() => {
    // 刷新產品列表
    const getProducts = async () => {
      try {
        const url = `${API_BASE_URL}/v2/api/${API_PATH}/products`;
        const response = await axios.get(url);
        setProducts(response.data.products);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          showError(error.response?.data.message);
        }
      }
    };
    getProducts();

    // modal初始化
    if (productModalRef.current) {
      productModal.current = new bootstrap.Modal(productModalRef.current);
      console.log(productModal.current);
    }

    // modal 關閉時移除焦點

    productModalRef.current?.addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }, []);

  // 關閉 modal
  const closeModal = () => {
    productModal.current?.hide();
  };
  return (
    <>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => {
            return (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <div
                    style={{
                      height: "100px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${product.imageUrl})`,
                    }}
                  ></div>
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價：{product.origin_price}</del>
                  <div className="h5">特價：{product.price}</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={loadingState === product.id}
                      onClick={() => {
                        handleView(product.id);
                      }}
                    >
                      {loadingState === product.id ? (
                        <RotatingLines width={60} height={16} color="grey" />
                      ) : (
                        "查看更多"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => addCart(product.id)}
                      disabled={loadingState === product.id}
                    >
                      {loadingState === product.id ? (
                        <RotatingLines width={60} height={16} color="grey" />
                      ) : (
                        "加到購物車"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <SingleProductModal
        product={product}
        addCart={addCart}
        closeModal={closeModal}
        productModalRef={productModalRef}
      />
    </>
  );
};

export default Products;
