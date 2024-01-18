import { expect } from "@playwright/test";
export class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailField = page.getByLabel("Email:");
    this.passwordField = page.getByLabel("Password:");
    this.loginButton = page.locator('[class="button-1 login-button"]');
    this.customerInfoLink = page.locator('[href="/customer/info"]').first();
  }

  loginWithUser = async (userDetails) => {
    await this.emailField.waitFor();
    await this.emailField.fill(userDetails.email);

    await this.passwordField.waitFor();
    await this.passwordField.fill(userDetails.password);

    await this.loginButton.waitFor();
    await this.loginButton.click();

    expect(await this.customerInfoLink.innerText()).toEqual(userDetails.email);
  };
  getLoginToken = async () => {
    const cookies = await this.page.context().cookies();
    const setCookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(`;`);

    const match = setCookieHeader.match(/NOPCOMMERCE\.AUTH=([a-fA-F0-9-]+);?/);
    const loginToken = match[1];
    return loginToken;
  };
  setLoginToken = async (loginToken) => {
    await this.page.context().addCookies([
      {
        name: "NOPCOMMERCE.AUTH",
        value: loginToken,
        url: "https://demowebshop.tricentis.com",
      },
    ]);
  };
}
