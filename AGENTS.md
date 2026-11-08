## parallel agents

Every task runs through concurrent subagents. Sequential single-agent work is the
fallback, not the default.

- Three dispatch points are mandatory: exploration before edits, implementation,
and self-diagnosis after the work lands.
- Launch a minimum of three agents per round, all in the same message so they
run concurrently rather than back to back.
- Split work by disjoint file ownership. Two agents never edit the same file; a
file with overlapping work belongs to one agent only.
- Give each agent a self-contained brief: goal, the files it owns, the
constraints it must respect, and the command that proves its slice passes.
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
- always use parallel agents for exploration, execution and self-diagnosis redce number of subagents if always timeouts with errors too many requests on endpoint

##explaining
- use .html / .md /mermaid charts  for explaining where necessary