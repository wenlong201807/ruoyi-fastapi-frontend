pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    options {
        timestamps()
    }

    environment {
        GIT_REPO_URL  = 'https://github.com/wenlong201807/ruoyi-fastapi-frontend.git'
        DEPLOY_DIR    = "/var/jenkins_home/nginx_html/ruoyi-${DEPLOY_ENV}"
        NODE_OPTIONS  = '--max-old-space-size=4096'
    }

    stages {
        stage('环境信息') {
            steps {
                script {
                    def stageStart = System.currentTimeMillis()
                    echo "=========================================="
                    echo "项目名称: ruoyi-fastapi-frontend"
                    echo "部署环境: ${DEPLOY_ENV}"
                    echo "部署分支: ${BRANCH}"
                    echo "包管理器: ${PACKAGE_MANAGER}"
                    echo "仓库地址: ${GIT_REPO_URL}"
                    echo "部署目录: ${DEPLOY_DIR}"
                    echo "=========================================="
                    sh 'node --version'
                    sh 'npm --version'
                    env.STAGE_1_TIME = "${System.currentTimeMillis() - stageStart}"
                    echo ">>> [计时] 环境信息: ${env.STAGE_1_TIME}ms"
                }
            }
        }

        stage('拉取代码') {
            steps {
                script {
                    def stageStart = System.currentTimeMillis()
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "${BRANCH}"]],
                        extensions: [[$class: 'CloneOption', depth: 1, shallow: true]],
                        userRemoteConfigs: [[
                            url: "${GIT_REPO_URL}",
                            credentialsId: 'github-credentials'
                        ]]
                    ])
                    env.STAGE_2_TIME = "${System.currentTimeMillis() - stageStart}"
                    echo ">>> [计时] 拉取代码: ${env.STAGE_2_TIME}ms"
                }
            }
        }

        stage('安装依赖') {
            steps {
                script {
                    def stageStart = System.currentTimeMillis()
                    switch(PACKAGE_MANAGER) {
                        case 'pnpm':
                            sh 'npm install -g pnpm'
                            sh 'pnpm install --frozen-lockfile || pnpm install'
                            break
                        case 'yarn':
                            sh 'npm install -g yarn'
                            sh 'yarn install --frozen-lockfile || yarn install'
                            break
                        default:
                            sh 'npm ci || npm install'
                            break
                    }
                    env.STAGE_3_TIME = "${System.currentTimeMillis() - stageStart}"
                    echo ">>> [计时] 安装依赖: ${env.STAGE_3_TIME}ms"
                }
            }
        }

        stage('构建项目') {
            steps {
                script {
                    def stageStart = System.currentTimeMillis()
                    def pm = PACKAGE_MANAGER
                    def deployEnv = DEPLOY_ENV
                    def runCmd = pm == 'pnpm' ? 'pnpm run' : (pm == 'yarn' ? 'yarn' : 'npm run')

                    sh "${runCmd} build:${deployEnv} || ${runCmd} build"
                    echo "${runCmd} build:${deployEnv} || ${runCmd} build"

                    env.STAGE_4_TIME = "${System.currentTimeMillis() - stageStart}"
                    echo ">>> [计时] 构建项目: ${env.STAGE_4_TIME}ms"
                }
            }
        }

        stage('部署') {
            steps {
                script {
                    def stageStart = System.currentTimeMillis()
                    def outputDir = fileExists('dist') ? 'dist' : 'build'
                    echo "构建输出目录: ${outputDir}"

                    sh """
                        rm -rf ${DEPLOY_DIR}/*
                        mkdir -p ${DEPLOY_DIR}
                        cp -r ${outputDir}/* ${DEPLOY_DIR}/
                        echo '部署完成！'
                        ls -la ${DEPLOY_DIR}/
                    """
                    env.STAGE_5_TIME = "${System.currentTimeMillis() - stageStart}"
                    echo ">>> [计时] 部署: ${env.STAGE_5_TIME}ms"
                }
            }
        }

        stage('验证部署') {
            steps {
                script {
                    def stageStart = System.currentTimeMillis()
                    def portMap = [
                        'dev': '8096',
                        'staging': '8097',
                        'production': '8098',
                        'docker': '8099',
                    ]
                    def port = portMap[DEPLOY_ENV]
                    def accessUrl = "http://localhost:${port}"

                    echo "=========================================="
                    echo "部署成功！"
                    echo ""
                    echo "构建产物访问地址: ${accessUrl}"
                    echo ""
                    echo "项目: ruoyi-fastapi-frontend"
                    echo "环境: ${DEPLOY_ENV}"
                    echo "分支: ${BRANCH}"
                    echo "包管理器: ${PACKAGE_MANAGER}"
                    echo "=========================================="

                    env.ACCESS_URL = accessUrl
                    env.STAGE_6_TIME = "${System.currentTimeMillis() - stageStart}"
                    echo ">>> [计时] 验证部署: ${env.STAGE_6_TIME}ms"
                }
            }
        }
    }

    post {
        success {
            script {
                def s1 = (env.STAGE_1_TIME ?: '0') as long
                def s2 = (env.STAGE_2_TIME ?: '0') as long
                def s3 = (env.STAGE_3_TIME ?: '0') as long
                def s4 = (env.STAGE_4_TIME ?: '0') as long
                def s5 = (env.STAGE_5_TIME ?: '0') as long
                def s6 = (env.STAGE_6_TIME ?: '0') as long
                def stageTotal = s1 + s2 + s3 + s4 + s5 + s6

                echo ""
                echo "=========================================="
                echo "       构建阶段耗时报告 (ruoyi-frontend)    "
                echo "=========================================="
                echo "  环境信息    | ${s1}ms (${(s1/1000.0).round(1)}s)"
                echo "  拉取代码    | ${s2}ms (${(s2/1000.0).round(1)}s)"
                echo "  安装依赖    | ${s3}ms (${(s3/1000.0).round(1)}s)"
                echo "  构建项目    | ${s4}ms (${(s4/1000.0).round(1)}s)"
                echo "  部署        | ${s5}ms (${(s5/1000.0).round(1)}s)"
                echo "  验证部署    | ${s6}ms (${(s6/1000.0).round(1)}s)"
                echo "=========================================="
                echo "  阶段合计    | ${stageTotal}ms (${(stageTotal/1000.0).round(1)}s)"
                echo "=========================================="
                echo "  构建产物:   ${env.ACCESS_URL}"
                echo "=========================================="
            }
        }
        failure {
            echo '构建部署失败，请检查日志！'
        }
        always {
            cleanWs()
        }
    }
}
