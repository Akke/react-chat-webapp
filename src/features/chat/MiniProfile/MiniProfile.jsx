import "./MiniProfile.css";

const MiniProfile = ({ avatar, username }) => {
    return (
        <div className="mini-profile-container">
            <div className="mini-profile">
                <div className="avatar">
                    <img src={avatar} alt="Avatar" />
                </div>

                <div className="username">Greetings, <span className="name">{username}</span></div>
            </div>
        </div>
    );
}

export default MiniProfile;