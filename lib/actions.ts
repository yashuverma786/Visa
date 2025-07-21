"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export interface Task {
  _id?: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getTasks(): Promise<Task[]> {
  try {
    const { db } = await connectToDatabase()
    const tasks = await db.collection<Task>("tasks").find({}).sort({ createdAt: -1 }).toArray()

    return tasks.map((task) => ({
      ...task,
      _id: task._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return []
  }
}

export async function createTask(title: string, description: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!title.trim()) {
      return { success: false, error: "Title is required" }
    }

    const { db } = await connectToDatabase()

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("tasks").insertOne(taskData)
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error creating task:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: "Invalid task ID" }
    }

    const { db } = await connectToDatabase()

    const updateData = {
      ...updates,
      updatedAt: new Date(),
    }

    const result = await db.collection("tasks").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return { success: false, error: "Task not found" }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating task:", error)
    return { success: false, error: "Failed to update task" }
  }
}

export async function deleteTask(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: "Invalid task ID" }
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("tasks").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return { success: false, error: "Task not found" }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

export async function toggleTask(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: "Invalid task ID" }
    }

    const { db } = await connectToDatabase()

    const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) })
    if (!task) {
      return { success: false, error: "Task not found" }
    }

    await db.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          completed: !task.completed,
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error toggling task:", error)
    return { success: false, error: "Failed to toggle task" }
  }
}
