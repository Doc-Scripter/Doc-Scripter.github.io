import { readFile } from "node:fs/promises"
import { For, Show, createSignal, onCleanup, onMount } from "solid-js"
import { Command, Panel, Plugin, Slot, usePlugin } from "@opencode/plugin/gui"
import { ReadTasks, TASKS_FILENAME, type Task, type TaskFile, type TaskStatus } from "./contract"

const POLL_MS = 2000

const GLYPH: Record<TaskStatus, string> = {
  pending: "○",
  active: "◐",
  done: "●",
  blocked: "✕",
}

const ORDER: TaskStatus[] = ["active", "pending", "blocked", "done"]

function parseTasks(value: unknown): Task[] {
  if (!value || typeof value !== "object") return []
  const file = value as Partial<TaskFile>
  if (!Array.isArray(file.tasks)) return []
  return file.tasks
    .filter((t): t is Task => !!t && typeof t.title === "string" && typeof t.status === "string")
    .map((t) => ({ id: String(t.id ?? t.title), title: t.title, status: t.status, note: t.note }))
    .sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status))
}

function tasksPath(ctx: ReturnType<typeof usePlugin>): string | null {
  const directory = ctx.sessions.current()?.directory
  return directory ? `${directory}/${TASKS_FILENAME}` : null
}

/** Polls the main process so the panel tracks `.opencode/tasks.json` live. */
function useTasks() {
  const ctx = usePlugin()
  const [tasks, setTasks] = createSignal<Task[]>([])
  const [reachable, setReachable] = createSignal(true)

  const load = async () => {
    const file = tasksPath(ctx)
    if (!file) {
      setTasks([])
      setReachable(false)
      return
    }
    try {
      const data = await ctx.main(ReadTasks).read(file)
      setTasks(parseTasks(data))
      setReachable(true)
    } catch {
      setReachable(false)
    }
  }

  onMount(() => void load())
  const timer = setInterval(() => void load(), POLL_MS)
  onCleanup(() => clearInterval(timer))

  return {
    tasks,
    reachable,
    done: () => tasks().filter((t) => t.status === "done").length,
    total: () => tasks().length,
    reload: load,
  }
}

function TasksPanel() {
  const ctx = usePlugin()
  const state = useTasks()

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        height: "100%",
        padding: "12px",
        gap: "10px",
        "font-size": "13px",
      }}
    >
      <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
        <strong>{ctx.t("panel.title")}</strong>
        <span style={{ opacity: 0.7 }}>
          {state.done()} / {state.total()}
        </span>
      </div>

      <button onClick={() => void state.reload()} style={{ "align-self": "flex-start" }}>
        {ctx.t("action.refresh")}
      </button>

      <Show
        when={state.tasks().length > 0}
        fallback={<p style={{ opacity: 0.6 }}>{ctx.t("empty")}</p>}
      >
        <ul style={{ "list-style": "none", margin: 0, padding: 0, display: "flex", "flex-direction": "column", gap: "6px" }}>
          <For each={state.tasks()}>
            {(task) => (
              <li style={{ display: "flex", gap: "8px", opacity: task.status === "done" ? 0.55 : 1 }}>
                <span aria-hidden="true">{GLYPH[task.status] ?? "○"}</span>
                <span style={{ "text-decoration": task.status === "done" ? "line-through" : "none" }}>
                  {task.title}
                </span>
              </li>
            )}
          </For>
        </ul>
      </Show>

      <Show when={!state.reachable()}>
        <p style={{ opacity: 0.6 }}>{ctx.t("unreachable")}</p>
      </Show>
    </div>
  )
}

function TasksStatus() {
  const ctx = usePlugin()
  const state = useTasks()

  return (
    <span style={{ opacity: 0.75, padding: "0 8px" }}>
      {ctx.t("status.label")} {state.done()}/{state.total()}
    </span>
  )
}

export default Plugin.define({
  i18n: {
    en: {
      title: "Tasks",
      "panel.title": "Tasks",
      "command.open": "Open tasks",
      "action.refresh": "Refresh",
      "status.label": "Tasks",
      empty: "No tasks yet — the agent writes .opencode/tasks.json",
      unreachable: "Waiting for a session directory",
    },
  },

  setup(ctx) {
    const tab = {
      id: "tasks",
      get title() {
        return ctx.t("panel.title")
      },
      fallback: true,
    }

    ctx.add(Panel, {
      id: "tasks",
      region: "side",
      width: "narrow",
      list: (input) => (input.open.includes("tasks") ? [tab] : []),
      render: () => <TasksPanel />,
    })

    ctx.add(Slot, {
      at: "window.bottom",
      order: 10,
      render: () => <TasksStatus />,
    })

    ctx.add(Command, () => ({
      id: "open",
      title: ctx.t("command.open"),
      slash: { name: "tasks" },
      bind: "mod+shift+t",
      enabled: !!ctx.sessions.current(),
      run: () => {
        const session = ctx.sessions.current()
        if (session) ctx.layout.open(`${ctx.id}:tasks`, session)
      },
    }))
  },

  main(ctx) {
    ctx.provide(ReadTasks, {
      async read(file: string) {
        try {
          return JSON.parse(await readFile(file, "utf8"))
        } catch {
          return null
        }
      },
    })
  },
})
