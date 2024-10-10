import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await page.getByLabel('Task Name:').click();
    await page.getByLabel('Task Name:').fill('Dry clothes');
    await page.getByLabel('Status:').selectOption('4');
    await page.getByLabel('Assign To:').selectOption('20');
    await page.getByLabel('Hours Estimated:').click();
    await page.getByLabel('Hours Estimated:').fill('3');
    await page.getByLabel('Priority:').selectOption('medium');
    await page.getByRole('button', { name: 'Add Task' }).click();

    const rows = page.locator('#tasksTableBody').getByRole('row');
    const newlyAddedRow = rows.last();
    const hoursEstimatedCell = newlyAddedRow.locator('td').nth(4); // Assuming "Hours Estimated" is the 4th column (0-indexed)
    await expect(hoursEstimatedCell).toHaveText('3');
});