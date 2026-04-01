import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect, useCallback } from "react";

import type { Root } from "../../types/cartProductType";

import { currency } from "../../utils/filter";
import { useMessage } from "../../hooks/useMessage";

const API_PATH = import.meta.env.VITE_API_PATH;
const API_BASE_URL = import.meta.env.VITE_API_BASE;

const Cart = () => {
  const [cart, setCart] = useState<Root>(); // 購物車
  const { showError, showSuccess } = useMessage();

  // 刷新購物車
  const getCart = useCallback(async () => {
    try {
      const url = `${API_BASE_URL}/v2/api/${API_PATH}/cart`;
      const response = await axios.get(url);
      setCart(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    }
  }, [showError]);

  // week5 - 更新購物車
  const updateCart = async (
    cartId: string,
    productId: string,
    qty: number = 1,
  ) => {
    const data = {
      qty: qty,
      product_id: productId,
    };
    try {
      const url = `${API_BASE_URL}/v2/api/${API_PATH}/cart/${cartId}`;
      const response = await axios.put(url, { data });
      showSuccess(response.data.message);
      getCart();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    }
  };

  // week5 - 刪除購物車(單項)
  const removeCart = async (id: string) => {
    try {
      const url = `${API_BASE_URL}/v2/api/${API_PATH}/cart/${id}`;
      const response = await axios.delete(url);
      showSuccess(response.data.message);
      getCart();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    }
  };

  // week5 - 清空購物車
  const removeCartAll = async () => {
    try {
      const url = `${API_BASE_URL}/v2/api/${API_PATH}/carts`;
      const response = await axios.delete(url);
      showSuccess(response.data.message);
      getCart();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    }
  };

  // debounce 避免修改購物車列表數量
  const debounceUpdateCart = useDebouncedCallback(
    (cartId: string, productId: string, qty: number = 1) => {
      // if (qty < 0) {
      //   qty = 1;
      // }
      updateCart(cartId, productId, qty);
    },
    500,
  );

  useEffect(() => {
    (async () => {
      await getCart();
    })();
  }, [getCart]);

  return (
    <div>
      {/* 購物車列表 */}
      <h2>購物車列表</h2>
      <div className="mt-4 text-end">
        <button
          type="button"
          disabled={!cart?.carts?.length}
          className="btn btn-outline-danger"
          onClick={() => {
            removeCartAll();
          }}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    removeCart(cartItem.id);
                  }}
                >
                  刪除
                </button>
              </td>
              <th scope="row">{cartItem.product.title}</th>
              <td>
                <div className="input-group mb-3">
                  <input
                    min={1}
                    type="number"
                    aria-label="數量"
                    placeholder="數量"
                    className="form-control"
                    defaultValue={cartItem.qty}
                    aria-describedby="basic-addon1"
                    onChange={(e) => {
                      // updateCart(
                      debounceUpdateCart(
                        cartItem.id,
                        cartItem.product_id,
                        Number(e.target.value),
                      );
                    }}
                  />
                  <span id="basic-addon1" className="input-group-text">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-end">
              總計
            </td>
            <td className="text-start">{currency(cart?.final_total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Cart;
