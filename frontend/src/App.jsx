import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from "./components/Navigation/Navigation-bonus";
import * as sessionActions from "./store/session";
import LandingPage from "./components/LandingPage/LandingPage";
import SpotInfo from "./components/SpotInfo/SpotInfo";
import ManageSpots from "./components/ManageSpots/ManageSpots";
import UpdateSpot from "./components/UpdateSpot/UpdateSpot";
import CreateSpot from "./components/CreateSpot/CreateSpot";
import { Modal } from "./context/Modal";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Modal />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotInfo />,
        children: [
          {
            path: "/spots/*",
            element: <h1>404 Not Found</h1>,
          },
        ],
      },
      {
        path: "/spots/current",
        element: <ManageSpots />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <UpdateSpot />,
      },
      {
        path: "/spots/new",
        element: <CreateSpot />,
      },
      {
        path: "*",
        element: <h1>404 Not Found</h1>,
      },
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
