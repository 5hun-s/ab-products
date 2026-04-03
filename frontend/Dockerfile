FROM node:22-alpine

WORKDIR /app

EXPOSE 5173

CMD ["sh", "-lc", "if [ ! -f package.json ]; then npx --yes create-vite@latest . --template react-ts --force; fi && npm install && npm run dev -- --host 0.0.0.0 --port 5173"]
