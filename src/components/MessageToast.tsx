import { useSelector } from "react-redux";

import type { RootType } from "../store/store";

const MessageToast = () => {
  const messages = useSelector((state: RootType) => state.message);
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      {messages.map((message) => {
        return (
          <div
            role="alert"
            key={message.id}
            aria-atomic="true"
            aria-live="assertive"
            className="toast show"
          >
            <div className={`toast-header text-white bg-${message.type}`}>
              <strong className="me-auto">{message.title}</strong>
              <button
                type="button"
                aria-label="Close"
                className="btn-close"
                data-bs-dismiss="toast"
              ></button>
            </div>
            <div className="toast-body">{message.text}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageToast;
