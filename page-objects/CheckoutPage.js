import { expect } from "@playwright/test";
import { addressDetails } from "../data/addressDetails";
import { Navigation } from "./Navigation";

import { checkoutData } from "../data/checkoutData";
export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.navigation = new Navigation(page);

    this.totalPriceField = page.locator('[class="product-price order-total"]');
    this.termsCheckBox = page.getByRole("checkbox").last();
    this.countryDropdown = page.locator('[id="CountryId"]');
    this.postalCodeField = page.locator('[name="ZipPostalCode"]');
    this.estimateShippingButton = page.locator('[name="estimateshipping"]');
    this.shippingEstimatesList = page.locator('[class="shipping-results"]');
    this.discountCodeField = page.locator('[class="discount-coupon-code"]');
    this.applyDiscountButton = page.getByRole("button", { name: "Apply coupon" });

    this.discountMessage = page.locator('[class="message"]');
    this.subTotalPriceField = page.locator('[class="product-price"]').nth(0);
    this.discountField = page.locator('[class="product-price"]').nth(3);
    this.totalPriceAfterDiscountsField = page.locator('[class="product-price order-total"]');

    this.universalContinueButton = page.getByRole("button", { name: "Continue" });

    this.billingNewAddressDropDown = page.locator('[id="billing-address-select"]');
    this.billingFirstNameField = page.locator('[id="BillingNewAddress_FirstName"]');
    this.billingLastNameField = page.locator('[id="BillingNewAddress_LastName"]');
    this.billingEmailField = page.locator('[id="BillingNewAddress_Email"]');
    this.billingCompanyField = page.locator('[id="BillingNewAddress_Company"]');
    this.billingCountryDropDown = page.locator('[id="BillingNewAddress_CountryId"]');
    this.billingCityField = page.locator('[id="BillingNewAddress_City"]');
    this.billingAddressField = page.locator('[id="BillingNewAddress_Address1"]');
    this.billingPostalCodeField = page.locator('[id="BillingNewAddress_ZipPostalCode"]');
    this.billingPhoneNumberField = page.locator('[id="BillingNewAddress_PhoneNumber"]');

    this.shippingAddressDropDown = page.locator('[id="shipping-address-select"]');

    this.shippingMethodRadioButton = page.getByLabel("Next Day Air (0.00)");

    this.paymentMethodRadioButton = page.getByLabel("Cash On Delivery (COD) (7.00)");

    this.confirmOrderName = page.locator('[class="name"]').nth(1);
    this.confirmOrderEmail = page.locator('[class="email"]').first();
    this.confirmOrderTotalPrice = page.locator('[class="product-price order-total"]');

    this.orderNumberField = page.getByText("Order number:");
    this.pdfInvoiceButton = page.getByRole("link", { name: "PDF Invoice" });
  }

  checkoutShoppingCartWithDiscount = async () => {
    await this.countryDropdown.waitFor();
    await this.countryDropdown.selectOption({ label: "Sweden" });

    await this.postalCodeField.waitFor();
    await this.postalCodeField.fill(addressDetails.postal);
    await this.estimateShippingButton.waitFor();
    await this.estimateShippingButton.click();
    await expect(this.shippingEstimatesList).toBeVisible();

    const priceBeforeDiscount = await this.subTotalPriceField.innerText();
    const priceBeforeDiscountNumber = parseFloat(priceBeforeDiscount);
    const totalDiscountNumber = (
      priceBeforeDiscountNumber * checkoutData.discountPercentageValue
    ).toFixed(2);

    await this.discountCodeField.waitFor();
    await this.discountCodeField.fill(checkoutData.discountCode);
    expect(await this.discountCodeField.inputValue()).toBe(checkoutData.discountCode);

    await this.applyDiscountButton.click();
    expect(await this.discountMessage).toBeVisible();
    expect(await this.discountMessage.innerText()).toBe(checkoutData.success);

    const priceAfterDiscounts = priceBeforeDiscount - totalDiscountNumber;
    const priceAfterDiscountsNumber = priceAfterDiscounts.toFixed(2);

    await this.termsCheckBox.waitFor();
    await this.termsCheckBox.check();

    //Remember to come back to this for refactoring, perhaps this could be done in
    //A more eloquent way

    expect(await this.discountField.innerText()).toBe("-" + totalDiscountNumber);
    expect(await this.totalPriceAfterDiscountsField.innerText()).toBe(priceAfterDiscountsNumber);

    await this.navigation.navigateToCheckoutBillingAddress();
  };
  fillBillingDetails = async () => {
    await this.billingNewAddressDropDown.waitFor();
    await this.billingNewAddressDropDown.selectOption({ label: "New Address" });

    await this.billingFirstNameField.waitFor();
    expect(await this.billingFirstNameField.inputValue()).toBe(addressDetails.firstName);

    await this.billingLastNameField.waitFor();
    expect(await this.billingLastNameField.inputValue()).toBe(addressDetails.lastName);

    await this.billingEmailField.waitFor();
    expect(await this.billingEmailField.inputValue()).toBe(addressDetails.email);

    await this.billingCompanyField.waitFor();
    await this.billingCompanyField.fill(addressDetails.company);
    expect(await this.billingCompanyField.inputValue()).toBe(addressDetails.company);

    await this.billingCountryDropDown.waitFor();
    await this.billingCountryDropDown.selectOption({ label: addressDetails.country });
    expect(await this.billingCountryDropDown.inputValue()).toBe(addressDetails.countryCode);

    await this.billingCityField.waitFor();
    await this.billingCityField.fill(addressDetails.city);
    expect(await this.billingCityField.inputValue()).toBe(addressDetails.city);

    await this.billingAddressField.waitFor();
    await this.billingAddressField.fill(addressDetails.address);
    expect(await this.billingAddressField.inputValue()).toBe(addressDetails.address);

    await this.billingPostalCodeField.waitFor();
    await this.billingPostalCodeField.fill(addressDetails.postal);
    expect(await this.billingPostalCodeField.inputValue()).toBe(addressDetails.postal);

    await this.billingPhoneNumberField.waitFor();
    await this.billingPhoneNumberField.fill(addressDetails.phone);
    expect(await this.billingPhoneNumberField.inputValue()).toBe(addressDetails.phone);

    await this.clickUniversalContiniueButton();
  };

  fillShippingAddress = async () => {
    const fullAddress = `${addressDetails.firstName} ${addressDetails.lastName}, ${addressDetails.address}, ${addressDetails.city} ${addressDetails.postal}, ${addressDetails.country}`;
    await this.shippingAddressDropDown.waitFor();
    await this.shippingAddressDropDown.selectOption({ label: fullAddress });

    await this.clickUniversalContiniueButton();
  };

  chooseShippingMethod = async () => {
    await this.shippingMethodRadioButton.waitFor();
    await this.shippingMethodRadioButton.check();

    expect(await this.shippingMethodRadioButton).toBeChecked();

    await this.clickUniversalContiniueButton();
  };

  choosePaymentMethod = async () => {
    await this.paymentMethodRadioButton.waitFor();
    await this.paymentMethodRadioButton.check();

    expect(await this.paymentMethodRadioButton).toBeChecked();

    await this.clickUniversalContiniueButton();
  };

  confirmPaymentInfoMessage = async (message) => {
    this.paymentInfoMessage = await this.page.getByText(message);
    await this.paymentInfoMessage.waitFor();
    expect(await this.paymentInfoMessage.innerText()).toBe(message);

    await this.clickUniversalContiniueButton();
  };

  confirmOrder = async () => {
    await this.confirmOrderName.waitFor();
    expect(await this.confirmOrderName.innerText()).toBe(
      `${addressDetails.firstName} ${addressDetails.lastName}`
    );

    await this.confirmOrderEmail.waitFor();
    expect(await this.confirmOrderEmail.innerText()).toBe(`Email: ${addressDetails.email}`);

    const totalPriceBeforeConfirm = parseFloat(await this.confirmOrderTotalPrice.innerText());

    await this.navigation.navigateToOrderCompleted();
    const orderNumberText = await this.orderNumberField.innerText();
    const orderNumberOnly = orderNumberText.replace(/Order number: /g, "");

    await this.navigation.navgiateToPageByOrderNumber(orderNumberOnly);
    await this.pdfDownloader(await this.pdfInvoiceButton);
    const totalPriceInPdf = await this.extractTotalPrice(orderNumberOnly);

    expect(totalPriceBeforeConfirm).toBe(totalPriceInPdf);

    //Go on from here.
    //Great work yesterday. Check the billing address and then finish the E2E! :)
    //It's done! Kind of. Need to refactor to parse the innerTexts to avoid the double variables.
  };

  clickUniversalContiniueButton = async () => {
    await this.universalContinueButton.waitFor();
    await this.universalContinueButton.click();
  };

  pdfDownloader = async (downloadButtonLocator) => {
    const downloadPromise = this.page.waitForEvent("download");
    downloadButtonLocator.click();
    const download = await downloadPromise;

    await download.saveAs("./pdf/" + download.suggestedFilename());
  };

  extractTotalPrice = async (orderNumber) => {
    const fs = require("fs");
    const pdf = require("pdf-parse");
    const pdfFilePath = `./pdf/order_${orderNumber}.pdf`;

    const databuffer = fs.readFileSync(pdfFilePath);
    const data = await pdf(databuffer);

    const orderTotalRegex = /Order total: (\d+\.\d+)/;
    const match = data.text.match(orderTotalRegex);

    if (match && match.length >= 2) {
      const orderTotalValue = parseFloat(match[1]);
      return orderTotalValue;
    } else {
      console.error("Order total not found in the PDF.");
    }
  };
}
