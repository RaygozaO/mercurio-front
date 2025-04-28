pipeline {
  agent any

  environment {
    BRANCH_NAME = 'main'
    ANGULAR_DIR = "."
    BUILD_DIR = "dist/mercurio-front"
  }

  stages {
    stage('Setup Deploy Directory and Build Mode') {
      steps {
        script {
          if (BRANCH_NAME == 'main') {
            env.DEPLOY_DIR = "/var/www/mercurio-front"
            env.BUILD_CONFIG = "production"
          } else if (BRANCH_NAME == 'development') {
            env.DEPLOY_DIR = "/var/www/mercurio-front-dev"
            env.BUILD_CONFIG = "development"
          } else {
            error "Branch '${BRANCH_NAME}' no tiene configurado un despliegue."
          }
        }
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
          sh "npx ng build --configuration ${BUILD_CONFIG}"
        }
      }
    }

    stage('Verify Build Output') {
      steps {
        script {
          if (!fileExists("${BUILD_DIR}/index.html")) {
            error "Error: No se encontró el index.html en ${BUILD_DIR}. Falló el build."
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        sh "cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/"
        sh "chmod -R 755 ${DEPLOY_DIR}"
      }
    }
  }
}
