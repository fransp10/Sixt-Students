import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/auth/useLogin";
import { getErrorMessage } from "../helpers/getErrorMessage";

function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const loginMutation = useLogin();
  const navigate = useNavigate();

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    if (typeof username !== "string" || typeof password !== "string") {
      console.error("Username or password is not a string");
      return;
    }

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          navigate(data.user?.user_role === "admin" ? "/admin" : "/student");
        },
      },
    );
  }

  return (
    <div className="bg-cardBG text-primaryText flex flex-col gap-6 w-full max-w-md p-8 rounded-xl border border-borderDividers ">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">Login</h1>
        <p className="text-secondaryText text-base">
          Welcome back! Please log in to continue.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <div className="flex items-center gap-3 h-12 px-3 rounded-lg border border-borderDividers bg-pageBackground focus-within:border-primary transition-colors">
            <UserIcon className="size-5 shrink-0 text-icons" />
            <input
              id="username"
              name="username"
              type="text"
              className="w-full h-full bg-transparent text-xs sm:text-base placeholder:text-icons focus:outline-none"
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="flex items-center gap-3 h-12 px-3 rounded-lg border border-borderDividers bg-pageBackground focus-within:border-primary transition-colors">
            <LockClosedIcon className="size-5 shrink-0 text-icons" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full h-full bg-transparent text-xs sm:text-base placeholder:text-icons focus:outline-none"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="shrink-0 text-icons hover:text-primaryText hover:cursor-pointer"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeIcon className="size-5" />
              ) : (
                <EyeSlashIcon className="size-5" />
              )}
            </button>
          </div>
        </div>

        {loginMutation.isError && (
          <p
            role="alert"
            className="text-sm text-danger flex items-center gap-1"
          >
            <ExclamationCircleIcon className="size-4 shrink-0" />
            {getErrorMessage(loginMutation.error, "Login failed")}
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-2 h-12 w-full rounded-lg bg-primary text-lg font-semibold text-primaryText hover:bg-primaryHover hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? "Logging in…" : "Login"}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <hr className="w-full border-borderDividers" />
          <p className="text-nowrap text-sm text-secondaryText">Need access?</p>
          <hr className="w-full border-borderDividers" />
        </div>
        <p className="text-center text-sm text-secondaryText">
          Contact your administrator if you need access.
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
