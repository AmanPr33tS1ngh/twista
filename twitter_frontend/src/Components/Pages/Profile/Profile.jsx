import React, { useEffect, useMemo, useState } from "react";
import axios from "../../Redux/Axios/axios";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../../ReUsableComponents/Post/Post";
import ImageUploader from "../../ReUsableComponents/ImageUploader/ImageUploader";
import ModalBackground from "../../ReUsableComponents/ModalBackground/ModalBackground";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faLocationDot,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import EditProfile from "../../ReUsableComponents/EditProfile/EditProfile";

const Profile = () => {
  const { profile, view_type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, [profile, view_type]);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [uploadProfilePicture, setUploadProfilePicture] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [editModal, setEditModal] = useState(false);

  const buttons = useMemo(
    () => [
      { name: "Posts", to: "" },
      { name: "Replies", to: "replies" },
      { name: "Likes", to: "likes" },
      { name: "Bookmarks", to: "bookmarks" },
    ],
    []
  );

  const getProfile = () => {
    const endpoint = "http://127.0.0.1:8000/users/get_profile/";
    const data = { profile: profile, view_type: view_type };
    console.log("data getprofile", data);
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;
      console.log("responseData getprofile", responseData);

      const user = responseData.user;
      const posts = responseData.posts;
      setUser(user);
      setPosts(posts || []);
    });
  };
  const navigateTo = (type) => {
    navigate(`/${user?.username}/${type}`);
  };

  const actions = (e, post, action_type) => {
    console.log("post, action_type", post, action_type);
    e.stopPropagation();
    if (action_type === "comment") {
      navigate(`/post/${post?.user?.username}/${post?.id}`);
      return;
    }
    let endpoint = `http://127.0.0.1:8000/tweets/take_action/`;
    if (!user?.username) return;
    axios
      .post(endpoint, {
        tweet_id: post?.id,
        user: user?.username,
        action_type: action_type,
      })
      .then((res) => {
        let responseData = res.data;
        console.log("acionts", responseData);
        if (responseData.success) {
          const newPost = posts?.filter((p) => {
            if (p.id === post?.id) {
              if (action_type === "bookmark") {
                p.is_bookmarked = !p.is_bookmarked;
              } else if (action_type === "like") {
                p.is_liked = !p.is_liked;
                if (p.is_liked) {
                  p.like_count += 1;
                } else {
                  p.like_count -= 1;
                }
              }
            }
            return p;
          });
          setPosts(newPost);
        }
      });
  };
  const imageUploader = (image) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("upload_type", uploadType);

    const endpoint = `http://127.0.0.1:8000/users/upload_image/`;
    axios.post(endpoint, formData).then((res) => {
      const responseData = res.data;
      console.log("ressss", responseData);
    });
  };
  const uploadOpener = (type) => {
    if (type) setUploadType(type);
    setUploadProfilePicture(!uploadProfilePicture);
  };
  const createConnection = () => {
    const endpoint = `http://127.0.0.1:8000/users/create_connection/`;
    axios.post(endpoint, { receiver: profile }).then((res) => {
      const responseData = res.data;
      console.log("ressss", responseData);
    });
  };
  const changeEditModal = () => {
    setEditModal(!editModal);
  };
  const changeProfile = (user) => {
    const endpoint = `http://127.0.0.1:8000/users/edit_profile/`;
    axios.post(endpoint, { user: user }).then((res) => {
      const responseData = res.data;
      console.log("ressss", responseData);
      if (responseData.success) setUser(responseData.user);
    });
  };
  return (
    <div>
      {console.log("profile", user)}
      {uploadProfilePicture ? (
        <ModalBackground>
          <ImageUploader
            onClose={() => uploadOpener()}
            onImageUpload={imageUploader}
            isImageUpload={user?.username === profile}
            savedImage={
              uploadType === "banner" ? user?.banner : user?.profile_picture
            }
          />
        </ModalBackground>
      ) : null}
      <div
        onClick={() => {
          uploadOpener("banner");
        }}
        className="h-32 bg-black relative overflow-hidden z-2 cursor-pointer"
      >
        <img
          className={"h-inherit"}
          src={`http://127.0.0.1:8000/media/${user?.banner}`}
          alt="Banner"
        />
      </div>
      <div className=" relative bg-white mt-[-50px] p-6">
        <div>
          <div className="flex justify-between">
            <div
              onClick={() => {
                uploadOpener("profile_picture");
              }}
              className="cursor-pointer	w-32 h-32 z-2 relative bg-white overflow-hidden rounded-full border-4 border-white mb-8"
            >
              <img
                className={"h-inherit"}
                src={`http://127.0.0.1:8000/media/${user?.profile_picture}`}
                alt="Profile picture"
              />
            </div>
            <div className="mt-5">
              {user?.is_user_profile ? (
                <button
                  className="text-sm border font-semibold border-gray-300 rounded-full px-4 py-1"
                  onClick={changeEditModal}
                >
                  Edit profile
                </button>
              ) : (
                <button onClick={createConnection}>
                  <FontAwesomeIcon icon={faUserPlus} />
                </button>
              )}
            </div>
          </div>
          <div>
            <h1 className={"text-xl font-semibold mb-1"}>{user?.fullName}</h1>
            <p className={"text-base text-gray-600"}>@{user?.username}</p>
            <br />
            <p className={"text-sm text-gray-600 mb-2"}>
              {user?.biography || "bio"}
            </p>
            <div className="flex items-center">
              <p className={"text-sm text-gray-600 mb-2"}>
                <FontAwesomeIcon className="mr-2" icon={faLocationDot} />
                {user?.location || "location"}
              </p>
              <p className={"text-sm text-gray-600 mb-2 ml-3"}>
                <FontAwesomeIcon className="mr-2" icon={faCalendarDays} />
                {user?.joining_date || "joining_date"}
              </p>
            </div>
            {console.log("UUUUUSSS", user)}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center">
          {buttons.map((button) => (
            <button
              onClick={() => navigateTo(button.to)}
              className={
                view_type === button.to || (!view_type && button.to === "")
                  ? "font-bold text-black"
                  : "font-bold text-gray-500 py-1 px-2 transition-colors duration-300 ease-in-out hover:bg-gray-200"
              }
            >
              {button.name}
            </button>
          ))}
        </div>
        <div>
          {posts.length
            ? posts.map((post) => <Post post={post} actions={actions} />)
            : "No Posts"}
        </div>
      </div>
      {editModal ? (
        <EditProfile
          user={user}
          changeProfile={changeProfile}
          closeModal={changeEditModal}
        />
      ) : null}
    </div>
  );
};

export default Profile;
