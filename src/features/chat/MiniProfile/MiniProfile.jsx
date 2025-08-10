import AvatarPreview from "../../../components/AvatarPreview/AvatarPreview";
import "./MiniProfile.css";

const MiniProfile = ({ avatar, username }) => {
    return (
        <div className="mini-profile-container">
            <div className="mini-profile">
                <AvatarPreview sourceUrl={avatar || "https://avatars.githubusercontent.com/u/6265267?v=4"} />

                <div className="username">Greetings, <span className="name">{username || "user"}</span></div>
            </div>
        </div>
    );
}

export default MiniProfile;