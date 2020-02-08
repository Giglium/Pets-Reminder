<template>
    <f7-page>
        <f7-navbar>
            <f7-nav-left>
                <f7-link class="panel-open" open-panel="left" icon="fas fa-bars"><!-- back arrow icon --></f7-link>
            </f7-nav-left>
            <div class="title">{{ $t("message.name") }}</div>
            <f7-nav-right><!-- --></f7-nav-right>
        </f7-navbar>
        <f7-fab :class="{'c-pulse' : animals.length === 0}" position="right-bottom" slot="fixed" href="/new/">
            <f7-icon ios="f7:plus" aurora="f7:plus" md="material:add"><!-- Plus icon --></f7-icon>
        </f7-fab>
        <f7-block-title v-if="animals.length !== 0">{{ $t("message.home.title") }}</f7-block-title>
        <f7-block-header v-if="animals.length === 0">{{ $t("message.home.noAnimal") }}</f7-block-header>
        <draggable v-model="animals" v-bind="dragOptions" handle=".c-draggable-card" @update="finishSort">
            <transition-group>
                <f7-block class="c-card" v-for="animal in animals" :key="animal.id">
                    <f7-card class="c-card-header-pic">
                        <f7-link class="c-full-width" :href="'/info-animal/animal/' + animal.id + '/'" panel-close>
                            <f7-card-header
                                    class="no-border c-card-header c-full-width"
                                    valign="bottom"
                                    :style="getAnimalImageBackground(animal.img, animal.id)"
                                    data-long-press-delay="500">
                                <p class="c-card-title">{{animal.name}}</p>
                            </f7-card-header>
                        </f7-link>
                        <f7-card-footer>
                            <f7-link :href="'/info-animal/animal/' + animal.id + '/'">{{ $t("message.info") }}</f7-link>
                            <f7-link :href="'/info-animal/animal/' + animal.id + '/tab-2/'">{{ $t("message.food") }}
                            </f7-link>
                            <f7-link :href="'/info-animal/animal/' + animal.id + '/tab-3/'">{{ $t("message.vet") }}
                            </f7-link>
                            <f7-link :href="'/info-animal/animal/' + animal.id + '/tab-4/'">{{ $t("message.weight") }}
                            </f7-link>
                        </f7-card-footer>
                    </f7-card>
                </f7-block>
            </transition-group>
        </draggable>

    </f7-page>
</template>
<script>
    import applicationFacades from "../../js/applicationFacades";
    import draggable from "vuedraggable"

    const constants = {
            DEFAULT_IMAGE: () => {
                return "avatar/default-avatar-" + Math.floor(Math.random() * (9 - 1 + 1) + 1) + ".svg"
            },
        },
        selectors = {
            CARD_HEADER: ".c-card-header",
        },
        classes = {
            DRAGGABLE_CARD: "c-draggable-card",
            CARD_HEADER: "c-card-header",
        };

    export default {
        components: {
            draggable,
        },
        data() {
            return {
                animals: [],
            }
        },
        methods: {
            getAnimalImageBackground(imgName, id) {
                let imagePath = "";

                if (imgName === "") {
                    imagePath = applicationFacades.getStaticImage(constants.DEFAULT_IMAGE(), id);
                } else {
                    imagePath = imgName;
                }

                return "background-image:url(" + imagePath + ")";
            },
            updateAnimals() {
                this.animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));
            },
            deleteAnimal(animalId) {
                let animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                animals = animals.filter(animals => animals.id !== animalId);

                window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                // Save into a persistent file
                applicationFacades.saveLocalStorageData();

                this.updateAnimals();
            },
            finishSort() {
                document.querySelectorAll(selectors.CARD_HEADER).forEach((card) => {
                    card.classList.remove(classes.DRAGGABLE_CARD);
                });

                let animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                animals = this.animals;

                window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                // Save into a persistent file
                applicationFacades.saveLocalStorageData();
            },
            bindEvents() {
                document.addEventListener(applicationFacades.events.DEVICE_READY, () => {
                    this.animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));
                });
                document.addEventListener(applicationFacades.events.UPDATE_ANIMALS, () => {
                    this.updateAnimals();
                });

                document.addEventListener(applicationFacades.events.LONG_PRESS, (e) => {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    e.stopPropagation();

                    if (e.target.classList.contains(classes.CARD_HEADER)) {
                        const cards = document.querySelectorAll(selectors.CARD_HEADER);
                        if (cards.length > 1) {
                            cards.forEach((card) => {
                                card.classList.add(classes.DRAGGABLE_CARD);
                            });
                        }
                    }
                });

            },
        },
        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    group: "animals",
                    disabled: false,
                    ghostClass: "ghost",
                    direction: 'vertical',
                    forceFallback: false,
                };
            },
        },
        mounted() {
            this.bindEvents();
        }
    };
</script>
