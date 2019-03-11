<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>

    <div class="home-main" >

        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row class="margin-top-10">
                                <Card>
                                    <p slot="title" class="card-title">
                                        <Icon type="ios-shuffle-strong"></Icon>
                                        用户充值
                                    </p>
                                    <div class="line-chart-con">
                                        <zhu></zhu>
                                        <!--<visite-volume></visite-volume>-->
                                    </div>
                                </Card>
                            </Row>
                        </Card>
                    </Col>
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row class="margin-top-10">
                                <Card>
                                    <p slot="title" class="card-title">
                                        <Icon type="ios-shuffle-strong"></Icon>
                                        本周代售(已成交)
                                    </p>
                                    <div class="line-chart-con">
                                        <dai></dai>
                                        <!--<service-requests></service-requests>-->
                                    </div>
                                </Card>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="12" :sm="24" :ht="300"  :md="8" :style="{marginBottom: '30px'}">
                        <infor-card
                                id-name="user_created_count"
                                :end-val="today_user"
                                iconType="android-person-add"
                                color="#2d8cf0"
                                intro-text="今日新增用户"
                        ></infor-card>
                    </Col>
                    <Col :xs="12" :sm="24" :ht="32" :md="8" :style="{marginBottom: '30px'}">
                        <infor-card
                                id-name="visit_count"
                                :end-val="all_total"
                                iconType="ios-eye"
                                color="#64d572"
                                :iconSize="50"
                                intro-text="今日充值数量"
                        ></infor-card>
                    </Col>
                    <Col :xs="12" :sm="24" :ht="32"  :md="8" :style="{marginBottom: '30px'}">
                        <infor-card
                                id-name="collection_count"
                                :end-val="today_shop_order"
                                iconType="upload"
                                color="#ffd572"
                                intro-text="今日用户订单"
                        ></infor-card>
                    </Col>
                    <!--<Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">-->
                    <!--<infor-card-->
                    <!--id-name="transfer_count"-->
                    <!--:end-val="today_shop_order"-->
                    <!--iconType="shuffle"-->
                    <!--color="#f25e43"-->
                    <!--intro-text="今日采购订单"-->
                    <!--&gt;</infor-card>-->
                    <!--</Col>-->
                </Row>
                <Row  :gutter="10" class-name="home-page-row1">
                    <!--<Col :md="24" :lg="8" :style="{marginBottom: '10px'}">-->
                    <!--<Card>-->
                    <!--<p slot="title" class="card-title">-->
                    <!--<Icon type="android-map"></Icon>-->
                    <!--&lt;!&ndash;商户绑定排行&ndash;&gt;-->
                    <!--提币排行-->
                    <!--</p>-->
                    <!--<div class="data-source-row">-->
                    <!--<visite-volume></visite-volume>-->
                    <!--</div>-->
                    <!--</Card>-->
                    <!--</Col>-->
                    <!--<Col :md="24" :lg="12" :style="{marginBottom: '10px'}">-->
                    <!--<Card>-->
                    <!--<p slot="title" class="card-title">-->
                    <!--<Icon type="android-map"></Icon>-->
                    <!--&lt;!&ndash;商户绑定排行&ndash;&gt;-->
                    <!--提现排行-->
                    <!--</p>-->
                    <!--<div class="data-source-row">-->
                    <!--<visite-volume></visite-volume>-->
                    <!--</div>-->
                    <!--</Card>-->
                    <!--</Col>-->
                    <Col :md="12" :lg="24" :style="{marginBottom: '8px'}">
                        <Card>
                            <Row class="margin-top-10">
                                <Card>
                                    <p slot="title" class="card-title">
                                        <Icon type="ios-shuffle-strong"></Icon>
                                        本周提现
                                    </p>
                                    <div class="line-chart-con">
                                        <ti></ti>
                                        <!--<visite-volume></visite-volume>-->
                                        <!--<data-source-pie></data-source-pie>-->
                                    </div>
                                </Card>
                            </Row>
                        </Card>
                    </Col>
                    <!--<Col :md="24" :lg="12" :style="{marginBottom: '10px'}">-->
                    <!--<Card>-->
                    <!--<Row class="margin-top-10">-->
                    <!--<Card>-->
                    <!--<p slot="title" class="card-title">-->
                    <!--<Icon type="ios-shuffle-strong"></Icon>-->
                    <!--提币排行-->
                    <!--</p>-->
                    <!--<div class="line-chart-con">-->
                    <!--&lt;!&ndash;<zhu></zhu>&ndash;&gt;-->
                    <!--<service-requests></service-requests>-->
                    <!--</div>-->
                    <!--</Card>-->
                    <!--</Row>-->
                    <!--</Card>-->
                    <!--</Col>-->
                </Row>

                <Row  :gutter="10" class-name="home-page-row1">
                    <!--<Col :md="24" :lg="8" :style="{marginBottom: '10px'}">-->
                    <!--<Card>-->
                    <!--<p slot="title" class="card-title">-->
                    <!--<Icon type="android-map"></Icon>-->
                    <!--&lt;!&ndash;商户绑定排行&ndash;&gt;-->
                    <!--提币排行-->
                    <!--</p>-->
                    <!--<div class="data-source-row">-->
                    <!--<visite-volume></visite-volume>-->
                    <!--</div>-->
                    <!--</Card>-->
                    <!--</Col>-->
                    <!--<Col :md="24" :lg="12" :style="{marginBottom: '10px'}">-->
                    <!--<Card>-->
                    <!--<p slot="title" class="card-title">-->
                    <!--<Icon type="android-map"></Icon>-->
                    <!--&lt;!&ndash;商户绑定排行&ndash;&gt;-->
                    <!--提现排行-->
                    <!--</p>-->
                    <!--<div class="data-source-row">-->
                    <!--<visite-volume></visite-volume>-->
                    <!--</div>-->
                    <!--</Card>-->
                    <!--</Col>-->
                    <!--<Col :md="12" :lg="24" :style="{marginBottom: '8px'}">-->
                    <!--<Card>-->
                    <!--<Row class="margin-top-10">-->
                    <!--<Card>-->
                    <!--<p slot="title" class="card-title">-->
                    <!--<Icon type="ios-shuffle-strong"></Icon>-->
                    <!--提现排行-->
                    <!--</p>-->
                    <!--<div class="line-chart-con">-->
                    <!--&lt;!&ndash;<zhu></zhu>&ndash;&gt;-->
                    <!--<visite-volume></visite-volume>-->
                    <!--</div>-->
                    <!--</Card>-->
                    <!--</Row>-->
                    <!--</Card>-->
                    <!--</Col>-->
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row class="margin-top-10">
                                <Card>
                                    <p slot="title" class="card-title">
                                        <Icon type="ios-shuffle-strong"></Icon>
                                        本周提币
                                    </p>
                                    <div class="line-chart-con">
                                        <bi></bi>
                                        <!--<service-requests></service-requests>-->
                                    </div>
                                </Card>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
        <!--<Row :gutter="10" class="margin-top-10">-->
        <!---->
        <!---->
        <!--<Col :md="24" :lg="8" :style="{marginBottom: '10px'}">-->
        <!--<Card>-->
        <!--<p slot="title" class="card-title">-->
        <!--<Icon type="ios-pulse-strong"></Icon>-->
        <!--零售商品分布(一周)-->
        <!--</p>-->
        <!--<div class="data-source-row">-->
        <!--<data-source-pie></data-source-pie>-->
        <!--</div>-->
        <!--</Card>-->
        <!--</Col>-->
        <!--<Col :md="24" :lg="8" :style="{marginBottom: '10px'}">-->
        <!--<Card>-->
        <!--<p slot="title" class="card-title">-->
        <!--<Icon type="ios-pulse-strong"></Icon>-->
        <!--采购商品分布(一周)-->
        <!--</p>-->
        <!--<div class="data-source-row">-->
        <!--&lt;!&ndash;<cai-source-pie></cai-source-pie>&ndash;&gt;-->

        <!--</div>-->
        <!--</Card>-->
        <!--</Col>-->
        <!--</Row>-->

    </div>
