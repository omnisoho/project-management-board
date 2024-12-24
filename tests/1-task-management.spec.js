const { test, expect } = require('@playwright/test');

// Navigate to the application before each test
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3001');
});

// Define new tasks and their assignees
const NEW_TASKS = ['buy some cheese', 'feed the cat', 'delete me'];
/**
 * An array representing task assignees.
 * Each sub-array contains two numbers:
 * - The first number represents the task ID.
 * - The second number represents the user ID assigned to the task.
 * 
 * @type {number[][]}
 * @example
 * // Example usage:
 * const ASSIGNEES = [
 *   [0, 1], // Task 0 is assigned to user 1
 *   [1, 2], // Task 1 is assigned to user 2
 *   [1, 2], // Task 1 is also assigned to user 2
 * ];
 */
const ASSIGNEES = [
  [0, 1],
  [1, 2],
  [1, 2],
];

// Function to add a task
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

  await page.getByRole('button', { name: 'Add Task' }).click();

  // Verify the task is added to the table
  await expect(page.locator('#tasksTableBody')).toContainText(
    NEW_TASKS[taskIndex],
  );
}

// Test suite for adding new tasks
test.describe('New Task', () => {
  // Test case for adding a pending task with assignees
  test('Should allow me to add pending task with assignees', async ({ page }) => {
    await addTask(page, 0);
  });

  // Test case for ensuring a task cannot be added without an assignee
  test('Should not allow me to add without assignee', async ({ page }) => {
    const taskNameInput = page.getByLabel('Task Name');
    await taskNameInput.fill(NEW_TASKS[0]);

    const statusInput = page.getByLabel('Status');
    await statusInput.selectOption({ label: 'In Progress' });

    await page.getByRole('button', { name: 'Add Task' }).click();

    // Verify the 'Assign To' field is focused if not filled
    await expect(page.getByLabel('Assign To')).toBeFocused();
  });

  // Feature suggestion: More fields such as "Start/End time", hours estimated, priority, etc...
});

// Test suite for loading tasks
test.describe('Load Tasks', () => {
  // Test case for loading tasks
  test('Should load tasks', async ({ page }) => {
    const rows = page.locator('#tasksTableBody').getByRole('row');
    await rows.first().waitFor();
    await expect(await rows.count()).toBeGreaterThan(0);
  });

  // Feature suggestion: Pagination
});

// Test suite for updating tasks
test.describe('Update Task', () => {
  // Test case for removing an assignee from a task
  test('Should allow me to remove assignee', async ({ page }) => {
    await addTask(page, 1);

    const rows = page.locator('#tasksTableBody').getByRole('row');
    const newlyAddedRow = rows.filter({ hasText: NEW_TASKS[1] });
    await newlyAddedRow.getByRole('button', { name: '❌' }).first().click();

    // Verify only one assignee is left
    await expect(newlyAddedRow.getByRole('button', { name: '❌' })).toHaveCount(1);
  });

  // Feature suggestion: Should prevent removal if it is the last assignee
});

// Test suite for deleting tasks
test.describe('Delete Task', () => {
  // Test case for removing a task
  test('Should allow me to remove task', async ({ page }) => {
    await addTask(page, 2);

    const rows = page.locator('#tasksTableBody').getByRole('row');
    const newlyAddedRow = rows.filter({ hasText: NEW_TASKS[2] });
    await newlyAddedRow.getByRole('button', { name: 'Delete' }).click();

    // Verify the task is removed from the table
    await expect(page.locator('#tasksTableBody')).not.toContainText(NEW_TASKS[2]);
  });

  // Feature suggestion: Add a new state "Cancelled" and prevent deletion unless it is "Cancelled" or "Completed"
});
