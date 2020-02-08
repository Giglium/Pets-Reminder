<template>
    <form :id="id" class="list no-store-data" @submit="createWeight">
        <ul>
            <li class="item-content item-input">
                <div class="item-inner">
                    <div class="item-title item-label c-required">{{ $t("message.form.weight") }}</div>
                    <div class="item-input-wrap">
                        <input name="weight" type="number" v-model="weight" step="0.01" min="0.01" max="999"
                               :placeholder="$t('message.form.placeholder.weight')"
                               :data-error-message="$t('message.form.errors.weight')" required validate>
                        <span class="input-clear-button"><!-- x icon --></span>
                    </div>
                </div>
            </li>

            <f7-button fill type="submit">{{ $t("message.form.create") }}</f7-button>
        </ul>

    </form>
</template>
<script>
    import applicationFacades from '../../js/applicationFacades';

    const selectors = {
        SHEET_BACKDROP: ".sheet-backdrop",
    };

    export default {
        components: {},
        data() {
            return {
                animalId: "",
                weight: "",
            }
        },
        methods: {
            createWeight($event){
                $event.preventDefault();
                if (document.querySelector("#" + this.id).checkValidity()) {
                    const weight = {};

                    weight.y = this.weight;
                    weight.x = new Date();

                    //Save weight
                    const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                    animals.forEach((animal) => {
                        if (animal.id === this.animalId) {
                            animal.weights.push(weight);
                        }
                    });

                    window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                    // Save into a persistent file
                    applicationFacades.saveLocalStorageData();
                    // Update list of animals
                    document.dispatchEvent(new CustomEvent(applicationFacades.events.UPDATE_WEIGHT));

                    // Clear form
                    this.weight = "";

                    // Close sheet
                    document.querySelectorAll(selectors.SHEET_BACKDROP).forEach((sheetBackdrop) => {
                        sheetBackdrop.click();
                    });
                }
            }
        },
        props: {
            id: String,
        },
        mounted() {
            this.animalId = this.$f7route.params.animalId != null ? this.$f7route.params.animalId : constants.DEFAULT_ID;
        }
    };
</script>
