import { User } from './types';

export const MOCK_USERS: User[] = [
   {
    id: 'admin-001',
    fullName: 'Admin User',
    phone: '000-000-0000',
    email: 'admin@socialcop.app',
    password: 'admin',
    emergencyContacts: [],
  },
  {
    id: 'user-123',
    fullName: 'Jane Doe',
    phone: '555-123-4567',
    email: 'jane.doe@example.com',
    password: 'password123',
    emergencyContacts: [
      { id: 'contact-1', name: 'John Doe', phone: '555-987-6543' },
      { id: 'contact-2', name: 'Samantha Smith', phone: '555-555-5555' },
    ],
  },
  {
    id: 'user-456',
    fullName: 'John Smith',
    phone: '555-111-2222',
    email: 'john.smith@example.com',
    password: 'password456',
    emergencyContacts: [
      { id: 'contact-3', name: 'Emily White', phone: '555-333-4444' },
    ],
  },
];
