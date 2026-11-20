/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AcademyConfig, FreelanceProject, Prospect, RoutineTask } from '../types';

export const DEFAULT_ROUTINE_TASKS: RoutineTask[] = [
  {
    id: 'task-morning-routine',
    title: 'Morning Routine',
    timeSlot: '8:30–9:30 AM',
    category: 'morning',
    description: 'Start the day energized, hydrated, and ready.',
    order: 1,
    subtasks: [
      { id: 'sub-wake', title: 'Wake up on time', completed: false },
      { id: 'sub-water', title: 'Drink three glasses of water', completed: false },
      { id: 'sub-wash', title: 'Wash face and freshen up', completed: false },
    ],
  },
  {
    id: 'task-study-1',
    title: 'Deep Study Session 1',
    timeSlot: '9:30–11:30 AM',
    category: 'study',
    description: 'Focus deeply on core subjects with zero distractions.',
    order: 2,
    subtasks: [],
  },
  {
    id: 'task-free-time',
    title: 'Free Time & Rest',
    timeSlot: '11:30 AM–1:00 PM',
    category: 'free_time',
    description: 'Rest, eat a healthy meal, or handle personal errands.',
    order: 3,
    subtasks: [],
  },
  {
    id: 'task-prayer-outreach',
    title: 'Prayer & Client Outreach',
    timeSlot: '1:00–2:00 PM',
    category: 'prayer_outreach',
    description: 'Offer Dhuhr prayer (prioritized!) and conduct daily prospect outreach.',
    order: 4,
    subtasks: [
      { id: 'sub-dhuhr-pri', title: 'Prioritize & offer Dhuhr prayer', completed: false },
      { id: 'sub-outreach-send', title: 'Send targeted client outreach messages', completed: false },
    ],
  },
  {
    id: 'task-study-2',
    title: 'Study Session 2',
    timeSlot: '2:00–3:00 PM',
    category: 'study',
    description: 'Second focused study block before afternoon academy.',
    order: 5,
    subtasks: [],
  },
  {
    id: 'task-academy',
    title: 'Academy Preparation & Attendance',
    timeSlot: 'After 3:00 PM',
    category: 'academy',
    description: 'Get ready, pack materials, and attend academy sessions.',
    order: 6,
    subtasks: [
      { id: 'sub-acad-prep', title: 'Get ready & review academy notes', completed: false },
      { id: 'sub-acad-attend', title: 'Attend academy classes', completed: false },
    ],
  },
  {
    id: 'task-freelance',
    title: 'Freelancing & Client Delivery',
    timeSlot: '9:30–10:30 PM',
    category: 'freelance',
    description: 'Work on client projects, sharpen skills, and manage business pipeline.',
    order: 7,
    subtasks: [
      { id: 'sub-free-client', title: 'Progress on active client deliverables', completed: false },
      { id: 'sub-free-skill', title: 'Skill improvement or pipeline follow-ups', completed: false },
    ],
  },
  {
    id: 'task-review',
    title: 'Daily Review & Tomorrow Prep',
    timeSlot: 'After 10:30 PM',
    category: 'review',
    description: 'Review completed tasks, log reflections, and set up tomorrow.',
    order: 8,
    subtasks: [
      { id: 'sub-rev-check', title: 'Review completed tasks and check off routine', completed: false },
      { id: 'sub-rev-plan', title: 'Prepare priority list for tomorrow', completed: false },
    ],
  },
];

export const DEFAULT_ACADEMY_CONFIG: AcademyConfig = {
  name: 'Academy',
  startTime: '15:30',
  endTime: '19:30',
  daysOfWeek: [1, 2, 3, 4, 5, 6], // Mon-Sat
  locationOrNotes: 'Onsite classes and lectures',
  reminderMinutesBefore: 30,
};

export const INITIAL_PROSPECTS: Prospect[] = [
  {
    id: 'prosp-1',
    name: 'Ahmed Malik',
    platform: 'LinkedIn',
    contacted: true,
    status: 'In Discussion',
    followUpDate: '2026-11-02',
    notes: 'Interested in web application redesign. Follow up with portfolio link.',
    createdAt: '2026-10-30',
    lastContactedAt: '2026-10-31',
  },
  {
    id: 'prosp-2',
    name: 'Sarah Jenkins',
    platform: 'Upwork',
    contacted: true,
    status: 'Meeting Booked',
    followUpDate: '2026-11-01',
    notes: 'Call scheduled at 7 PM for SaaS dashboard MVP.',
    createdAt: '2026-10-28',
    lastContactedAt: '2026-10-30',
  },
  {
    id: 'prosp-3',
    name: 'Tariq Al-Mansoor',
    platform: 'Cold Email',
    contacted: false,
    status: 'Not Contacted',
    followUpDate: '2026-11-01',
    notes: 'E-commerce founder; prepare proposal for checkout speed optimization.',
    createdAt: '2026-10-31',
  },
];

export const INITIAL_PROJECTS: FreelanceProject[] = [
  {
    id: 'proj-1',
    clientName: 'Nexus Digital',
    title: 'E-Commerce Dashboard Development',
    taskDescription: 'Build real-time inventory and sales tracking interface.',
    deadline: '2026-11-10',
    status: 'In Progress',
    estimatedEarnings: 85000,
    actualEarnings: 0,
    currency: 'PKR',
    notes: 'Milestone 1 delivered, working on data visualization.',
    createdAt: '2026-10-25',
  },
  {
    id: 'proj-2',
    clientName: 'Creative Flow Labs',
    title: 'Landing Page & Lead Funnel',
    taskDescription: 'Design and code responsive mobile-first landing page with email capture.',
    deadline: '2026-11-05',
    status: 'In Review',
    estimatedEarnings: 45000,
    actualEarnings: 45000,
    currency: 'PKR',
    notes: 'Client reviewing preview link before final sign-off.',
    createdAt: '2026-10-20',
    completedAt: '2026-10-31',
  },
];
