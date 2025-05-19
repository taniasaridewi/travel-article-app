import React, { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import authService from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Format email tidak valid" })
    .min(1, { message: "Email tidak boleh kosong" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const {
    loginAction,
    setLoading,
    setError,
    isLoading,
    error: authError,
    clearError,
  } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting, dirtyFields },
    setValue,
    trigger,
    watch,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  useEffect(() => {
    const checkForAutofill = () => {
      const isEmailDirtyByRHF = dirtyFields && dirtyFields.email;
      const isPasswordDirtyByRHF = dirtyFields && dirtyFields.password;

      if (
        emailInputRef.current &&
        emailInputRef.current.value &&
        emailInputRef.current.value !== watchedEmail &&
        !isEmailDirtyByRHF
      ) {
        setValue("email", emailInputRef.current.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (
        passwordInputRef.current &&
        passwordInputRef.current.value &&
        passwordInputRef.current.value !== watchedPassword &&
        !isPasswordDirtyByRHF
      ) {
        setValue("password", passwordInputRef.current.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    };
    const timeoutId = setTimeout(checkForAutofill, 50);
    return () => clearTimeout(timeoutId);
  }, [setValue, watchedEmail, watchedPassword, dirtyFields]);

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
            "Error calling clearError on unmount from LoginForm:",
            e,
          );
        }
      }
    };
  }, [clearError]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    if (typeof setLoading === "function") setLoading(true);
    else console.warn("setLoading is not a function");
    if (typeof clearError === "function") clearError();
    else console.warn("clearError is not a function");

    try {
      const response = await authService.login(data);
      console.log("Login successful (processed response object):", response);

      if (response.user && response.token) {
        if (typeof loginAction === "function") {
          loginAction(response);

          if (typeof onLoginSuccess === "function") {
            onLoginSuccess();
          }

          navigate("/");
        } else {
          console.error("loginAction is not a function in LoginForm");
          if (typeof setError === "function")
            setError("Terjadi kesalahan internal saat login.");
          else console.warn("setError is not a function");
        }
      } else {
        const errorMessage =
          response.message ||
          "Data pengguna atau token tidak valid setelah login.";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("Login failed (caught error):", err);
      let displayErrorMessage = "Terjadi kesalahan saat login.";
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

  const handleInputChange = (fieldName: "email" | "password") => {
    if (typeof clearError === "function") {
      clearError();
    }
    if (typeof trigger === "function") {
      trigger(fieldName);
    } else {
      console.warn("trigger is not a function");
    }
  };

  const { ref: emailFieldRefHookForm, ...emailRest } = register("email");
  const { ref: passwordFieldRefHookForm, ...passwordRest } =
    register("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {authError && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 text-red-700"
        >
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Login Gagal</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
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
          className={`${errors.email ? "border-red-500 focus:border-red-500" : "border-brand-muted/70 focus:border-brand-primary"} mt-1 rounded-md px-3 py-2.5 shadow-sm`}
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
            placeholder="Password Anda"
            className={`${errors.password && dirtyFields.password ? "border-red-500 focus:border-red-500" : "border-brand-muted/70 focus:border-brand-primary"} mt-1 rounded-md px-3 py-2.5 shadow-sm`}
            onChange={() => handleInputChange("password")}
            autoComplete="current-password"
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

      <Button
        type="submit"
        className="bg-brand-primary w-full rounded-lg py-2.5 font-semibold text-white shadow-md transition-all hover:bg-opacity-80 hover:shadow-lg"
        disabled={isFormSubmitting || isLoading}
      >
        {isFormSubmitting || isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        {isFormSubmitting || isLoading ? "Memproses..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
