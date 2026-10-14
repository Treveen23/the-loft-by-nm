import { test, expect } from '@playwright/test';

test.describe('The Loft by NM - App E2E Tests', () => {
  test('should load the homepage and display the correct title', async ({ page }) => {
    await page.goto('/');
    
    // Check if the title is correct based on PAGE_METADATA.home in App.tsx
    await expect(page).toHaveTitle(/The Loft by NM \| Luxury Salon & Spa/);
    
    // Check if the main content is visible
    const mainContent = page.locator('main#main-content');
    await expect(mainContent).toBeVisible();
  });

  test('should navigate to the services page', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Services using the header link
    await page.click('#nav-item-services');
    
    // Verify we are on the services page
    await expect(page).toHaveTitle(/Our Luxury Services/);
  });
  
  test('should show floating WhatsApp button', async ({ page }) => {
    await page.goto('/');
    
    // Check for WhatsApp button
    const whatsappBtn = page.locator('a[aria-label="Contact us on WhatsApp"]');
    await expect(whatsappBtn).toBeVisible();
    await expect(whatsappBtn).toHaveAttribute('href', /wa\.me/);
  });
  
  test('should navigate to the Contact page', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Contact
    await page.click('#nav-item-contact');
    
    // Check for correct title
    await expect(page).toHaveTitle(/Schedule Your Appointment/);
  });

  test('should match the homepage visual snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for elements to stabilize, especially if there are initial animations
    await page.waitForTimeout(2000);
    
    // Take a full page screenshot and compare it with the baseline
    await expect(page).toHaveScreenshot('homepage.png', { 
      fullPage: true, 
      maxDiffPixelRatio: 0.02 // Allow up to 2% difference for minor rendering/animation artifacts
    });
  });
});
