import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex flex-col gap-4">
      <p>404 Not found</p>
      <Link to="/">Go back to the home page</Link>
    </div>
  );
}

export default NotFoundPage;
