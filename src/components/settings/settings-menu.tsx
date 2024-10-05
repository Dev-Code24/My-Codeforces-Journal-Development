import React, { useEffect, useState } from "react";
import CodeforcesForm from "../forms/codeforces-form";
import { handleVerifyCodeforcesId } from "../../services/verify-codeforces-id";
import Modal from "./modal";

interface SettingsProps {
  codeforcesId: string;
  setCodeforcesId: (value: string) => void;
  error: boolean;
  isLoading: boolean;
  onTryAgain: () => void;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsMenu: React.FC<SettingsProps> = ({ codeforcesId, setCodeforcesId, error, isLoading, onTryAgain, setError, setLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(window.CODEFORCES_AVATAR_URL);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    window.CODEFORCES_VERIFIED = false;
    handleVerifyCodeforcesId(codeforcesId, setError, undefined, setLoading);
    if (error) {
      window.CODEFORCES_VERIFIED = true;
    }
  };

  useEffect(() => {
    setAvatarUrl(window.CODEFORCES_AVATAR_URL);
  }, [avatarUrl, window.CODEFORCES_AVATAR_URL]);

  return (
    <div className="relative inline-block text-left">
      {/* Profile Icon */}
      <button onClick={() => setIsOpen(!isOpen)} className="inline-flex justify-center w-full rounded-full bg-gray-800 text-white focus:outline-none">
        <span className="h-10 w-10 rounded-full bg-pink-500 text-white">
          {avatarUrl.length > 0 && <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/* Menu Items */}
            <div
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setIsModalOpen(true);
                setIsOpen(false);
              }}
            >
              Change Codeforces ID
            </div>
          </div>
        </div>
      )}

      {/* Modal for changing Codeforces ID */}
      <Modal show={isModalOpen} onClose={closeModal} handleSubmit={handleSubmit}>
        <CodeforcesForm codeforcesId={codeforcesId} setCodeforcesId={setCodeforcesId} error={error} isLoading={isLoading} onTryAgain={onTryAgain} />
      </Modal>
    </div>
  );
};

export default SettingsMenu;
