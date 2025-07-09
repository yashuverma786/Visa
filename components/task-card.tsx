"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import type { Task } from "@/lib/types"
import { deleteTask } from "@/lib/actions"
import TaskForm from "./task-form"

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      startTransition(async () => {
        await deleteTask(task.id)
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <TaskForm task={task} onSuccess={() => setIsEditing(false)} />
        <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full">
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{task.description}</p>
        <div className="text-sm text-gray-500 mb-4">
          <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(task.updatedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-1">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
