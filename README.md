define
======

> Prototypal class & interface inheritance in Javascript

The scope of this is to formalize class definitions with shared interfaces & superclasses, useful for ensuring x-module compatibility & DRYness.

The approach is inline with Javascript's orthogonal take on type-checking.

## Getting started
```javascript
// ============================================================================
// Interface contract definition
// ============================================================================

var IFeline = {

    sleep: function () {
        return 'prepare for tomorrow';
    },

    eat: function () {
        return 'beware of poison';
    },

    pet: function () {
        if (this.habbits && this.habbits.couchSleeper)
            return Math.random() > 0.5 ? 'bite' : 'survive';
        return 'bite';
    },

    walk: function () {
        return 'escape';
    }
};

var IPet = {
    isSleepy        : 'sleepy',
    sleepsOnTheCouch: 'habbits.couchSleeper',

    calcHappiness: function (ate) {
        return ate && this.isSleepy ? 0.9 : -10;
    }
};

// ============================================================================
// Class implementation definition
// ============================================================================

var Cat = define(function (color, sleepy, habbits) {
    this.color   = color;
    this.sleepy  = sleepy;
    this.habbits = habbits;
}, [ 
    IFeline, 
    IPet 
]);

// ============================================================================
// Main
// ============================================================================

var overTheCouchCat  = new Cat('black', true,  { couchSleeper: true  }),
    underTheCouchCat = new Cat('brown', false, { couchSleeper: false });

console.log([
    overTheCouchCat.pet(),                 // survive
    overTheCouchCat.isSleepy,              // true
    overTheCouchCat.sleepsOnTheCouch,      // true
    overTheCouchCat.calcHappiness(true),   // 0.9

    underTheCouchCat.pet(),                // bite
    underTheCouchCat.isSleepy,             // false
    underTheCouchCat.sleepsOnTheCouch,     // false
    underTheCouchCat.calcHappiness(false), // -10
].join('\n'));
```