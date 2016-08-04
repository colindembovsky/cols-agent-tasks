#FROM microsoft/dotnet:latest
FROM colin/agentbase:latest

# defaults - override them using --build-arg
ARG AGENT_URL=https://github.com/Microsoft/vsts-agent/releases/download/v2.104.0/vsts-agent-ubuntu.14.04-x64-2.104.0.tar.gz
ARG AGENT_NAME=docker
ARG AGENT_POOL=default

# you must supply these to the build command using --build-arg
ARG VSTS_ACC
ARG PAT

# install git
#RUN apt-get update && apt-get -y install software-properties-common && apt-add-repository ppa:git-core/ppa
#RUN apt-get update && apt-get -y install git

# prereqs required to run dotnet publish
#RUN apt-get install -y nodejs-legacy npm
#RUN npm install -g bower

# create a user
RUN useradd -ms /bin/bash agent
USER agent
WORKDIR /home/agent

# download the agent tarball
#RUN curl -Lo agent.tar.gz $AGENT_URL && tar xvf agent.tar.gz && rm agent.tar.gz
COPY *.tar.gz .
RUN tar xzf *.tar.gz && rm -f *.tar.gz
RUN bin/Agent.Listener configure --url https://$VSTS_ACC.visualstudio.com --agent $AGENT_NAME --pool $AGENT_POOL --acceptteeeula --auth PAT --token $PAT --unattended

ENTRYPOINT ./run.sh