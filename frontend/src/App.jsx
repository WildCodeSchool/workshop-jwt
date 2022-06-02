import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Logout from "./pages/Logout";

function App() {
  return (
    <Router>
      <div className='app'>
        <nav>
          <ul>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/users'>Users</Link>
            </li>
            <li>
              <Link to='/logout'>Disconnect</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/users' element={<Users />} />
          <Route exact path='/logout' element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
