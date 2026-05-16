/* --------- Profile Meta Types --------- */

export interface Profile {
  id: string;
  name: string;
  description: string | null;
  parsedProfileJson: string;
  updatedAt: string;
  createdAt: string;
}
