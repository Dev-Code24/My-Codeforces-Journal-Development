export const checkCodeforcesUrl = (url: string) => {
  const checkStr = "https://codeforces.com/profile/";
  if (url.includes(checkStr)) return true;

  return false;
};
export const checkAppScriptUrl = (url: string) => {
  const checkStr = "https://script.google.com/macros/s/";
  if (url.includes(checkStr) && url.includes("/exec")) return true;

  return false;
};
