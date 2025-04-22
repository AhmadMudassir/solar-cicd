pipeline {
    agent any

    environment {
        MONGO_URI='mongodb+srv://cluster0.tf6bj.mongodb.net/'
    }

    tools {
        nodejs 'node-22-14-0'
    }
    stages {
        stage ('Install Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
            
        } 

        stage ('Dependency Scanning') {
                stage ('NPM Dependency Audit') {
                    steps {
                        sh 'npm audit --audit-level=critical'
                    }
                }
            }

        stage ('Unit Testing') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'mongo_creds', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')]) {
                    sh 'npm test'
                }
            }
            
        }     
        
    }
}