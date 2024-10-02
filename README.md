<p align="center">
  <img height="80px" width="80px" src="https://file.strassburger.dev/featherflow.png" alt="logo">
  <h3 align="center"><b>FeatherFlow</b></h3>

  <p align="center" >Lightweight Text editor with Syntax highlighting</p>
</p>

> [!NOTE]  
> Currently the app is only optimised and tested for MacOS, but support for Windows and Linux will follow

## Customization

You can choose between 11 different themes with each having a light and dark mode option or add your own theme and background image.

<p align="center">
  <img src="https://file.strassburger.dev/ff_mockup_2.png" alt="Mockup 1" width="30%" />
  <img src="https://file.strassburger.dev/ff_mockup_1.png" alt="Mockup 2" width="30%" />
  <img src="https://file.strassburger.dev/ff_mockup_3.png" alt="Mockup 3" width="30%" />
</p>

## Installation

### Easy way:

Go to the [Releases](https://github.com/KartoffelChipss/FeatherFlow/releases), download the latest installer for your OS and install it.

### Little bit harder way:

You need to have Node.js, npm and git installed.

Clone this repository:
```
git clone https://github.com/KartoffelChipss/FeatherFlow
```

Move to the apps directory, install all dependencies and start the app:

```
cd FeatherFlow
npm install
npm run start
```

If you want to build an installer yourself use one of the following commands:

- MacOS: `npm run dist:mac`
- Linux: `npm run dist:linux`
- Windows: `npm run dist:win`

## License

[GNU General Public License v3.0](https://github.com/KartoffelChipss/FeatherFlow/blob/main/LICENSE)
