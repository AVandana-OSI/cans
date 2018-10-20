FROM cwds/cans_testing_base_image:latest
USER root
RUN apt-get install -y netcat
WORKDIR /app
RUN chromedriver-update
ADD . /app
RUN gem install bundler && bundle install


# Install Xvfb init script
ENV DISPLAY :99
ADD docker/test/run.sh /run.sh
RUN chmod a+x /run.sh
CMD /run.sh

