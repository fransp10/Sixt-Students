import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState, type MouseEvent, type SubmitEvent } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  function togglePasswordVisibility(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    login({ username: username as string, password: password as string });
    navigate("/admin");
  }
  return (
    <div className="bg-cardBG text-primaryText flex flex-col gap-4 w-full max-w-2xl p-6 rounded-xl  m-auto  border-borderDividers border   ">
      <div className="flex flex-col items-center justify-center gap-2 ">
        <h1 className="text-3xl font-semibold">Login</h1>
        <p className="text-l text-secondaryText">
          Welcome back! Please log in to continue.
        </p>
      </div>

      <form
        className="flex flex-col gap-2 p-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="items-start">
            Username
          </label>

          <div className="flex gap-2 items-center w-full h-16 outline-1 outline-borderDividers p-2">
            <UserIcon className="size-8 text-icons" />
            <input
              name="username"
              className="w-full h-full  text-xl focus-within:outline-none"
              placeholder="Enter your username"
              type="text"
              id="username"
              autoComplete="username"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label>Password</label>
          <div className="flex gap-2 items-center w-full h-16 outline-1 outline-borderDividers p-2">
            <LockClosedIcon className="size-8 text-icons" />
            <input
              name="password"
              className="w-full h-full text-xl focus-within:outline-none "
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
            />
            <button
              className="hover:cursor-pointer"
              onClick={(e) => togglePasswordVisibility(e)}
            >
              {showPassword ? (
                <EyeIcon className="size-6  " />
              ) : (
                <EyeSlashIcon className="size-6 " />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className=" mt-12 rounded-xl bg-primary w-full h-14 text-primaryText font-semibold hover:cursor-pointer text-2xl items-center justify-center flex gap-2 hover:bg-primaryHover"
        >
          Login
        </button>
      </form>
      <div className="flex flex-row gap-4 items-center justify-center">
        <hr className="border-borderDividers  w-full" />
        <p className="text-nowrap text-secondaryText">Need access?</p>
        <hr className="border-borderDividers  w-full" />
      </div>
      <p className="text-center text-secondaryText">
        Contact your administrator if you need access.
      </p>
    </div>
  );
}

export default LoginForm;
