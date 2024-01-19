import { expect } from "@playwright/test";
import { TestUtils } from "../utilities/TestUtils";
export class ApparelAndShoesPage {
  constructor(page) {
    this.page = page;

    this.blueGreenSneakerLink = page.locator('[href="/blue-and-green-sneaker"]').last();
    this.blueGreenSneakerQuantityField = page.locator('[id="addtocart_28_EnteredQuantity"]');
    this.blueGreenSneakerWishlistButton = page.locator('[id="add-to-wishlist-button-28"]');
    this.wishListQuantityLinkText = page.locator('[class="wishlist-qty"]');
    this.wishListSuccessBar = page.locator('[class="bar-notification success"]');
    this.wishlistRemoveItemsCheckBox = page.locator('input[name="removefromcart"]');
    this.wishlistUpdateWishlistButton = page.getByRole("button", { name: "Update wishlist" });
    this.wishlistIsEmptyTextfield = page.locator('[class="wishlist-content"]');
  }

  wishListBlueGreenSneaker = async (amount) => {
    const testUtils = new TestUtils(await this.page);
    const amountNumber = parseInt(amount);

    await this.blueGreenSneakerLink.waitFor();
    await this.blueGreenSneakerLink.click();

    await this.blueGreenSneakerQuantityField.waitFor();
    await this.blueGreenSneakerQuantityField.fill(amount);

    const wishListNumberBefore = await testUtils.parenthesisRemoverFunction(
      await this.wishListQuantityLinkText
    );

    await this.blueGreenSneakerWishlistButton.waitFor();
    await this.blueGreenSneakerWishlistButton.click();

    await this.wishListSuccessBar.waitFor();
    const wishListNumberAfter = await testUtils.parenthesisRemoverFunction(
      await this.wishListQuantityLinkText
    );

    expect(wishListNumberAfter).toEqual(wishListNumberBefore + amountNumber);
  };
  removeItemsFromWishlist = async () => {
    await this.wishlistRemoveItemsCheckBox.waitFor();
    await this.wishlistRemoveItemsCheckBox.check();

    expect(await this.wishlistRemoveItemsCheckBox).toBeChecked();

    await this.wishlistUpdateWishlistButton.waitFor();
    await this.wishlistUpdateWishlistButton.click();

    await this.wishlistIsEmptyTextfield.waitFor();
    expect(await this.wishlistIsEmptyTextfield.innerText()).toBe("The wishlist is empty!");
  };
}
