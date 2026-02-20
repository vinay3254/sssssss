# Table Resize Drag Fix

## Problem
When inserting a table into a slide and attempting to resize it by dragging the resize handles, the resize functionality was not working. Users could not adjust the table size despite seeing the blue resize handles around the table.

## Root Cause
The resize handles for tables were missing the `pointer-events-auto` CSS class. The parent table container had `pointer-events-none` applied, which blocked all mouse events from reaching child elements. Without explicit `pointer-events-auto` on the resize handles, mouse events couldn't be received by them, making the resize functionality non-functional.

### Original Code (Non-functional):
```jsx
{element.type === 'table' && (
  <div className="w-full h-full border-2 border-gray-400 bg-white rounded overflow-hidden relative group pointer-events-none">
    {selectedElement === element.id && (
      <>
        {/* Resize handles WITHOUT pointer-events-auto */}
        <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize" 
             style={{ left: -6, top: -6 }} 
             onMouseDown={(e) => startResize(e, element, 'nw')} 
             title="Resize" />
        {/* ... more handles without pointer-events-auto ... */}
      </>
    )}
    <table className="w-full h-full border-collapse table-fixed pointer-events-auto">
      {/* table content */}
    </table>
  </div>
)}
```

## Solution
Added `pointer-events-auto` class to all 8 resize handles so they can receive mouse events even though the parent container has `pointer-events-none`.

### Fixed Code:
```jsx
{element.type === 'table' && (
  <div className="w-full h-full border-2 border-gray-400 bg-white rounded overflow-hidden relative group pointer-events-none">
    {selectedElement === element.id && (
      <>
        {/* Resize handles WITH pointer-events-auto */}
        <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize pointer-events-auto" 
             style={{ left: -6, top: -6 }} 
             onMouseDown={(e) => startResize(e, element, 'nw')} 
             title="Resize" />
        <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize pointer-events-auto" 
             style={{ left: '50%', top: -6, transform: 'translateX(-50%)' }} 
             onMouseDown={(e) => startResize(e, element, 'n')} 
             title="Resize" />
        <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize pointer-events-auto" 
             style={{ right: -6, top: -6 }} 
             onMouseDown={(e) => startResize(e, element, 'ne')} 
             title="Resize" />
        <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize pointer-events-auto" 
             style={{ left: -6, top: '50%', transform: 'translateY(-50%)' }} 
             onMouseDown={(e) => startResize(e, element, 'w')} 
             title="Resize" />
        <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize pointer-events-auto" 
             style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }} 
             onMouseDown={(e) => startResize(e, element, 'e')} 
             title="Resize" />
        <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize pointer-events-auto" 
             style={{ left: -6, bottom: -6 }} 
             onMouseDown={(e) => startResize(e, element, 'sw')} 
             title="Resize" />
        <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize pointer-events-auto" 
             style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)' }} 
             onMouseDown={(e) => startResize(e, element, 's')} 
             title="Resize" />
        <div className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize pointer-events-auto" 
             style={{ right: -6, bottom: -6 }} 
             onMouseDown={(e) => startResize(e, element, 'se')} 
             title="Resize" />
      </>
    )}
    <table className="w-full h-full border-collapse table-fixed pointer-events-auto">
      {/* table content */}
    </table>
  </div>
)}
```

## File Modified
- **`client/src/components/SlideEditor.jsx`** (lines 1027-1033)
  - Added `pointer-events-auto` class to all 8 resize handles

## Why This Works

### CSS Pointer Events Inheritance
The parent div has `pointer-events-none` which blocks all mouse events from reaching the table and its children. However, when you explicitly set `pointer-events-auto` on child elements, it overrides the parent's setting and allows those specific elements to receive mouse events again.

### The 8 Resize Handles
Each resize handle:
- Is positioned absolutely relative to the table container
- Has a blue circular appearance with white border (3x3px)
- Shows appropriate cursor for resize direction:
  - **Corners** (NW, NE, SW, SE): `cursor-[direction]-resize` for proportional resizing
  - **Edges** (N, S, E, W): `cursor-[direction]-resize` for single-direction resizing
- Now receives `onMouseDown` events via the `startResize()` function
- Can now be dragged to resize the table

### Resize Logic
The existing resize logic in SlideEditor.jsx handles:
1. **Mouse Down** (via `startResize()`): Captures initial mouse position and element dimensions
2. **Mouse Move** (global handler): Calculates new dimensions based on which handle is being dragged
3. **Mouse Up** (global handler): Finalizes the resize operation and stops tracking

### Resize Constraints
- Minimum size: 30px (prevents tables from becoming too small)
- Boundary checking: Prevents negative positions
- All 8 directions work correctly:
  - NW: Resize from top-left (both width and height decrease)
  - NE: Resize from top-right (width increases, height decreases)
  - SW: Resize from bottom-left (width decreases, height increases)
  - SE: Resize from bottom-right (both width and height increase)
  - N: Resize top edge only
  - S: Resize bottom edge only
  - E: Resize right edge only
  - W: Resize left edge only

## Testing Instructions

To verify the fix is working:

1. **Open the application** at http://localhost:5173
2. **Insert a table** into a slide (use the Insert Table button)
3. **Click on the table** to select it
4. **Look for blue circular resize handles** around the table perimeter
5. **Try dragging any resize handle**:
   - Try corner handles for proportional resizing
   - Try edge handles for single-direction resizing
   - Verify the table resizes smoothly in the expected direction
6. **Edit table content**: Click on any cell to edit its text
7. **Verify styling buttons** work above the table (color themes)
8. **Click the move handle** (⊕ symbol) at top-left to move the table

## Expected Behavior After Fix

✅ All 8 resize handles are visible when table is selected  
✅ Mouse cursor changes to appropriate resize cursor when hovering over handles  
✅ Dragging any handle resizes the table smoothly  
✅ Table content remains editable  
✅ Color theme buttons continue to work  
✅ Move functionality (⊕ handle) works correctly  
✅ No mouse events are blocked  

## Related Features

- **Move**: Click and drag the blue circle (⊕) at top-left to move the table anywhere on the slide
- **Edit**: Click on any cell to edit its content, use Tab to move to next cell
- **Styling**: Use the color buttons above the table to change its theme (Blue, Green, Orange, Purple, Red, Gray)
- **Delete**: Right-click and select delete, or press Delete key when table is selected
- **Keyboard Navigation**: Use Tab to move forward through cells, Shift+Tab to move backward

## Browser Compatibility

This fix uses standard CSS `pointer-events` which is supported in all modern browsers:
- Chrome/Edge 26+
- Firefox 3.6+
- Safari 4+
- Opera 11.6+
