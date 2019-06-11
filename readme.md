## Event Study with Javascript
This project was created based on Event Study methodologies by [mackinlay paper](https://pdfs.semanticscholar.org/aac6/83a678a12a3dcd73389aac7289868847ea73.pdf).

## Tech / framework used
* express js

## Features
* Market Model
    * normalReturn
    * abnormalReturn
    * statisticalTest
    * significantTest

## Code Example
You can use this project as an api package or extract services and use it for your own project

If you intend to use api, just run the project and query like this:
```
axios.post('http://localhost:8080', {
    dataCalendar: [{ Date: '6' }],  // sequence of event dates 
    dataMarket: [{ Date: '1', Close: '100' }], // sequence of market price
    dataStock: [{ Date: '2', Close: '200' }], // sequence of stock price
    timeline: { // event study time line (E is event date)
      T0T1: 2, // pre event window
      T1E: 2, // event window (till event date)
      ET2: 2, // event window (till post event window)
      T2T3: 2 // post event window
    },
    operationField: 'Close', // which price field should be use (in price sequence)
    dateField: 'Date' // which field should be use as date field (in price sequence)
})
```
or if you are willing to use standalone services:
```
import { marketModel } from '../services/eventStudy'
marketModel(same body as api body)
```


## Installation
run `yarn install` or `npm install` then `yarn serve`.

## Tests
run `yarn test`