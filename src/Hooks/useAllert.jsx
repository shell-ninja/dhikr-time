import { useContext } from "react";
import { AlertContext } from "../App"; // Adjust path if needed

const useAlert = () => {
  const { alert, showAlert, hideAlert } = useContext(AlertContext);

  return { alert, showAlert, hideAlert };
};

export default useAlert;
