FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g pnpm


RUN pnpm install

COPY . .

RUN pnpm build
ENV PORT=80
EXPOSE 80
CMD ["pnpm", "run", "start"]


