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
                 withCredentials([usernamePassword(credentialsId: 'docker_creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker build -t solarimage .'
                    sh 'docker tag solarimage $DOCKER_USERNAME/solarimage:$BUILD_NUMBER'
                    sh 'docker push $DOCKER_USERNAME/solarimage:$BUILD_NUMBER'
                }

        }
            }
        }
    }

