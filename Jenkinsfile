pipeline {
  agent any

    environment {
    BRANCH_NAME = 'main' // <--- Aquí definimos manualmente
        ANGULAR_DIR = "."
        BUILD_DIR = "dist/mercurio-front"
    }

    stages {
    stage('Setup Deploy Directory and Build Mode') {
      steps {
        script {
          if (env.BRANCH_NAME == 'main') {
            env.DEPLOY_DIR = "/var/www/mercurio-front"
                        env.BUILD_CONFIG = "production"
                    } else if (env.BRANCH_NAME == 'development') {
            env.DEPLOY_DIR = "/var/www/mercurio-front-dev"
                        env.BUILD_CONFIG = "development"
                    } else {
            error "Branch '${env.BRANCH_NAME}' no tiene configurado un despliegue."
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

        stage('Deploy') {
      steps {
        sh "rm -rf ${DEPLOY_DIR}/*"
                sh "cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/"
            }
        }
    }
}
