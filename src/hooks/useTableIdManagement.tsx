import { useCallback } from "react";
import Cookies from "js-cookie";

export const useTableIdManagement = () => {
  const setTableId = useCallback((id) => {
    if (id) {
      Cookies.set("tableId", id, { expires: 6 / 24, path: "/" });
    }
  }, []);
  const getTableId = useCallback(() => {
    return Cookies.get("tableId") || null;
  }, []);
  const removeTableId = useCallback(() => {
    Cookies.remove("tableId", { path: "/" });
  }, []);

  return { getTableId, setTableId, removeTableId };
};
