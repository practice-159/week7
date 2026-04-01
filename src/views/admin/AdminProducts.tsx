import axios from "axios";
import * as bootstrap from "bootstrap";
import { useDispatch } from "react-redux";
import React, { useRef, useState, useEffect } from "react";

import type { AppDispatch } from "../../store/store";
import type { ProductType } from "../../types/productType";

import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import { createAsyncMessage } from "../../slices/messageSlice";
import ProductModalComponent from "../../components/ProductModalComponent";

// week2 - .env 的資訊
const API_BASE_URL = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const AdminProducts = () => {
  // week1 - 產品列表
  const [productList, setProductList] = useState<ProductType[]>([]);

  // week4 - 頁數
  const [pagination, setPagination] = useState({
    category: "",
    has_pre: false,
    has_next: false,
    total_pages: NaN,
    current_page: NaN,
  });

  // week7
  const dispatch = useDispatch<AppDispatch>();

  // week2 - 取得產品api
  const fetchProducts = async (page = 1) => {
    try {
      const url = `${API_BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`;
      const response = await axios.get(url);
      setPagination(response.data.pagination);
      setProductList(response.data.products);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(createAsyncMessage(error.response?.data));
      }
    }
  };
  // [dispatch],
  // );

  // week3 - 產品資料
  const INITIAL_TEMPLATE_DATA = {
    id: "",
    num: "",
    unit: "",
    title: "",
    price: "",
    content: "",
    category: "",
    imageUrl: "",
    is_enabled: true,
    description: "",
    imagesUrl: [""],
    origin_price: "",
  };

  // week3 - Modal控制相關狀態
  const productModalRef = useRef<HTMLDivElement | null>(null);
  const productModal = useRef<bootstrap.Modal | null>(null);
  const [modalType, setModalType] = useState(""); // "create", "edit", "delete"

  // week3 - 產品資料模板
  const [templateData, setTemplateData] = useState(INITIAL_TEMPLATE_DATA);

  // week3 - 初始化時綁定 Modal
  useEffect(() => {
    if (productModalRef.current) {
      productModal.current = new bootstrap.Modal(productModalRef.current, {
        keyboard: false,
      });
    }

    const fetchProducts = async (page = 1) => {
      try {
        const url = `${API_BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`;
        const response = await axios.get(url);
        setPagination(response.data.pagination);
        setProductList(response.data.products);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          dispatch(createAsyncMessage(error.response?.data));
        }
      }
    };
    fetchProducts();
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="container mt-5">
        <div className="row">
          <div className="col text-center">
            {/* 產品列表 */}
            <Table
              productList={productList}
              productModal={productModal}
              setModalType={setModalType}
              setTemplateData={setTemplateData}
              INITIAL_TEMPLATE_DATA={INITIAL_TEMPLATE_DATA}
            />
            {/* Modal */}
            <ProductModalComponent
              modalType={modalType}
              productModal={productModal}
              templateData={templateData}
              fetchProducts={fetchProducts}
              productModalRef={productModalRef}
            />
            <Pagination pagination={pagination} fetchProducts={fetchProducts} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminProducts;
