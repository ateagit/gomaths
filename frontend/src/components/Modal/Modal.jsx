import styles from "./Modal.module.css";
import ReactModal from "react-modal";
import ContentBox from "../ContentBox/ContentBox";

export default function Modal({ isOpen, closeModal, children }) {
    return (
        <ReactModal
            isOpen={isOpen}
            shouldCloseOnOverlayClick
            onRequestClose={closeModal}
            appElement={document.getElementById("root")}
            className={styles.modalWrapper}
            overlayClassName={styles.modalOverlay}
        >
            <ContentBox>{children}</ContentBox>
        </ReactModal>
    );
}
