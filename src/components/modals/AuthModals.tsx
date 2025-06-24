import React, { useEffect } from "react";
import { useModalStore } from "@/store/modalStore";
import ModalDialog from "@/components/common/ModalDialog";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useToast } from "@/hooks/use-toast";

const AuthModals: React.FC = () => {
  const { currentOpenModal, closeModal, openModal } =
    useModalStore();
  const { toast } = useToast();

  useEffect(() => {
    console.log(
      "[AuthModals.tsx] currentOpenModal state changed to:",
      currentOpenModal,
    );
  }, [currentOpenModal]);

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      console.log(
        "[AuthModals.tsx] Modal closing via onOpenChange for:",
        currentOpenModal,
      );
      closeModal();
    }
  };

  return (
    <>
      <ModalDialog
        isOpen={currentOpenModal === "login"}
        onOpenChange={handleModalOpenChange}
        title="Login Akun Anda"
        description="Masuk untuk melanjutkan ke TravelArticle."
        className="sm:max-w-md"
      >
        <LoginForm
          onLoginSuccess={() => {
            toast({
              title: "Login Berhasil!",
              description: "Selamat datang kembali.",
            });
            closeModal();
          }}
        />
      </ModalDialog>

      <ModalDialog
        isOpen={currentOpenModal === "register"}
        onOpenChange={handleModalOpenChange}
        title="Buat Akun Baru"
        description="Daftar untuk mulai berbagi dan menjelajahi artikel perjalanan."
        className="sm:max-w-md"
      >
        <RegisterForm
          onRegisterSuccess={() => {
            toast({
              title: "Registrasi Berhasil!",
              description: "Akun Anda telah dibuat. Silakan login.",
            });
            closeModal();
            if (typeof openModal === "function") openModal("login");
          }}
        />
      </ModalDialog>
    </>
  );
};

export default AuthModals;
