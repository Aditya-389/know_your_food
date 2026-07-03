import { z } from "zod";

export const authRegisterSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long").max(80, "Name is too long"),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z 
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(64, "Password is too long")

}).strict();


export const authLoginSchmea = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(64, "Password is too long")
}).strict();

export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;
export type AuthLoginInput = z.infer<typeof authLoginSchmea>;

/*
.strict() -> Only the fields I define are allowed. else give error of Unrecognized key(s): 'field_name'

z.infer<> -> Read this schema and generate the corresponding TypeScript type

Zod validates the data at runtime

*/