import { TestUtils } from "../utilities/TestUtils";
export class Navigation {
  constructor(page) {
    this.page = page;

    this.bookButton = page.locator('[href="/books"]').first();
    this.shoppingCartLink = page.locator('[class="cart-label"]').first();
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.confirmOrderButton = page.getByRole("button", { name: "Confirm" });
    this.orderInfoLink = page.getByRole("link", { name: "Click here for order details." });
    this.customerInfoLink = page.locator('[href="/customer/info"]').first();
    this.apparelAndShoesLink = page.locator('[href="/apparel-shoes"]').first();
    this.wishlistLink = page.locator('[class="cart-label"]').last();
    this.loginLink = page.getByRole("link", { name: "Log in" });

    this.categoriesMobileTab = page.getByRole("link", { name: "Categories" });
    this.mobileApparelAndShoesLink = page.locator('[href="/apparel-shoes"]').nth(1);
    this.mobileBooksLink = page.locator('[href="/books"]').nth(1);
  }
  visitLoginPage = async () => {
    await this.page.goto("/login");
  };
  visitRegistrationPage = async () => {
    await this.page.goto("/register");
  };
  visitMainPage = async () => {
    await this.page.goto("/");
  };
  visitAddressPage = async () => {
    await this.page.goto("/customer/addresses");
  };

  visitUserPage = async () => {
    await this.page.goto("/customer/info");
  };

  navigateToAccountPage = async () => {
    await this.navigateTo(this.customerInfoLink, "/customer/info");
  };

  navigateToLogin = async () => {
    await this.navigateTo(this.loginLink, "/login");
  };

  navigateToBooks = async () => {
    const testUtils = new TestUtils(await this.page);
    if (testUtils.isDeskTopViewPort()) {
      await this.navigateTo(this.mobileBooksLink, "/books", true);
    } else {
      await this.navigateTo(this.bookButton, "/books");
    }
  };

  navigateToShoppingCart = async () => {
    await this.navigateTo(this.shoppingCartLink, "/cart");
  };

  navigateToCheckoutBillingAddress = async () => {
    await this.navigateTo(this.checkoutButton, "/onepagecheckout");
  };

  navigateToOrderCompleted = async () => {
    await this.navigateTo(this.confirmOrderButton, "/checkout/completed/");
  };

  navgiateToPageByOrderNumber = async (orderNumber) => {
    await this.navigateTo(this.orderInfoLink, `/orderdetails/${orderNumber}`);
  };

  navgiateToApparelAndShoes = async () => {
    const testUtils = new TestUtils(await this.page);
    if (testUtils.isDeskTopViewPort()) {
      await this.navigateTo(this.mobileApparelAndShoesLink, "/apparel-shoes", true);
    } else {
      await this.navigateTo(this.apparelAndShoesLink, "/apparel-shoes");
    }
  };

  navigateToWishlist = async () => {
    await this.navigateTo(this.wishlistLink, "/wishlist");
  };

  navigateTo = async (locatorTarget, hrefStub, mobile = false) => {
    if (mobile) {
      await this.categoriesMobileTab.waitFor();
      await this.categoriesMobileTab.click();

      await locatorTarget.waitFor();
      await locatorTarget.click();
    } else {
      await locatorTarget.waitFor();
      await locatorTarget.click();
    }
    const regexPattern = new RegExp(hrefStub);

    await this.page.waitForURL(regexPattern, { timeout: 8000 });
  };
}
