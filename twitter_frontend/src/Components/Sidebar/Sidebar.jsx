import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../Redux/ActionTypes/ActionTypes";
import axios from "axios";
import OutsideClickHandler from "react-outside-click-handler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openProfile, setOpenProfile] = useState(false);
  const changeOpenProfile = () => {
    setOpenProfile(!openProfile);
  };
  const logoutUser = () => {
    const endpoint = "http://127.0.0.1:8000/users/sign_out/";
    axios.post(endpoint).then((res) => {
      const responseData = res.data;
      if (responseData.success) {
        localStorage.removeItem("authTokens");
        dispatch({
          type: LOGOUT,
          payload: {
            authenticated: false,
          },
        });
        navigate("/sign_in");
      }
    });
  };
  const { user } = useSelector((state) => state.reducer.reducer);
  const sidebar = useMemo(
    () => [
      {
        name: "Home",
        to: "/",
        path: "M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z",
      },
      {
        name: "Explore",
        to: "/explore",
        path: "M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z",
      },
      // {
      //   name: "Notifications",
      //   to: "/notifications",
      //   path: "M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z",
      // },
      {
        name: "Requests",
        to: "/requests",
        path: "M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z",
      },
      {
        name: "Messages",
        to: "/messages",
        path: "M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z",
      },
      // {
      //   name: "Profile",
      //   to: `/${user?.username}`,
      //   path: "M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z",
      // },
      {
        name: "Post",
        to: `/post`,
        path: "M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z",
      },
    ],
    []
  );
  return (
    <aside className="sticky  top-0 items-center px-2  border-r border-gray-300">
      <nav className="relative h-[100vh] flex flex-col flex-1 space-y-6 ">
        <Link to={"/"} className="items-center p-2 mpt-0">
          <img
            className="w-1/2 rounded-3xl"
            height={"100"}
            src="/twista_logo.png"
            alt="Twista Logo"
            decoding="async"
          />
          {/* <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={'h-[30px]' }
          >
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </g>
          </svg> */}
        </Link>
        {sidebar.map((item) => (
          <Link
            className="grid grid-cols-5 gap-x-1 items-center p-2 my-2"
            to={item.to}
          >
            {item.to === "/post" ? (
              <FontAwesomeIcon className=" text-xl" icon={faLocationArrow} />
            ) : (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="inline h-[25px] grid-cols-1"
              >
                <g>
                  <path d={item.path} />
                </g>
              </svg>
            )}
            <span className="flex-1 text-base font-medium grid-cols-4">
              {item.name}
            </span>
          </Link>
        ))}
        <div className="w-[-webkit-fill-available] absolute bottom-0">
          {openProfile ? (
            <OutsideClickHandler onOutsideClick={changeOpenProfile}>
              <ul className="shadow-lg rounded-xl">
                <Link
                  onClick={changeOpenProfile}
                  to={`/${user?.username}`}
                  // className="flex-1 text-base font-medium grid-cols-4"
                  className="grid grid-cols-5 gap-x-1 items-center p-2 cursor-pointer hover:bg-gray-200 rounded-xl"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="inline h-[25px] col-span-1"
                  >
                    <g>
                      <path
                        d={
                          "M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"
                        }
                      />
                    </g>
                  </svg>
                  <span className="flex-1 text-base font-medium col-span-4">
                    Profile
                  </span>
                </Link>
                <hr />
                <li
                  // className="flex-1 text-base font-medium grid-cols-4"
                  onClick={logoutUser}
                  className="grid grid-cols-5 gap-x-1 items-center p-2 cursor-pointer hover:bg-gray-200 rounded-xl"
                >
                  <FontAwesomeIcon
                    className="col-span-1 ml-1"
                    icon={faRightFromBracket}
                  />
                  <span className="flex-1 text-base font-medium col-span-4">
                    Logout
                  </span>
                </li>
              </ul>
            </OutsideClickHandler>
          ) : null}
          <span
            className="flex items-center p-2 my-2 cursor-pointer hover:bg-gray-200"
            onClick={changeOpenProfile}
            // to={item.to}
          >
            <div className={"flex h-[40px] w-[40px] mr-2  rounded-full"}>
              <img
                className={" rounded-full"}
                src={user?.profile_picture}
              />
            </div>
            <span className="flex-1 text-base font-medium ">
              {user?.full_name}
            </span>
          </span>
        </div>
      </nav>
    </aside>
  );
};
export default Sidebar;
