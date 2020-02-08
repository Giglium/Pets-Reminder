<template>
    <div>
        <form :class="{'c-read-mode' : readMode}" class="list form-store-data" v-bind:id="animalId" name="infoForm" @submit.prevent="saveButtonClicked">
            <ul>
                <li class="item-content item-input">
                    <div class="c-img-avatar-box">
                        <f7-photo-browser
                          :photos="photos"
                          ref="standalone"
                        ><!-- photo --></f7-photo-browser>
                        <img :src="img" rased class="c-avatar-image" :alt="$t('message.img.avatar.alt')" @click="$refs.standalone.open()">
                        <div class="c-avatar-content c-display-none">
                            <f7-link
                                    icon-ios="f7:camera_fill"
                                    icon-aurora="f7:camera_fill"
                                    icon-md="material:camera_alt"
                                    icon-size="36px"
                                    sheet-open=".sheet-swipe-to-close"
                            ><!-- camera icon --></f7-link>
                        </div>
                        <input name="img" v-model="img" type="hidden"/>
                    </div>
                </li>
                <li class="item-content item-input">
                    <div class="item-inner">
                        <div class="item-title item-label c-required">{{ $t("message.form.name") }}</div>
                        <div class="item-input-wrap">
                            <input name="name" v-model="name" type="text"
                                   :placeholder="$t('message.form.placeholder.name')"
                                   :data-error-message="$t('message.form.errors.name')" required validate>
                            <span class="input-clear-button c-display-none"><!-- x icon --></span>
                        </div>
                    </div>
                </li>
                <li class="item-content item-input">
                    <div class="item-inner">
                        <div class="item-title item-label">{{ $t("message.form.birthday") }}</div>
                        <div class="item-input-wrap">
                            <input name="birthday" v-model="birthday" type="date" v-bind:max="today"
                                   v-bind:data-error-message="$t('message.form.errors.birthday')" validate>
                            <span class="input-clear-button c-display-none"><!-- x icon --></span>
                        </div>
                    </div>
                </li>
                <li class="item-content item-input">
                    <div class="item-inner">
                        <label class="item-title item-label">{{ $t("message.form.gender") }}</label>
                        <div class="item-input-wrap">
                            <select name="gender" v-model="gender">
                                <option value="" disabled selected>{{ $t("message.form.placeholder.gender") }}</option>
                                <option value="Male">{{ $t("message.form.male") }}</option>
                                <option value="Female">{{ $t("message.form.female") }}</option>
                                <option value="Unknown">{{ $t("message.form.unknown") }}</option>
                            </select>
                        </div>
                    </div>
                </li>
                <li class="item-content item-input">
                    <div class="item-inner">
                        <div class="item-title item-label">{{ $t("message.form.color") }}</div>
                        <div class="item-input-wrap">
                            <input name="name" v-model="color" type="text"
                                   :placeholder="$t('message.form.placeholder.color')" validate>
                            <span class="input-clear-button c-display-none"><!-- x icon --></span>
                        </div>
                    </div>
                </li>
                <li>
                    <f7-row tag="p">
                        <f7-col tag="span">
                            <f7-button raised id="save-button" type="submit">
                                <span v-if="!readMode" v-t="'message.form.save'"><!-- save text--></span>
                                <span v-if="readMode" v-t="'message.form.modify'"><!-- modify text--></span>
                            </f7-button>
                            <f7-button class="c-delete-button" raised @click="deleteButtonClicked">{{ $t("message.form.delete") }}</f7-button>
                        </f7-col>
                    </f7-row>
                </li>
            </ul>
        </form>
        <f7-sheet
                class="sheet-swipe-to-close c-height-auto"
                swipe-to-close
                backdrop>
            <f7-block-title>{{ $t("message.form.pick.photo") }}</f7-block-title>
            <f7-block>
                <f7-row tag="p">
                    <f7-col tag="span">
                        <f7-button raised @click="getCameraPhoto">{{ $t("message.form.pick.camera") }}</f7-button>
                    </f7-col>
                </f7-row>
            </f7-block>
            <f7-block>
                <f7-row tag="p">
                    <f7-col tag="span">
                        <f7-button raised @click="getAlbumPhoto">{{ $t("message.form.pick.album") }}</f7-button>
                    </f7-col>
                </f7-row>
            </f7-block>
        </f7-sheet>
    </div>
