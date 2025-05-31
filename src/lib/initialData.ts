import type { ResumeData } from './types';

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    jobTitle: 'Software Engineer',
    email: 'john.doe@example.com',
    phoneNumber: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev',
  },
  summary: 'Highly motivated and results-oriented software engineer with 5+ years of experience in developing and deploying web applications. Proficient in JavaScript, React, and Node.js. Passionate about creating innovative solutions and collaborating with cross-functional teams.',
  workExperience: [
    {
      id: 'we1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: '2021-06',
      endDate: 'Present',
      description: '- Led the development of a new e-commerce platform, resulting in a 20% increase in sales.\n- Mentored junior engineers and conducted code reviews.\n- Collaborated with product managers to define project requirements.',
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.S. in Computer Science',
      institution: 'University of Example',
      location: 'Example City, USA',
      graduationDate: '2019-05',
      details: 'GPA: 3.8, Magna Cum Laude',
    },
  ],
  skills: 'JavaScript, React, Node.js, Python, SQL, AWS, Docker, Agile Methodologies',
}; 