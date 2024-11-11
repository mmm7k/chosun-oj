FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g pnpm


RUN pnpm install

COPY . .

RUN pnpm build
ENV PORT=5000
EXPOSE 5000
CMD ["pnpm", "run", "start"]


