enum AndroidKeyEventActionType {
  /** The key has been pressed down. See android.view.KeyEvent.ACTION_DOWN. */
  ACTION_DOWN = 0,

  /** The key has been released. See android.view.KeyEvent.ACTION_UP. */
  ACTION_UP = 1,

  /** The key has been pressed and released. */
  ACTION_DOWN_AND_UP = 8,
}
export { AndroidKeyEventActionType };
