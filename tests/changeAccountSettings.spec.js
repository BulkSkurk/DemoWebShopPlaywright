import { test } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { AccountPage } from "../page-objects/AccountPage.js";
import { extraUser } from "../data/loginDetails.js";
import { Navigation } from "../page-objects/Navigation.js";

test("Change all account settings", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);
  const navigation = new Navigation(page);

  await navigation.visitLoginPage();
  await loginPage.loginWithUser(extraUser);

  await navigation.navigateToAccountPage();
  await accountPage.changeInfo();
  await accountPage.addAddress();

  //await accountPage.deleteLastAddress();
  //currently disabled due to webpage having issues with delete address function.
});
