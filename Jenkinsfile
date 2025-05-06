pipeline {
    agent any

    environment {
        MONGO_URI = 'mongodb+srv://cluster0.tf6bj.mongodb.net/'
        DOCKER_CONFIG = credentials('dockerhub_keys')
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

                // stage('Unit Testing') {
                //     steps {
                //         withCredentials([usernamePassword(
                //             credentialsId: 'mongo_creds',
                //             usernameVariable: 'MONGO_USERNAME',
                //             passwordVariable: 'MONGO_PASSWORD'
                //         )]) {
                //             sh 'npm test'
                //         }
                //     }
                // }
            }
        }
        
        stage('Building Application with Kaniko') {
             agent {
                kubernetes {
                    label 'kaniko-agent'
                    yaml """
                        apiVersion: v1
                        kind: Pod
                        spec:
                          containers:
                          - name: kaniko
                            image: gcr.io/kaniko-project/executor:latest
                            command:
                            - cat
                            tty: true
                            volumeMounts:
                              - name: docker-config
                                mountPath: /kaniko/.docker
                          volumes:
                            - name: docker-config
                              emptyDir: {}
                        """
                    defaultContainer 'kaniko'
                }
            }
            steps {
                container('kaniko') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub_keys',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )]) {
                        sh '''
                        echo "{\"auths\":{\"https://index.docker.io/v1/\":{\"auth\":\"$(echo -n "$DOCKER_USERNAME:$DOCKER_PASSWORD" | base64)\"}}}" > /kaniko/.docker/config.json
                        /kaniko/executor \
                          --context `pwd` \
                          --dockerfile `pwd`/Dockerfile \
                          --destination=ahmadmudassir/solar-system:${BUILD_NUMBER}
                        '''
                    }
                }
            }
        }

        // stage('Push to Docker') {
        //     steps {
        //          withCredentials([usernamePassword(
        //             credentialsId: 'dockerhub_keys',
        //             usernameVariable: 'DOCKER_USERNAME', 
        //             passwordVariable: 'DOCKER_PASSWORD'
        //          )]) {
        //              sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
        //              sh 'docker push $DOCKER_USERNAME/solar-system:$BUILD_NUMBER'
        //         }
        //     }
        // }
        
        // stage('Deploying Application') {
        //     steps {
        //              withCredentials([usernamePassword(
        //             credentialsId: 'mongo_creds',
        //             usernameVariable: 'MONGO_USERNAME',
        //             passwordVariable: 'MONGO_PASSWORD'
        //         )]) {
        //             sh '''
        //                 kubectl apply -f k8s-deployment.yaml
        //             '''
        //         }
        //     }
        // }
    }
}

