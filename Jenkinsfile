git branch pipeline {
    agent any

    environment {
        ANGULAR_DIR = "frontend"
        BUILD_DIR = "dist/frontend" // cambia si tu app se llama diferente
        DEPLOY_DIR = "/var/www/html/mercurio-front" // donde Nginx sirve el frontend
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'git@github.com:RaygozaO/mercurio-front.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                dir("${ANGULAR_DIR}") {
                    sh 'npm install'
                }
            }
        }
        stage('Build Angular') {
            steps {
                dir("${ANGULAR_DIR}") {
                    sh 'npm run build --configuration production'
                }
            }
        }
        stage('Deploy') {
            steps {
                sh "rm -rf ${DEPLOY_DIR}/*"
                sh "cp -r ${ANGULAR_DIR}/${BUILD_DIR}/* ${DEPLOY_DIR}/"
            }
        }
    }
}
