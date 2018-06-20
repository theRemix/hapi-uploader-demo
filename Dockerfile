FROM node:10-alpine

ADD . /srv
WORKDIR /srv
RUN mkdir /srv/public/uploads
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]