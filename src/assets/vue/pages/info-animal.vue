<template>
    <f7-page>
        <f7-navbar :title="title" :back-link="$t('message.back')"><!-- title --></f7-navbar>
        <f7-toolbar tabbar top>
            <f7-link tab-link="#tab-1" tab-link-active>{{ $t("message.info") }}</f7-link>
            <f7-link tab-link="#tab-2">{{ $t("message.food") }}</f7-link>
            <f7-link tab-link="#tab-3">{{ $t("message.vet") }}</f7-link>
            <f7-link tab-link="#tab-4">{{ $t("message.weight") }}</f7-link>
        </f7-toolbar>
        <f7-tabs swipeable>
            <f7-tab id="tab-1" class="page-content" tab-active>
                <infoForm @updateTitle="updateTitle"/>
            </f7-tab>
            <f7-tab id="tab-2" class="page-content">
                <f7-list sortable @sortable:sort="finishFoodSort" class="sortable-tap-hold sortable-eneable">
                    <f7-list-item swipeout class="swiper-no-swiping" @swipeout:deleted="deleteAlarm(alarm.id)"
                                  v-for="alarm in foodAlarm" :key="alarm.id"
                                  :header="alarm.date !== ''  ? alarm.title : $t('message.form.repeat')"
                                  :title="alarm.date !== '' ? getPreferredDate(alarm.date) : alarm.title"
                                  :after="getPreferredTime(alarm.time)"
                                  :class="{'c-opacity' : isOld(alarm.date, alarm.time)}">
                        <f7-swipeout-actions right>
                            <f7-swipeout-button delete class="swipeout-overswipe"
                                                :confirm-text="$t('message.alarm.delete')"
                                                :data-confirm-title="$t('message.delete')">
                                {{$t('message.delete')}}
                            </f7-swipeout-button>
                        </f7-swipeout-actions>
                    </f7-list-item>
                </f7-list>
                <f7-block @page:beforeremove="onPageBeforeRemove">
                    <p>
                        <f7-button fill popup-open=".c-food-popup-swipe">{{ $t("message.alarm.new") }}</f7-button>
                    </p>
                </f7-block>
                <f7-popup class="c-food-popup-swipe" swipe-to-close>
                    <f7-page>
                        <f7-navbar :title="$t('message.alarm.new')">
                            <f7-nav-right>
                                <f7-link popup-close>{{ $t("message.alarm.close") }}</f7-link>
                            </f7-nav-right>
                        </f7-navbar>
                        <div class="c-height-100 display-flex justify-content-center align-items-center">
                            <vetAlarm :id="foodId"/>
                        </div>
                    </f7-page>
                </f7-popup>
            </f7-tab>
            <f7-tab id="tab-3" class="page-content">
                <f7-list sortable @sortable:sort="finishVetSort" class="sortable-tap-hold sortable-eneable">
                    <f7-list-item swipeout class="swiper-no-swiping" @swipeout:deleted="deleteAlarm(alarm.id)"
                                  v-for="alarm in vetAlarm" :key="alarm.id" :header="alarm.title"
                                  :title="getPreferredDate(alarm.date)" :after="getPreferredTime(alarm.time)"
                                  :class="{'c-opacity' : isOld(alarm.date, alarm.time)}">
                        <f7-swipeout-actions right>
                            <f7-swipeout-button delete class="swipeout-overswipe"
                                                :confirm-text="$t('message.alarm.delete')"
                                                :data-confirm-title="$t('message.delete')">{{$t('message.delete')}}
                            </f7-swipeout-button>
                        </f7-swipeout-actions>
                    </f7-list-item>
                </f7-list>
                <f7-block @page:beforeremove="onPageBeforeRemove">
                    <p>
                        <f7-button fill popup-open=".c-vet-popup-swipe">{{ $t("message.alarm.new") }}</f7-button>
                    </p>
                </f7-block>
                <f7-popup class="c-vet-popup-swipe" swipe-to-close>
                    <f7-page>
                        <f7-navbar :title="$t('message.alarm.new')">
                            <f7-nav-right>
                                <f7-link popup-close>{{ $t("message.alarm.close") }}</f7-link>
                            </f7-nav-right>
                        </f7-navbar>
                        <div class="c-height-100 display-flex justify-content-center align-items-center">
                            <vetAlarm :id="vetId"/>
                        </div>
                    </f7-page>
                </f7-popup>
            </f7-tab>
            <f7-tab id="tab-4" class="page-content">
                <f7-block class="swiper-no-swiping">
                    <apexChart type="line" :options="chartOptions" :series="chartData"><!-- Chart --></apexChart>
                </f7-block>
                <f7-list>
                    <f7-list-item swipeout v-for="weight in weights" :key="weight.x + weight.y" class="swiper-no-swiping"
                                  :after="getPreferredDate(weight.x)" :title="weight.y + ' KG'"
                                  @swipeout:deleted="deleteWeight(weight)"  >
                        <f7-swipeout-actions right>
                            <f7-swipeout-button delete class="swipeout-overswipe"
                                                :confirm-text="$t('message.weights.delete')"
                                                :data-confirm-title="$t('message.delete')">{{$t('message.delete')}}
                            </f7-swipeout-button>
                        </f7-swipeout-actions>
                    </f7-list-item>
                </f7-list>
                <f7-block><f7-button fill sheet-open=".weight-sheet-swipe-to-close">{{ $t("message.weights.new") }}</f7-button></f7-block>
                <f7-sheet
                        class="weight-sheet-swipe-to-close"
                        style="height:auto; --f7-sheet-bg-color: #fff;"
                        swipe-to-close
                        backdrop>
                    <f7-page-content>
                        <weight :id="weightID"/>
                    </f7-page-content>
                </f7-sheet>
            </f7-tab>
        </f7-tabs>
    </f7-page>
