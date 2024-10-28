export const checkCodeforcesUrl = (url: string) => {
  const checkStr = "https://codeforces.com/profile/";
  if (url.includes(checkStr) && !url.includes("user__Id")) return true;

  return false;
};
export const checkAppScriptUrl = (url: string) => {
  const checkStr = "https://script.google.com/macros/s/";
  if (url.includes(checkStr) && url.includes("/exec")) return true;

  return false;
};

export const checkCodeforcesSite = (url: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
  if (!url.includes("https://codeforces.com/")) {
    setError("Extension works only with Codeforces !");
    return false;
  }

  if (!url.includes("problem")) {
    setError("Open a problem page on Codeforces.");
    return false;
  }

  return true;
};
