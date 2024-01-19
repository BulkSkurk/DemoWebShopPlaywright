import { test } from "@playwright/test";
import { RegistrationPage } from "../page-objects/RegistrationPage";
import { Navigation } from "../page-objects/Navigation";
import { LoginPage } from "../page-objects/LoginPage";
import { TestUtils } from "../utilities/TestUtils";

test("Test registration of new user flow", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);
  const navigation = new Navigation(page);
  const loginPage = new LoginPage(page);
  const testUtils = new TestUtils();

  const loginDetails = testUtils.randomLoginGenerator();

  await navigation.visitRegistrationPage();
  await registrationPage.fillRegistrationForm(await loginDetails);
  await registrationPage.logOut();

  await navigation.visitLoginPage();
  await loginPage.loginWithUser(await loginDetails);
});
