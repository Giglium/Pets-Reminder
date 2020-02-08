<template>
    <form :id="id" class="list no-store-data" @submit="createAlarm">
        <ul>
            <li class="item-content item-input c-day">
                <div class="item-inner">
                    <div class="item-title item-label c-required">{{ $t("message.form.date") }}</div>
                    <div class="item-input-wrap">
                        <input name="date" type="date" :data-error-message="$t('message.form.errors.date')" v-model="date"
                               v-bind:min="today" validate>
                        <span class="input-clear-button"><!-- x icon --></span>
                    </div>
                </div>
            </li>
            <li class="item-content item-input">
                <div class="item-inner">
                    <div class="item-title item-label c-required">{{ $t("message.form.time") }}</div>
                    <div class="item-input-wrap">
                        <input name="time" type="time" :data-error-message="$t('message.form.errors.time')" v-model="time"
                               required validate>
                        <span class="input-clear-button"><!-- x icon --></span>
                    </div>
                </div>
            </li>
            <li class="item-content item-input">
                <div class="item-inner">
                    <div class="item-title item-label c-required">{{ $t("message.form.titleAlarm") }}</div>
                    <div class="item-input-wrap">
                        <input name="title" type="text" v-model="title"
                               :placeholder="$t('message.form.placeholder.nameAlarm')"
                               :data-error-message="$t('message.form.errors.nameAlarm')" required validate>
                        <span class="input-clear-button"><!-- x icon --></span>
                    </div>
                </div>
            </li>
            <li class="c-repeat-toggle">
                <f7-list-item>
                    <span>{{ $t("message.form.repeat") }}</span>
                    <f7-toggle @change="showDay" :checked="repeat"><!-- Toggle Button --></f7-toggle>
                </f7-list-item>
            </li>
            <li class="item-content c-display-none c-empty">
                <f7-list-item>
                    <!-- empty -->
                </f7-list-item>
            </li>

            <f7-button fill type="submit">{{ $t("message.form.create") }}</f7-button>
        </ul>

    </form>
</template>
<script>
    import applicationFacades from '../../js/applicationFacades';

    const constants = {
            VET_ID: "vet",
            FOOD_ID: "food",
        },
        selectors = {
            DAY: ".c-day",
            REPEAT_TOGGLE: ".c-repeat-toggle",
            TITLE_INPUT: "[name=title]",
            EMPTY: ".c-empty",
        },
        classes = {
            HIDDEN: "c-hidden",
            HIDE: "c-display-none",
        };

    export default {
        components: {},
        data() {
            return {
                animalId: "",
                title: "",
                date: "",
                time: "",
                repeat: false,
                today: new Date().toISOString().split("T")[0],
            }
        },
        methods: {
            showDay() {
                const form = document.querySelector("#" + this.id);
                form.querySelector(selectors.DAY).classList.toggle(classes.HIDE);
                form.querySelector(selectors.EMPTY).classList.toggle(classes.HIDE);
            },
            mountVetAlarm() {
                const form = document.querySelector("#" + this.id);
                form.querySelector(selectors.REPEAT_TOGGLE).classList.toggle(classes.HIDE);
            },
            mountFoodAlarm() {
                this.repeat = true;
            },
            createAlarm($event){
                $event.preventDefault();
                if (document.querySelector("#" + this.id).checkValidity()) {
                   const alarm = {};

                   alarm.id = this.id + "-" + this.animalId + "=" + applicationFacades.generateUniqueId();
                   alarm.title = this.title;
                   alarm.date = this.date;
                   alarm.time = this.time;
                   alarm.repeat = this.repeat;

                   // Create alarm
                    const date = alarm.date !== "" ? new Date(alarm.date) : new Date();
                   date.setHours(parseInt(alarm.time.split(':')[0]));
                   date.setMinutes(parseInt(alarm.time.split(':')[1]));

                    applicationFacades.scheduleNotificationForPreciseInstant(alarm.id,
                        date.getMonth() + 1,
                        date.getDate(),
                        date.getHours(),
                        date.getMinutes(),
                        alarm.title,
                        alarm.repeat,
                        false
                    );

                    //Save alarm
                    const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                    animals.forEach((animal) => {
                        if (animal.id === this.animalId) {
                            animal.alarm.push(alarm);
                        }
                    });

                    window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                    // Save into a persistent file
                    applicationFacades.saveLocalStorageData();
                    // Update list of animals
                    document.dispatchEvent(new CustomEvent(applicationFacades.events.UPDATE_ALARM));

                    // Clear form
                    this.title = "";
                    this.date = "";
                    this.time = "";
                    switch (this.id) {
                        case constants.VET_ID:
                            this.repeat = false;
                            break;
                        case constants.FOOD_ID:
                            this.repeat = true;
                            break;
                    }
                }
            }
        },
        props: {
            id: String,
        },
        mounted() {
            this.animalId = this.$f7route.params.animalId != null ? this.$f7route.params.animalId : constants.DEFAULT_ID;

            switch (this.id) {
                case constants.VET_ID:
                    this.mountVetAlarm();
                    break;
                case constants.FOOD_ID:
                    this.mountFoodAlarm();
                    break;
            }
        }
    };
</script>
