"use server"

import { revalidatePath } from "next/cache"

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

// In-memory storage for demo purposes
const tasks: Task[] = [
  {
    id: "1",
    title: "Setup MongoDB Integration",
    description: "Configure MongoDB connection and collections",
    completed: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Implement User Authentication",
    description: "Add login/logout functionality for admin panel",
    completed: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    title: "Create Country Management",
    description: "Build CRUD operations for countries and visa categories",
    completed: false,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
]

export async function getTasks(): Promise<Task[]> {
  return tasks
}

export async function createTask(title: string, description: string): Promise<Task> {
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  tasks.push(newTask)
  revalidatePath("/")
  return newTask
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const taskIndex = tasks.findIndex((task) => task.id === id)
  if (taskIndex === -1) return null

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
  }

  revalidatePath("/")
  return tasks[taskIndex]
}

export async function deleteTask(id: string): Promise<boolean> {
  const taskIndex = tasks.findIndex((task) => task.id === id)
  if (taskIndex === -1) return false

  tasks.splice(taskIndex, 1)
  revalidatePath("/")
  return true
}

export async function toggleTask(id: string): Promise<Task | null> {
  const task = tasks.find((task) => task.id === id)
  if (!task) return null

  return updateTask(id, { completed: !task.completed })
}
