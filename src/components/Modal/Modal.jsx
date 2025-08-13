import { useEffect, useState } from "react";
import "./Modal.css";
import { IoClose } from "react-icons/io5";

const Modal = ({ isVisible = false, title, content, onHandleClose }) => {

    const handleClose = () => {
        onHandleClose();
    }

    if(!isVisible) return;

    return (
        <>
            <div className="modal-overlay"></div>
            <div className="modal">
                <div className="title">
                    <h2>{title}</h2>
                    <div className="close" onClick={handleClose}><IoClose /></div>
                </div>

                {content}
            </div>
        </>
    );
}

export default Modal;