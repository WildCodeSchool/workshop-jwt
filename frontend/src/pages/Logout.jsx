import axios from "axios";

const Logout = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {
        withCredentials: true,
      })
      .then(() => {
        alert("Successfully logged out");
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("You're not authenticated");
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='submit' value='Disconnect' />
    </form>
  );
};

export default Logout;
