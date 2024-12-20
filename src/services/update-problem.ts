import axios from "axios";
import { storage } from "../storage-fallback";
import { appscriptFetchUrl, getUserStatusUrl } from "./request-urls";
type Problem = {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    type: string;
    points?: number;
    rating?: number;
    tags: string[];
  };
  author: {
    contestId: number;
    members: { handle: string }[];
    participantType: string;
    ghost: boolean;
    room?: number;
    startTimeSeconds: number;
  };
  programmingLanguage: string;
  verdict: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
};

type SearchParams = {
  verdict?: string;
  contestId?: number;
  index?: string;
};

type Params = {
  status: string;
  remarks: string;
  takeaways: string;
};

function searchResult(result: Problem[], param: SearchParams): Problem[] {
  return result.filter((item) => {
    const matchesVerdict = param.verdict ? item.verdict === param.verdict : true;
    const matchesContestId = param.contestId ? item.contestId === param.contestId : true;
    const matchesIndex = param.index ? item.problem.index === param.index : true;

    return matchesVerdict && matchesContestId && matchesIndex;
  });
}

export async function handleUpdateProblems(data: Params, callback: (message: string, success: boolean) => void) {
  storage.get(["APP_SCRIPT_URL", "CODEFORCES_ID", "CURRENT_TAB_URL"], async (result) => {
    const { APP_SCRIPT_URL, CODEFORCES_ID, CURRENT_TAB_URL } = result;
    const fetchUserStatusUrl: string = getUserStatusUrl.replace("CODEFORCES_ID", CODEFORCES_ID);
    let problemSolved = false;

    try {
      // Step 1: Fetch the problem details, and check if it has been solved or not
      const userStatus = await fetch(fetchUserStatusUrl);
      let searchObj: SearchParams;
      let solvedProblem: Problem[];

      if (userStatus.ok) {
        const userStatusData = await userStatus.json();
        if (userStatusData?.status === "OK") {
          const tabUrlSplit: [string] = CURRENT_TAB_URL.split("/");
          const len: number = tabUrlSplit.length;
          const arr = [tabUrlSplit[len - 1], tabUrlSplit[len - 2], tabUrlSplit[len - 3]];
          arr.sort();

          searchObj = { verdict: "OK", contestId: Number(arr[0]), index: arr[1] };
          solvedProblem = searchResult(userStatusData.result, searchObj);
          problemSolved = solvedProblem.length > 0;

          if (!problemSolved) {
            const message = "Solve the problem first, then submit!";
            console.error(message);
            callback(message, false);
            return;
          }
        } else {
          const message = "Failed to fetch Problem details!";
          console.error(message);
          callback(message, false);
          return;
        }

        const problemDetails = solvedProblem[0].problem;
        const problemRating = problemDetails.rating || "N/A";
        const problemName = `Problem${problemDetails.contestId}${problemDetails.index}`;
        const problemTopics = problemDetails.tags.join(", ");
        const date = new Date(solvedProblem[0].creationTimeSeconds * 1000);
        const dateSolved = date
          .toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-");

        // Step 2: Prepare payload and fetchUpdateProblemUrl for adding the problem to the spreadsheet

        const payload = {
          action: "updateProblem",
          problemRating,
          problemName,
          problemStatus: data.status,
          remarks: data.remarks,
          dateSolved,
          takeaways: data.takeaways,
          problemTopics,
          problemUrl: CURRENT_TAB_URL,
        };

        const SECRET_HASH = APP_SCRIPT_URL.split("/")[5];
        const fetchSubmitProblemUrl = appscriptFetchUrl.replace("SECRET_HASH", SECRET_HASH);

        // Step 4: Send POST request to Google Apps Script
        const response = await axios.post(fetchSubmitProblemUrl, payload, {
          headers: { "Content-Type": "text/plain" },
        });

        if (response.status === 200 && response.data.status === "success") {
          const message = "Problem data successfully updated to your Spreadsheet!";
          console.log(message);
          callback(message, true);
        } else {
          const message = `Failed to update problem data: ${response.data.message}`;
          console.error(message);
          callback(message, false);
        }
      } else {
        const message = "Failed to fetch Problem details!";
        console.error(message);
        callback(message, false);
      }
    } catch (error) {
      const message = `An error occurred while adding the problem: ${error}`;
      console.error(message);
      callback(message, false);
    }
  });
}
