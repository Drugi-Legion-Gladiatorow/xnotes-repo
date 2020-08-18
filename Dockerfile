FROM node:14.5-alpine
ADD . ./app
WORKDIR /app

ENV NODE_ENV dev
# RUN ls -a 

# Install dependencies:
RUN npm i -g nodemon ts-node typescript
RUN npm install

# RUN ls -a 
# RUN ls -a node_modules/

# RUN chmod +x ./*

EXPOSE 3000
ENTRYPOINT [ "npm", "start" ] 


# CMD ["/opt/venv/bin/activate && exec python app.py"]

# FROM python:3.6
# ADD . ./app
# WORKDIR /app

# RUN pip install virtualenv 
# RUN virtualenv -p /usr/bin/python3 venv
# RUN source venv/bin/activate

# RUN pip install -r ./requirements.txt

# RUN ls



# RUN /opt/venv/bin/pip list
