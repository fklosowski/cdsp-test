import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto('https://fk-test-ci-instance-01.ps-01-platformos.com/');

  const heading = page.getByRole("heading");
  await expect(heading).toHaveText(/Contact Us/);
});


test("page has expected elements", async ({ page }) => {
  await page.goto(process.env.TEST_APP_URL!);

  const heading = page.getByRole("heading").filter({ hasText: "Contact Us" });
  const emailField = page.getByRole("textbox", { name: "Email" });
  const messageField = page.locator("textarea");
  const sendButton = page.getByRole("button", { name: "Send" });

  await expect(heading).toBeVisible();
  await expect(emailField).toBeVisible();
  await expect(messageField).toBeVisible();
  await expect(sendButton).toBeVisible();
});

test('user can submit "Contact us" form - happy path', async ({ page }) => {
  await page.goto(process.env.TEST_APP_URL!);

  const heading = page.getByRole("heading").filter({ hasText: "Contact US" });
  const emailField = page.getByRole("textbox", { name: "Email" });
  const messageField = page.locator("textarea");
  const sendButton = page.getByRole("button", { name: "Send" });

  const successMessage = page.getByText("Thank You!");

  await emailField.fill("validemail@test.com");
  await messageField.fill("Some valid test messge");
  await sendButton.click();

  await expect(heading).not.toBeVisible();
  await expect(emailField).not.toBeVisible();
  await expect(messageField).not.toBeVisible();
  await expect(successMessage).toBeVisible();
});

test('user cannot submit "Contact us" form with invalid data - sad path', async ({
  page,
}) => {
  await page.goto(process.env.TEST_APP_URL!);

  const heading = page.getByRole("heading").filter({ hasText: "Contact US" });
  const emailField = page.getByRole("textbox", { name: "Email" });
  const messageField = page.locator("textarea");
  const sendButton = page.getByRole("button", { name: "Send" });

  const successMessage = page.getByText("Thank You!");
  const emailValidation = page.getByText("must be a valid email");
  const messageValidation = page.getByText(
    "is too short (minimum is 10 characters)"
  );

  await emailField.fill("invalid email");
  await messageField.fill("abc");
  await sendButton.click();

  await expect(successMessage).not.toBeVisible();
  await expect(emailValidation).toBeVisible();
  await expect(messageValidation).toBeVisible();
});
