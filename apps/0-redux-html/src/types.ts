export type Task = {
  id: string;
  title: string;
  done: boolean;
};

export type Filter = "all" | "active" | "done";

export type Theme = "light" | "dark";
