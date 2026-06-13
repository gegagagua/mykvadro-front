import api from "./axios";

export const SignIn = (email: string, password: string) =>
  api.post("/login", { email, password }).then((res) => res.data);

export const SignUp = (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => api.post("/register", data).then((res) => res.data);

export const getMe = () =>
  api.get("/user").then((res) => res.data);

export const logout = () =>
  api.post("/logout").then((res) => res.data);

export const updateProfile = (data: { name?: string; phone?: string }) =>
  api.put("/user", data).then((res) => res.data);
