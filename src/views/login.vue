<template>
  <Row type="flex" justify="center" align="middle" class="login" @keydown.enter.native="submitLogin">
    <Col :xs="{span:22}" style="width: 368px;">
      <Row class="header">
        <img src="../assets/xboot.png" width="220px" />
        <!--<div class="description">X-Boot 是很不错的Web前后端分离架构开发平台</div>-->
      </Row>

      <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>

      <Row class="login-form" v-if="!socialLogining">
        <Tabs v-model="tabName">
          <TabPane label="账户密码登录" name="username" icon="md-person">
            <Form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
              <FormItem prop="username">
                <Input v-model="form.username" prefix="ios-contact" size="large" clearable placeholder="请输入用户名" autocomplete="off" />
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="form.password" prefix="ios-lock" size="large" clearable placeholder="请输入密码" autocomplete="off" />
              </FormItem>
            </Form>
          </TabPane>
          <!--<TabPane label="手机号登录" name="mobile" icon="ios-phone-portrait">-->
          <!--<Form ref="mobileLoginForm" :model="form" :rules="rules" class="form">-->
          <!--<FormItem prop="mobile">-->
          <!--<Input v-model="form.mobile" prefix="ios-phone-portrait" size="large" clearable placeholder="请输入手机号" />-->
          <!--</FormItem>-->
          <!--<FormItem prop="code" :error="errorCode">-->
          <!--<Row type="flex" justify="space-between" class="code-row-bg">-->
          <!--<Input v-model="form.code" prefix="ios-mail-outline" size="large" clearable placeholder="请输入短信验证码" :maxlength="maxLength" class="input-verify" />-->
          <!--<Button size="large" :loading="sending" @click="sendVerify" v-if="!sended" class="send-verify">-->
          <!--<span v-if="!sending">获取验证码</span>-->
          <!--<span v-else>发送中</span>-->
          <!--</Button>-->
          <!--<Button size="large" disabled v-if="sended" class="count-verify">{{countButton}}</Button>-->
          <!--</Row>-->
          <!--</FormItem>-->
          <!--</Form>-->
          <!--</TabPane>-->
        </Tabs>

        <Row type="flex" justify="space-between" class="code-row-bg">
          <!--<Checkbox v-model="saveLogin" size="large">自动登录</Checkbox>-->
          <!--<a class="forget-pass" @click="showAccount">忘记密码</a>-->
        </Row>
        <Row>
          <Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </Button>
        </Row>
        <!--<Row type="flex" justify="space-between" class="code-row-bg other-login">-->
        <!--<div class="other-way icons">-->
        <!--其它方式登录-->
        <!--<div class="other-icon" @click="toGithubLogin">-->
        <!--<icon scale="1.1" name="brands/github"></icon>-->
        <!--</div>-->
        <!--<div class="other-icon" @click="toQQLogin">-->
        <!--<icon name="brands/qq"></icon>-->
        <!--</div>-->
        <!--<div class="other-icon" @click="toWeiboLogin">-->
        <!--<icon scale="1.2" name="brands/weibo"></icon>-->
        <!--</div>-->
        <!--<div class="other-icon" @click="toWeixinLogin">-->
        <!--<icon scale="1.2" name="brands/weixin"></icon>-->
        <!--</div>-->
        <!--</div>-->
        <!--<router-link to="/regist"><a class="forget-pass">注册账户</a></router-link>-->
        <!--</Row>-->
      </Row>

      <Row class="foot">
        <Row type="flex" justify="space-around" class="code-row-bg help">
          <a class="item" href="#" target="_blank">帮助</a>
          <a class="item" href="#" target="_blank">隐私</a>
          <a class="item" href="#" target="_blank">条款</a>
        </Row>
        <Row type="flex" justify="center" class="code-row-bg copyright">
          Copyright © 2019 <a href="http://www.qiao-ou.com" target="_blank" style="margin:0 5px;">四川乔鸥科技有限公司</a> Presents
        </Row>
      </Row>
    </Col>
  </Row>
</template>

