# 📝 Markdown Quick Reference for AI Responses

## Formatting Cheatsheet

### Headings
```
# Heading 1 (Largest)
## Heading 2
### Heading 3
#### Heading 4
```

### Emphasis
```
**bold text**
*italic text*
***bold and italic***
```

### Lists

#### Unordered
```
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3
```

#### Ordered
```
1. First step
2. Second step
3. Third step
```

### Code

#### Inline
```
Use `const` for constants and `let` for variables.
```

#### Block
````
```javascript
function example() {
  console.log("Hello, World!");
}
```
````

### Links
```
[Link text](https://example.com)
```

### Tables
```
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Blockquotes
```
> This is an important note or quote
```

### Horizontal Rule
```
---
```

## Best Practices

✅ **DO:**
- Use headings to organize long responses
- Use lists for steps or multiple items
- Use code blocks for technical examples
- Use tables for comparisons
- Use bold for emphasis on key terms
- Use blockquotes for important notes

❌ **DON'T:**
- Overuse formatting (keep it clean)
- Nest too many levels of lists
- Make tables too wide (keep columns reasonable)
- Use multiple heading levels unnecessarily

## Common Patterns

### Tech Stack List
```markdown
## Our Technology Stack

**Frontend:**
- React 18
- TypeScript 5
- Tailwind CSS

**Backend:**
- Node.js
- Express
- PostgreSQL
```

### Step-by-Step Guide
```markdown
## Onboarding Process

Follow these steps:

1. **Day 1**: Complete HR paperwork
2. **Day 2**: Set up development environment
3. **Day 3**: Meet with your team
4. **Week 2**: Start first project

> **Note**: Schedule may vary by department.
```

### Code Example
````markdown
## Authentication Example

Here's how to implement login:

```typescript
async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```
````

### Comparison Table
```markdown
## Deployment Options

| Option | Speed | Cost | Scalability |
|--------|-------|------|-------------|
| Vercel | ⚡ Fast | 💰 Med | 📈 High |
| AWS    | ⚡ Fast | 💰💰 High | 📈📈 Very High |
| Heroku | 🐢 Medium | 💰 Low | 📈 Medium |
```

---

**Tip**: The Markdown will automatically render beautifully in the chat interface!
