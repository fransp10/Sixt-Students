import loginBackground from "../assets/loginBackgroundImage.png";
import sixtStudentsLogo from "../assets/sixtStudentsLogo.png";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center brightness-100 bg-black/50 bg-blend-darken "
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <img src={sixtStudentsLogo} width={425} height={225} />
      <LoginForm />
    </div>
  );
}

export default Login;