</template>

<script>
    import cityData from "./map-data/get-city-value.js";
    import homeMap from "./components/map.vue";
    import dataSourcePie from "./components/dataSourcePie.vue";
    //  import caiSourcePie from "./components/caiSourcePie.vue";
    import visiteVolume from "./components/visiteVolume.vue";
    import serviceRequests from "./components/serviceRequests.vue";
    //   import yuan from "./components/yuan.vue";
    import zhu from "./components/zhu.vue";
    import ti from "./components/ti.vue";
    import bi from "./components/bi.vue";
    import dai from "./components/dai.vue";
    import userFlow from "./components/userFlow.vue";
   // import countUp from "./components/countUp.vue";
    import inforCard from "./components/inforCard.vue";
    import mapDataTable from "./components/mapDataTable.vue";
    import Cookies from "js-cookie";
    import ToDoListItem from "./components/toDoListItem";
    // import Yuan from "./components/yuan";

    export default {
        name: "home",
        components: {
            //   Yuan,
            ToDoListItem,
            homeMap,
            dataSourcePie,
            //  caiSourcePie,
            visiteVolume,
            serviceRequests,
            userFlow,
         //   countUp,
            inforCard,
            mapDataTable,
            //    yuan,
            zhu,
            ti,
            bi,
            dai,
        },
        data() {
            return {
                count: {
                    createUser: 496,
                    visit: 3264,
                    collection: 24389305,
                    transfer: 39503498
                },
                // cityData: cityData,
                cityData: [],
                newToDoItemValue: "",
                city: "",
                weather: "",
                username: "",
                today_user_order:0,
                today_shop_order:0,
                all_total:0,
                today_user:0,

            };
        },
        computed: {
            avatarPath() {
                return localStorage.avatorImgPath;
            }
        },
        methods: {

            init() {
                let userInfo = JSON.parse(Cookies.get("userInfo"));
                this.username = userInfo.username;
                this.getRequest("/counts/getTodayCount").then(res => {
                    if (res.success === true) {
                        this.today_user=res.result.user_count;
                        this.all_total=res.result.recharge_count;
                        this.today_user_order=res.result.order_count;
                        //   this.today_shop_order=res.today_cai_order;
                        // let ipInfo = JSON.parse(res.result);
                        // if (ipInfo.retCode === "200") {
                        //   let info = ipInfo.result[0];
                        //   let weather =
                        //     info.weather +
                        //     " " +
                        //     info.temperature +
                        //     " 污染指数: " +
                        //     info.pollutionIndex;
                        //   this.city = info.city;
                        //   this.weather = weather;
                        // } else {
                        //   this.city = "未知";
                        //   this.weather = "未知";
                        // }
                    }
                });
            },
            // getDai(){
            //     this.getRequest('/index/getDai').then(res=>{
            //         if(res.success===true){
            //             this.cityData=res.result;
            //         }
            //     })
            //  }

            getShopLevel(){
console.log(1)
            },
            getDai(){
                console.log(1)
            }
        },
        mounted() {
            // this.warning(false)
            this.init();
            //   this.getDai();
            this.getShopLevel();
            if (this.timer) {
                clearInterval(this.timer);
            } else {
                this.timer = setInterval(() => {
                    this.init();
                    this.getDai()
                }, 1800000)
            }
        }
    };
</script>
