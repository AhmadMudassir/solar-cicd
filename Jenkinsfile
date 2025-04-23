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
        
        stage('Building Application') {
            steps {
                    sh 'docker build -t solar-system .'
                    sh 'docker tag solar-system ahmadmudassir/solar-system:$BUILD_NUMBER'
            }
        }

        stage('Push to Docker') {
            steps {
                 withCredentials([usernamePassword(credentialsId: 'dockerhub_keys', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker push $DOCKER_USERNAME/solar-system:$BUILD_NUMBER'
                }
            }
        }
    }
}