</template>
<script>
    import applicationFacades from '../../js/applicationFacades';
    import infoForm from '../form/info-form';
    import vetAlarm from '../form/alarm';
    import weight from '../form/weight';
    import apexChart from 'vue-apexcharts'

    const constants = {
            VET_ID: "vet",
            FOOD_ID: "food",
            WEIGHT_ID: "weight",
            WEIGHT_PROPERTY: "message.weight",
        },
        selectors = {
            POPUP_CLOSE: ".popup-close",
        };

    export default {
        components: {
            infoForm,
            vetAlarm,
            weight,
            apexChart,
        },
        data() {
            return {
                title: "",
                vetId: constants.VET_ID,
                foodId: constants.FOOD_ID,
                weightID: constants.WEIGHT_ID,
                animalId: "",
                popupOpened: false,
                vetAlarm: [],
                foodAlarm: [],
                weights: [],
                chartOptions: {
                    chart: {id: 'weight-cart', toolbar: {show: false,}, type: 'area',},
                    stroke: {curve: 'smooth',},
                    markers: {size: 0,},
                    yaxis: {title: {text: applicationFacades.getLocaleString(constants.WEIGHT_PROPERTY),},},
                    xaxis: {type: 'datetime',},
                    colors: [applicationFacades.getHexColor()],
                    },
                chartData: [{
                    name: applicationFacades.getLocaleString(constants.WEIGHT_PROPERTY),
                    data: [{x: new Date(), y: 0}],
                }],
            }
        },
        methods: {
            updateTitle(title) {
                this.title = title;
            },
            onPageBeforeRemove(el) {
                // Destroy popup when page removed
                if (this.popup) this.popup.destroy(el);
            },
            deleteAlarm(alarmId) {
                const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                animals.forEach((animal) => {
                    if (animal.id === this.animalId) {
                        animal.alarm = animal.alarm.filter(alarm => alarm.id !== alarmId);
                    }
                });

                applicationFacades.clearNotificationForPreciseInstant(alarmId);

                window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                // Save into a persistent file
                applicationFacades.saveLocalStorageData();
                // Update list of animals
                document.dispatchEvent(new CustomEvent(applicationFacades.events.UPDATE_ALARM));
            },
            deleteWeight(weight){
                const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                animals.forEach((animal) => {
                    if (animal.id === this.animalId) {
                        animal.weights = animal.weights.filter(measure => measure.x !== weight.x && measure.y !== weight.y);
                    }
                });

                window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                // Save into a persistent file
                applicationFacades.saveLocalStorageData();
                // Update list of animals
                document.dispatchEvent(new CustomEvent(applicationFacades.events.UPDATE_WEIGHT));
            },
            updateAlarms() {
                const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));
                let alarms = [];

                animals.forEach((animal) => {
                    if (animal.id === this.animalId) {
                        alarms = animal.alarm;
                    }
                });

                this.vetAlarm = [];
                this.foodAlarm = [];

                alarms.forEach(alarm => {
                    if (alarm.id.startsWith(constants.VET_ID)) {
                        this.vetAlarm.push(alarm)
                    }
                    if (alarm.id.startsWith(constants.FOOD_ID)) {
                        this.foodAlarm.push(alarm)
                    }
                });
            },
            isOld(date, time) {
                const alarmDate = new Date(date);
                const today = new Date();

                alarmDate.setHours(parseInt(time.split(':')[0]));
                alarmDate.setMinutes(parseInt(time.split(':')[1]));

                return alarmDate <= today;
            },
            getPreferredTime(time) {
                return applicationFacades.getUserPreferredTime(time);
            },
            getPreferredDate(date) {
                return applicationFacades.getUserPreferredDate(date);
            },
            finishFoodSort($event) {
                const {from, to} = $event;
                this.foodAlarm.splice(to, 0, this.foodAlarm.splice(from, 1)[0]);

                const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                animals.forEach((animal) => {
                    if (animal.id === this.animalId) {
                        animal.alarm = [];
                        animal.alarm = animal.alarm.concat(this.foodAlarm);
                        animal.alarm = animal.alarm.concat(this.vetAlarm);
                    }
                });

                window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                // Save into a persistent file
                applicationFacades.saveLocalStorageData();
            },
            finishVetSort($event) {
                const {from, to} = $event;
                this.vetAlarm.splice(to, 0, this.vetAlarm.splice(from, 1)[0]);

                const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                animals.forEach((animal) => {
                    if (animal.id === this.animalId) {
                        animal.alarm = [];
                        animal.alarm.concat(this.foodAlarm);
                        animal.alarm.concat(this.vetAlarm);
                    }
                });

                window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                // Save into a persistent file
                applicationFacades.saveLocalStorageData();
            },
            updateWeights(){
                const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                animals.forEach((animal) => {
                    if (animal.id === this.animalId) {
                        this.weights = animal.weights;
                    }
                });

                if(this.weights.length > 0){
                    this.chartData[0].data = this.weights;
                    this.chartData = [{name: applicationFacades.getLocaleString(constants.WEIGHT_PROPERTY), data: this.weights}];
                }
            },
            bindEvents() {
                document.addEventListener(applicationFacades.events.UPDATE_ALARM, () => {
                    this.updateAlarms();
                    const closePopUpButton = document.querySelector(selectors.POPUP_CLOSE);

                    if (closePopUpButton != null) {
                        closePopUpButton.click();
                    }
                });
                document.addEventListener(applicationFacades.events.UPDATE_WEIGHT, () => {
                    this.updateWeights();
                });
            },
        },
        mounted() {
            this.animalId = this.$f7route.params.animalId != null ? this.$f7route.params.animalId : constants.DEFAULT_ID;

            this.bindEvents();
            this.updateAlarms();
            this.updateWeights();
        }
    };
</script>
