## Installation
The app uses a react front end exposed on port 5173
javascript based backend aka a node app, BE on port 3000 
DB used postgress
please build the docker_images.
and run the following commands.


```bash
cd fe/vite-project/
docker build -t "fe-dummy"
cd ../../student-registration/
docker build -t "dummy-be"
cd ..
docker-compose up
```
FE is exposed on port 5173

