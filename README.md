define
======

Now part of [comjs](https://github.com/sanagnos/comjs); usage same as in comjs.

## Getting started
```javascript
// ============================================================================
// Interface contracts
// ============================================================================

var IPet = {

    isSleepy: 'sleepy', // access on class attribute

    calcHappiness: function (ate) { // generic happiness response in pets
        return ate && this.isSleepy ? 0.9 : -10;
    }
};

var IFeline = {
    
    postInit: function () { // called post instantiation
        if (!this.habbits)
            this.habbits = { couchSleeper: false };
    },

    sleepsOnTheCouch: 'habbits.couchSleeper', // access on nested class attribute

    pet: function () { // feline's response to petting
        if (this.sleepsOnTheCouch)
            return Math.random() + 0.2 > 0.5 ? 'purr' : 'survive';
        return Math.random() > 0.5 ? 'survive' : 'bite';
    },

    findElevatedVantagePoint: '@require' // require member implementation
};

// ============================================================================
// Class definition
// ============================================================================

var Cat = define(function (color, sleepy, habbits) {
    
    // instance properties
    this.color   = color;
    this.sleepy  = sleepy;
    this.habbits = habbits;
}, [ 

    // shared contracts
    IPet,
    IFeline,

    // custom members
    {
        // exception thrown if missing since required by IFeline with '@require'
        findElevatedVantagePoint: function (furniture) { /* cat ninja code */ },

        // partially override IPet's method
        calcHappiness: function (ate, whenAsked) {
            return whenAsked ? 0.9999999991 : this.calcHappiness.super(ate);
        }
    }
]);

// ============================================================================
// Main
// ============================================================================

var catOverTheCouch  = new Cat('brown', true,  { couchSleeper: true  }),
    catUnderTheCouch = new Cat('gray',  false);

console.log([
    catOverTheCouch.pet(),                       // purr
    catOverTheCouch.isSleepy,                    // true
    catOverTheCouch.sleepsOnTheCouch,            // true
    catOverTheCouch.calcHappiness(true, true),   // 0.9999999991

    catUnderTheCouch.pet(),                      // bite
    catUnderTheCouch.isSleepy,                   // false
    catUnderTheCouch.sleepsOnTheCouch,           // false
    catUnderTheCouch.calcHappiness(false)        // -10
].join('\n'));
```