FROM node:18.20.4
WORKDIR /app
COPY . .
RUN npm install
RUN npm install @angular/cli -g
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]
