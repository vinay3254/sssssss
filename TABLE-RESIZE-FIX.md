# Table Resize Fix

## Problem
When inserting a table in the slide, users were unable to control its size - the resize handles were not working properly.

## Root Cause
The resize handles for tables were incorrectly wrapped in an extra `<div>` container with positioning that prevented them from being properly positioned around the table element.

### Original Code (Incorrect):
```jsx
{/* Resize handles for table */}
<div className="absolute -top-6 left-0 flex gap-1 z-10">
  <div className="absolute w-3 h-3 bg-blue-500 border border-white cursor-nw-resize" 
       style={{ left: -6, top: -6 }} 
       onMouseDown={(e) => startResize(e, element, 'nw')} />
  {/* ... more handles ... */}
</div>
```

The outer `<div>` with `absolute -top-6 left-0` was causing all resize handles to be positioned incorrectly relative to the table.

## Solution
Removed the wrapper div and positioned each resize handle directly as absolute elements relative to the table container.

### Fixed Code:
```jsx
{/* Resize handles for table */}
<div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize" 
     style={{ left: -6, top: -6 }} 
     onMouseDown={(e) => startResize(e, element, 'nw')} 
     title="Resize" />
{/* ... more handles positioned correctly ... */}
```

## File Modified
- **`ppt7/client/src/components/SlideEditor.jsx`** (lines 901-911)

## How It Works Now

### Resize Handle Positions
The table now has 8 resize handles positioned correctly:
- **Corners**: NW, NE, SW, SE (for proportional resizing)
- **Edges**: N, S, E, W (for single-direction resizing)

Each handle:
- Is positioned absolutely relative to the table container
- Has a blue circular appearance with white border
- Shows appropriate cursor (nw-resize, n-resize, etc.)
- Triggers the `startResize()` function on mouse down

### Resize Logic
The existing resize logic in the `useEffect` hook (lines 76-150) handles:
1. **Mouse Down**: Captures initial position and dimensions
2. **Mouse Move**: Calculates new dimensions based on handle and mouse movement
3. **Mouse Up**: Finalizes the resize operation

### Resize Constraints
- Minimum size: 20px (prevents tables from becoming too small)
- Boundary checking: Prevents negative positions
- Maintains table structure while resizing

## Benefits
✅ Tables can now be resized properly
✅ All 8 resize handles work correctly
✅ Visual feedback with rounded blue handles
✅ Proper cursor indicators for each resize direction
✅ Smooth resizing experience

## Testing
To verify the fix:
1. Insert a table into a slide
2. Click on the table to select it
3. You should see 8 blue circular resize handles around the table
4. Drag any handle to resize the table
5. Verify the table resizes smoothly in the expected direction

## Related Features
- **Move**: Click and drag the blue circle at top-left to move the table
- **Edit**: Click on any cell to edit its content
- **Theme**: Use the color buttons above the table to change its theme
- **Delete**: Right-click and select delete, or press Delete key when selected
