FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g pnpm


RUN pnpm install

COPY . .

RUN pnpm build
ENV PORT=6000
EXPOSE 6000
CMD ["pnpm", "run", "start"]


