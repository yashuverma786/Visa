"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"

export interface Task {
  _id?: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export async function createTask(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!title?.trim()) {
      throw new Error("Title is required")
    }

    const taskData: Omit<Task, "_id"> = {
      title: title.trim(),
      description: description?.trim() || "",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("tasks").insertOne(taskData)

    revalidatePath("/")

    return {
      success: true,
      task: {
        _id: result.insertedId.toString(),
        ...taskData,
      },
    }
  } catch (error) {
    console.error("Error creating task:", error)
    return {
      success: false,
      error: error.message || "Failed to create task",
    }
  }
}

export async function updateTask(id: string, formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const completed = formData.get("completed") === "true"

    if (!title?.trim()) {
      throw new Error("Title is required")
    }

    const updateData = {
      title: title.trim(),
      description: description?.trim() || "",
      completed,
      updatedAt: new Date(),
    }

    const result = await db.collection("tasks").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      throw new Error("Task not found")
    }

    revalidatePath("/")

    return {
      success: true,
      message: "Task updated successfully",
    }
  } catch (error) {
    console.error("Error updating task:", error)
    return {
      success: false,
      error: error.message || "Failed to update task",
    }
  }
}

export async function deleteTask(id: string) {
  try {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      throw new Error("Task not found")
    }

    revalidatePath("/")

    return {
      success: true,
      message: "Task deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting task:", error)
    return {
      success: false,
      error: error.message || "Failed to delete task",
    }
  }
}

export async function toggleTask(id: string) {
  try {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) })

    if (!task) {
      throw new Error("Task not found")
    }

    const result = await db.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          completed: !task.completed,
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/")

    return {
      success: true,
      message: "Task toggled successfully",
    }
  } catch (error) {
    console.error("Error toggling task:", error)
    return {
      success: false,
      error: error.message || "Failed to toggle task",
    }
  }
}

export async function getTasks() {
  try {
    const { db } = await connectToDatabase()

    const tasks = await db.collection("tasks").find({}).sort({ createdAt: -1 }).toArray()

    return tasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
    }))
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return []
  }
}
