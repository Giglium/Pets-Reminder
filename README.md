# Pets Reminder

This repository encompasses code developed for the "Mobile Programming and Multimedia" project as part of the Bachelor's Degree program at the University of Padua during the academic year [A.A. 2019/2020](https://en.didattica.unipd.it/off/2019/LM/SC/SC1176/000ZZ/SCP7080184/N0).

> The project is based on [caiobiodere/cordova-template-framework7-vue-webpack](https://github.com/caiobiodere/cordova-template-framework7-vue-webpack)

## Project idea and realization

The project involves developing an application for both iOS and Android platforms using a cross-platform framework. The app will help users manage their pets' schedules, providing reminders for feeding, vet appointments, and special occasions like birthdays.

![Application demo gif](./img/demo.gif)

## Prerequisites

* [Node 10.x](https://nodejs.org/);
* [Cordova 11.x](https://cordova.apache.org/).

The are extra pre-requisites based on the platform:

* *Android* platform:
  * Any [Java 1.8.x](https://www.java.com/) distribution
  * [Gradle](https://gradle.org/).
* *IOS* platform:
  * [Xcode](https://developer.apple.com/xcode/).

## Usage

```shell
git clone https://github.com/Giglium/Pets-Reminder.git
cd Pets-Reminder
npm install
npm run init-<platform>
npm build-<platform>
```

## Docker Demo

A limited functionality demo is available for the browser platform. However, some Cordova plugins only work on iOS and Android, which restricts full functionality across the browser.

```shell
 docker run --rm -p 80:80 ghcr.io/giglium/pets-reminder:latest
```

## License

This project is licensed under the APACHE LICENSE, VERSION 2.0 - see the [LICENSE](./LICENSE) file for details.
