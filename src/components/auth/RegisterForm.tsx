import React, { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import authService from "@/services/authService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username minimal 3 karakter." })
      .max(50, { message: "Username maksimal 50 karakter." }),
    email: z
      .string()
      .email({ message: "Format email tidak valid." })
      .min(1, { message: "Email tidak boleh kosong." }),
    password: z
      .string()
      .min(6, { message: "Password minimal 6 karakter." })
      .min(1, { message: "Password tidak boleh kosong." }),
    password_confirmation: z
      .string()
      .min(1, { message: "Konfirmasi password tidak boleh kosong." }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["password_confirmation"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const {
    setLoading,
    setError,
    isLoading,
    error: authError,
    clearError,
  } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmationInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting, dirtyFields },
    setValue,
    trigger,
    watch,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    mode: "onTouched",
  });

  const watchedUsername = watch("username");
  const watchedEmail = watch("email");
  const watchedPassword = watch("password");
  const watchedPasswordConfirmation = watch("password_confirmation");

  useEffect(() => {
    const checkForAutofill = () => {
      const isUsernameDirty = dirtyFields && dirtyFields.username;
      const isEmailDirty = dirtyFields && dirtyFields.email;
      const isPasswordDirty = dirtyFields && dirtyFields.password;
      const isPasswordConfirmationDirty =
        dirtyFields && dirtyFields.password_confirmation;

      if (
        usernameInputRef.current &&
        usernameInputRef.current.value &&
        usernameInputRef.current.value !== watchedUsername &&
        !isUsernameDirty
      ) {
        console.log(
          "[Autofill Sync] Username DOM value differs. Updating RHF state.",
        );
        setValue("username", usernameInputRef.current.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (
        emailInputRef.current &&
        emailInputRef.current.value &&
        emailInputRef.current.value !== watchedEmail &&
        !isEmailDirty
      ) {
        console.log(
          "[Autofill Sync] Email DOM value differs. Updating RHF state.",
        );
        setValue("email", emailInputRef.current.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (
        passwordInputRef.current &&
        passwordInputRef.current.value &&
        passwordInputRef.current.value !== watchedPassword &&
        !isPasswordDirty
      ) {
        console.log(
          "[Autofill Sync] Password DOM value differs. Updating RHF state.",
        );
        setValue("password", passwordInputRef.current.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (
        passwordConfirmationInputRef.current &&
        passwordConfirmationInputRef.current.value &&
        passwordConfirmationInputRef.current.value !==
          watchedPasswordConfirmation &&
        !isPasswordConfirmationDirty
      ) {
        console.log(
          "[Autofill Sync] Password Confirmation DOM value differs. Updating RHF state.",
        );
        setValue(
          "password_confirmation",
          passwordConfirmationInputRef.current.value,
          { shouldValidate: true, shouldDirty: true },
        );
      }
    };
    const timeoutId = setTimeout(checkForAutofill, 50);
    return () => clearTimeout(timeoutId);
  }, [
    setValue,
    watchedUsername,
    watchedEmail,
    watchedPassword,
    watchedPasswordConfirmation,
    dirtyFields,
  ]);

  useEffect(() => {
    const capturedClearError = clearError;
    return () => {
      if (typeof capturedClearError === "function") {
        capturedClearError();
      } else {
        try {
          useAuthStore.getState().clearError();
        } catch (e) {
          console.error(
            "Error calling clearError on unmount from RegisterForm:",
            e,
          );
        }
      }
    };
  }, [clearError]);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    if (typeof setLoading === "function") setLoading(true);
    else console.warn("setLoading is not a function");
    if (typeof clearError === "function") clearError();
    else console.warn("clearError is not a function");

    try {
      const { password_confirmation, ...apiData } = data;
      const response = await authService.register(apiData);
      console.log("Registrasi berhasil (processed response object):", response);

      if (response.user) {
        if (typeof onRegisterSuccess === "function") {
          onRegisterSuccess();
        }
      } else {
        const errorMessage =
          response.message ||
          "Respons API tidak sesuai format yang diharapkan setelah registrasi.";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("Registrasi gagal (caught error):", err);
      let displayErrorMessage = "Terjadi kesalahan saat registrasi.";
      if (err && err.message) {
        displayErrorMessage = err.message;
        if (
          err.name === "ValidationError" &&
          err.details &&
          err.details.errors
        ) {
          const fieldErrors = err.details.errors
            .map((e: any) => e.message)
            .join(" ");
          displayErrorMessage = `${err.message}: ${fieldErrors}`;
        } else if (err.name && err.message) {
          displayErrorMessage = `${err.message}`;
        }
      }
      if (typeof setError === "function") setError(displayErrorMessage);
      else console.warn("setError is not a function");
    } finally {
      if (typeof setLoading === "function") setLoading(false);
      else console.warn("setLoading is not a function");
    }
  };

  const handleInputChange = (fieldName: keyof RegisterFormInputs) => {
    if (typeof clearError === "function") {
      clearError();
    }
    if (typeof trigger === "function") {
      trigger(fieldName);
    } else {
      console.warn("trigger is not a function");
    }
  };

  const { ref: usernameFieldRefHookForm, ...usernameRest } =
    register("username");
  const { ref: emailFieldRefHookForm, ...emailRest } = register("email");
  const { ref: passwordFieldRefHookForm, ...passwordRest } =
    register("password");
  const {
    ref: passwordConfirmationFieldRefHookForm,
    ...passwordConfirmationRest
  } = register("password_confirmation");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {authError && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 text-red-700"
        >
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Registrasi Gagal</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="username" className="text-brand-text">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          {...usernameRest}
          ref={(e) => {
            usernameFieldRefHookForm(e);
            usernameInputRef.current = e;
          }}
          placeholder="Username Anda"
          className={`${errors.username && dirtyFields.username ? "border-red-500 focus:border-red-500" : "border-brand-muted/70 focus:border-brand-primary"} mt-1 rounded-md px-3 py-2.5 shadow-sm`}
          onChange={() => handleInputChange("username")}
          autoComplete="username"
        />
        {errors.username && dirtyFields.username && (
          <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="text-brand-text">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...emailRest}
          ref={(e) => {
            emailFieldRefHookForm(e);
            emailInputRef.current = e;
          }}
          placeholder="Email Anda"
          className={`${errors.email && dirtyFields.email ? "border-red-500 focus:border-red-500" : "border-brand-muted/70 focus:border-brand-primary"} mt-1 rounded-md px-3 py-2.5 shadow-sm`}
          onChange={() => handleInputChange("email")}
          autoComplete="email"
        />
        {errors.email && dirtyFields.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className="text-brand-text">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...passwordRest}
            ref={(e) => {
              passwordFieldRefHookForm(e);
              passwordInputRef.current = e;
            }}
            placeholder="Minimal 6 karakter"
            className={`${errors.password && dirtyFields.password ? "border-red-500 focus:border-red-500" : "border-brand-muted/70 focus:border-brand-primary"} mt-1 rounded-md px-3 py-2.5 shadow-sm`}
            onChange={() => handleInputChange("password")}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-brand-muted hover:text-brand-primary absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && dirtyFields.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password_confirmation" className="text-brand-text">
          Konfirmasi Password
        </Label>
        <div className="relative">
          <Input
            id="password_confirmation"
            type={showConfirmPassword ? "text" : "password"}
            {...passwordConfirmationRest}
            ref={(e) => {
              passwordConfirmationFieldRefHookForm(e);
              passwordConfirmationInputRef.current = e;
            }}
            placeholder="Ulangi password"
            className={`${errors.password_confirmation && dirtyFields.password_confirmation ? "border-red-500 focus:border-red-500" : "border-brand-muted/70 focus:border-brand-primary"} mt-1 rounded-md px-3 py-2.5 shadow-sm`}
            onChange={() => handleInputChange("password_confirmation")}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-brand-muted hover:text-brand-primary absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
            aria-label={
              showConfirmPassword
                ? "Sembunyikan konfirmasi password"
                : "Tampilkan konfirmasi password"
            }
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password_confirmation && dirtyFields.password_confirmation && (
          <p className="mt-1 text-xs text-red-600">
            {errors.password_confirmation.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="bg-brand-accent text-brand-text w-full rounded-lg py-2.5 font-semibold shadow-md transition-all hover:bg-opacity-90 hover:shadow-lg"
        disabled={isFormSubmitting || isLoading}
      >
        {isFormSubmitting || isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        {isFormSubmitting || isLoading ? "Memproses..." : "Daftar Akun"}
      </Button>
    </form>
  );
};

export default RegisterForm;
