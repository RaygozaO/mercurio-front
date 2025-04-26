pipeline {
  agent any

    environment {
    ANGULAR_DIR = "." // cambia si tu angular.json está en raíz o ajusta
        BUILD_DIR = "dist/mercurio-front" // ajusta si tu carpeta de build tiene otro nombre
        DEPLOY_DIR = "/var/www/html/mercurio-front" // donde Nginx sirve tu frontend
    }

    stages {
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
                sh "cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/"
            }
        }
    }
}