<script>
    import Cookies from "js-cookie";
    import {
        login,
        userInfo,
        githubLogin,
        qqLogin,
        weiboLogin,
        getJWT,
        sendSms,
        smsLogin
    } from "@/api/index";
    import util from "@/libs/util.js";
    import { setStore } from "@/libs/storage";
    export default {
        data() {
            const validateMobile = (rule, value, callback) => {
                var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!reg.test(value)) {
                    callback(new Error("手机号格式错误"));
                } else {
                    callback();
                }
            };
            return {
                socialLogining: false,
                error: false,
                errorMsg: "",
                tabName: "username",
                saveLogin: true,
                loading: false,
                sending: false,
                sended: false,
                count: 60,
                countButton: "60 s",
                maxLength: 6,
                errorCode: "",
                form: {
                    username: "",
                    password: "",
                    mobile: "捐赠获取完整版功能",
                    code: ""
                },
                rules: {
                    username: [
                        {
                            required: true,
                            message: "账号不能为空",
                            trigger: "blur"
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: "密码不能为空",
                            trigger: "blur"
                        }
                    ],
                    mobile: [
                        {
                            required: true,
                            message: "手机号不能为空",
                            trigger: "blur"
                        },
                        {
                            validator: validateMobile,
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        methods: {
            showErrorMsg(msg) {
                this.error = true;
                this.errorMsg = msg;
            },
            sendVerify() {
                this.$refs.mobileLoginForm.validate(valid => {
                    if (valid) {
                        this.showErrorMsg("请捐赠获取完整版")
                    }
                });
            },
            countDown() {
                let that = this;
                if (this.count === 0) {
                    this.sended = false;
                    this.count = 60;
                    return;
                } else {
                    this.countButton = this.count + " s";
                    this.count--;
                }
                setTimeout(function() {
                    that.countDown();
                }, 1000);
            },
            submitLogin() {
                if (this.tabName === "username") {
                    this.$refs.usernameLoginForm.validate(valid => {
                        if (valid) {
                            this.loading = true;
                            this.postRequest('/login/login',{
                                name: this.form.username,
                                password: this.form.password,
                                saveLogin: this.saveLogin
                            }).then(res => {
                                //    alert(1);
                                // this.loading = false;
                                // return
                                if (res.success === true) {
                                    setStore("Authorization", res.data);
                                    // 获取用户信息
                                    userInfo().then(res => {
                                        if (res.success === true) {
                                            // 避免超过大小限制
                                            //   setStore("accessToken", res.token);
                                        //    delete res.result.permissions;
                                        //     let roles = [];
                                        //     res.result.roles.forEach(e => {
                                        //         roles.push(e.name);
                                        //     });
                                         //   this.setStore("roles", roles);

                                            if (this.saveLogin) {
                                                // 保存7天
                                                Cookies.set("userInfo", JSON.stringify(res.data), {
                                                    expires: 7
                                                });
                                            } else {
                                                Cookies.set("userInfo", JSON.stringify(res.data));
                                            }
                                           setStore("userInfo", res.data);
                                         this.$store.commit("setAvatarPath", res.data.avatar);
                                            // 加载菜单
                                            util.initRouter(this);
                                            this.$router.push({
                                                name: "home"
                                            });
                                        } else {
                                            this.loading = false;
                                            this.$Message.error(res.message)
                                        }
                                    });
                                } else {
                                    this.loading = false;
                                    this.$Message.error(res.message)
                                }
                            });
                        }
                    });
                } else if (this.tabName === "mobile") {
                    this.$refs.mobileLoginForm.validate(valid => {
                        if (valid) {
                            if (this.form.code === "") {
                                this.errorCode = "验证码不能为空";
                                return;
                            } else {
                                this.errorCode = "";
                            }
                            this.showErrorMsg("请捐赠获取完整版")
                        }
                    });
                }
            },

            relatedLogin() {

            },


        },
        mounted() {
            // this.showMessage();
            // this.showAccount();
            this.relatedLogin();
        }
    };
</script>

<style lang="less">
  @import "./login.less";
</style>
