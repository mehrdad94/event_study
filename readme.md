## Event Study
A NPM package for conducting event studies.

## Installation
Run `npm install event-study --save`.

## Features
* Market Model
    * normalReturn
    * abnormalReturn
    * statisticalTest
    * significantTest
    * CARS
    * newsType (Good, Bad, neutral)
## Terminology
##### calendar: object of event dates.
##### stock: stock prices.
##### market: market prices.
##### timeline: event study time line that includes: pre event window (T0T1), end of pre event window till event date (T1E), event date till post event window (ET2), post event window (T2T3).
##### dateColumn: which field in stock or market prices has date format. 
##### operationColumn: which field in stock or market price you want to perform arithmetic operations (default is Close). 

## How to use
#### Market Model
##### Option one: provide information for each date separately. 
```
import { marketModel } from 'event-study'

const data = {
    calendar: {
        '2016-12-01': {
            stock: [{ Date: '2016-12-01', Close: 200 }],
            market: [{ Date: '2016-12-01', Close: 10 }],
            timeline: {
                T0T1: 2,
                T1E: 2,
                ET2: 2,
                T2T3: 2
            },
            dateColumn: 'Date',
            operationColumn: 'Close'
        }
    }
}

marketModel(data)
```
##### Option two: provide information globally.
In this method, every date will use same global information.
```
import { marketModel } from 'event-study'

const data = {
    calendar: {
        '2016-12-01': {}
    },
    stock: [{ Date: '2016-12-01', Close: 200 }],
    market: [{ Date: '2016-12-01', Close: 10 }],
    timeline: {
        T0T1: 2,
        T1E: 2,
        ET2: 2,
        T2T3: 2
    },
    dateColumn: 'Date',
    operationColumn: 'Close'
}

marketModel(data)
```
##### Option three: combine information.
In this method for date '2016-12-01' the global information(stock) will be ignored.

```
import { marketModel } from 'event-study'

const data = {
    calendar: {
        '2016-12-01': {
            stock: [{ Date: '2016-12-01', Close: 30 }],
        }
    },
    stock: [{ Date: '2016-12-01', Close: 200 }],
    market: [{ Date: '2016-12-01', Close: 10 }],
    timeline: {
        T0T1: 2,
        T1E: 2,
        ET2: 2,
        T2T3: 2
    },
    dateColumn: 'Date',
    operationColumn: 'Close'
}

marketModel(data)
```

## Analyse results
Results will be in below format:

**Result contains information just for EVENT PERIOD (T1E + ET2), for example in above scenario the abnormal return will be
an array with 4 item because T1E is 2 and ET2 is 2.**
```
[{
    date, // event date
    normalReturn,
    abnormalReturn,
    statisticalTest, 
    significantTest,
    CARS,
    newsType // 1 means good news, -1 bad news, 0 neutral
}]
```

## Contributing
If you saw any issue or have any recommendation you have 2 option to follow and I will be grateful:

##### Option one: Fill an issue in github account.
##### Option two: Send an Email to: m_javidi@outlook.com

## Tests
run `yarn test`
