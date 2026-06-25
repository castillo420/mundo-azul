const { z } = require("zod");

const registerSchema = z.object({
  id_reg: z.number().optional().default(0),
  name: z
    .string({ required_error: "Nombre es requerido" })
    .min(1, { message: "Nombre es requerido" }),
  email: z.string({ required_error: "Email requerido" }).email(),
  password: z.string({ required_error: "Contraseña requerida" }).min(6, {
    message: "La contraseña tiene que tener al menos 6 caracteres",
  }),
  pregunta_seguridad: z
    .string({ required_error: "La pregunta es requerida" })
    .min(1),
  respuesta_seguridad: z
    .string({ required_error: "La respuesta es requerida" })
    .min(1),
});

const loginSchema = z.object({
  name: z.string({
    required_error: "Usuario es requerido",
  }),
  password: z
    .string({
      required_error: "Contraseña es requerida",
    })
    .min(6, {
      message: "La contraseña tiene que tener al menos 6 caracteres",
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
