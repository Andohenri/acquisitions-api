# GitHub Actions Setup Guide

This guide will help you set up and troubleshoot the GitHub Actions workflows for your acquisitions API project.

## 🔧 Required Repository Secrets

Before the workflows can run successfully, you need to configure the following secrets in your GitHub repository:

### For Docker Build and Push Workflow:

1. **DOCKER_USERNAME**: Your Docker Hub username
2. **DOCKER_ACCESS_TOKEN**: Your Docker Hub Access Token (**NOT** your password)

### For Tests Workflow (Optional):

3. **TEST_DATABASE_URL**: Database URL for testing (defaults to a local test database if not set)

## 🐳 Setting up Docker Hub Access Token

The Docker workflow fails with "401 Unauthorized" because it needs an **Access Token** instead of your password:

### Steps to create a Docker Hub Access Token:

1. Go to [Docker Hub](https://hub.docker.com/)
2. Sign in to your account
3. Click on your username in the top right corner
4. Select **"Account Settings"**
5. Go to the **"Security"** tab
6. Click **"New Access Token"**
7. Give it a name (e.g., "GitHub Actions CI/CD")
8. Select **"Public Repo Read/Write"** permissions
9. Click **"Generate"**
10. **Copy the token immediately** (you won't be able to see it again)

### Adding Secrets to GitHub Repository:

1. Go to your GitHub repository: `https://github.com/Andohenri/acquisitions-api`
2. Click on **"Settings"** tab
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Add each secret:
   - Name: `DOCKER_USERNAME`, Value: your Docker Hub username
   - Name: `DOCKER_ACCESS_TOKEN`, Value: the access token you created
   - Name: `TEST_DATABASE_URL` (optional), Value: your test database URL

## 🔍 Troubleshooting Common Issues

### Lint and Format Workflow Issues:

**Problem**: Linting fails in GitHub Actions but works locally
**Solution**: Usually caused by line ending differences (Windows vs Linux)

- ✅ **Fixed**: Added Git line ending configuration to the workflow

**Problem**: Prettier formatting issues
**Possible causes**:

- Files were edited on Windows with CRLF line endings
- Different Prettier version

**To fix locally**:

```bash
npm run format
git add .
git commit -m "Fix formatting"
```

### Docker Build Issues:

**Problem**: "401 Unauthorized: access token has insufficient scopes"
**Solution**:

- ✅ **Fixed**: Updated workflow to use `DOCKER_ACCESS_TOKEN`
- Make sure you're using an Access Token, not your password
- Ensure the token has "Public Repo Read/Write" permissions

**Problem**: Repository doesn't exist on Docker Hub
**Solution**: Create the repository first:

1. Go to Docker Hub
2. Click "Create Repository"
3. Name it: `acquisitions-api`
4. Set it as Public or Private as needed

### Test Workflow Issues:

**Problem**: Tests fail in CI but work locally
**Common causes**:

- Missing environment variables
- Database connection issues
- Different Node.js version

**To debug**:

1. Check the test artifacts uploaded by the workflow
2. Ensure `TEST_DATABASE_URL` secret is set if needed
3. Verify all dependencies are properly installed

## 🚀 Testing Your Workflows

### To trigger the workflows:

1. **Lint and Format + Tests**: Create a PR or push to `main`/`staging`
2. **Docker Build and Push**: Push to `main` branch or use "Run workflow" button

### Manual workflow trigger:

1. Go to **"Actions"** tab in your GitHub repository
2. Select **"Docker Build and Push"** workflow
3. Click **"Run workflow"** button
4. Select the branch and click **"Run workflow"**

## 📁 Workflow Files Created:

- `.github/workflows/lint-and-format.yml` - ESLint and Prettier checks
- `.github/workflows/tests.yml` - Test execution with coverage reports
- `.github/workflows/docker-build-and-push.yml` - Multi-platform Docker build

## ✅ Success Indicators:

- **Green checkmarks** on all workflow runs
- **Docker image published** to Docker Hub
- **Coverage reports** uploaded as artifacts
- **Detailed summaries** in each workflow run

## 🆘 Still Having Issues?

1. Check the **Actions** tab for detailed error logs
2. Verify all secrets are set correctly
3. Ensure your Docker Hub repository exists
4. Make sure your Access Token has the right permissions

For Docker Hub authentication issues specifically, double-check:

- Username is correct (case-sensitive)
- Using Access Token, not password
- Token has "Public Repo Read/Write" permissions
- Repository name matches: `{username}/acquisitions-api`
