import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUser = () => {
    setCredential("Guest");
    setPassword("123456");
  };

  return (
    <div className="main">
      <h1 className="login-signup">Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Enter Your Username or Email"
            className="credential-input"
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter Your Password"
            className="password-input"
          />
        </label>
        {errors.credential && <p className="errors">{errors.credential}</p>}
        <button
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
          className="login-button"
        >
          Log In
        </button>
        <button className="demo-button" onClick={demoUser}>
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
