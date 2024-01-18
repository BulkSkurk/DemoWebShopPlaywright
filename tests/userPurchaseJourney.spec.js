import { test } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { defaultUser } from "../data/loginDetails";
import { Navigation } from "../page-objects/Navigation";
import { BooksPage } from "../page-objects/BooksPage";
import { CheckoutPage } from "../page-objects/CheckoutPage";

import { checkoutData } from "../data/checkoutData";
import { ApparelAndShoesPage } from "../page-objects/ApparelAndShoesPage";
let loginToken = "";

test.beforeAll("Test login and retreive login cookie", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const navigation = new Navigation(page);

  await navigation.visitLoginPage(page);
  await loginPage.loginWithUser(defaultUser);
  loginToken = await loginPage.getLoginToken();

  await context.close();
});
test("Full e2e user purchase journey", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const navigation = new Navigation(page);
  const booksPage = new BooksPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.setLoginToken(loginToken);
  await navigation.visitMainPage();

  await navigation.navigateToBooks();
  await booksPage.buyQuantityOfBooks(10);

  await navigation.navigateToShoppingCart();
  await checkoutPage.checkoutShoppingCartWithDiscount();

  await checkoutPage.fillBillingDetails();
  await checkoutPage.fillShippingAddress();
  await checkoutPage.chooseShippingMethod();
  await checkoutPage.choosePaymentMethod();
  await checkoutPage.confirmPaymentInfoMessage(checkoutData.codPaymentMessage);
  await checkoutPage.confirmOrder();
});

test("Add items to wishlist", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const navigation = new Navigation(page);
  const apparelAndShoes = new ApparelAndShoesPage(page);
  await loginPage.setLoginToken(loginToken);
  await navigation.visitMainPage();
  await navigation.navgiateToApparelAndShoes();
  await apparelAndShoes.wishListBlueGreenSneaker("2");

  await navigation.navigateToWishlist();
  await apparelAndShoes.removeItemsFromWishlist();
});
