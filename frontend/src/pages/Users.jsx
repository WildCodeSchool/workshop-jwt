import { useState, useEffect } from "react";
import useAxios from "../hooks/useAxios";

function Users() {
  const [users, setUsers] = useState([]);
  const axios = useAxios();

  useEffect(() => {
    axios
      .get("users")
      .then((res) => res.data)
      .then((data) => {
        setUsers(data);
      });
  }, []);

  return (
    <div>
      <p>Users List</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            Email: {user.email} - Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
