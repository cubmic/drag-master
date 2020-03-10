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

## Data Flow

You can forward the data to the directive as function
```
<li
    v-for="item in list.items"
    :key="item.id"
    v-drag="dragDefs(item)"
    :style="'background: #' + list.color"
>
```

the defs as function
```
dragDefs: (dragData) => {
    return {
        data: dragData,
        ...
    }
}
```

then you can use it in every event function
```
onDrop: (data) => {
    console.log(data.dragData)
}
```

Also the drop
```
<ul v-drop="dropDefs(list)">
```
give you the:
* data.oldParentData = data from the old parent
* data.startIndex = start index in the old parent
* data.dropData = date from the new parent
* data.endIndex = end index in the new parent

to change the data then:
```
onDrop: (data) => {
    data.oldParentData.items.splice(data.startIndex, 1)
    data.dropData.items.splice(data.endIndex, 0, data.dragData)
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
