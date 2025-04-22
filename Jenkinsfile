pipeline {
    agent any
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
        }
}