import { Modal } from "bootstrap";

import type { ProductType } from "./productType";
export type productModalComponentType = {
  modalType: string;
  templateData: ProductType;
  productModal: React.RefObject<Modal | null>;
  fetchProducts: (e?: number) => Promise<void>;
  productModalRef: React.RefObject<HTMLDivElement | null>;
};
