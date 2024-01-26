import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav-container">
      <li>
        <NavLink to="/" className="logo">
          FlowBnB
        </NavLink>
      </li>
      {isLoaded && (
        <li>
          <div className="new-spot-menu">
            {sessionUser && (
              <NavLink to="/spots/new" className="new-spot">
                Create A Spot
              </NavLink>
            )}

            <div className="button-container">
              <ProfileButton user={sessionUser} />
            </div>
          </div>
        </li>
      )}
    </ul>
  );
}

export default Navigation;
