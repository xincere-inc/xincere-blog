export interface Contact {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  inquiry: string;
  privacyPolicy: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
