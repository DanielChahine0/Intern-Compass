# Deployment Helper Scripts

This directory contains scripts to help with deployment preparation and validation.

## Available Scripts

### `pre-deploy-check.js`
Runs comprehensive checks before deployment to catch common issues.

**Usage:**
```powershell
cd backend
node scripts/pre-deploy-check.js
```

**Checks:**
- ✓ package.json scripts (build, start)
- ✓ TypeScript configuration
- ✓ Required deployment files
- ✓ Database migrations present
- ✓ Environment documentation
- ✓ .gitignore configuration
- ✓ Build test (compiles TypeScript)

**Exit Codes:**
- `0` - All checks passed
- `1` - Critical errors found

---

## Adding New Scripts

To add a new deployment script:

1. Create script in this directory
2. Add documentation here
3. Update package.json scripts if needed
4. Test thoroughly before committing

---

## Troubleshooting

### Build fails during check
```powershell
# Clean build artifacts
Remove-Item -Recurse -Force dist
npm run build
```

### Missing dependencies
```powershell
npm ci  # Use clean install
```

### Permission errors
```powershell
# On Windows, run PowerShell as Administrator if needed
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
