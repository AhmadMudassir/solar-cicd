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
                sh 'docker build -t ahmadmudassir/solar-system:$BUILD_NUMBER .'
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
