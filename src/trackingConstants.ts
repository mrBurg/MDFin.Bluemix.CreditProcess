export enum EGlobalEvent {
  SELECT_START = 'onselectstart',
  SELECTION_CHANGE = 'onselectionchange',
  // CONTROL_SELECT = 'oncontrolselect',
}

export enum EWidgetEvent {
  AFTER_CHANGE = 'onAfterChange',
  // CALENDAR_CLOSE = 'onCalendarClose',
  // CALENDAR_OPEN = 'onCalendarOpen',
  // CLICK_OUTSIDE = 'onClickOutside',
  // INPUT_CLICK = 'onInputClick',
  // INPUT_ERROR = 'onInputError',
  // MONTH_CHANGE = 'onMonthChange',
  // YEAR_CHANGE = 'onYearChange',
}

export enum ETrackingActions {
  EVENTS = 'events',
  PAGES = 'pages',
  COMMON = 'common',
  ENTER = 'Enter',
  // PAGE_NAVIGATION = 'PageNavigation',
}

export enum EResourceEvents {
  BEFORE_UNLOAD = 'beforeunload',
}

export enum EFocusEvents {
  FOCUS = 'onFocus',
  BLUR = 'onBlur',
}

export enum ECommonEvents {}
// ERROR = 'onError',
// LOAD = 'onLoad',

export enum ECSSAnimationEvents {}
// ANIMATION_START = 'onAnimationStart',
// ANIMATION_END = 'onAnimationEnd',
// ANIMATION_ITERATION = 'onAnimationIteration',

export enum ECSSTransitionEvents {}
// TRANSITION_END = 'onTransitionEnd',

export enum EFormEvents {
  // RESET = 'onReset',
  // SUBMIT = 'onSubmit',
  CHANGE = 'onChange',
  // INPUT = 'onInput',
  // INVALID = 'onInvalid',
  // SELECT = 'onSelect',
}

export enum EKeyboardEvents {
  // KEY_DOWN = 'onKeyDown',
  KEY_PRESS = 'onKeyPress',
  KEY_UP = 'onKeyUp',
}

export enum EMouseEvents {
  CLICK = 'onClick',
  // CONTEXT_MENU = 'onContextMenu',
  // DOUBLE_CLICK = 'onDoubleClick',
  // DRAG = 'onDrag',
  // DRAG_END = 'onDragEnd',
  // DRAG_ENTER = 'onDragEnter',
  // DRAG_EXIT = 'onDragExit',
  // DRAG_LEAVE = 'onDragLeave',
  // DRAG_OVER = 'onDragOver',
  // DRAG_START = 'onDragStart',
  // DROP = 'onDrop',
  // MOUSE_DOWN = 'onMouseDown',
  // MOUSE_ENTER = 'onMouseEnter',
  // MOUSE_LEAVE = 'onMouseLeave',
  // MOUSE_MOVE = 'onMouseMove',
  // MOUSE_OUT = 'onMouseOut',
  // MOUSE_OVER = 'onMouseOver',
  // MOUSE_UP = 'onMouseUp',
  // WHEEL = 'onWheel',
}

export enum EUIEvents {
  SCROLL = 'onScroll',
}

export enum ESelectionEvents {}
// SELECT = 'select',

export enum EDOMMutationEvents {}
// DOM_CONTENT_LOADED = 'DOMContentLoaded',

export enum ETouchEvents {
  // TOUCH_CANCEL = 'onTouchCancel',
  // TOUCH_END = 'onTouchEnd',
  // TOUCH_MOVE = 'onTouchMove',
  TOUCH_START = 'onTouchStart',
}

export const requiredData = ['value', 'role', 'text'];
