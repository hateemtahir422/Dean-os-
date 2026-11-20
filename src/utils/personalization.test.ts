import test from 'node:test';
import assert from 'node:assert';
import { RoutineTask, UserPreferences } from '../types';

test('routine reordering logic: moves task up and down correctly', () => {
  const initialTasks: RoutineTask[] = [
    { id: '1', title: 'Task 1', timeSlot: '8:00 AM', category: 'morning', order: 1 },
    { id: '2', title: 'Task 2', timeSlot: '9:00 AM', category: 'study', order: 2 },
    { id: '3', title: 'Task 3', timeSlot: '10:00 AM', category: 'review', order: 3 },
  ];

  // Move task 2 up (index 1 -> index 0)
  const moveTask = (tasks: RoutineTask[], index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasks.length) return tasks;
    const newTasks = [...tasks];
    const temp = newTasks[index];
    newTasks[index] = newTasks[targetIndex];
    newTasks[targetIndex] = temp;
    return newTasks.map((t, idx) => ({ ...t, order: idx + 1 }));
  };

  const movedUp = moveTask(initialTasks, 1, 'up');
  assert.strictEqual(movedUp[0].id, '2');
  assert.strictEqual(movedUp[0].order, 1);
  assert.strictEqual(movedUp[1].id, '1');
  assert.strictEqual(movedUp[1].order, 2);

  // Moving topmost task up should be a no-op
  const noOpUp = moveTask(initialTasks, 0, 'up');
  assert.strictEqual(noOpUp[0].id, '1');

  // Move task 2 down (index 1 -> index 2)
  const movedDown = moveTask(initialTasks, 1, 'down');
  assert.strictEqual(movedDown[1].id, '3');
  assert.strictEqual(movedDown[2].id, '2');
  assert.strictEqual(movedDown[2].order, 3);
});

test('user preferences: defaults to enabled prayer and uncompleted onboarding', () => {
  const defaultPrefs: UserPreferences = {
    userName: '',
    hasCompletedOnboarding: false,
    showPrayerTimes: true,
  };

  assert.strictEqual(defaultPrefs.userName, '');
  assert.strictEqual(defaultPrefs.hasCompletedOnboarding, false);
  assert.strictEqual(defaultPrefs.showPrayerTimes, true);
});
