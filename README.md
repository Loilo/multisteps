# multisteps
Minimal content "slider" for jQuery. Uses CSS3 animations only, falls back to pure CSS `display`.

## Usage

Easy.

1. Include `multisteps.js` and `multisteps.css` in your page.

2. Create a DOM structure like this:
    ```html
<div id="slider">
    <div class="step">First step</div>
    <div class="step">Second step</div>
    <div class="step">Third step</div>
</div>
```

3. Initialize:
    ```javascript
$( '#slider' ).multisteps( options );
```

## Options

You may provide the following options. (Changing them afterwards is not possible at the moment.)

### start
The index or id of the starting step.

Default: `0`

### loop
Calling "next" on the last step returns to the first one.

Default: `false`

### orientation
Changing this to "horizontal" won't restrict the container's height.

Default: `vertical`

### animateIn
The name of the CSS3 class for a showing up step. The default is provided in the `multisteps.css`.

Default: `fadeInUp`

### animateOut
The name of the CSS3 class for a closing step. The default is provided in the `multisteps.css`.

Default: `fadeOutUp`

### onChange
A callback function triggered at the moment the command for a step change comes in.

Default: `function () {}`

### onAfterChange
A callback function triggered at the moment a step change completes.

Default: `function () {}`

## Methods

Use the following methods like this:
```javascript
$( '#slider' ).multisteps( methodName, arguments... );
```

### current()
Returns a jQuery collection containing the currently active step.

### currentIndex()
Returns the index of the currently active step.

### hasPrev()
If there is a previous step. Returns `false` if the first step is active, even if `loop: true`.

### hasNext()
If there is a next step. Returns `false` if the last step is active, even if `loop: true`.

### prev()
Shows the previous step.

### next()
Shows the next step.

### first()
Shows the first step.

### last()
Shows the last step.

### goto( to )
Shows the step with the index / id `to`.

### refresh()
Recalculates the height of the container. Automatically called after step change. `orientation: vertical` only.

