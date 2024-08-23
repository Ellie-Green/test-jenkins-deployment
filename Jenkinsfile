pipeline {
    agent any 

    environment {
        GIT_REPO_URL = "https://github.com/Ellie-Green/test-jenkins-deployment.git"
        
        ECR_REPO = "direqtory-cont-dev"
        IMAGE_NAME = "todo-api"
        IMAGE_TAG = "latest"
        AWS_ACCOUNT_ID = "308171262801"
        AWS_REGION = "eu-west-2"
        AWS_ACCESS_KEY_ID = credentials("AWS_ACCESS_KEY_ID")
        AWS_SECRET_ACCESS_KEY = credentials("AWS_SECRET_ACCESS_KEY")
        ECR_URI = "308171262801.dkr.ecr.eu-west-2.amazonaws.com/direqtory-cont-dev"
    }

    stages {
        stage("Checkout code") {
            steps {
                git branch: "master", url: "${GIT_REPO_URL}"
            }
        }

        stage("Build docker image") {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage("Login to ECR") {
            steps{ 
                script {
                    sh """
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com 
                    """
                }
            }
        }

        stage("Tag docker image") {
            steps {
                script {
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage("Push docker image to ecr") {
            steps {
                script {
                    sh "docker push ${ECR_URI}:${IMAGE_TAG}"
                }
            }
        }

        stage("Deploy to kubernetes") {
            steps {
                script {
                    sh """
                    kubectl apply -f configmap.yaml
                    kubectl apply -f deployment.yaml
                    """
                }
            }
        }

        stage("Verify deployment") {
            steps {
                script {
                    sh """
                    echo "Retrieving deployments ..."
                    kubectl get deployments
                    echo "Retrieving pods ..."
                    kubectl get pods 
                    echo "Retrieving services ..."
                    kubectl get services
                    """
                }
            }
        }
    }
}