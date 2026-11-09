## parallel agents

Every task runs through concurrent subagents. Sequential single-agent work is the
fallback, not the default.

- Three dispatch points are mandatory: exploration before edits, implementation,
and self-diagnosis after the work lands.
- Launch as many agents per round as the work genuinely splits into, all in the
same message so they run concurrently rather than back to back. The task sets
the count; there is no fixed minimum or maximum to hit.
- Split work into disjoint areas of the codebase. Two agents never edit the same
file; an area with overlapping work belongs to one agent only. Assign areas,
not file paths — an agent that has to find its own files will, and it often
finds ones the parent had not considered.
- Give each agent a self-contained brief: goal, the constraints it must
respect, and the command that proves its slice passes. Do not list the files it
should edit: the child searches the codebase itself, so naming files up front
is wasted effort and usually wrong.
- Pre-load the context so no child re-discovers it. Before launching, gather
the file paths, findings and prior results that agent needs and paste them
straight into the brief. A child that re-greps, re-searches or re-reads files
the parent already read is duplicated work — the parent already holds that
knowledge and is one message away from handing it over. Send the child to
search only where the parent has not already looked. This means handing over
what you already found, not prescribing the files the child must edit: the
child chooses those once it has looked.
- Self-diagnosis agents audit different angles, for example backend contract,
frontend state and runtime behavior, so a shared blind spot cannot pass twice.
- Read every report yourself, then apply the fixes in the main thread. The final
diff keeps one author even when the evidence came from many agents.
- Report the outcome honestly per agent, including any agent that failed or
returned nothing usable.
- When the environment blocks agents, state that plainly and execute the same
steps sequentially instead of pretending the swarm ran.
- While subagents are running, keep working in the main thread on tasks that do
not overlap their files or topics. Never idle, never park waiting on a single
report, and never declare a result before the agent that produced it lands.

##model selection
- Every subagent runs on the model named in its own call, never on the parent
model by default. The parent model (`step-5-preview`) stays on the main thread.
- Pick the free model that best suits the task from the verified list in
`memory.md`. Match the model to the job, not the job to the model:
  - fast search, file scans, small edits: `nemotron-3.5-lightning-30b-a3b`
  - general implementation and review: `minimax-m3.1-flash` or `muse-glimmer-30b`
  - heavy reasoning, architecture, hard debugging: `nemotron-3-ultra-550b-a55b`
  - orchestrating the work and merging reports: the parent model
- Do not dispatch the parent model as a child unless it is genuinely the best
fit for that task. Say why in the brief when you do.
- Mixing models across agents in the same round is preferred when the tasks
differ; identical work on identical models is not a second opinion.
- If the best-fitting model is unavailable or fails, say so plainly rather than
silently falling back to whatever is left.

##git
when committing use best practice like feat,style,chore ,group and commit files accordingly
- always confirm the edited file compiles succefully for no syntax errors
- when told to commit,check file contents and group properly as you commit
- always use parallel agents for exploration, execution and self-diagnosis

##todo
There is no todo tool in this environment, so `TODO.md` in the repo root is the todo
list. Keeping it current is not optional, and it is not something the user has to ask
for — the parent agent does all of this **every session, natively**:

1. At session start, read `TODO.md` and `browser.preview` it, so the list is visible
   in the Review pane from the first message onward.
2. When the user names tasks — "do task 1, do task 2" — add every one of them to
   `TODO.md` before starting any of them, in the order given. Never leave a task only
   in the conversation.
3. Tick an item only once it is verified: the file compiles, or the proof command
   passes. Nothing is self-marked.
4. After every tick, re-run `browser.preview` on `TODO.md` so the visible list tracks
   reality as tasks land, rather than only being correct at the end.
5. Report the todo state at the end: what moved, what is still open, and why.

- The **Tasks** side panel (the `live-tasks` plugin) renders `.opencode/tasks.json`,
  which it polls every 2 seconds. Write that file on every state change: it is the
  live view, while `TODO.md` is the durable record. Treat `tasks.json` as
  authoritative for what is open right now, and keep the two consistent.

- One line per task. Break multi-step work into the sub-tasks you will actually
  dispatch.
- Subagents follow the same rule for work they discover: new tasks go into `TODO.md`
  before continuing on them. Only the parent owns the visible preview.
- When a task is dropped, blocked or turns out to be unnecessary, say so in the list
  instead of silently deleting it. The history stays honest.
- Keep the list short enough to be true. If it stops being maintained, delete it
  rather than let it lie.

##explaining
- use .html / .md /mermaid charts  for explaining where necessary