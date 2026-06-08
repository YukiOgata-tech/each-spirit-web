export type ContactFormState = {
  ok: boolean;
  message: string;
  fieldErrors: Partial<Record<"name" | "email" | "category" | "subject" | "body" | "privacy", string>>;
};

export const initialContactFormState: ContactFormState = {
  ok: false,
  message: "",
  fieldErrors: {},
};
