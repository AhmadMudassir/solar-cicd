pipeline {
    agent any
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
