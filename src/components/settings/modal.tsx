import Button from "../../ui/button";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  handleSubmit: () => void;
}
const Modal: React.FC<ModalProps> = ({ show, onClose, children, handleSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full sm:w-[400px] p-4 rounded-t-lg shadow-lg">
        <div>{children}</div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
