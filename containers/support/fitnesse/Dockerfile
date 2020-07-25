FROM openjdk:11.0.7-jre-slim-buster
ARG fit_release=20200501
EXPOSE 8080
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        wget && \
    groupadd --gid 1000 fitnesse && \
    useradd --uid 1000 --gid fitnesse --shell /bin/bash --create-home fitnesse && \
    wget -qO "/home/fitnesse/fitnesse-standalone.jar" "http://www.fitnesse.org/fitnesse-standalone.jar?responder=releaseDownload&release=$fit_release" && \
    chown fitnesse:fitnesse /home/fitnesse/fitnesse-standalone.jar && \
    mkdir /home/fitnesse/FitNesseRoot && \
    chown fitnesse:fitnesse /home/fitnesse/FitNesseRoot && \
    apt-get clean
WORKDIR /home/fitnesse
USER fitnesse
CMD ["java", "-jar", "/home/fitnesse/fitnesse-standalone.jar", "-p", "8080", "-e", "0"]