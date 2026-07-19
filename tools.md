# Available Tools

Below is a concise reference of all the tools that this assistant can use, along with a brief description of each tool’s purpose and capabilities.

| Tool | Category | Description |
|------|----------|-------------|
| **calculator** | Utility | Perform basic arithmetic operations (addition, subtraction, multiplication, division) on two numbers. |
| **weather** | External API | Retrieve the current weather conditions for any city, state, or country. |
| **news** | External API | Fetch the latest news headlines or search for articles based on category, country, language, query, and result limit. |
| **search** | External API | Conduct a web search for any topic, person, place, or thing and return the most relevant results. |
| **time** | Utility | Get the current date and time for a specified IANA timezone (e.g., `Asia/Kolkata`, `America/New_York`). |
| **units** | Conversion | Convert values between common units of length, weight, and temperature. |
| **currency** | Conversion | Convert an amount of money from one currency to another using live exchange rates. |
| **json** | Data Formatting | Work with JSON data – format, minify, validate, or repair JSON strings. |
| **github** | Repository Explorer | Interact with public GitHub repositories: search repos/users, read files/README, list branches, tags, languages, contributors, releases, issues, pull requests, etc. |
| **notes** | Personal Knowledge Base | Create, read, update, delete, pin, archive, list, and search personal notes. Ideal for storing and retrieving information the user wants to keep. |
| **memory** | Long‑Term User Memory | Store and retrieve small pieces of user‑specific data (preferences, profile info, project details, custom key‑value pairs). Supports remembering, recalling, updating, forgetting, and searching stored items. |

## Quick Usage Summary

- **calculator**: `{ a: number, b: number, operation: "add" | "subtract" | "multiply" | "divide" }`
- **weather**: `{ location: string }`
- **news**: `{ category?, country?, language?, limit?, query? }`
- **search**: `{ query: string }`
- **time**: `{ timezone: string }`
- **units**: `{ category: "length" | "weight" | "temperature", from: string, to: string, value: number }`
- **currency**: `{ amount: number (>0), from: string (3‑letter code), to: string (3‑letter code) }`
- **json**: one of `format`, `minify`, `validate`, `repair` actions with appropriate fields.
- **github**: multiple actions (`searchRepositories`, `getRepository`, `getReadme`, `listBranches`, `listTags`, `listLanguages`, `listContributors`, `listReleases`, `searchUsers`, `getUser`, `getFile`, `listIssues`, `getIssue`, `listPullRequests`, `getPullRequest`) each requiring specific parameters.
- **notes**: actions (`create`, `list`, `search`, `get`, `update`, `delete`, `pin`, `archive`) with fields like `title`, `content`, `tags`, etc.
- **memory**: actions (`remember`, `recall`, `recallAll`, `search`, `update`, `forget`) for key‑value storage.

These tools enable the assistant to perform calculations, retrieve live data, manage personal information, and interact with external services such as GitHub and news sources.


# Tools Overview (tools.md)

| Tool | Category | Description | Typical Use‑Case | Example Prompt |
|------|----------|-------------|------------------|----------------|
| **calculator** | Math | Perform basic arithmetic – add, subtract, multiply, divide. | Quickly compute totals, percentages, ratios, or any simple math without leaving the chat. | `Calculate 125 % of 84.` |
| **weather** | Info | Fetch current weather for any city, state, or country. | Check the temperature, conditions, or humidity before planning a trip or outing. | `What’s the weather like in Kyoto right now?` |
| **news** | Info | Retrieve the latest news headlines, filtered by category, country, language, or custom query. | Stay updated on world events, tech releases, sports scores, etc. | `Give me the top 5 technology headlines from the US.` |
| **search** | Info | Run a web‑search and return the most relevant snippets. | Find facts, definitions, or recent articles that aren’t in the model’s training cut‑off. | `Search for “best budget smartphones 2024”.` |
| **time** | Info | Get the current date & time in any IANA time‑zone. | Schedule meetings across time‑zones or confirm local times. | `What time is it now in São Paulo?` |
| **units** | Conversion | Convert between length, weight, and temperature units. | Translate measurements for cooking, travel, or engineering. | `Convert 12 miles to kilometers.` |
| **currency** | Conversion | Convert an amount from one currency to another using live exchange rates. | Calculate travel budgets, price comparisons, or invoice conversions. | `Convert 250 USD to INR.` |
| **json** | Data | Format, minify, validate, or repair JSON strings. | Clean up API responses, prepare data for code, or debug malformed JSON. | `Pretty‑print this JSON with an indent of 2 spaces:`<br>`{ "name":"Alice","age":30}` |
| **github** | Code | Interact with public GitHub repositories – search, read READMEs, list branches/tags, fetch files, issues, PRs, etc. | Explore open‑source projects, fetch example code, or check repository stats. | `Show me the README of the repository facebook/react.` |
| **notes** | Personal | Create, list, search, update, delete, pin, or archive personal notes. | Keep track of ideas, to‑do items, or any info you want the assistant to remember across sessions. | `Create a note titled “Project ideas” with content “AI‑driven tutoring app”.` |
| **memory** | Long‑term | Store and retrieve small pieces of structured information (preferences, profile data, key‑value pairs). | Remember user preferences (e.g., favorite language), project settings, or short facts. | `Remember that my favorite coffee is “cold brew”.` |

---

## How to Use a Tool in a Prompt

When you want the assistant to call a specific tool, **describe the request as naturally as possible**. The assistant will translate your request into the appropriate API call.

### Example Flow

**User:**  
> *“What’s the weather in New Delhi right now?”*

**Assistant (behind the scenes):**  
Calls `weather({ location: "New Delhi" })` and returns the result.

**User:**  
> *“Convert 5 kilograms to pounds.”*

**Assistant:**  
Calls `units({ category: "weight", from: "kilogram", to: "pound", value: 5 })`.

---

## Quick Prompt Cheat‑Sheet

| Goal | Prompt |
|------|--------|
| **Do a quick math** | `What is 23 × 47?` |
| **Check weather** | `Is it raining in London today?` |
| **Get latest headlines** | `Show me the top 3 sports news from Canada.` |
| **Search the web** | `Find recent reviews of the Sony WH‑1000XM5 headphones.` |
| **Know the time** | `What time is it in Tokyo now?` |
| **Unit conversion** | `How many ounces are in 2.5 liters?` |
| **Currency conversion** | `How much is 100 EUR in JPY?` |
| **Format JSON** | `Format this JSON nicely:`<br>`{"user":"bob","active":true}` |
| **Read a GitHub repo** | `Give me a short summary of the repository torvalds/linux.` |
| **Save a note** | `Create a note called “Grocery list” with items: milk, eggs, bread.` |
| **Remember a preference** | `Remember that I prefer dark mode for all web apps.` |

---

Feel free to copy this markdown into a file called **`tools.md`** and refer back to it whenever you’re unsure which tool to use or how to phrase your request. Happy prompting! 🚀
