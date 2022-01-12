# Fájlrendszer szinkronizáció

## useYProjectStructure.js
A kollaboratív szerkesztést megvalósító metódusokat tartalmazzó custom hook.
Egy `Y.Doc`-ot példányosít, ezen végzi a műveleteket. 
Az adatok megosztását a kliensek között egy `WebsocketProvider` végzi.

A struktúra alapját az `Y.Map` adattípus képezi, ahogy mappaszerkezetet alkot. 
A mappaszerkezet alján a fájlokat `Y.Text` reprezentálja.

A műveletek az `Y.Map` típusú `yData` adattagon hajtódnak végre. 
Ebben 2 beágyazott `Y.Map` van, az egyik a projekt metaadatait, a másik a projekt fájlrendszerét tartalmazza.

Beállításra kerülő metaadatok: 
- résztvevők listája
- aktív, megnyitott fájl
- diákok számára csak olvashatak-e a fájlok

A custom hookot használó osztály számára a `metaData`, `filesystem` és `isTeacher` adattagokon keresztül kerülnek átadásra az információk.
Az elsőnek belépő felhasználó kapja a tanár szerepét, mindenki más diák.

A fájlrendszert kezelő metódusok a `projectMethods` tömbben találhatóak. 

Használat: `const [metaData, filesystem, isTeacher, projectMethods] = useYProjectStructure();`

### Inicializálás
A `useEffect` lefutása során bállításra kerülnek a változásokat figyelő observerek.
Ez a fáljrendszer, a metaadatok és külön a résztvevők listájának figyelését, kezelését jelenti.

### Kiemelt projektkezelő metódusok

#### Fájl vagy mappa hozzáadása - `addFile(path)`
A `path` paraméter a fájl elérési útvonala. 
Az új fájl/mappa az elérési útvonal utolsó része. Amennyiben van kiterjesztése, akkor fájl, tehát `Y.Text`-ként reprezentálható, ha nincs, akkor pedig mappa, azaz `Y.Map`-ként reprezentálható.
Az `Y.Map`-ekhez az observerek hozzárendelése rekurzívan, tehát ebben a lépésben történik.

#### Törlés - `deleteFile(path)`
A fájl elérési útvonalát megadva történik a törlés.

#### Monaco binding létrehozása - `createMonacoBinding(path, editor, monaco)`
Egy fálj tartlamát egy monaco szerkesztővel köti össze.
Ehhez paraméterként a fájl elérési útvonala, illetve az editor és a monaco példányok megadása szükséges.


## UI felépítés

Három React komponensből épül fel az alkalmazás: `App`, `Main` és `MonacoEditor`, ezek ebben a sorrendben tartalmazzák egymást.

Az `App`-ban lehet új fáljokat létrehozni, és váltani közöttük.    
**Csak "lapos" fájlrendszerrel működik, mappaszerkezetek megjelenítése és kezelése UI szinten még nem lehetséges.**

### Monaco Editor
Példányosítja a monaco editort, és összeköti vele a kiválaszott fájlt.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
