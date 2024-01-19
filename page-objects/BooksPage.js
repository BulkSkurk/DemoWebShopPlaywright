import { expect } from "@playwright/test";
import { TestUtils } from "../utilities/TestUtils";

export class BooksPage {
  constructor(page) {
    this.page = page;

    this.bookItemList = page.locator('[class="item-box"]');
    this.shoppingCartQuantity = page.locator('[class="cart-qty"]');
    this.purchaseSuccessBar = page.locator('[id="bar-notification"]');

    this.fictionBookLink = page.locator('[href="/fiction"]').last();
    this.fictionBookQuantityField = page.locator('[id="addtocart_45_EnteredQuantity"]');
    this.fictionBookAddToCartButton = page.locator('[id="add-to-cart-button-45"]');
  }

  buyBook = async (bookNumber) => {
    const testUtils = new TestUtils(page);
    const bookToBuy = await this.bookItemList.nth(bookNumber);
    const addToCartButton = await bookToBuy.locator(
      '[class="button-2 product-box-add-to-cart-button"]'
    );
    const cartQuantityNumberBefore = await testUtils.parenthesisRemoverFunction(
      await this.shoppingCartQuantity
    );

    if (await addToCartButton.isVisible()) {
      await addToCartButton.waitFor();
      await addToCartButton.click();

      await this.purchaseSuccessBar.waitFor();
      const cartQuantityNumberAfter = await testUtils.parenthesisRemoverFunction(
        await this.shoppingCartQuantity
      );

      expect(cartQuantityNumberAfter).toEqual(cartQuantityNumberBefore + 1);
    } else {
      console.warn(`Item amount ${bookNumber} is not currently available to buy.`);
    }
  };

  buyQuantityOfBooks = async (quantity) => {
    const testUtils = new TestUtils(await this.page);

    await this.fictionBookLink.waitFor();
    await this.fictionBookLink.click();

    await this.fictionBookQuantityField.waitFor();
    await this.fictionBookQuantityField.fill(quantity.toString());

    const cartQuantityNumberBefore = await testUtils.parenthesisRemoverFunction(
      await this.shoppingCartQuantity
    );

    await this.fictionBookAddToCartButton.waitFor();
    await this.fictionBookAddToCartButton.click();

    await this.purchaseSuccessBar.waitFor();
    const cartQuantityNumberAfter = await testUtils.parenthesisRemoverFunction(
      await this.shoppingCartQuantity
    );

    expect(cartQuantityNumberAfter).toEqual(cartQuantityNumberBefore + quantity);
  };
}
