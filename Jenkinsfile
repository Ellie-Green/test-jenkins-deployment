pipeline {
    agent any 

    environment {
        GIT_REPO_URL = "https://github.com/Ellie-Green/test-jenkins-deployment.git"
        KUBE_CONFIG = credentials("kubeconfig credentials id")
    }

    stages {
        stage("Checkout") {
            steps {
                git branch: "main", url: "${GIT_REPO_URL}"
            }
        }

        stage("Apply configmap") {
            steps {
                script{
                    withKubeConfig([credentialsId: "kubeconfig credentials id"])
                    sh "kubectl apply -f configmap.yaml"
                }
            }
        }

        stage ("Apply deployment") {
            steps {
                script {
                    withKubeConfig([credentialsId: "kubeconfig credentials id"])
                    sh "kubectl apply -f deployment.yaml"
                }
            }
        }
    }

    post {
        success {
            echo "Kubernetes resources applied successfully!"
        }
        failure {
            echo "Failed to apply kubernetes resources."
        }
    }
}