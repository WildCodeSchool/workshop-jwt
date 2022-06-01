const Logout = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO your code here
  };

  return (
    <form>
      <button type='button' onClick={handleSubmit}>
        Disconnect
      </button>
    </form>
  );
};

export default Logout;
