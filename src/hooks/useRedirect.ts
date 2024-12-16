import { useSearchParams, useNavigate } from "react-router-dom";

const useRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectTo = (defaultPath = "/") => {
    const redirect = searchParams.get("redirect") || defaultPath;
    navigate(redirect);
  };

  return { redirectTo };
};

export default useRedirect;
