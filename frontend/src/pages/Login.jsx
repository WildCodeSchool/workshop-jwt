import { useState } from "react";
import useAxios from "../hooks/useAxios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const axios = useAxios();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email && password) {
      // don't forget to import the axios module
      axios
        .post("users/login", { email, password })
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          alert("Successfully logged in");
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    } else {
      alert("Please specify both email and password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='email'>
        Email:
        <input
          type='email'
          name='email'
          id='email'
          placeholder='test@blabla.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label htmlFor='password'>
        Password:
        <input
          type='password'
          name='password'
          id='password'
          placeholder='***********'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <input type='submit' value='Login' />
    </form>
  );
}

export default Login;
