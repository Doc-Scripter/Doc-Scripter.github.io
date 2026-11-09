import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

/**
 * Bridge to the Electron main process, which is the only side with filesystem
 * access. The window passes the absolute path; main reads and parses it.
 */
export const ReadTasks = Ipc.define({
  id: "live-tasks.read",
  methods: {
    read: { input: Schema.String, output: Schema.Unknown },
  },
})

export type TaskStatus = "pending" | "active" | "done" | "blocked"

export interface Task {
  id: string
  title: string
  status: TaskStatus
  note?: string
}

export interface TaskFile {
  updated?: string
  tasks: Task[]
}

export const TASKS_FILENAME = ".opencode/tasks.json"
