import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { logoutAction, isLoading } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutAction();
      navigate("/login");
    } catch (error) {
      console.error("Logout process failed:", error);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center space-x-2"
    >
      <LogOut size={16} />
      <span>{isLoading ? "Keluar..." : "Keluar"}</span>
    </Button>
  );
};

export default LogoutButton;
