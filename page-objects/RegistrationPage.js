import { expect } from "@playwright/test";
import { addressDetails } from "../data/addressDetails";

export class RegistrationPage {
  constructor(page) {
    this.page = page;

    this.genderMaleCheckbox = page.locator('[id="gender-male"]');
    this.genderFemaleCheckbox = page.locator('[id="gender-female"]');

    this.firstNameInput = page.locator('[id="FirstName"]');
    this.lastNameInput = page.locator('[id="LastName"]');
    this.emailInput = page.locator('[id="Email"]');

    this.passwordInput = page.locator('[id="Password"]');
    this.confirmPasswordInput = page.locator('[id="ConfirmPassword"]');

    this.registerNewUserButton = page.locator('[id="register-button"]');

    this.continueButton = page.getByRole("button", { name: "Continue" });

    this.accountText = page.locator('[class="account"]');

    this.logOutButton = page.locator('[class="ico-logout"]');

    this.loginButton = page.getByRole("link", { name: "Log in" });
  }

  fillRegistrationForm = async (loginDetails) => {
    await this.genderMaleCheckbox.waitFor();
    await this.genderMaleCheckbox.click();

    await this.firstNameInput.fill(addressDetails.firstName);
    await this.lastNameInput.fill(addressDetails.lastName);

    await this.emailInput.waitFor();
    await this.emailInput.fill(loginDetails.email);

    await this.passwordInput.waitFor();
    await this.passwordInput.fill(loginDetails.password);
    await this.confirmPasswordInput.fill(loginDetails.password);

    await this.registerNewUserButton.waitFor();
    await this.registerNewUserButton.click();

    await this.continueButton.waitFor();
    await this.continueButton.click();

    const newAccountText = await this.accountText.first();
    await newAccountText.waitFor();

    await expect(newAccountText).toContainText(loginDetails.email);
  };
  logOut = async () => {
    await this.logOutButton.waitFor();
    await this.logOutButton.click();

    await this.loginButton.waitFor();
  };
}
