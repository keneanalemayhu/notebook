// @/lib/axios.ts

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/backend/notes",
  headers: {
    "Content-Type": "application/json",
  },
});

// Note Types
export type NoteBadgeVariant = "default" | "secondary" | "destructive" | "outline";

export type Note = {
  id: number;
  title: string;
  content: string;
  badge?: {
    label: string;
    variant: NoteBadgeVariant;
  };
};

// CRUD FUNCTIONS

// FETCH NOTES
export const getNotes = async () => {
  const response = await api.get<Note[]>("/list.php");
  return response.data;
};

// FETCH NOTES BY ID
export const getNoteById = async (id: number) => {
  const response = await api.get<Note>(`/read.php?id=${id}`);
  return response.data;
};

// CREATE NOTE
export const createNote = async (note: Omit<Note, "id">) => {
  const response = await api.post<Note>("/create.php", note);
  return response.data;
};

// UPDATE NOTE
export const updateNote = async (id: number, note: Omit<Note, "id">) => {
  const response = await api.post(`/update.php`, {
    ...note,
    id,
    _method: "PUT",
  });
  return response.data;
};

// DELETE NOTE
export const deleteNote = async (id: number) => {
  const response = await api.post(`/delete.php`, { id, _method: "DELETE" });
  return response.data;
};

export default api;