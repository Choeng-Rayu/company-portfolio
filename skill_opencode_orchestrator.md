# Skill: Orchestrate Sub-Agents via `opencode run`

> **Who reads this skill:** The orchestrator AI (you)  
> **What is the sub-agent:** `opencode run` — a CLI AI agent you invoke via `run_command`  
> **Default model:** `nvidia/openai/gpt-oss-120b`  
> **Source:** Verified against official docs at https://opencode.ai/docs/cli/

---

## Architecture

```
YOU (Orchestrator)
 │
 │  You plan tasks, decide session strategy, and synthesize results.
 │  You use run_command to invoke opencode.
 │  You do NOT code directly — you delegate to opencode.
 │
 ├─ run_command("opencode run ... 'TASK 1'")  → opencode sub-agent #1
 │   └─ opencode reads files, runs tools, returns result
 │      opencode does NOT spawn further sub-agents
 │
 ├─ run_command("opencode run ... 'TASK 2'")  → opencode sub-agent #2
 │   └─ same — executes directly, returns result
 │
 └─ You collect outputs, evaluate, synthesize, re-dispatch if needed
```

**Key rule:** opencode is the executor. YOU are the brain. opencode does not delegate further — it directly reads files, runs bash, greps, and writes code. You manage the sessions and decide what to dispatch.

---

## Step 1 — Discover Available Models

Before dispatching, confirm the model ID exists.

```
run_command:
  Cwd: /home/rayu/both-safe
  Command: opencode models nvidia 2>&1
```

Expected output includes: `nvidia/openai/gpt-oss-120b`

---

## Step 2 — Dispatch a Task

### Template (copy this pattern exactly)

```
run_command:
  Cwd: <PROJECT ROOT WHERE FILES LIVE>     ← this sets opencode's working directory
  SafeToAutoRun: true
  WaitMsBeforeAsync: 5000                   ← background immediately
  Command:
    opencode run \
      --model nvidia/openai/gpt-oss-120b \
      --dangerously-skip-permissions \
      --format json \
      "AGENT-N TASK: <clear task description>
       Read <relative path from Cwd>.
       <what to find/do/return>.
       Output format: <table / bullet list / code block>." \
      2>&1
```

### Example — Dispatch a review task

```
run_command:
  Cwd: /home/rayu/both-safe/bothsafe       ← opencode will see files relative to here
  Command:
    opencode run \
      --model nvidia/openai/gpt-oss-120b \
      --dangerously-skip-permissions \
      --format json \
      "AGENT-1 TASK: Error Handling Audit.
       Read src/payments/providers/bakong.provider.ts.
       Find every fetch() call without try/catch.
       For each: method name, line number, exception risk.
       Output as a markdown table." \
      2>&1
```

### Capturing the Session ID

From the JSON output, extract `sessionID` for potential follow-ups:

```
In the command output, look for:
  "sessionID":"ses_XXXXXXXXX"

Extract it with:
  grep -o '"sessionID":"[^"]*"' | head -1 | cut -d'"' -f4
```

Or look at the Background command output — the sessionID appears in every JSON event.

---

## Step 3 — Collect Results

After dispatching (the command goes to background), use `command_status` to collect:

```
command_status:
  CommandId: <background-command-id>
  WaitDurationSeconds: 120
  OutputCharacterCount: 6000
```

Read the result. Check for `Exit code: 0` = success.

---

## Step 4 — Session Decision: Reuse or New?

**THIS IS THE MOST IMPORTANT DECISION.**

After collecting a result, you must decide for the next task:

```
Is the next task DIRECTLY RELATED to what this agent just did?
│
├─ YES: the next task builds on findings, fixes issues found,
│       extends the output, or needs the same file context
│
│   → REUSE session: add --session <captured-session-id>
│     Agent remembers: files it read, findings, full conversation
│     You do NOT need to re-explain context
│     You MUST still pass --dangerously-skip-permissions again
│
└─ NO: the next task is about different files, different concern,
       or is completely independent
│
    → NEW session: do NOT pass --session
      Clean slate, no context from prior work
      You MUST provide all context in the prompt
```

