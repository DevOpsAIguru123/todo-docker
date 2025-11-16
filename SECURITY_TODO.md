# Security TODO & Recommendations

## ✅ Completed

- [x] Move passwords to `.env` file
- [x] Add `.env` to `.gitignore`
- [x] Update `docker-compose.yml` to use environment variables

## 🚀 Setup Instructions

### Step 1: Create `.env` file

Create a `.env` file in the project root with the following content:

```env
# Database credentials
POSTGRES_USER=todo_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=todo_db

# Backend configuration
DATABASE_URL=postgresql+psycopg2://todo_user:your_secure_password_here@db:5432/todo_db
CORS_ORIGINS=http://localhost
```

**Important:** Replace `your_secure_password_here` with a strong password (at least 16 characters, mixed case, numbers, symbols).

### Step 2: Update `.gitignore`

Ensure `.gitignore` includes:
```
.env
.env.local
.env.*.local
```

### Step 3: Restart containers

After creating `.env`, restart your containers:
```bash
docker compose down
docker compose up --build
```

**Note:** If you're changing the database password and have existing data, you'll need to remove the volume first:
```bash
docker compose down
docker volume rm todo-app_db_data
docker compose up --build
```

## 🔒 Security Recommendations

### 1. Database Security
- [ ] **Remove database port exposure** - Remove `5432:5432` port mapping from `docker-compose.yml` (backend can access via service name `db`)
- [ ] **Use strong passwords** - Ensure database password is at least 16 characters with mixed case, numbers, and symbols
- [ ] **Regular password rotation** - Set up a schedule to rotate database passwords periodically

### 2. API Security
- [ ] **Add API authentication** - Implement JWT tokens or API keys to protect endpoints
  - Create `backend/app/auth.py` with authentication middleware
  - Add token verification to protected routes
  - Implement login/register endpoints if needed
- [ ] **Add rate limiting** - Prevent API abuse with rate limiting middleware
  - Install `slowapi` package
  - Add rate limits to API endpoints (e.g., 100 requests/minute per IP)
- [ ] **Input validation** - Ensure all API inputs are properly validated (already using Pydantic schemas ✅)

### 3. CORS Configuration
- [ ] **Restrict CORS further** - Update CORS to support multiple origins from environment variable
  - Change `CORS_ORIGINS` to support comma-separated list
  - Update `main.py` to split and parse origins properly
  - Remove wildcard `allow_methods=["*"]` and specify only needed methods (GET, POST, PATCH, DELETE)

### 4. Network Security
- [ ] **Use HTTPS in production** - Configure Nginx with SSL certificates
  - Set up Let's Encrypt certificates
  - Update `nginx.conf` to redirect HTTP to HTTPS
  - Configure SSL/TLS settings in Nginx
- [ ] **Firewall rules** - Ensure only necessary ports are exposed
  - Review port mappings in `docker-compose.yml`
  - Consider removing backend port 8000 exposure if only accessed via Nginx

### 5. Secrets Management
- [ ] **Use Docker secrets** (for production) - Replace `.env` file with Docker secrets or external secrets manager
  - Consider HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault
  - Never commit secrets to version control

### 6. Monitoring & Logging
- [ ] **Add security logging** - Log authentication attempts, failed requests, etc.
- [ ] **Set up monitoring** - Monitor for suspicious activity
- [ ] **Error handling** - Ensure errors don't leak sensitive information

### 7. Code Security
- [ ] **Dependency scanning** - Regularly scan dependencies for vulnerabilities
  - Use `pip-audit` for Python dependencies
  - Use `npm audit` for Node.js dependencies
- [ ] **SQL injection prevention** - Ensure SQLAlchemy is used correctly (already using ORM ✅)
- [ ] **XSS prevention** - Ensure React properly escapes user input (React does this by default ✅)

## 📝 Notes

### Current Security Status

**Working:**
- ✅ Database only accessible from containers (via service name)
- ✅ Backend uses environment variables for configuration
- ✅ CORS middleware is configured
- ✅ Using SQLAlchemy ORM (prevents SQL injection)
- ✅ React escapes user input by default

**Needs Improvement:**
- ⚠️ Passwords hardcoded in docker-compose.yml (now fixed with .env)
- ⚠️ Database port exposed to host (should be removed for production)
- ⚠️ No API authentication
- ⚠️ No rate limiting
- ⚠️ No HTTPS/TLS encryption
- ⚠️ CORS allows all methods

### Priority Order

1. **High Priority:**
   - Remove database port exposure
   - Add API authentication
   - Add rate limiting

2. **Medium Priority:**
   - Restrict CORS further
   - Use HTTPS in production
   - Add security logging

3. **Low Priority:**
   - Docker secrets for production
   - Advanced monitoring
   - Dependency scanning automation

