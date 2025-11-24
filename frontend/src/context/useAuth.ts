import { useContext } from "react";
import AuthContext from "./authcontext"; // ✔️ correct

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
