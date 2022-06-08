import useAxios from "../hooks/useAxios";

function Logout() {
  const axios = useAxios();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.get("users/logout").then(() => {
      alert("Successfully logged out");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='submit' value='Disconnect' />
    </form>
  );
}

export default Logout;
