# reg_app
please build the docker_images.
run the following commands from the directory
cd fe/vite-project/
docker build -t "fe-dummy"
cd ../../student-registration/
docker build -t "dummy-be"
cd ..
docker-compose up
