import { z } from "zod";

export const taskStatusSchema = z.enum([
  "todo",
  "in_progress",
  "move_to_qa",
  "completed",
  "archived",
]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(2, "Category is required"),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  budget: z.number().min(0, "Budget must be a positive number"),
  createdAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const createTaskFormSchema = taskSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>;
