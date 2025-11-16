# ---------- Build stage ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install || yarn install || pnpm install

COPY . .

# Build static files
RUN npm run build

# ---------- Nginx serve stage ----------
FROM nginx:alpine

# Copy our nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React app from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
