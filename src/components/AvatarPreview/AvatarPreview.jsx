import "./AvatarPreview.css";

const AvatarPreview = ({ sourceUrl, small = false }) => {
    return (
        <div className={small ? "avatar-preview avatar-preview-small" : "avatar-preview"}>
            <img src={sourceUrl || "https://avatars.githubusercontent.com/u/6265267?v=4"} alt="Avatar Preview" />
        </div>
    );
}

export default AvatarPreview;