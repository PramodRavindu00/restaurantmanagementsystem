package com.project.backend.Selenium;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class UserSeleniumTest {

    private WebDriver driver;

    @BeforeEach
    public void setup(){
        System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
        driver = new ChromeDriver();
    }

    @Test
    public void testRegisterWithEmptyFields() throws InterruptedException {
        driver.get("http://localhost:3000/register");

        WebElement firstNameInput = driver.findElement(By.name("firstName"));
        firstNameInput.sendKeys("");

        WebElement lastNameInput = driver.findElement(By.name("lastName"));
        lastNameInput.sendKeys("");

        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("");

        WebElement contactInput = driver.findElement(By.name("phone"));
        contactInput.sendKeys("");

        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("");

        WebElement confirmPasswordInput = driver.findElement(By.name("confirm"));
        confirmPasswordInput.sendKeys("");

//        WebElement branchInput = driver.findElement(By.id("branch"));
//        branchInput.click();

        WebElement RegisterButton = driver.findElement(By.cssSelector(".submit"));
        RegisterButton.click();

        WebElement firstNameError =  driver.findElement(By.cssSelector(".error-message.firstName"));
        String firstNameErrorText = firstNameError.getText();
        assert(firstNameErrorText.contains("First name is required!"));

        WebElement lastNameError =  driver.findElement(By.cssSelector(".error-message.lastName"));
        String lastNameErrorText = lastNameError.getText();
        assert(lastNameErrorText.contains("Last name is required!"));

        WebElement emailError =  driver.findElement(By.cssSelector(".error-message.email"));
        String emailErrorText = emailError.getText();
        assert(emailErrorText.contains("Email is required!"));

        WebElement contactError =  driver.findElement(By.cssSelector(".error-message.phone"));
        String contactErrorText = contactError.getText();
        assert(contactErrorText.contains("Phone number is required!"));

        WebElement passwordError =  driver.findElement(By.cssSelector(".error-message.password"));
        String passwordErrorText = passwordError.getText();
        assert(passwordErrorText.contains("Password is required!"));

        WebElement confirmError =  driver.findElement(By.cssSelector(".error-message.confirm"));
        String confirmErrorText = confirmError.getText();
        assert(confirmErrorText.contains("Confirm password is required!"));

//        WebElement branchError = driver.findElement(By.cssSelector(".error-message.branch"));
//        String branchErrorText = branchError.getText();
//        assert(branchErrorText.contains("Branch is required!"));

        Thread.sleep(2000);
    }

    @Test
    public void testRegisterWithExistingEmail() throws InterruptedException {
        driver.get("http://localhost:3000/register");

        WebElement firstNameInput = driver.findElement(By.name("firstName"));
        firstNameInput.sendKeys("Test");

        WebElement lastNameInput = driver.findElement(By.name("lastName"));
        lastNameInput.sendKeys("Person");

        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("abcadmin@gmail.com");

        WebElement contactInput = driver.findElement(By.name("phone"));
        contactInput.sendKeys("0778520369");

        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("12345678");

        WebElement confirmPasswordInput = driver.findElement(By.name("confirm"));
        confirmPasswordInput.sendKeys("12345678");

        WebElement branchDropdown = driver.findElement(By.cssSelector(".css-hlgwow"));
        branchDropdown.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement branchOption = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'Head Branch')]")));
        branchOption.click();


        WebElement RegisterButton = driver.findElement(By.cssSelector(".submit"));
        RegisterButton.click();


        WebElement emailError =  driver.findElement(By.cssSelector(".error-message.email"));
        String emailErrorText = emailError.getText();
        assert(emailErrorText.contains("Email is already registered"));

        Thread.sleep(2000);
    }

    @Test
    public void testRegisterWithExistingPhoneNumber() throws InterruptedException {
        driver.get("http://localhost:3000/register");

        WebElement firstNameInput = driver.findElement(By.name("firstName"));
        firstNameInput.sendKeys("Test");

        WebElement lastNameInput = driver.findElement(By.name("lastName"));
        lastNameInput.sendKeys("Person");

        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("testexistingphone@gmail.com");

        WebElement contactInput = driver.findElement(By.name("phone"));
        contactInput.sendKeys("0767203699");

        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("12345678");

        WebElement confirmPasswordInput = driver.findElement(By.name("confirm"));
        confirmPasswordInput.sendKeys("12345678");

        WebElement branchDropdown = driver.findElement(By.cssSelector(".css-hlgwow"));
        branchDropdown.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement branchOption = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'Head Branch')]")));
        branchOption.click();


        WebElement RegisterButton = driver.findElement(By.cssSelector(".submit"));
        RegisterButton.click();

        WebElement phoneError = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".error-message.phone")));
        String phoneErrorText = phoneError.getText();
        assert(phoneErrorText.contains("Phone number is already using with another account"));

        Thread.sleep(2000);
    }

    @Test
    public void testRegisterWithInvalidEmail() throws InterruptedException {
        driver.get("http://localhost:3000/register");

        WebElement firstNameInput = driver.findElement(By.name("firstName"));
        firstNameInput.sendKeys("Test");

        WebElement lastNameInput = driver.findElement(By.name("lastName"));
        lastNameInput.sendKeys("Person");

        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("invalidEmailFormat");

        WebElement contactInput = driver.findElement(By.name("phone"));
        contactInput.sendKeys("0778520369");

        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("12345678");

        WebElement confirmPasswordInput = driver.findElement(By.name("confirm"));
        confirmPasswordInput.sendKeys("12345678");

        WebElement branchDropdown = driver.findElement(By.cssSelector(".css-hlgwow"));
        branchDropdown.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement branchOption = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'Head Branch')]")));
        branchOption.click();


        WebElement RegisterButton = driver.findElement(By.cssSelector(".submit"));
        RegisterButton.click();


        WebElement emailError =  driver.findElement(By.cssSelector(".error-message.email"));
        String emailErrorText = emailError.getText();
        assert(emailErrorText.contains("Invalid Email format!"));

        Thread.sleep(2000);
    }

    @Test
    public void testRegisterWithShorterPassword() throws InterruptedException {
        driver.get("http://localhost:3000/register");

        WebElement firstNameInput = driver.findElement(By.name("firstName"));
        firstNameInput.sendKeys("Test");

        WebElement lastNameInput = driver.findElement(By.name("lastName"));
        lastNameInput.sendKeys("Person");

        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("testcustomer@gmail.com");

        WebElement contactInput = driver.findElement(By.name("phone"));
        contactInput.sendKeys("0778520369");

        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("123");

        WebElement confirmPasswordInput = driver.findElement(By.name("confirm"));
        confirmPasswordInput.sendKeys("123");

        WebElement branchDropdown = driver.findElement(By.cssSelector(".css-hlgwow"));
        branchDropdown.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement branchOption = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'Head Branch')]")));
        branchOption.click();


        WebElement RegisterButton = driver.findElement(By.cssSelector(".submit"));
        RegisterButton.click();


        WebElement passwordError =  driver.findElement(By.cssSelector(".error-message.password"));
        String passwordErrorText = passwordError.getText();
        assert(passwordErrorText.contains("Password must be more than 4 characters"));

        Thread.sleep(2000);
    }

    @Test
    public void testRegisterWithMismatchingPasswords() throws InterruptedException {
        driver.get("http://localhost:3000/register");

        WebElement firstNameInput = driver.findElement(By.name("firstName"));
        firstNameInput.sendKeys("Test");

        WebElement lastNameInput = driver.findElement(By.name("lastName"));
        lastNameInput.sendKeys("Person");

        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("testcustomer@gmail.com");

        WebElement contactInput = driver.findElement(By.name("phone"));
        contactInput.sendKeys("0778520369");

        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("12345678");

        WebElement confirmPasswordInput = driver.findElement(By.name("confirm"));
        confirmPasswordInput.sendKeys("123456789");

        WebElement branchDropdown = driver.findElement(By.cssSelector(".css-hlgwow"));
        branchDropdown.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement branchOption = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'Head Branch')]")));
        branchOption.click();


        WebElement RegisterButton = driver.findElement(By.cssSelector(".submit"));
        RegisterButton.click();


        WebElement confirmError =  driver.findElement(By.cssSelector(".error-message.confirm"));
        String confirmErrorText = confirmError.getText();
        assert(confirmErrorText.contains("Passwords do not match"));

        Thread.sleep(2000);
    }
