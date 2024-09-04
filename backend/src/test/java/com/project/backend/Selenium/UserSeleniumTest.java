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
