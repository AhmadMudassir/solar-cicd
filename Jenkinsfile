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

        stage('Building & Deploying Applicaton') {
            steps {
                    sh 'docker build -t solar-system . || true ' 
                    sh 'docker tag solar-system ahmadmudassir/solar-system:$BUILD_NUMBER || true ' 
                    sh 'docker stop solar-system || true '
                    sh 'docker rm solar-system || true ' 
            }
        }
        
        stage('Docker Push') {
          steps {
              withDockerRegistry(credentialsId: 'dockerhub-keys', url: "https://registry.hub.docker.com") {
                sh 'docker push ahmadmudassir/solar-system:$BUILD_NUMBER'
                }
            }
          }
        }
    }

