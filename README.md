# Nebula-Electron
Now overhauled!
Nebula Electron is now faster, runs on a locally hosted server, and cannot be blocked as long as you can run the program.

# What is Nebula-Electron?
Nebula-Electron is an electron build of the popular proxy Nebula that runs on NodeJS.

# How do I build Nebula-Electron?
It's Simple!
```
npm install --save-dev electron-packager
npx electron-packager ./ Nebula --icon=logo.ico
```
Or for yarn:
```
yarn add electron-packager
npx electron-packager ./ Nebula --icon=logo.ico
```
This is a fully functioning build of Nebula, however .asar packing **does not work!**, No clue why, it just fails to find Nebula's app.js

Credits: 
<br>
[Nebula](https://github.com/NebulaServices/Nebula) 
<br>
[Electron-Packager](https://github.com/electron/electron-packager)
