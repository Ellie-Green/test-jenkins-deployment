pipeline {
    agent any 

    environment {
        GIT_REPO_URL = "https://github.com/Ellie-Green/test-jenkins-deployment.git"
        
        ECR_REPO = "direqtory-cont-dev"
        IMAGE_NAME = "todo-api"
        IMAGE_TAG = "latest"
        CLUSTER_NAME = "eks-test"
        AWS_ACCOUNT_ID = "308171262801"
        AWS_REGION = "eu-west-2"
        AWS_ACCESS_KEY_ID= credentials("aws-access-key-id")
        AWS_SECRET_ACCESS_KEY= credentials("aws-secret-access-key")
        AWS_SESSION_TOKEN= credentials("aws-session-token")
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
                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}"
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

        stage("Update kubeconfig") {
            steps {
                script {
                    sh """
                    aws eks --region ${AWS_REGION} update-kubeconfig --name ${CLUSTER_NAME}
                    """
                }
            }
        }

        stage("Deploy to kubernetes") {
            steps {
                script {
                    sh """
                    kubectl apply -f configmap.yaml --request-timeout=60s --validate=false
                    kubectl apply -f deployment.yaml --request-timeout=60s --validate=false
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