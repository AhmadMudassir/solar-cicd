pipeline {
    agent any

    environment {
        MONGO_URI = 'mongodb+srv://cluster0.tf6bj.mongodb.net/'
    }

    tools {
        nodejs 'node-22-14-0'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }

        stage('Dependency Scanning & Testing') {
            parallel {
                stage('NPM Dependency Audit') {
                    steps {
                        sh 'npm audit --audit-level=critical'
                    }
                }

                stage('Unit Testing') {
                    steps {
                        withCredentials([usernamePassword(
                            credentialsId: 'mongo_creds',
                            usernameVariable: 'MONGO_USERNAME',
                            passwordVariable: 'MONGO_PASSWORD'
                        )]) {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Building Applicaton') {
            steps {
                 withDockerRegistry(credentialsId: 'docker_creds', url: 'https://registry.hub.docker.com') {
                    sh 'docker build -t solarimage .'
                    sh 'docker tag solarimage ahmadmudassir/solarimage:$BUILD_NUMBER'
                    sh 'sudo docker image push ahmadmudassir/solarimage:$BUILD_NUMBER'
            }
        }
            }
        }
    }

