import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="signup-container">
      <h1 className="login-signup">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter Your Email"
            className="input"
          />
        </label>
        {errors.email && <p className="input-error">{errors.email}</p>}
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter Your Username"
            className="input"
          />
        </label>
        {errors.username && <p className="input-error">{errors.username}</p>}
        <label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Enter Your First Name"
            className="input"
          />
        </label>
        {errors.firstName && <p className="input-error">{errors.firstName}</p>}
        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Enter Your Last Name"
            className="input"
          />
        </label>
        {errors.lastName && <p className="input-error">{errors.lastName}</p>}
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter Your Password"
            className="input"
          />
        </label>
        {errors.password && <p className="input-error">{errors.password}</p>}
        <label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Your Password"
            className="input"
          />
        </label>
        {errors.confirmPassword && (
          <p className="input-error">{errors.confirmPassword}</p>
        )}
        <button
          type="submit"
          disabled={
            !confirmPassword ||
            !email ||
            !username ||
            !firstName ||
            !lastName ||
            !password ||
            username.length < 4 ||
            password.length < 6
          }
          className="signup-button"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
