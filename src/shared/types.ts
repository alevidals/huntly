export type ServerActionResponse<T> = {
  data?: Partial<T>;
  success: boolean;
  message?: string;
  error?: string;
  errors?: Partial<Record<keyof T, string>>;
};
