import React from "react";

const Contact = ({
  currentUser,
  setOtherUser,
  otherUser,
  users,
  toggleContact,
  otherUserBool,
  setOtherUserBool,
}) => {
  return (
    <>
      <div className="contact-container">
        <div className="header">
          <h2 className="logo">swift</h2>
        </div>
        <div className="content">
          <div className="users">
            {users &&
              users.map((user, index) => (
                <div
                  className={`user ${
                    otherUser.username === user.username && "select-user"
                  }`}
                  key={index}
                  onClick={() => {
                    setOtherUser(user);
                  }}
                >
                  <img
                    src={`/avatars/Multiavatar-User${user.avatarImage}.png`}
                    alt="avatar"
                    className={`online ${!user.online && "offline"}`}
                  />
                  <p>{user.username}</p>
                </div>
              ))}
          </div>
          <div className="current-user">
            <div className="usr">
              <img
                // src={`data:image/svg+xml;base64,${
                //   currentUser && currentUser.avatarImage
                // }`}
                src={`/avatars/Multiavatar-User${
                  currentUser && currentUser.avatarImage
                }.png`}
                alt="avatar"
              />
              <p>{currentUser && currentUser.username}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`contact-mobile-container ${
          toggleContact && "display-contact"
        } ${otherUserBool && "remove-display-contact"}`}
      >
        <div className="header">
          <h2 className="logo">swift</h2>
        </div>
        <div className="content">
          <div className="users">
            {users &&
              users.map((user, index) => (
                <div
                  className={`user ${
                    otherUser.username === user.username && "select-user"
                  }`}
                  key={index}
                  onClick={() => {
                    setOtherUser(user);
                    setOtherUserBool(true);
                  }}
                >
                  <img
                    src={`/avatars/Multiavatar-User${user.avatarImage}.png`}
                    alt="avatar"
                    className={`online ${!user.online && "offline"}`}
                  />
                  <p>{user.username}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
