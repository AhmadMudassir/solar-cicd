FROM node:18-alpine3.17

WORKDIR /usr/app

COPY package*.json /usr/app/

RUN npm install

COPY . .

ENV MONGO_URI=mongodb+srv://cluster0.tf6bj.mongodb.net/
ENV MONGO_USERNAME=Ahmad
ENV MONGO_PASSWORD=pass123

EXPOSE 3000

CMD [ "npm", "start" ]



# FROM node:22-alpine3.20 AS builder 

# WORKDIR /app

# COPY package*.json/ ./

# RUN ["npm", "install", "--omit=dev"]

# COPY . .

# RUN ["npm", "install", "-g", "@vercel/ncc"]

# RUN ["ncc", "build", "app.js", "-o", "dist"]


# FROM node:22-alpine3.20

# COPY --from=builder /app/dist/index.js .
# ENV MONGO_URI=mongodb+srv://cluster0.tf6bj.mongodb.net/
# ENV MONGO_USERNAME=Ahmad
# ENV MONGO_PASSWORD=pass123
# EXPOSE 3000

# CMD ["node", "index.js"]
