pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // This step automatically pulls the latest code from GitHub
                checkout scm
                echo 'Code pulled successfully!'
            }
        }

        stage('Copy Secrets') {
            steps {
                // Copy the .env files from our local Windows folder to Jenkins workspace
                bat 'copy "d:\\PINGME-PLACMENT\\PingME\\Backend\\.env" "Backend\\.env"'
                bat 'copy "d:\\PINGME-PLACMENT\\PingME\\Frontend\\.env" "Frontend\\.env" || exit 0'
                echo 'Environment variables copied successfully!'
            }
        }

        stage('Build and Deploy Containers') {
            steps {
                // Build new images and restart the containers
                bat 'docker-compose down'
                bat 'docker-compose up --build -d'
                echo 'Application Deployed Locally Successfully!'
            }
        }
    }

    post {
        always {
            // Clean up to save disk space
            bat 'docker system prune -f'
        }
        success {
            echo 'Deployment was a SUCCESS! '
        }
        failure {
            echo 'Deployment FAILED! Check logs.'
        }
    }
}
