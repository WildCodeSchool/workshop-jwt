import axios from "axios";
import { useNavigate } from "react-router-dom";

function useAxios() {
  const navigate = useNavigate();

  const Api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/`,
  });

  Api.interceptors.request.use(
    function (config) {
      return {
        ...config,
        withCredentials: true,
      };
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  Api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (axios.isAxiosError(error)) {
        if (error.response.status === 401) {
          alert("You're not authenticated");
          navigate("/login");
        }
        if (error.response.status === 403) {
          alert("You're not authorized");
          navigate("/login");
        }
      }
      return Promise.reject(error);
    }
  );

  return Api;
}

export default useAxios;
