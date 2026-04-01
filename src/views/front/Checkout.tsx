import { useForm } from "react-hook-form";
import axios, { isAxiosError } from "axios";

import type { FormDataType } from "../../types/formDataType";

import { useMessage } from "../../hooks/useMessage";

const API_PATH = import.meta.env.VITE_API_PATH;
const API_BASE_URL = import.meta.env.VITE_API_BASE;

const Checkout = () => {
  const { showError, showSuccess } = useMessage();
  // 送出訂單
  const onSubmit = async (formData: FormDataType) => {
    try {
      const data = {
        data: {
          message: formData.message,
          user: {
            tel: formData.tel,
            name: formData.name,
            email: formData.email,
            address: formData.address,
          },
        },
      };
      const url = `${API_BASE_URL}/v2/api/${API_PATH}/order`;
      const res = await axios.post(url, data);
      showSuccess(res.data.message);
      reset(); // 送出後清空表單
    } catch (error) {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    }
  };

  // react-hook-form
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormDataType>({ mode: "onChange" });

  return (
    <>
      <div className="container">
        {/* 第6次主線 */}
        {/* 結帳頁面 */}
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                {...register("email", {
                  required: { value: true, message: "信箱必填" },
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Email格式不正確",
                  },
                })}
                type="email"
                placeholder="請輸入 Email"
                className="form-control"
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message as string}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                id="name"
                {...register("name", {
                  required: { value: true, message: "請輸入姓名" },
                  minLength: { value: 2, message: "姓名至少2個字" },
                })}
                type="text"
                placeholder="請輸入姓名"
                className="form-control"
              />
              {errors.name && (
                <p className="text-danger">{errors.name.message as string}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                id="tel"
                {...register("tel", {
                  required: "請輸入收件人電話",
                  minLength: { value: 8, message: "電話至少8碼" },
                  pattern: { value: /^\d+$/, message: "電話只能輸入數字" },
                })}
                type="tel"
                placeholder="請輸入電話"
                className="form-control"
              />
              {errors.tel && (
                <p className="text-danger">{errors.tel.message as string}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                type="text"
                id="address"
                {...register("address", { required: "請輸入收件人地址" })}
                placeholder="請輸入地址"
                className="form-control"
              />
              {errors.address && (
                <p className="text-danger">
                  {errors.address.message as string}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                cols={30}
                rows={10}
                id="message"
                className="form-control"
                {...register("message")}
              ></textarea>
            </div>
            <div className="text-end">
              <button
                type="submit"
                disabled={!isValid}
                className="btn btn-danger"
              >
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
