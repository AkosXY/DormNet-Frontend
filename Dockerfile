FROM nginx:alpine

COPY ./dist/dormnet-frontend/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
