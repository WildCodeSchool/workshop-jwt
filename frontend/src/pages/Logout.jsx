const Logout = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO your code here
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='submit' value='Disconnect' />
    </form>
  );
};

export default Logout;
