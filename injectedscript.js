/*
 * innerscript.js
 */

/*===========================*/
/* Google dependent variable */
/*===========================*/
var DOWN_ARROW_FUNC= "(0, _.fU)(true, true);";
var UP_ARROW_FUNC = "(0, _.fU)(false, true);";


/*==========*/
/* function */
/*==========*/
function simulateDownArrowKey() {
  eval(DOWN_ARROW_FUNC);
}

function simulateUpArrowKey() {
  eval(UP_ARROW_FUNC);
}

function movePtrNTimes(req) {
  if (req.isDown) {
    for (var i = 0; i < req.numOfTimes; i++) {
      simulateDownArrowKey();
    }
  } else {
    for (var i = 0; i < req.numOfTimes; i++) {
      simulateUpArrowKey();
    }
  }
}
