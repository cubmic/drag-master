# drag-master

A simple drag and drop directives for VueJS to handle drag and drop

Thank you, Enjoy
...and please give me a star ;-)

## Demo Page
https://cubmic.ch/drag-master/

## Drag Directive
template:
```
<item v-drag="dragDefs" />
```

data:
```
dragDefs: {
    parent: () => this.$el,
    data: dragData,
    lockY: true,
    onStart: (data) => {
        // callback
    },
    onDrag: (data) => {
        // callback
    },
    onEnd: (data) => {
        // callback
    }
}
```
* parent: dom element target as func callback. drag object will be appended to that during drag
* data: will be flow back in the callbacks as data.dragData
* lockX/Y: drag only on x/y axis possible

## Drop Directive

template:
```
<item v-drop="dropDefs" />
```

data:
```
dropDefs: {
    data: dropData, // data will be flow back in the callbacks as data.dropData
    placeholder: true,
    onStart: (data) => {
        // callback <- drag start for every v-drop directive items
    },
    onDrag: (data) => {
        // callback <- drag for every v-drop directive items
    },
    onEnd: (data) => {
        // callback <- drag end for every v-drop directive items
    },
    onEnter: (data) => {
        // callback <- drag enter only for this item
    },
    onMove: (data) => {
        // callback <- drag over only for this item
    },
    onLeave: (data) => {
        // callback <- drag leave only for this item
    },
    onDrop: (data) => {
        // callback <- drag end over only for this item
    }
}
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
