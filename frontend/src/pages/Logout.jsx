import useAxios from "../hooks/useAxios";

function Logout() {
  const { logout } = useAxios();

  const handleSubmit = (event) => {
    event.preventDefault();
    logout().then(() => {
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
