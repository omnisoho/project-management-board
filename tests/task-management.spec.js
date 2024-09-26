const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3001');
});

const NEW_TASKS = ['buy some cheese', 'feed the cat'];

const ASSIGNEES = [
  [0, 1],
  [1, 2],
];

async function addTask(page, taskIndex) {
  const taskNameInput = page.getByLabel('Task Name');
  await taskNameInput.fill(NEW_TASKS[taskIndex]);

  const statusInput = page.getByLabel('Status');
  await statusInput.selectOption({ label: 'Pending' });

  const assigneesInput = page.getByLabel('Assign To');
  await assigneesInput.selectOption([
    { index: ASSIGNEES[taskIndex][0] },
    { index: ASSIGNEES[taskIndex][1] },
  ]);

  const rows = page.locator('#tasksTableBody').getByRole('row');
  const initialNumberOfRows = await rows.count();

  await page.getByRole('button', { name: 'Add Task' }).click();

  await expect(rows).toHaveCount(initialNumberOfRows + 1);
}

test.describe('New Task', () => {
  test('Should allow me to add pending task with assignees', async ({
    page,
  }) => {
    await addTask(page, 0);
  });

  test('Should not allow me to add without assignee', async ({ page }) => {
    const taskNameInput = page.getByLabel('Task Name');
    await taskNameInput.fill(NEW_TASKS[0]);

    const statusInput = page.getByLabel('Status');
    await statusInput.selectOption({ label: 'In Progress' });

    await page.getByRole('button', { name: 'Add Task' }).click();

    // First required field not filled will be focused
    await expect(page.getByLabel('Assign To')).toBeFocused();
  });

  // Feature suggestion: More fields such as "Start/End time", hours estimated, priority, etc...
});

test.describe('Load Tasks', () => {
  test('Should load tasks', async ({ page }) => {
    const rows = page.locator('#tasksTableBody').getByRole('row');
    await expect(await rows.count()).toBeGreaterThan(0);
  });

  // Feature suggestion: Pagination
});

test.describe('Update Task', () => {
  test('Should allow me to remove assignee', async ({ page }) => {
    await addTask(page, 1);

    const rows = page.locator('#tasksTableBody').getByRole('row');
    const newlyAddedRow = rows.last();
    await newlyAddedRow.getByRole('button', { name: '❌' }).first().click();

    await expect(newlyAddedRow).toHaveCount(1);
  });

  // Feature suggestion: Should prevent removal if it is the last assignee
});

test.describe('Delete Task', () => {
  test('Should allow me to remove task', async ({ page }) => {
    const rows = page.locator('#tasksTableBody').getByRole('row');
    const initialNumberOfRows = await rows.count();

    const newlyAddedRow = rows.last();
    await newlyAddedRow.getByRole('button', { name: 'Delete' }).click();

    await expect(rows).toHaveCount(initialNumberOfRows - 1);
  });

  // Feature suggestion: Add a new state "Cancelled" and prevent deletion unless it is "Cancelled" or "Completed"
});