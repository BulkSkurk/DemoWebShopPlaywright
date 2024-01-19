import { v4 as uuidv4 } from "uuid";
export class TestUtils {
  constructor(page) {
    this.page = page;
  }
  parenthesisRemoverFunction = async (locator) => {
    await locator.waitFor();
    const quantityText = await locator.innerText();
    return parseInt(await quantityText.replace(/[()]/g, ""));
  };

  randomLoginGenerator = async () => {
    return { email: uuidv4() + "@gmail.com", password: uuidv4() };
  };

  isDeskTopViewPort = () => {
    const size = this.page.viewportSize();
    return size.width <= 600;
  };
}
