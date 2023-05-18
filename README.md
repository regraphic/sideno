# ShareImage
![Card](https://shimg.zype.cf/v1/image?title=Generate%20Social%20Share%20Images%20Dynamically!&cloudName=zype&imagePublicID=ShareImage/Docs-Card)
## Installation
There is currently 2 Langauges Supported: **Python** and **Node.js**
And there is a **API** available to use with your project!
### API (Beta, WIP)
The API is currently in beta and may have some issues.
The domain of the API is https://shimg.zype.cf/v1
Currently, the V2 of ShareImage is only available for the Node.JS Library (with CommonJS, ESM and TypeScript support)
#### Endpoints
There is currently only one endpoint available:
##### GET `/image`
It needs Query Params in the following format:
https://shimg.zype.cf/v1/image?paramName=paramValue
The paramaters are as same as **Node.js** Params!
### Python
To Install ShareImage in Python with *PIP* Run:
```sh
pip install ShareImage
```
### Node.js
To Install ShareImage in Node.js with *NPM* Run:
```sh
npm i shareimage --save
```
Or, with *Yarn*:
```sh
yarn add shareimage
```
## Usage
Using ShareImage is a bit different across Languages.
### Python
Use the Following Code to Generate a Image and print it's URL in Python:
```py
from ShareImage import ShareImage

image = ShareImage(
    title = "My Test Image",
    cloudName = "myCloud",
    imagePublicId = "myFolder/myImage"
)

print(image)
```
### Node.js
Use the Following Code to Generate a Image and output it's URL in Node.js (ES6):
```js
import * as ShareImage from 'shareimage';

const image = await ShareImage.generateImage(
    "/path/to/image.png",
    "My awesome title",
    { type: "datauri" }
)

console.log(image)
```

### Deno
You can use the [`sideno`](https://deno.land/x/sideno) library to use ShareImage in Deno!
Example:
```ts
import SI from "https://deno.land/x/sideno@VERSION/mod.ts";
let img = new SI.Image("URL/Buffer of Image");

img.title.text = "Your desired title";
img.tagline.text = "Your desired tagline";

let out = await img.export("buffer");
await Deno.writeFile("out.png", out);
```

## Docs
Coming Soon...

## Sponsors
We have been sponsored by **Vercel**, **MacStadium**.  
Vercel gave us free **Pro Plan** access to host the documentation and other websites.  
MacStadium gave us free **Mac Mini Server** to host the API and for builds.  

[![Powered By Vercel](https://res.cloudinary.com/zype/image/upload/ShareImage/powered-by-vercel.png)](https://vercel.com/?utm_source=zypeoss&utm_campaign=oss)

<img src="https://res.cloudinary.com/zype/image/upload/ShareImage/MacStadium" height="44" width="212">
