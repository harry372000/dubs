#!/usr/bin/env python3
"""PostToolUse hook: runs tsc + eslint after Write/Edit, wakes model on errors."""
import sys, json, subprocess

data = json.load(sys.stdin)
fp = data.get("tool_input", {}).get("file_path", "")
cwd = "D:/My Projects/DUBS"

errors = []

# TypeScript check (whole project)
r = subprocess.run(
    ["npx", "tsc", "--noEmit", "--project", "tsconfig.json"],
    capture_output=True, text=True, cwd=cwd, timeout=90
)
if r.returncode != 0:
    errors.append("TypeScript errors:\n" + r.stdout[:1000])

# ESLint on the changed file only
if fp and (fp.endswith(".ts") or fp.endswith(".tsx")):
    r2 = subprocess.run(
        ["npx", "next", "lint", "--file", fp, "--quiet"],
        capture_output=True, text=True, cwd=cwd, timeout=60
    )
    if r2.returncode != 0:
        lint_out = (r2.stdout or r2.stderr or "").strip()
        if lint_out:
            errors.append("ESLint errors:\n" + lint_out[:600])

if errors:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": "COMPONENT TEST FAILED — fix before responding:\n\n" + "\n\n".join(errors)
        }
    }))
    sys.exit(2)