</template>
<script>
    // Import Application Facades
    import applicationFacades from '../../js/applicationFacades';

    const constants = {
            DEFAULT_ID: "new",
            HAPPY_BIRTHDAY_PROPERTY: "message.birthday",
            BIRTHDAY_NOTIFICATION_SUFFIX: "-birthday",
            DEFAULT_IMAGE: "avatar/default-avatar-" + Math.floor(Math.random() * (9 - 1 + 1) + 1) + ".svg",
            DEFAULT_IMAGE_REGEX: /default-avatar-([1-9])\.svg/i,
            UPDATE_TITLE_EVENT: "updateTitle",
            URL_ANIMAL_PREFIX: "/info-animal/animal/",
        },
        selectors = {
            HIDE: ".c-display-none",
            SHOW: ".c-display",
            SHEET_BACKDROP: ".sheet-backdrop",
            SAVE_BUTTON: "#save-button",
            NAME_INPUT: "[name='name']",
            GENDER_SELECT: "[name='gender']",
            INPUTS: "input",
            FORM: "[name='infoForm']",
        },
        classes = {
            HIDE: "c-display-none",
            SHOW: "c-display",
            READ_MODE: "c-read-mode",
        };

    export default {
        components: {},
        data() {
            return {
                animalId: "",
                name: "",
                birthday: "",
                gender: "",
                img: "",
                color: "",
                today: new Date().toISOString().split("T")[0],
                readMode: false,
            }
        },
        methods: {
            saveAnimal() {
                if (document.querySelector("#" + this.animalId).checkValidity()) {
                    //Create new Animal
                    const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));
                    let animalId = "";

                    if (constants.DEFAULT_ID === this.animalId) {
                        const animal = {};
                        // Populate with form data
                        animal.id = applicationFacades.generateUniqueId();
                        animalId = animal.id;

                        // Add Empty attribute
                        animal.alarm = [];
                        animal.photos = [];
                        animal.weights = [];

                        this.populateAnimalFromForm(animal, true);

                        this.birthdayNotification(animal, true);

                        // Add new animal to local storage
                        animals.push(animal);
                    } else {
                        animals.forEach((animal) => {
                            if (animal.id === this.animalId) {
                                this.populateAnimalFromForm(animal, false);
                                this.birthdayNotification(animal, false);
                            }
                        });
                    }

                    window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                    // Save into a persistent file
                    applicationFacades.saveLocalStorageData();

                    // Update list of animals
                    document.dispatchEvent(new CustomEvent(applicationFacades.events.UPDATE_ANIMALS));

                    if (constants.DEFAULT_ID === this.animalId) {
                        this.$f7router.navigate(constants.URL_ANIMAL_PREFIX  + animalId + "/", {reloadCurrent: true});
                    } else {
                        this.disableModify();
                    }
                }
            },
            getCameraPhoto() {
                applicationFacades.getCameraImage();
                // Close sheet
                document.querySelectorAll(selectors.SHEET_BACKDROP).forEach((sheetBackdrop) => {
                    sheetBackdrop.click();
                });
            },
            getAlbumPhoto() {
                applicationFacades.getAlbumImage();
                // Close sheet
                document.querySelectorAll(selectors.SHEET_BACKDROP).forEach((sheetBackdrop) => {
                    sheetBackdrop.click();
                });
            },
            enableModify() {
                const form = document.querySelector(selectors.FORM);

                form.querySelectorAll(selectors.HIDE).forEach((hideElement) => {
                    hideElement.classList.remove(classes.HIDE);
                    hideElement.classList.add(classes.SHOW);
                });

                form.querySelectorAll(selectors.INPUTS).forEach((input) => {
                    input.disabled = false;
                });

                form.querySelector(selectors.GENDER_SELECT).disabled = false;

                this.readMode = false;
            },
            disableModify() {

                const form = document.querySelector(selectors.FORM);

                form.querySelectorAll(selectors.SHOW).forEach((hideElement) => {
                    hideElement.classList.remove(classes.SHOW);
                    hideElement.classList.add(classes.HIDE);
                });

                form.querySelectorAll(selectors.INPUTS).forEach((input) => {
                    input.disabled = true;
                });

                form.querySelector(selectors.GENDER_SELECT).disabled = true;

                this.readMode = true;
            },
            saveButtonClicked(e) {
                this.readMode ? this.enableModify() : this.saveAnimal();
            },
            deleteButtonClicked(){
                this.$f7.dialog.confirm(applicationFacades.getLocaleString("message.areyousure"),applicationFacades.getLocaleString("message.delete"), () => {
                    let animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS)),
                        deleteAnimal = {};

                    animals.forEach((animal) => {
                        if (animal.id === this.animalId) {
                            deleteAnimal = animal;
                        }
                    });

                    if (animals.alarm != null){
                        animals.alarm.forEach(alarm => {
                            applicationFacades.clearNotificationForPreciseInstant(alarm.id);
                        });
                    }

                    applicationFacades.clearNotificationForPreciseInstant(deleteAnimal.id.replace("_", "") + constants.BIRTHDAY_NOTIFICATION_SUFFIX);

                    animals = animals.filter(animals => animals.id !== this.animalId);

                    window.localStorage.setItem(applicationFacades.localStorage.ANIMALS, JSON.stringify(animals));

                    // Save into a persistent file
                    applicationFacades.saveLocalStorageData();

                    // Update list of animals
                    document.dispatchEvent(new CustomEvent(applicationFacades.events.UPDATE_ANIMALS));

                    this.$f7router.back();
                });
            },
            populateAnimalFromForm(animal, isNew) {
                // Update animal attributes
                animal.name = this.name;
                animal.birthday = this.birthday != null ? this.birthday : "";
                animal.gender = this.gender;
                animal.color = this. color;

                const isDefaultImage =this.img.search(constants.DEFAULT_IMAGE_REGEX) !== -1;

                if(!isDefaultImage && animal.img !== this.img){
                    animal.photos.push(this.img);
                    this.name = animal.name + "\\n";
                    this.name = animal.name.replace("\\n", ""); //force update of the photos prop
                }

                animal.img = this.img.search(constants.DEFAULT_IMAGE_REGEX) !== -1 ? "" : this.img;
                applicationFacades.setStaticImage(this.img, animal.id);

                if(isNew) {
                    // Clear form
                    this.name = "";
                    this.birthday = "";
                    this.gender = "";
                    this.color = "";
                }
            },
            populateFormFromAnimal(animal){
                // Update form attributes
                this.name = animal.name;
                this.birthday = animal.birthday;
                this.gender = animal.gender;
                this.img = animal.img;
                this.color = animal.color;
            },
            birthdayNotification(animal, isNew){
                if(animal.birthday !== "") {
                    const birthday = new Date(animal.birthday);

                    if (!isNew) {
                        applicationFacades.clearNotificationForPreciseInstant(animal.id.replace("_", "") + constants.BIRTHDAY_NOTIFICATION_SUFFIX);
                    }

                    applicationFacades.scheduleNotificationForPreciseInstant(animal.id.replace("_", "") + constants.BIRTHDAY_NOTIFICATION_SUFFIX,
                        birthday.getMonth() + 1,
                        birthday.getDate(),
                        birthday.getHours(),
                        birthday.getMinutes(),
                        applicationFacades.getLocaleStringWithParams(constants.HAPPY_BIRTHDAY_PROPERTY, [animal.name]),
                        true,
                        true
                    );
                }
            },
            bindEvents() {
                document.addEventListener(applicationFacades.events.ACQUIRED_IMAGE, (e) => {
                    this.img = e.detail.imageUri;
                });

                document.addEventListener(applicationFacades.events.INPUT_OUTPUT_ERROR, (e) => {
                    this.$f7.dialog.alert(applicationFacades.getLocaleString("message.form.errors.io"),applicationFacades.getLocaleString("message.form.errors.title"));
                });
            }
        },
        mounted() {
            this.animalId = this.$f7route.params.animalId != null ? this.$f7route.params.animalId : constants.DEFAULT_ID;
            let img = "";

            if (this.animalId === constants.DEFAULT_ID) {
                img = constants.DEFAULT_IMAGE;

                this.enableModify();
            }else{
                const animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

                animals.forEach((animal) => {
                    if (animal.id === this.animalId) {
                        this.populateFormFromAnimal(animal);
                        img = animal.img === "" ?  constants.DEFAULT_IMAGE : animal.img;
                        this.$parent.title = animal.name;
                        this.$emit(constants.UPDATE_TITLE_EVENT, animal.name);
                        this.img = animal.img;
                    }
                });

                this.disableModify();
            }

            if(img.search(constants.DEFAULT_IMAGE_REGEX) !== -1)
            {
                let img_to_load = img;
                this.img = "./static/img/" + img;
                applicationFacades.getStaticImageOnRender(img_to_load, this.animalId).then((value) => {
                    this.img = value;
                });
            }

        this.bindEvents();
    },
    computed:
    {
      photos: function() {
              const photos = [];

          if(this.animalId !== constants.DEFAULT_ID) {

              let animals = JSON.parse(window.localStorage.getItem(applicationFacades.localStorage.ANIMALS));

              animals.forEach((animal) => {
                  if (animal.id === this.animalId) {
                      if(animal.photos.length > 0){
                          animal.photos.forEach( (photo) =>{
                              photos.push({url: photo, caption: this.name});
                          });
                      }else{
                          photos.push({url: this.img, caption: this.name});
                      }
                  }
              });
          }else {
              photos.push({url: this.img, caption: this.name});
          }

          return photos.reverse();
        }
      }
    };
</script>
