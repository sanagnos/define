define
======

> Prototypal class & interface inheritance in Javascript

The scope is to formalize class definitions with shared interfaces & superclasses, useful for ensuring x-module compatibility & DRYness.

The approach is inline with Javascript's orthogonal take on type-checking.

## Getting started
```javascript
// ============================================================================
// Interface contract definition
// ============================================================================

var IPet = {

    isSleepy: 'sleepy', // getter on class attribute

    calcHappiness: function (ate) { // generic happiness response in pets
        return ate && this.isSleepy ? 0.9 : -10;
    }
};

var IFeline = {
    
    postInit: function () { // called post instantiation (also see preInit)
        if (!this.habbits)
            this.habbits = { couchSleeper: false };
    },

    sleepsOnTheCouch: 'habbits.couchSleeper', // getter on nested class attribute

    pet: function () { // feline's response to petting
        if (this.sleepsOnTheCouch)
            return Math.random() + 0.2 > 0.5 ? 'purr' : 'survive';
        return Math.random() > 0.5 ? 'survive' : 'bite';
    }
};

// ============================================================================
// Class implementation definition
// ============================================================================

var Cat = define(function (color, sleepy, habbits) {
    
    // instance properties
    this.color   = color;
    this.sleepy  = sleepy;
    this.habbits = habbits;
}, [ 

    // shared contracts
    IFeline, 
    IPet,

    // custom members
    {
        findElevatedVantagePoint: function (furniture) { /* cat ninja code */ }
    }
]);

// ============================================================================
// Main
// ============================================================================

var catOverTheCouch  = new Cat('brown', true,  { couchSleeper: true  }),
    catUnderTheCouch = new Cat('gray',  false);

console.log([
    catOverTheCouch.pet(),                 // purr
    catOverTheCouch.isSleepy,              // true
    catOverTheCouch.sleepsOnTheCouch,      // true
    catOverTheCouch.calcHappiness(true),   // 0.9

    catUnderTheCouch.pet(),                // bite
    catUnderTheCouch.isSleepy,             // false
    catUnderTheCouch.sleepsOnTheCouch,     // false
    catUnderTheCouch.calcHappiness(false)  // -10
].join('\n'));
```