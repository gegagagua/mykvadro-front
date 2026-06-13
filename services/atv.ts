import api from "./axios";

export const getAtvs = (filter: string) =>
  api.get(`/atvs${filter}`).then((res) => res.data);

export const getAtv = (id: number | string) =>
  api.get(`/atvs/${id}`).then((res) => res.data);

export const getBrands = () =>
  api.get("/brands").then((res) => res.data);

export const getCategories = () =>
  api.get("/categories?active_only=true").then((res) => res.data);

export const getCities = () =>
  api
    .get("/locations?georgian_only=true&international_only=false&active_only=true&country=Georgia&type=city&per_page=45")
    .then((res) => res.data);

export const createBrand = (data: FormData) =>
  api.post("/brands", data, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);

export const updateBrand = (id: number, data: FormData) =>
  api.post(`/brands/${id}?_method=PUT`, data, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);

export const deleteBrand = (id: number) =>
  api.delete(`/brands/${id}`).then((res) => res.data);

export const createCategory = (data: { title: string; image?: string }) =>
  api.post("/categories", data).then((res) => res.data);

export const updateCategory = (id: number, data: { title: string; image?: string }) =>
  api.put(`/categories/${id}`, data).then((res) => res.data);

export const deleteCategory = (id: number) =>
  api.delete(`/categories/${id}`).then((res) => res.data);

export const getAdminAtvs = (page = 1) =>
  api.get(`/atvs?page=${page}&per_page=20`).then((res) => res.data);

export const createAtv = (data: Record<string, unknown>) =>
  api.post("/atvs", data).then((res) => res.data);

export const updateAtv = (id: number, data: Record<string, unknown>) =>
  api.put(`/atvs/${id}`, data).then((res) => res.data);

export const deleteAtv = (id: number) =>
  api.delete(`/atvs/${id}`).then((res) => res.data);

export const getMyAtvs = (userId: number, page = 1) =>
  api.get(`/atvs?user_id=${userId}&page=${page}&per_page=10`).then((res) => res.data);

export const getBlogs = () =>
  api.get("/blogs").then((res) => res.data);
