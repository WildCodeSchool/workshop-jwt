function Logout() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='submit' value='Disconnect' />
    </form>
  );
};

export default Logout;
