import * as nodeFetch from "node-fetch";

export const getLoginToken = async (email, password) => {
  const response = await nodeFetch("https://demowebshop.tricentis.com/login", {
    method: "POST",
    body: JSON.stringify({ Email: email, Password: password, RememberMe: false }),
  });
  if (response.status !== 200) {
    throw new Error("An error occured retreiving the login token.");
  }

  const setCookieHeader = response.headers.get("Set-cookie");
  const customerCookie = setCookieHeader.match(/NOPCOMMERCE\.AUTH=([a-fA-F0-9-]+);?/);

  console.log(JSON.stringify({ Email: email, Password: password, RememberMe: false }));

  console.log(response.headers.raw());

  if (!setCookieHeader) {
    throw new Error("No cookie header found in html response");
  }
  return customerCookie[1];
};
