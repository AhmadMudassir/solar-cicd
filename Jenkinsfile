pipeline {
    agent any
    tools {
        nodejs 'node-22-14-0'
    }
    stages {
        stage ('install dep') {
            steps {
                sh 'npm install'
            }
            
        } 
        stage ('start server') {
            steps {
                sh 'npm start'
            }
        }
    }


}
