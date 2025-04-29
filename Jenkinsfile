pipeline {
  agent any

  environment {
    ANGULAR_DIR = "/var/lib/jenkins/workspace/mercurio-front-deploy"
    BUILD_DIR = "${ANGULAR_DIR}/dist/mercurio-front/browser"
    DEPLOY_DIR = "/var/www/mercurio-front"
    BUILD_CONFIG = "production"
  }

  stages {
    stage('Verifinacdo usuario') {
      sh 'whoami'
    }
    stage('Instalar dependencias') {
      steps {
        dir("${ANGULAR_DIR}") {
          sh 'npm install'
        }
      }
    }

    stage('Limpiar directorio dist') {
      steps {
        dir("${ANGULAR_DIR}") {
          sh 'rm -rf dist/'
        }
      }
    }

    stage('Construir aplicación Angular') {
      steps {
        dir("${ANGULAR_DIR}") {
          sh "npx ng build --configuration ${BUILD_CONFIG}"
        }
      }
    }

    stage('Verificar salida del build') {
      steps {
        script {
          if (!fileExists("${BUILD_DIR}/index.html")) {
            error "❌ No se encontró el index.html en ${BUILD_DIR}. Falló el build."
          }
        }
      }
    }

    stage('Desplegar en producción') {
      steps {
        sh "rm -rf ${DEPLOY_DIR}/*"
        sh "cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/"
        sh "chown -R www-data:www-data ${DEPLOY_DIR}"
      }
    }
  }
}
