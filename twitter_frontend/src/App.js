import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Components/Pages/Home/Home";
import SignUp from "./Components/Pages/SignUp/SignUp";
import SignIn from "./Components/Pages/SignIn/SignIn";
import Trending from "./Components/Pages/Trending/Trending";
import Profile from "./Components/Pages/Profile/Profile";
import Explore from "./Components/Pages/Explore/Explore";
import Bookmarks from "./Components/Pages/Bookmark/Bookmarks";
import Notifications from "./Components/Pages/Notifications/Notifications";
import Messages from "./Components/Pages/Messages/Messages";
import { AuthProvider } from "./Components/Authentication/AuthProvider";
import AuthRoute from "./Components/Authentication/AuthRoute";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<AuthRoute element={<Home />} />} />
            <Route
              exact
              path="/:profile"
              element={<AuthRoute element={<Profile />} />}
            />
            <Route
              exact
              path="/:profile/:view_type"
              element={<AuthRoute element={<Profile />} />}
            />
            <Route
              path="/compose/post/"
              exact
              element={<AuthRoute element={<Home />} isSign={true} />}
            />
            <Route exact path="/sign_in" element={<SignIn />} />
            <Route exact path="/sign_up" element={<SignUp />} />
            <Route
              exact
              path="/trending"
              element={<AuthRoute element={<Trending />} />}
            />
            <Route
              exact
              path="/explore"
              element={<AuthRoute element={<Explore />} />}
            />
            <Route
              exact
              path="/explore/:search"
              element={<AuthRoute element={<Explore />} />}
            />
            <Route
              exact
              path="/explore/tabs/:tab"
              element={<AuthRoute element={<Explore />} />}
            />
            <Route
              exact
              path="/bookmarks"
              element={<AuthRoute element={<Bookmarks />} />}
            />
            <Route
              exact
              path="/notification"
              element={<AuthRoute element={<Notifications />} />}
            />
            <Route
              exact
              path="/messages"
              element={<AuthRoute element={<Messages />} />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
