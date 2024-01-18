import { expect } from "@playwright/test";
import { addressDetails } from "../data/addressDetails";
export class AccountPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole("heading", { name: "Demo Web Shop. Account" });

    this.accountText = page.locator('[class="account"]').first();

    this.femaleCheckBox = page.locator('[id="gender-female"]');
    this.firstNameTextField = page.locator('[id="FirstName"]');
    this.lastNameTextField = page.locator('[id="LastName"]');
    this.emailTextField = page.locator('[id="Email"]');
    this.saveButton = page.locator('[value="Save"]');

    this.addNewAddressButton = page.locator('[class="button-1 add-address-button"]');

    this.addressFirstNameField = page.locator('[id="Address_FirstName"]');
    this.addressLastNameField = page.locator('[id="Address_LastName"]');
    this.addressEmailField = page.locator('[id="Address_Email"]');
    this.addressCompanyField = page.locator('[id="Address_Company"]');
    this.addressCountryDropDown = page.locator('[id="Address_CountryId"]');
    this.addressCityField = page.locator('[id="Address_City"]');
    this.addressOneField = page.locator('[id="Address_Address1"]');
    this.addressPostalCodeField = page.locator('[id="Address_ZipPostalCode"]');
    this.addressPhoneNumberField = page.locator('[id="Address_PhoneNumber"]');
    this.addressSaveButton = page.locator('[class="button-1 save-address-button"]');
    this.addressSidebarLink = page.getByRole("link", { name: "Addresses" }).first();

    this.savedAddressList = page.locator('[class="section address-item"]');
    this.savedAddressDeleteButtonsList = page.locator('[class="button-2 delete-address-button"]');
  }

  changeInfo = async () => {
    await this.femaleCheckBox.waitFor();
    await this.femaleCheckBox.click();

    await this.firstNameTextField.waitFor();
    await this.firstNameTextField.fill(addressDetails.firstName);
    expect(await this.firstNameTextField.inputValue()).toBe(addressDetails.firstName);

    await this.lastNameTextField.waitFor();
    await this.lastNameTextField.fill(addressDetails.lastName);
    expect(await this.lastNameTextField.inputValue()).toBe(addressDetails.lastName);

    await this.saveButton.waitFor();
    await this.saveButton.click();
  };

  addAddress = async () => {
    await this.addressSidebarLink.waitFor();
    await this.addressSidebarLink.click();

    await this.addNewAddressButton.waitFor();
    const addedAddressesCountBefore = await this.savedAddressList.count();

    await this.addNewAddressButton.click();
    await this.page.waitForURL("/customer/addressadd");

    await this.addressFirstNameField.waitFor();
    await this.addressFirstNameField.fill(addressDetails.firstName);

    await this.addressLastNameField.waitFor();
    await this.addressLastNameField.fill(addressDetails.lastName);

    await this.addressEmailField.waitFor();
    await this.addressEmailField.fill(addressDetails.email);

    await this.addressCompanyField.waitFor();
    await this.addressCompanyField.fill(addressDetails.company);

    await this.addressCountryDropDown.waitFor();
    await this.addressCountryDropDown.selectOption(addressDetails.country);

    await this.addressCityField.waitFor();
    await this.addressCityField.fill(addressDetails.city);

    await this.addressOneField.waitFor();
    await this.addressOneField.fill(addressDetails.address);

    await this.addressPostalCodeField.waitFor();
    await this.addressPostalCodeField.fill(addressDetails.postal);

    await this.addressPhoneNumberField.waitFor();
    await this.addressPhoneNumberField.fill(addressDetails.phone);

    await this.saveButton.waitFor();
    await this.saveButton.click();
    await this.page.waitForURL(/\/addresses/, { timeout: 8000 });

    await this.savedAddressList.nth(0).waitFor();
    const addedAddressesCountAfter = await this.savedAddressList.count();
    expect(await addedAddressesCountAfter).toBe(addedAddressesCountBefore + 1);
  };
  deleteLastAddress = async () => {
    await this.page.goto("/customer/addresses");
    await this.page.waitForURL(/\/addresses/, { timeout: 25000 });

    const addedAddressesCountBefore = await this.savedAddressList.count();

    const lastAddress = await this.savedAddressList.last();
    await lastAddress.last().waitFor();

    const lastDeleteButton = await this.savedAddressDeleteButtonsList.last();
    await lastDeleteButton.waitFor();
    await lastDeleteButton.scrollIntoViewIfNeeded();

    //Something really iffy with this button.
    //Turned out to be a serverside issue, the delete function simply does not work
    //in it's current iteration, keeping this test here for posterity
    await lastDeleteButton.hover();
    await this.page.pause();
    await lastDeleteButton.click();

    this.page.on("dialog", async (alert) => {
      await this.page.waitForTimeout(1000); //Just for testing - Remove later
      const text = alert.message();
      console.log(text);
      await alert.accept();
    });

    await this.page.waitForNavigation({ waitUntil: "networkidle", timeout: 20000 });
    expect(await this.savedAddressList).toHaveCount(addedAddressesCountBefore - 1);
  };
}
