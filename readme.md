## JavaScript Event Study package
This project was created based on Event Study methodologies by [mackinlay paper](https://pdfs.semanticscholar.org/aac6/83a678a12a3dcd73389aac7289868847ea73.pdf).

## Features
* Market Model
    * normalReturn
    * abnormalReturn
    * statisticalTest
    * significantTest

## Code Example
```
import { marketModel } from 'eventStudy'
marketModel({
    dataCalendar: [{ Date: '6' }],  // Event list
    dataMarket: [{ Date: '1', Close: '100' }], // Market price sheet
    dataStock: [{ Date: '2', Close: '200' }], // Stock price sheet
    timeline: { // event study time line (E is event date)
      T0T1: 2, // pre event window
      T1E: 2, // event window (till event date)
      ET2: 2, // event window (till post event window)
      T2T3: 2 // post event window
    },
    operationField: 'Close', // which price field should be use (in price table)
    dateField: 'Date' // which field should be use as date field (in price table)
})

// result will be
{
    normalReturn: [],
    abnormalReturn: [],
    statisticalTest: [],
    significantTest: []
}
```

## Installation
run `yarn install` or `npm install` then `yarn serve`.

## Tests
run `yarn test`
