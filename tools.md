# AI Tools Inventory

This document lists the currently supported AI tools in the application.

------------------------------------------------------------------------

## Productivity

### Notes

-   Create notes
-   Get a note
-   List notes
-   Search notes
-   Update notes
-   Delete notes

### Memory

-   Remember
-   Recall
-   Recall all
-   Search memories
-   Update memory
-   Forget memory

------------------------------------------------------------------------

## Developer

### GitHub (Public Repositories)

#### Repositories

-   Search repositories
-   Get repository details
-   Get README
-   List branches
-   List tags
-   List languages
-   List contributors
-   List releases

#### Users

-   Search users
-   Get user profile

#### Code

-   Get file contents

#### Issues

-   List issues
-   Get issue

#### Pull Requests

-   List pull requests
-   Get pull request

### JSON

-   Format JSON
-   Minify JSON
-   Validate JSON
-   Repair JSON (placeholder)

------------------------------------------------------------------------

## Utility

Current utility tools implemented in the project.

------------------------------------------------------------------------

## Web

Current web/search tools implemented in the project.

------------------------------------------------------------------------

## Summary

  Category       Tool       Actions
  -------------- -------- ---------
  Productivity   Notes            6
  Productivity   Memory           6
  Developer      GitHub          15
  Developer      JSON             4

**Total tool groups:** 4

**Total implemented actions:** 31# 🤖 AI Tools Reference

This document lists all AI tools currently supported by the application.

---

# Productivity

## 📝 Notes

Manage user notes.

### Supported Actions

| Action | Description |
|---------|-------------|
| createNote | Create a new note |
| getNote | Retrieve a note |
| listNotes | List all notes |
| searchNotes | Search notes |
| updateNote | Update an existing note |
| deleteNote | Delete a note |

**Service**

```
features/ai/services/productivity/notes
```

**Tool**

```
features/ai/tools/productivity/notes.ts
```

---

## 🧠 Memory

Persistent user memory.

### Supported Actions

| Action | Description |
|---------|-------------|
| remember | Save a memory |
| recall | Retrieve a memory |
| recallAll | Retrieve all memories |
| search | Search memories |
| update | Update a memory |
| forget | Delete a memory |

**Service**

```
features/ai/services/productivity/memory
```

**Tool**

```
features/ai/tools/productivity/memory.ts
```

---

# Developer

## 🐙 GitHub

Public GitHub repository exploration.

### Repository

| Action | Description |
|---------|-------------|
| searchRepositories | Search public repositories |
| getRepository | Get repository information |
| getReadme | Read repository README |
| listBranches | List branches |
| listTags | List repository tags |
| listLanguages | List languages used |
| listContributors | List contributors |
| listReleases | List releases |

### Users

| Action | Description |
|---------|-------------|
| searchUsers | Search GitHub users |
| getUser | Get GitHub user profile |

### Code

| Action | Description |
|---------|-------------|
| getFile | Read repository file |

### Issues

| Action | Description |
|---------|-------------|
| listIssues | List repository issues |
| getIssue | Get issue details |

### Pull Requests

| Action | Description |
|---------|-------------|
| listPullRequests | List pull requests |
| getPullRequest | Get pull request details |

**Service**

```
features/ai/services/github
```

**Tool**

```
features/ai/tools/github/index.ts
```

---

## 📄 JSON

JSON manipulation utilities.

### Supported Actions

| Action | Description |
|---------|-------------|
| format | Pretty-print JSON |
| minify | Minify JSON |
| validate | Validate JSON |
| repair | Attempt to repair malformed JSON |

**Service**

```
features/ai/services/developers/json
```

**Tool**

```
features/ai/tools/developer/json.ts
```

---

# Utility

## 🧮 Calculator

Perform mathematical calculations.

**Tool**

```
features/ai/tools/utility/calculator.ts
```

---

## 💱 Currency

Currency conversion.

**Tool**

```
features/ai/tools/utility/currency.ts
```

---

## 🕒 Time

Current time and timezone utilities.

**Tool**

```
features/ai/tools/utility/time.ts
```

---

## 📏 Units

Unit conversion utilities.

**Tool**

```
features/ai/tools/utility/units.ts
```

---

# Web

## 🔎 Search

General web search.

**Tool**

```
features/ai/tools/web/search.ts
```

---

## 📰 News

Latest news search.

**Tool**

```
features/ai/tools/web/news.ts
```

---

## 🌦 Weather

Weather lookup.

**Tool**

```
features/ai/tools/web/weather.ts
```

---

# Project Structure

```text
features/
└── ai
    ├── actions
    ├── services
    │   ├── developers
    │   │   └── json
    │   ├── github
    │   └── productivity
    │       ├── memory
    │       └── notes
    │
    ├── tools
    │   ├── developer
    │   ├── github
    │   ├── productivity
    │   ├── utility
    │   └── web
    │
    └── utils
```

---

# Summary

| Category | Tool | Actions |
|-----------|------|--------:|
| Productivity | Notes | 6 |
| Productivity | Memory | 6 |
| Developer | GitHub | 15 |
| Developer | JSON | 4 |
| Utility | Calculator | ✓ |
| Utility | Currency | ✓ |
| Utility | Time | ✓ |
| Utility | Units | ✓ |
| Web | Search | ✓ |
| Web | News | ✓ |
| Web | Weather | ✓ |

---

# Current Statistics

| Metric | Count |
|--------|------:|
| Productivity Tools | 2 |
| Developer Tools | 2 |
| Utility Tools | 4 |
| Web Tools | 3 |
| Total Tool Groups | **11** |
| Implemented AI Actions | **31** |
