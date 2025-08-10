import "./AvatarPreview.css";

const AvatarPreview = ({ sourceUrl }) => {
    return (
        <div className="avatar-preview">
            <img src={sourceUrl || "https://avatars.githubusercontent.com/u/6265267?v=4"} alt="Avatar Preview" />
        </div>
    );
}

export default AvatarPreview;