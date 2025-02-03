import Modal from "react-modal";

// Custom styles for the modal
const customStyles = {
  content: {
    width: "25%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "25px",
  },
};

function CustomModal({ modalIsOpen, setModalIsOpen, children }) {
  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
      overlayClassName="fixed inset-0 bg-primary bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
    >
      {children}
    </Modal>
  );
}

export default CustomModal;