### Reuse Example (follow-up fix)

```
run_command:
  Cwd: /home/rayu/both-safe/bothsafe
  Command:
    opencode run \
      --model nvidia/openai/gpt-oss-120b \
      --dangerously-skip-permissions \
      --session ses_209f4a609ffeBhgvrgy8lieKgH \
      "Based on the error handling gaps you found, now write the exact
       TypeScript patches to add try/catch to both methods.
       Show only the changed code blocks." \
      2>&1
```

Notice:
- `--session ses_...` → reuses the prior session (agent remembers the file + findings)
- `--dangerously-skip-permissions` → MUST be passed again (not stored in session)
- `--format json` → NOT needed here since we don't need a new session ID
- Prompt says "Based on what you found" → no need to re-describe the file

### New Session Example (unrelated task)

```
run_command:
  Cwd: /home/rayu/both-safe/bothsafe
  Command:
    opencode run \
      --model nvidia/openai/gpt-oss-120b \
      --dangerously-skip-permissions \
      --format json \
      "AGENT-2 TASK: Interface Compliance.
       Read src/payments/payment-provider.interface.ts
       and src/payments/providers/bakong.provider.ts.
       Verify BakongProvider implements every interface method.
       List any missing or mismatched signatures." \
      2>&1
```

Notice:
- No `--session` → fresh start
- `--format json` → capture new session ID for potential follow-ups
- Full context in the prompt (agent knows nothing about prior work)

---

## Step 5 — Permission Rules

`--dangerously-skip-permissions` is a **per-process flag**. It:
- ✅ Allows the current `opencode run` process to auto-approve all tool use
- ❌ Does NOT persist into the session
- ❌ Does NOT affect the user's own opencode TUI
- ❌ Does NOT affect any other `opencode run` process

**You MUST pass it on EVERY invocation** — including session reuse:

```
# ✅ Correct: flag on every call
opencode run --dangerously-skip-permissions --session $SES "fix it..."

# ❌ Wrong: reuse without flag → agent pauses and waits for manual approval
opencode run --session $SES "fix it..."
```

---

## Step 6 — Parallel Dispatch (Multiple Sub-Agents)

You can dispatch multiple independent tasks in parallel. Rules:

- ✅ Multiple agents READING the same file → safe, always parallel
- ✅ Multiple agents WRITING to DIFFERENT files → safe, parallel
- ❌ Multiple agents WRITING to the SAME file → NOT safe, must be sequential
- ❌ Follow-up that depends on prior result → must be sequential

### Pattern: Dispatch 3 parallel agents

```
run_command #1:  Cwd: .../bothsafe  Command: opencode run ... "AGENT-1: audit errors..."
run_command #2:  Cwd: .../bothsafe  Command: opencode run ... "AGENT-2: check interface..."
run_command #3:  Cwd: .../bothsafe  Command: opencode run ... "AGENT-3: review EMV spec..."

All three use --format json (to capture session IDs)
All three are independent read-only analysis
All three can run simultaneously
```

After all complete:
```
command_status(#1, wait=120)  → result 1  (+ session_id_1)
command_status(#2, wait=120)  → result 2  (+ session_id_2)
command_status(#3, wait=120)  → result 3  (+ session_id_3)
```

Then for follow-ups:
- Fix agent 1's findings → `--session session_id_1`
- Fix agent 2's findings → `--session session_id_2`
- These CAN be parallel if they write different files
- These must be SEQUENTIAL if they write the same file

---

## Step 7 — Working Directory Rules

**The `Cwd` parameter in your `run_command` call sets opencode's working directory.**

opencode sees files relative to this path. Set it to the root of the subproject:

```
Cwd: /home/rayu/both-safe/bothsafe     → agent can access src/payments/...
Cwd: /home/rayu/both-safe              → agent sees bothsafe/src/payments/...
```

If the project is a monorepo, point to the specific package root.

You can also use `--dir <path>` as a flag, but `Cwd` in `run_command` is simpler and always works. Do not rely on both — pick one. **Recommended: use `Cwd` only.**

---

## Step 8 — Using Design Skills for UI Tasks

