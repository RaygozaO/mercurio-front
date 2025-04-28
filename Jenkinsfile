pipeline {
  agent any

  environment {
    BRANCH_NAME = 'main'
    ANGULAR_DIR = "."
    BUILD_DIR = "dist/mercurio-front/browser"
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
          if (!fileExists("${BUILD_DIR}/index.csr.html")) {
            error "Error: No se encontró el index.csr.html en ${BUILD_DIR}. Falló el build."
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        // Primero forzamos permisos para poder borrar
        sh "chown -R jenkins:jenkins ${DEPLOY_DIR}" // o el usuario correcto de Jenkins
        sh "chmod -R u+w ${DEPLOY_DIR}"

        // Ahora sí borramos seguro
        sh "rm -rf ${DEPLOY_DIR}/*"

        // Copiamos el nuevo frontend
        sh "cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/"
        sh "cp ${DEPLOY_DIR}/index.csr.html ${DEPLOY_DIR}/index.html"

        // Finalmente reestablecemos permisos para Nginx
        sh "chown -R www-data:www-data ${DEPLOY_DIR}"
        sh "chmod -R 755 ${DEPLOY_DIR}"
      }
    }
  }
}
