import loginBackground from "../assets/loginBackgroundImage-compressed.png";
import sixtStudentsLogo from "../assets/sixtStudentsLogo.png";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div
      className="min-h-dvh w-full bg-cover bg-center bg-black/50 bg-blend-darken flex flex-col items-center justify-center gap-8 px-4 py-8"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <img
        src={sixtStudentsLogo}
        alt="Sixt Students App"
        className="w-full justify-start max-w-106 h-auto"
      />

      <LoginForm />
    </div>
  );
}

export default Login;
