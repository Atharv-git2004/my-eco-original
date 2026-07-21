// import axios from "axios";

// /**
//  * Common API Service to handle all HTTP requests using Axios
//  */
// export const commonAPI = async (httpRequest, url, reqBody = null, reqHeader = null) => {
  
//   const reqConfig = {
//     method: httpRequest,
//     url,
//     data: reqBody,
//     headers: reqHeader ? reqHeader : { "Content-Type": "application/json" }
//   };

//   try {
//     const result = await axios(reqConfig);
//     return result;

//   } catch (err) {
//     console.group("❌ API Error Report");
//     console.error("URL:", url);
//     console.error("Method:", httpRequest);

//     if (err.response) {
//       console.error("Status Code:", err.response.status);
//       console.error("Error Data:", err.response.data);
//       console.groupEnd();
//       return err.response;

//     } else if (err.request) {
//       console.error("Network Error: No response from server");
//       console.groupEnd();
//       return {
//         status: 503,
//         data: {
//           success: false,
//           message: "Server is not responding. Please check your internet or backend status.",
//         },
//       };

//     } else {
//       console.error("Technical Error:", err.message);
//       console.groupEnd();
//       return {
//         status: 0,
//         data: {
//           success: false,
//           message: "A technical issue occurred: " + err.message,
//         },
//       };
//     }
//   }
// };
import axios from "axios";

/**
 * Common API Service to handle all HTTP requests using Axios
 */
export const commonAPI = async (httpRequest, url, reqBody = null, reqHeader = null) => {
  
  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    // ✅ Logic: If reqHeader is provided, use it. 
    // Otherwise, Axios handles headers automatically (better for FormData/Multer).
    headers: reqHeader ? reqHeader : { "Content-Type": "application/json" }
  };

  try {
    const result = await axios(reqConfig);
    return result;

  } catch (err) {
    console.group("❌ API Error Report");
    console.error("URL:", url);
    console.error("Method:", httpRequest);

    if (err.response) {
      // The server responded with a status code (4xx, 5xx)
      console.error("Status Code:", err.response.status);
      console.error("Error Data:", err.response.data);
      console.groupEnd();
      return err.response;

    } else if (err.request) {
      // The request was made but no response was received
      console.error("Network Error: No response from server. Is the backend running?");
      console.groupEnd();
      return {
        status: 503,
        data: {
          success: false,
          message: "Server is not responding. Please check your backend status.",
        },
      };

    } else {
      // Something happened in setting up the request
      console.error("Technical Error:", err.message);
      console.groupEnd();
      return {
        status: 0,
        data: {
          success: false,
          message: "Technical issue: " + err.message,
        },
      };
    }
  }
};