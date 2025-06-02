"use server"

import type { Task, CreateTaskData, UpdateTaskData } from "./types"
import { revalidatePath } from "next/cache"

// In-memory storage (in production, use a database)
const tasks: Task[] = [
  {
    id: "1",
    title: "Setup Project",
    description: "Initialize the React project with Next.js",
    status: "completed",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Build CRUD Operations",
    description: "Implement Create, Read, Update, Delete functionality",
    status: "in-progress",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
]

// READ - Get all tasks
export async function getTasks(): Promise<Task[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// READ - Get single task
export async function getTask(id: string): Promise<Task | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return tasks.find((task) => task.id === id) || null
}

// CREATE - Add new task
export async function createTask(data: CreateTaskData) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const newTask: Task = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  tasks.push(newTask)
  revalidatePath("/")

  return { success: true, task: newTask }
}

// UPDATE - Edit existing task
export async function updateTask(data: UpdateTaskData) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const taskIndex = tasks.findIndex((task) => task.id === data.id)

  if (taskIndex === -1) {
    return { success: false, error: "Task not found" }
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: data.title,
    description: data.description,
    status: data.status,
    updatedAt: new Date(),
  }

  revalidatePath("/")
  return { success: true, task: tasks[taskIndex] }
}

// DELETE - Remove task
export async function deleteTask(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const taskIndex = tasks.findIndex((task) => task.id === id)

  if (taskIndex === -1) {
    return { success: false, error: "Task not found" }
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0]
  revalidatePath("/")

  return { success: true, task: deletedTask }
}
