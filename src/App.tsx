import { RouterProvider } from "react-router";

import router from "./routes";
import MessageToast from "./components/MessageToast";

const App = () => {
  return (
    <>
      <MessageToast />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
