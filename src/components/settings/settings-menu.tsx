import React, { useEffect, useState } from "react";
import CodeforcesForm from "../forms/codeforces-form";
import { handleVerifyCodeforcesId } from "../../services/verify-codeforces-id";
import Modal from "../../ui/modal";
import { handleVerifyAppScriptUrl } from "../../services/verify-appscript-url";
import AppsScriptForm from "../forms/appscript-form";
import { storage } from "../../storage-fallback";

interface SettingsProps {
  codeforcesId: string;
  setCodeforcesId: (value: string) => void;
  error: string;
  isLoading: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  appScriptUrl: string;
  setAppScriptUrl: React.Dispatch<React.SetStateAction<string>>;
  handleTryAgainCodeforcesForm: () => void;
  handleTryAgainAppScriptForm: () => void;
}

const SettingsMenu: React.FC<SettingsProps> = ({
  codeforcesId,
  setCodeforcesId,
  error,
  isLoading,
  setError,
  setLoading,
  appScriptUrl,
  setAppScriptUrl,
  handleTryAgainCodeforcesForm,
  handleTryAgainAppScriptForm,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeUrl, setChangeUrl] = useState(" ");
  const [avatarUrl, setAvatarUrl] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    if (changeUrl === "codeforcesid") {
      // Reset CODEFORCES_VERIFIED in storage
      storage.set({ CODEFORCES_VERIFIED: false }, () => {
        handleVerifyCodeforcesId(codeforcesId, setError, undefined, setLoading, closeModal);
        if (error) {
          storage.set({ CODEFORCES_VERIFIED: true });
        }
      });
    } else if (changeUrl === "appscripturl") {
      // Reset APPSCRIPT_VERIFIED in storage
      storage.set({ APPSCRIPT_VERIFIED: false }, () => {
        handleVerifyAppScriptUrl(appScriptUrl, setError, undefined, setLoading, closeModal);
        if (error) {
          storage.set({ APPSCRIPT_VERIFIED: true });
        }
      });
    }
  };

  useEffect(() => {
    // Fetch CODEFORCES_AVATAR_URL from storage and set it in state
    storage.get(["CODEFORCES_AVATAR_URL"], (result) => {
      setAvatarUrl(result.CODEFORCES_AVATAR_URL || "");
    });
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === "local" && changes.CODEFORCES_AVATAR_URL) {
        setAvatarUrl(changes.CODEFORCES_AVATAR_URL.newValue || "");
      }
    };

    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    // Cleanup listeners when the component is unmounted
    return () => {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
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
                setChangeUrl("codeforcesid");
                setIsModalOpen(true);
                setIsOpen(false);
              }}
            >
              Change Codeforces ID
            </div>
            <div
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setChangeUrl("appscripturl");
                setIsModalOpen(true);
                setIsOpen(false);
              }}
            >
              Change AppScript Url
            </div>
          </div>
        </div>
      )}

      {/* Modal for changing Codeforces ID */}
      <Modal show={isModalOpen} onClose={closeModal} handleSubmit={handleSubmit}>
        {changeUrl === "codeforcesid" && (
          <CodeforcesForm
            codeforcesId={codeforcesId}
            setCodeforcesId={setCodeforcesId}
            error={error}
            isLoading={isLoading}
            onTryAgain={handleTryAgainCodeforcesForm}
          />
        )}
        {changeUrl === "appscripturl" && (
          <AppsScriptForm url={appScriptUrl} setUrl={setAppScriptUrl} onTryAgain={handleTryAgainAppScriptForm} error={error} isLoading={isLoading} />
        )}
      </Modal>
    </div>
  );
};

export default SettingsMenu;