//
//    @Test
//    public void testRegister() throws InterruptedException {}

    @Test
    public void testLoginWithEmptyFields()throws InterruptedException {
        driver.get("http://localhost:3000/login");
        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("");

        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("");

        WebElement loginButton = driver.findElement(By.cssSelector(".submit"));
        loginButton.click();

        WebElement emailError =  driver.findElement(By.cssSelector(".error-message.email"));
        String emailErrorText = emailError.getText();
        assert(emailErrorText.contains("Email is required!"));

        WebElement passwordError = driver.findElement(By.cssSelector(".error-message.password"));
        String passwordErrorText = passwordError.getText();
        assert(passwordErrorText.contains("Password is required!"));

        Thread.sleep(2000);
    }

    @Test
    public void testLoginWithNonRegisteredEmail() throws InterruptedException {
        driver.get("http://localhost:3000/login");

        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("notregistered@gmail.com");


        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("12345678");

        WebElement loginButton = driver.findElement(By.cssSelector(".submit"));
        loginButton.click();


        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement toastMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".Toastify__toast--error")));

        String toastText = toastMessage.getText();
        assert(toastText.contains("User Not Found. Please Check Your Email"));

        Thread.sleep(2000);
    }

    @Test
    public void testLoginWithIncorrectPassword() throws InterruptedException {
        driver.get("http://localhost:3000/login");

        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("abcadmin@gmail.com");


        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("wrongPassword");

        WebElement loginButton = driver.findElement(By.cssSelector(".submit"));
        loginButton.click();


        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement toastMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".Toastify__toast--error")));

        String toastText = toastMessage.getText();
        assert(toastText.contains("Incorrect Password"));
        Thread.sleep(2000);
    }

    @Test
    public void testLoginWithCorrectCredentials() throws InterruptedException {
        driver.get("http://localhost:3000/login");

        WebElement emailInput = driver.findElement(By.name("email"));
        emailInput.sendKeys("pramod2000.ravindu@gmail.com");


        WebElement passwordInput = driver.findElement(By.name("password"));
        passwordInput.sendKeys("12345678");

        WebElement loginButton = driver.findElement(By.cssSelector(".submit"));
        loginButton.click();


        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement toastMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".Toastify__toast--success")));

        String toastText = toastMessage.getText();
        assert(toastText.contains("Login success"));
        Thread.sleep(2000);
    }

    @AfterEach
    public void teardown(){
        driver.quit();
    }
}
