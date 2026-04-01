import axios from "axios";
import { useState, useEffect } from "react";

import type { productModalComponentType } from "../types/productModalComponentType";

// import useMessage from "../hooks/useMessage";
import { useMessage } from "../hooks/useMessage";

// week2 - .env 的資訊
const API_BASE_URL = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductModalComponent = ({
  modalType,
  productModal,
  templateData,
  fetchProducts,
  productModalRef,
  // setTemplateData,
}: productModalComponentType) => {
  // week7
  const { showError, showSuccess } = useMessage();

  // week4 - 只傳入值，並使用useState接收這個值，不接收父元件的setTemplateData，不更改父元件的值
  const [tempData, setTempData] = useState(templateData);
  useEffect(() => {
    setTempData(templateData);
  }, [templateData]);

  // week3 - 設定 input onChange 的 function
  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempData((preData) => {
      const { name, type, value, checked } = e.target;
      return { ...preData, [name]: type === "checkbox" ? checked : value };
    });
  };

  // week3 - 新增產品api+編輯產品api
  const createOrUpdateProduct = async (id: string) => {
    let url = `${API_BASE_URL}/v2/api/${API_PATH}/admin/product`;
    let method: "post" | "put" = "post";
    if (modalType === "edit") {
      url = `${API_BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }

    const productData = {
      data: {
        ...tempData,
        price: Number(tempData.price),
        is_enabled: Number(tempData.is_enabled),
        origin_price: Number(tempData.origin_price),
        imagesUrl: [...tempData.imagesUrl.filter((url: string) => url !== "")],
      },
    };
    try {
      const response = await axios[method](url, productData);
      showSuccess(response.data.message);
      closeModal();
      fetchProducts();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    }
  };

  // week3 - 移除產品api
  const deleteProduct = async (id: string) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`,
      );
      // 移除產品後重新發送一次取得產品的request，讓畫面顯示最新的資料
      showSuccess(response.data.message);
      fetchProducts();
      closeModal();
      // }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    }
  };

  // week4 - 上傳圖片api
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);

      const token = document.cookie
        .split(";")
        .find((txt) => txt.startsWith("someCookieName="))
        ?.split("=")[1];
      if (token) {
        const config = { headers: { Authorization: token } };
        const response = await axios.post(
          `${API_BASE_URL}/v2/api/${API_PATH}/admin/upload`,
          formData,
          config,
        );

        setTempData((pre) => ({
          ...pre,
          imageUrl: response.data.imageUrl,
        }));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    }
  };

  // week3 - 設定資料裡面的圖片array
  const handleModalImageChange = (index: number, value: string) => {
    setTempData((preData) => {
      const newImage = [...preData.imagesUrl];
      newImage[index] = value;
      if (
        value !== "" &&
        index === newImage.length - 1 &&
        newImage.length < 5
      ) {
        newImage.push("");
      }
      if (
        value === "" &&
        newImage.length > 1 &&
        newImage[newImage.length - 1] === ""
      ) {
        newImage.pop();
      }
      return { ...preData, imagesUrl: newImage };
    });
  };

  // week3 - 新增副圖片
  const handleAddImage = () => {
    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages.push("");
      return { ...preData, imagesUrl: newImages };
    });
  };

  // week3 - 移除副圖片
  const handleRemoveImage = () => {
    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages.pop();
      return { ...preData, imagesUrl: newImages };
    });
  };

  // week3 - 關閉鍵(Modal)
  const closeModal = () => {
    if (productModal.current) {
      productModal.current.hide();
    }
  };

  return (
    <div>
      <div
        tabIndex={-1}
        id="exampleModal"
        aria-hidden="true"
        ref={productModalRef}
        className="modal fade"
        aria-labelledby="exampleModalLabel"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div
              className={`modal-header bg-${modalType === "delete" ? "danger" : "dark"} text-white`}
            >
              <h1 id="exampleModalLabel" className="modal-title fs-5">
                {modalType === "delete"
                  ? "刪除產品"
                  : modalType === "edit"
                    ? "編輯產品"
                    : "新增產品"}
              </h1>
              <button
                type="button"
                aria-label="Close"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              {modalType === "delete" ? (
                <p className="fs-4">
                  確定要刪除
                  <span className="text-danger">{tempData.title}</span>嗎？
                </p>
              ) : (
                <div className="container">
                  <div className="row">
                    <div className="col-4">
                      <div className="mb-3">
                        <label htmlFor="fileUpload" className="form-label">
                          上傳圖片
                        </label>
                        <input
                          type="file"
                          id="fileUpload"
                          name="fileUpload"
                          className="form-control"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => {
                            uploadImage(e);
                          }}
                        />
                      </div>
                      {/* imageUrl */}
                      <div className="form-floating">
                        <input
                          type="text"
                          id="imageUrl"
                          placeholder=""
                          name="imageUrl"
                          className="form-control"
                          value={tempData.imageUrl}
                          onChange={(e) => {
                            handleModalInputChange(e);
                          }}
                        />
                        <label htmlFor="imageUrl">主圖片</label>
                        <img
                          alt=""
                          className="w-100"
                          src={tempData.imageUrl || undefined}
                        />
                      </div>
                      {/* imagesUrl */}
                      {tempData.imagesUrl &&
                        tempData.imagesUrl.map((url: string, index: number) => {
                          return (
                            <div key={index}>
                              <div className="form-floating mt-3">
                                <input
                                  type="text"
                                  value={url}
                                  placeholder=""
                                  className="form-control"
                                  onChange={(e) => {
                                    handleModalImageChange(
                                      index,
                                      e.target.value,
                                    );
                                  }}
                                />
                                <img
                                  alt=""
                                  className="w-100"
                                  src={url || undefined}
                                />
                                <label htmlFor="imagesUrl1">輸入圖片網址</label>
                              </div>
                            </div>
                          );
                        })}
                      {tempData.imagesUrl.length < 5 &&
                        tempData.imagesUrl[tempData.imagesUrl.length - 1] !==
                          "" && (
                          <button
                            type="button"
                            onClick={handleAddImage}
                            className="btn btn-outline-primary w-100"
                          >
                            新增圖片
                          </button>
                        )}

                      {tempData.imagesUrl.length >= 1 && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="btn btn-outline-danger w-100"
                        >
                          刪除圖片
                        </button>
                      )}
                    </div>
                    <div className="col">
                      {/* title */}
                      <div className="form-floating mb-3 was-validated">
                        <input
                          required
                          id="title"
                          type="text"
                          name="title"
                          placeholder=""
                          value={tempData.title}
                          className="form-control"
                          onChange={(e) => {
                            handleModalInputChange(e);
                          }}
                        />
                        <label htmlFor="title">產品名稱(必填)</label>
                        <div className="invalid-feedback">
                          Please enter a message in the input.
                        </div>
                      </div>
                      <div className="row">
                        <div className="col mb-3">
                          {/* category */}
                          <div className="form-floating was-validated">
                            <input
                              required
                              type="text"
                              id="category"
                              placeholder=""
                              name="category"
                              className="form-control"
                              value={tempData.category}
                              onChange={(e) => {
                                handleModalInputChange(e);
                              }}
                            />
                            <label htmlFor="category" className="form-label">
                              分類(必填)
                            </label>
                            <div className="invalid-feedback">
                              Please enter a message in the input.
                            </div>
                          </div>
                        </div>
                        <div className="col mb-3">
                          {/* unit */}
                          <div className="form-floating was-validated">
                            <input
                              required
                              id="unit"
                              name="unit"
                              type="text"
                              placeholder=""
                              value={tempData.unit}
                              className="form-control"
                              onChange={(e) => {
                                // setUnit(e.target.value);
                                handleModalInputChange(e);
                              }}
                            />
                            <label htmlFor="unit">單位(必填)</label>
                            <div className="invalid-feedback">
                              Please enter a message in the input.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col mb-3">
                          {/* origin_price */}
                          <div className="form-floating was-validated needs-validation">
                            <input
                              min={0}
                              required
                              type="number"
                              placeholder=""
                              id="origin_price"
                              name="origin_price"
                              className="form-control"
                              value={tempData.origin_price}
                              onChange={(e) => {
                                // setOriginalPrice(Number.parseInt(e.target.value));
                                handleModalInputChange(e);
                              }}
                            />
                            <label htmlFor="original_price">原價(必填)</label>
                            <div className="invalid-feedback">
                              Please enter a message in the input.
                            </div>
                          </div>
                        </div>
                        <div className="col mb-3">
                          {/* price */}
                          <div className="form-floating was-validated">
                            <input
                              min={0}
                              required
                              id="price"
                              name="price"
                              type="number"
                              placeholder=""
                              value={tempData.price}
                              className="form-control"
                              onChange={(e) => {
                                handleModalInputChange(e);
                              }}
                            />
                            <label htmlFor="price">售價(必填)</label>
                            <div className="invalid-feedback">
                              Please enter a message in the input.
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* description */}
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          placeholder=""
                          id="description"
                          name="description"
                          className="form-control"
                          value={tempData.description}
                          onChange={(e) => {
                            handleModalInputChange(e);
                          }}
                        />
                        <label htmlFor="description">介紹</label>
                      </div>

                      {/* content */}
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="content"
                          name="content"
                          placeholder=""
                          className="form-control"
                          value={tempData.content}
                          onChange={(e) => {
                            // setContent(e.target.value);
                            handleModalInputChange(e);
                          }}
                        />
                        <label htmlFor="content">內容</label>
                      </div>

                      {/* is_enabled */}
                      <div className="form-check mb-3">
                        <input
                          placeholder=""
                          id="is_enabled"
                          // type="number"
                          type="checkbox"
                          name="is_enabled"
                          // className="form-control"
                          className="form-check-input"
                          checked={tempData.is_enabled}
                          onChange={(e) => {
                            handleModalInputChange(e);
                          }}
                        />
                        <label
                          htmlFor="is_enabled"
                          className="form-check-label"
                        >
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  closeModal();
                }}
              >
                取消
              </button>
              <button
                // type="button"
                className={`btn btn-${modalType === "delete" ? "danger" : "primary"}`}
                onClick={() => {
                  (modalType === "delete"
                    ? deleteProduct
                    : createOrUpdateProduct)(tempData.id);
                }}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModalComponent;
