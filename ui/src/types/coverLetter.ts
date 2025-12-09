export interface CoverLetterData {
  id?: number;
  userId?: number;
  title: string; // Internal name e.g. "Google Application"
  jobTitle: string;
  company: string;
  data: string; // JSON string of CoverLetterContent
  template: string;
  cvId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoverLetterContent {
  // Sender Details (User)
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  photoBase64?: string; // Storing image directly in JSON for this MVP

  // Recipient Details
  recipientName: string;
  recipientTitle: string; // e.g. "Hiring Manager"
  companyAddress: string;
  companyCityStateZip: string;
  body: string; // The main text
}