opencode has a pre-installed skill: `awesome-design-md` with 60+ brand design systems.

Location: `/home/rayu/.config/opencode/skills/awesome-design-md/design-md/`

Available brands include: `stripe`, `vercel`, `linear.app`, `supabase`, `notion`, `airbnb`, `spotify`, `tesla`, `ferrari`, `figma`, `cursor`, and many more.

**When dispatching a UI/frontend task**, include the design file path in your prompt:

```
run_command:
  Cwd: /home/rayu/both-safe/frontend
  Command:
    opencode run \
      --model nvidia/openai/gpt-oss-120b \
      --dangerously-skip-permissions \
      "Create a KHQR payment checkout page.
       Follow the design system defined in:
       /home/rayu/.config/opencode/skills/awesome-design-md/design-md/stripe/DESIGN.md
       Read that file first, then implement accordingly." \
      2>&1
```

**Orchestrator rule:** When a task involves UI work, always check:
```
ls /home/rayu/.config/opencode/skills/awesome-design-md/design-md/
```
to find matching brand styles.

---

## Step 9 — Cost & Session Management

```bash
# List recent sessions
opencode session list -n 10

# Find a lost session ID (JSON for scripting)
opencode session list --format json

# Export a session transcript
opencode export <session-id>
opencode export <session-id> --sanitize    # removes secrets

# Check token usage and cost
opencode stats
opencode stats --days 7
opencode stats --models

# Clean up old sessions
opencode session delete <session-id>
```

---

## Orchestrator Checklist (run through this before every dispatch)

```
Before dispatching:
 □ Cwd is set to the correct project root
 □ --dangerously-skip-permissions is included
 □ --format json is included (if I need the session ID later)
 □ Task prompt is specific: what file to read, what to find, what format to return
 □ Prompt does NOT ask opencode to delegate to sub-agents
 □ If follow-up: --session <id> is included
 □ If new concern: no --session (fresh start)
 □ If UI task: design system file path is included in prompt

After collecting result:
 □ Check exit code = 0
 □ Extract session ID if I might follow up
 □ Decide: reuse session or new session for next task
 □ If multiple agents wrote files, verify no conflicts
```

---

## Anti-Patterns (Do NOT do these)

```
❌ Tell opencode to "delegate to a sub-agent" or "spawn another agent"
   → opencode is YOUR sub-agent. It executes directly.

❌ Omit --dangerously-skip-permissions on session reuse
   → Agent will pause and wait for manual approval (hangs forever)

❌ Run opencode from wrong Cwd
   → Agent won't find the files referenced in the prompt

❌ Reuse --session for an unrelated task
   → Context pollution — agent carries stale findings from prior work

❌ Use --continue when managing multiple parallel agents
   → --continue picks the MOST RECENT session, which may be wrong

❌ Dispatch two agents writing the same file in parallel
   → Race condition — one agent's writes get overwritten

❌ Use --format json for follow-ups where you don't need session ID
   → Produces noisy JSON output; use default format for readability

❌ Forget to set Cwd thinking --dir will handle it
   → --dir works but is meant for --attach (remote) mode; Cwd is the reliable local approach
```

---

## Complete Decision Flowchart

```
You receive a task from the user
│
├─ Is it simple enough for one agent?
│   YES → Dispatch single opencode run
│   NO  → Decompose into N non-conflicting sub-tasks
│
├─ For each sub-task:
│   ├─ Set Cwd to correct project root
│   ├─ Include --dangerously-skip-permissions
│   ├─ Include --format json (if session reuse might be needed)
│   ├─ Write clear prompt: file, goal, output format
│   └─ Dispatch via run_command (background: WaitMsBeforeAsync=5000)
│
├─ Collect results via command_status (WaitDurationSeconds=120)
│
├─ For each result, decide:
│   ├─ DONE + complete     → add to synthesis
│   ├─ DONE + needs fix    → re-dispatch with --session <id> (related follow-up)
│   ├─ DONE + new concern  → new dispatch without --session
│   └─ FAILED              → retry with --session <id> and refined prompt
│
└─ Synthesize all results → report to user
```
