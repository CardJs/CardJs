CardJs.prototype.constructor = CardJs ;


/**
 * @class CardJs
 *
 * @author Colin Stannard
 *
 * @param elem
 * @constructor
 */
function CardJs(elem) {
  this.elem = jQuery(elem);

  this.captureName = this.elem.data("capture-name") ? this.elem.data("capture-name") : false;
  this.iconColour = this.elem.data("icon-colour") ? this.elem.data("icon-colour") : false;
  this.stripe = this.elem.data("stripe") ? this.elem.data("stripe") : false;

  if(this.stripe) {
    this.captureName = false;
  }

  // Initialise
  this.initCardNumberInput();
  this.initNameInput();
  this.initExpiryMonthInput();
  this.initExpiryYearInput();
  this.initCvcInput();


  this.elem.empty();


  // Setup display
  this.setupCardNumberInput();
  this.setupNameInput();
  this.setupExpiryInput();
  this.setupCvcInput();


  // Set icon colour
  if(this.iconColour) {
    this.setIconColour(this.iconColour);
  }

  // --- --- --- --- --- --- --- --- --- ---

  this.refreshCreditCardTypeIcon();

}


CardJs.KEYS = {
  "0" : 48,
  "9" : 57,
  "NUMPAD_0" : 96,
  "NUMPAD_9" : 105,
  "DELETE" : 46,
  "BACKSPACE" : 8,
  "ARROW_LEFT" : 37,
  "ARROW_RIGHT" : 39,
  "ARROW_UP" : 38,
  "ARROW_DOWN" : 40,
  "HOME" : 36,
  "END" : 35,
  "TAB" : 9,
  "A" : 65,
  "X" : 88,
  "C" : 67,
  "V" : 86
};




CardJs.CREDIT_CARD_NUMBER_DEFAULT_MASK    = "XXXX XXXX XXXX XXXX";
CardJs.CREDIT_CARD_NUMBER_VISA_MASK       = "XXXX XXXX XXXX XXXX";
CardJs.CREDIT_CARD_NUMBER_MASTERCARD_MASK = "XXXX XXXX XXXX XXXX";
CardJs.CREDIT_CARD_NUMBER_DISCOVER_MASK   = "XXXX XXXX XXXX XXXX";
CardJs.CREDIT_CARD_NUMBER_JCB_MASK        = "XXXX XXXX XXXX XXXX";
CardJs.CREDIT_CARD_NUMBER_AMEX_MASK       = "XXXX XXXXXX XXXXX";
CardJs.CREDIT_CARD_NUMBER_DINERS_MASK     = "XXXX XXXX XXXX XX";

CardJs.prototype.creditCardNumberMask = CardJs.CREDIT_CARD_NUMBER_DEFAULT_MASK;
CardJs.CREDIT_CARD_NUMBER_PLACEHOLDER = "Card number";
CardJs.NAME_PLACEHOLDER =  "Name on card";
CardJs.EXPIRY_MASK = "XX / XX";
CardJs.EXPIRY_PLACEHOLDER = "MM / YY";
CardJs.EXPIRY_USE_DROPDOWNS = false;
CardJs.EXPIRY_NUMBER_OF_YEARS = 10;
CardJs.CVC_MASK_3 = "XXX";
CardJs.CVC_MASK_4 = "XXXX";
CardJs.CVC_PLACEHOLDER =  "CVC";




CardJs.CREDIT_CARD_SVG = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
  'x="0px" y="3px" width="24px" height="17px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve">' +
  '<g><path class="svg" d="M182.385,14.258c-2.553-2.553-5.621-3.829-9.205-3.829H42.821c-3.585,0-6.653,1.276-9.207,3.829' +
  'c-2.553,2.553-3.829,5.621-3.829,9.206v99.071c0,3.585,1.276,6.654,3.829,9.207c2.554,2.553,5.622,3.829,9.207,3.829H173.18' +
  'c3.584,0,6.652-1.276,9.205-3.829s3.83-5.622,3.83-9.207V23.464C186.215,19.879,184.938,16.811,182.385,14.258z M175.785,122.536' +
  'c0,0.707-0.258,1.317-0.773,1.834c-0.516,0.515-1.127,0.772-1.832,0.772H42.821c-0.706,0-1.317-0.258-1.833-0.773' +
  'c-0.516-0.518-0.774-1.127-0.774-1.834V73h135.571V122.536z M175.785,41.713H40.214v-18.25c0-0.706,0.257-1.316,0.774-1.833' +
  'c0.516-0.515,1.127-0.773,1.833-0.773H173.18c0.705,0,1.316,0.257,1.832,0.773c0.516,0.517,0.773,1.127,0.773,1.833V41.713z"/>' +
  '<rect class="svg" x="50.643" y="104.285" width="20.857" height="10.429"/>' +
  '<rect class="svg" x="81.929" y="104.285" width="31.286" height="10.429"/>'+
  '</g></svg>';


CardJs.LOCK_SVG = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
  'x="0px" y="3px" width="24px" height="17px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve">' +
  '<path class="svg" d="M152.646,70.067c-1.521-1.521-3.367-2.281-5.541-2.281H144.5V52.142c0-9.994-3.585-18.575-10.754-25.745' +
  'c-7.17-7.17-15.751-10.755-25.746-10.755s-18.577,3.585-25.746,10.755C75.084,33.567,71.5,42.148,71.5,52.142v15.644' +
  'h-2.607c-2.172,0-4.019,0.76-5.54,2.281c-1.521,1.52-2.281,3.367-2.281,5.541v46.929c0,2.172,0.76,4.019,2.281,5.54' +
  'c1.521,1.52,3.368,2.281,5.54,2.281h78.214c2.174,0,4.02-0.76,5.541-2.281c1.52-1.521,2.281-3.368,2.281-5.54V75.607' +
  'C154.93,73.435,154.168,71.588,152.646,70.067z M128.857,67.786H87.143V52.142c0-5.757,2.037-10.673,6.111-14.746' +
  'c4.074-4.074,8.989-6.11,14.747-6.11s10.673,2.036,14.746,6.11c4.073,4.073,6.11,8.989,6.11,14.746V67.786z"/></svg>';


CardJs.CALENDAR_SVG = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
  'x="0px" y="4px" width="24px" height="16px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve">' +
  '<path class="svg" d="M172.691,23.953c-2.062-2.064-4.508-3.096-7.332-3.096h-10.428v-7.822c0-3.584-1.277-6.653-3.83-9.206' +
  'c-2.554-2.553-5.621-3.83-9.207-3.83h-5.213c-3.586,0-6.654,1.277-9.207,3.83c-2.554,2.553-3.83,5.622-3.83,9.206' +
  'v7.822H92.359v-7.822c0-3.584-1.277-6.653-3.83-9.206c-2.553-2.553-5.622-3.83-9.207-3.83h-5.214c-3.585,0-6.654,' +
  '1.277-9.207,3.83c-2.553,2.553-3.83,5.622-3.83,9.206v7.822H50.643c-2.825,0-5.269,1.032-7.333,3.096s-3.096,' +
  '4.509-3.096,7.333v104.287c0,2.823,1.032,5.267,3.096,7.332c2.064,2.064,4.508,3.096,7.333,3.096h114.714c2.824,0,' +
  '5.27-1.032,7.332-3.096c2.064-2.064,3.096-4.509,3.096-7.332V31.286C175.785,28.461,174.754,26.017,172.691,23.953z ' +
  'M134.073,13.036c0-0.761,0.243-1.386,0.731-1.874c0.488-0.488,1.113-0.733,1.875-0.733h5.213c0.762,0,1.385,0.244,' +
  '1.875,0.733c0.488,0.489,0.732,1.114,0.732,1.874V36.5c0,0.761-0.244,1.385-0.732,1.874c-0.49,0.488-1.113,' +
  '0.733-1.875,0.733h-5.213c-0.762,0-1.387-0.244-1.875-0.733s-0.731-1.113-0.731-1.874V13.036z M71.501,13.036' +
  'c0-0.761,0.244-1.386,0.733-1.874c0.489-0.488,1.113-0.733,1.874-0.733h5.214c0.761,0,1.386,0.244,1.874,0.733' +
  'c0.488,0.489,0.733,1.114,0.733,1.874V36.5c0,0.761-0.244,1.386-0.733,1.874c-0.489,0.488-1.113,0.733-1.874,0.733' +
  'h-5.214c-0.761,0-1.386-0.244-1.874-0.733c-0.488-0.489-0.733-1.113-0.733-1.874V13.036z M165.357,135.572H50.643' +
  'V52.143h114.714V135.572z"/></svg>';


CardJs.USER_SVG = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
  'x="0px" y="4px" width="24px" height="16px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve">' +
  '<g><path class="svg" d="M107.999,73c8.638,0,16.011-3.056,22.12-9.166c6.111-6.11,9.166-13.483,9.166-22.12c0-' +
  '8.636-3.055-16.009-9.166-22.12c-6.11-6.11-13.484-9.165-22.12-9.165c-8.636,0-16.01,3.055-22.12,9.165c-6.111,' +
  '6.111-9.166,13.484-9.166,22.12c0,8.637,3.055,16.01,9.166,22.12C91.99,69.944,99.363,73,107.999,73z"/>' +
  '<path class="svg" d="M165.07,106.037c-0.191-2.743-0.571-5.703-1.141-8.881c-0.57-3.178-1.291-6.124-2.16-8.84' +
  'c-0.869-2.715-2.037-5.363-3.504-7.943c-1.466-2.58-3.15-4.78-5.052-6.6s-4.223-3.272-6.965-4.358c-2.744-1.086' +
  '-5.772-1.63-9.085-1.63c-0.489,0-1.63,0.584-3.422,1.752s-3.815,2.472-6.069,3.911c-2.254,1.438-5.188,2.743-8.' +
  '799,3.909c-3.612,1.168-7.237,1.752-10.877,1.752c-3.639,0-7.264-0.584-10.876-1.752c-3.611-1.166-6.545-2.471-' +
  '8.799-3.909c-2.254-1.439-4.277-2.743-6.069-3.911c-1.793-1.168-2.933-1.752-3.422-1.752c-3.313,0-6.341,0.544-' +
  '9.084,1.63s-5.065,2.539-6.966,4.358c-1.901,1.82-3.585,4.02-5.051,6.6s-2.634,5.229-3.503,7.943c-0.869,2.716-' +
  '1.589,5.662-2.159,8.84c-0.571,3.178-0.951,6.137-1.141,8.881c-0.19,2.744-0.285,5.554-0.285,8.433c0,6.517,1.9' +
  '83,11.664,5.948,15.439c3.965,3.774,9.234,5.661,15.806,5.661h71.208c6.572,0,11.84-1.887,15.806-5.661c3.966-3' +
  '.775,5.948-8.921,5.948-15.439C165.357,111.591,165.262,108.78,165.07,106.037z"/></g></svg>';


CardJs.MAIL_SVG = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
  'x="0px" y="4px" width="24px" height="16px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve">' +
  '<path class="svg" d="M177.171,19.472c-2.553-2.553-5.622-3.829-9.206-3.829H48.036c-3.585,0-6.654,1.276-9.207,3.829C36.276,' +
  '22.025,35,25.094,35,28.679v88.644c0,3.585,1.276,6.652,3.829,9.205c2.553,2.555,5.622,3.83,9.207,3.83h119.929c3' +
  '.584,0,6.653-1.275,9.206-3.83c2.554-2.553,3.829-5.621,3.829-9.205V28.679C181,25.094,179.725,22.025,177.171,19' +
  '.472zM170.57,117.321c0,0.706-0.258,1.317-0.774,1.833s-1.127,0.773-1.832,0.773H48.035c-0.706,0-1.317-0.257-1.8' +
  '33-0.773c-0.516-0.516-0.774-1.127-0.774-1.833V54.75c1.738,1.955,3.612,3.748,5.622,5.377c14.557,11.189,26.126,' +
  '20.368,34.708,27.538c2.77,2.336,5.024,4.155,6.762,5.459s4.087,2.62,7.047,3.951s5.744,1.995,8.351,1.995H108h0.' +
  '081c2.606,0,5.392-0.664,8.351-1.995c2.961-1.331,5.311-2.647,7.049-3.951c1.737-1.304,3.992-3.123,6.762-5.459c8' +
  '.582-7.17,20.15-16.349,34.707-27.538c2.01-1.629,3.885-3.422,5.621-5.377V117.321z M170.57,30.797v0.896c0,3.204' +
  '-1.262,6.776-3.787,10.713c-2.525,3.938-5.256,7.075-8.188,9.41c-10.484,8.257-21.373,16.865-32.672,25.827c-0.32' +
  '6,0.271-1.277,1.073-2.852,2.403c-1.574,1.331-2.824,2.351-3.748,3.056c-0.924,0.707-2.131,1.562-3.625,2.566s-2.' +
  '865,1.752-4.114,2.24s-2.417,0.732-3.503,0.732H108h-0.082c-1.086,0-2.253-0.244-3.503-0.732c-1.249-0.488-2.621-' +
  '1.236-4.114-2.24c-1.493-1.004-2.702-1.859-3.625-2.566c-0.923-0.705-2.173-1.725-3.748-3.056c-1.575-1.33-2.526-' +
  '2.132-2.852-2.403c-11.297-8.962-22.187-17.57-32.67-25.827c-7.985-6.3-11.977-14.013-11.977-23.138c0-0.706,0.25' +
  '8-1.317,0.774-1.833c0.516-0.516,1.127-0.774,1.833-0.774h119.929c0.434,0.244,0.814,0.312,1.141,0.204c0.326-0.1' +
  '1,0.57,0.094,0.732,0.61c0.163,0.516,0.312,0.76,0.448,0.733c0.136-0.027,0.218,0.312,0.245,1.019c0.025,0.706,0.' +
  '039,1.061,0.039,1.061V30.797z"/></svg>';


CardJs.INFORMATION_SVG = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
  'x="0px" y="4px" width="24px" height="16px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve">' +
  '<g><path class="svg" d="M97.571,41.714h20.859c1.411,0,2.633-0.516,3.666-1.548c1.031-1.031,1.547-2.254,1.547-' +
  '3.666V20.857c0-1.412-0.516-2.634-1.549-3.667c-1.031-1.031-2.254-1.548-3.666-1.548H97.571c-1.412,0-2.634,0.51' +
  '7-3.666,1.548c-1.032,1.032-1.548,2.255-1.548,3.667V36.5c0,1.412,0.516,2.635,1.548,3.666C94.937,41.198,96.159' +
  ',41.714,97.571,41.714z"/><path class="svg" d="M132.523,111.048c-1.031-1.032-2.254-1.548-3.666-1.548h-5.215V6' +
  '2.571c0-1.412-0.516-2.634-1.547-3.666c-1.033-1.032-2.255-1.548-3.666-1.548H87.143c-1.412,0-2.634,0.516-3.666' +
  ',1.548c-1.032,1.032-1.548,2.254-1.548,3.666V73c0,1.412,0.516,2.635,1.548,3.666c1.032,1.032,2.254,1.548,3.666' +
  ',1.548h5.215V109.5h-5.215c-1.412,0-2.634,0.516-3.666,1.548c-1.032,1.032-1.548,2.254-1.548,3.666v10.429c0,1.4' +
  '12,0.516,2.635,1.548,3.668c1.032,1.03,2.254,1.547,3.666,1.547h41.714c1.412,0,2.634-0.517,3.666-1.547c1.031-1' +
  '.033,1.547-2.256,1.547-3.668v-10.429C134.07,113.302,133.557,112.08,132.523,111.048z"/></g></svg>';


/**
 * Get the key code from the given event.
 *
 * @param e
 * @returns {which|*|Object|which|which|string}
 */
CardJs.keyCodeFromEvent = function(e) {
  return e.which || e.keyCode;
};


/**
 * Get whether a command key (ctrl of mac cmd) is held down.
 *
 * @param e
 * @returns {boolean|metaKey|*|metaKey}
 */
CardJs.keyIsCommandFromEvent = function(e) {
  return e.ctrlKey || e.metaKey;
};


/**
 * Is the event a number key.
 *
 * @param e
 * @returns {boolean}
 */
CardJs.keyIsNumber = function(e) {
  return CardJs.keyIsTopNumber(e) || CardJs.keyIsKeypadNumber(e);
};


/**
 * Is the event a top keyboard number key.
 *
 * @param e
 * @returns {boolean}
 */
CardJs.keyIsTopNumber = function(e) {
  var keyCode = CardJs.keyCodeFromEvent(e);
  return keyCode >= CardJs.KEYS["0"] && keyCode <= CardJs.KEYS["9"];
};


/**
 * Is the event a keypad number key.
 *
 * @param e
 * @returns {boolean}
 */
CardJs.keyIsKeypadNumber = function(e) {
  var keyCode = CardJs.keyCodeFromEvent(e);
  return keyCode >= CardJs.KEYS["NUMPAD_0"] && keyCode <= CardJs.KEYS["NUMPAD_9"];
};


/**
 * Is the event a delete key.
 *
 * @param e
 * @returns {boolean}
 */
CardJs.keyIsDelete = function(e) {
  return CardJs.keyCodeFromEvent(e) == CardJs.KEYS["DELETE"];
};


/**
 * Is the event a backspace key.
 *
 * @param e
 * @returns {boolean}
 */
CardJs.keyIsBackspace = function(e) {
  return CardJs.keyCodeFromEvent(e) == CardJs.KEYS["BACKSPACE"];
};


/**
 * Is the event a deletion key (delete or backspace)
 *
 * @param e
 * @returns {boolean}
 */
CardJs.keyIsDeletion = function(e) {
  return CardJs.keyIsDelete(e) || CardJs.keyIsBackspace(e);
};


/**
 * Is the event an arrow key.
 *
 * @param e
 * @returns {boolean}
 */
CardJs.keyIsArrow = function(e) {
  var keyCode = CardJs.keyCodeFromEvent(e);
  return keyCode >= CardJs.KEYS["ARROW_LEFT"] && keyCode <= CardJs.KEYS["ARROW_DOWN"];
};


/**
 * Is the event a navigation key.
 *
 * @param e
 * @returns {boolean}
 */
CardJs.keyIsNavigation = function(e) {
  var keyCode = CardJs.keyCodeFromEvent(e);
  return keyCode == CardJs.KEYS["HOME"] || keyCode == CardJs.KEYS["END"];
};


/**
 * Is the event a keyboard command (copy, paste, cut, highlight all)
 *
 * @param e
 * @returns {boolean|metaKey|*|metaKey|boolean}
 */
CardJs.keyIsKeyboardCommand = function(e) {
  var keyCode = CardJs.keyCodeFromEvent(e);
  return CardJs.keyIsCommandFromEvent(e) &&
    (
      keyCode == CardJs.KEYS["A"] ||
      keyCode == CardJs.KEYS["X"] ||
      keyCode == CardJs.KEYS["C"] ||
      keyCode == CardJs.KEYS["V"]
    );
};


/**
 * Is the event the tab key?
 *
 * @param e
 * @returns {boolean}
 */
CardJs.keyIsTab = function(e) {
  return CardJs.keyCodeFromEvent(e) == CardJs.KEYS["TAB"];
};


/**
 * Copy all attributes of the source element to the destination element.
 *
 * @param source
 * @param destination
 */
CardJs.copyAllElementAttributes = function(source, destination) {
  $.each(source[0].attributes, function(idx, attr) {
    destination.attr(attr.nodeName, attr.nodeValue);
  });
};


/**
 * Strip all characters that are not in the range 0-9
 *
 * @param string
 * @returns {string}
 */
CardJs.numbersOnlyString = function(string) {
  var numbersOnlyString = "";
  for(var i = 0; i < string.length; i++) {
    var currentChar = string.charAt(i);
    var isValid = !isNaN(parseInt(currentChar));
    if(isValid) { numbersOnlyString += currentChar; }
  }
  return numbersOnlyString;
};


/**
 * Apply a format mask to the given string
 *
 * @param string
 * @param mask
 * @returns {string}
 */
CardJs.applyFormatMask = function(string, mask) {
  var formattedString = "";
  var numberPos = 0;
  for(var j = 0; j < mask.length; j++) {
    var currentMaskChar = mask[j];
    if(currentMaskChar == "X") {
      var digit = string.charAt(numberPos);
      if(!digit) {
        break;
      }
      formattedString += string.charAt(numberPos);
      numberPos++;
    } else {
      formattedString += currentMaskChar;
    }
  }
  return formattedString;
};



/**
 * Establish the type of a card from the number.
 *
 * @param number
 * @returns {string}
 */
CardJs.cardTypeFromNumber = function(number) {

  // Diners - Carte Blanche
  re = new RegExp("^30[0-5]");
  if (number.match(re) != null)
    return "Diners - Carte Blanche";

  // Diners
  re = new RegExp("^(30[6-9]|36|38)");
  if (number.match(re) != null)
    return "Diners";

  // JCB
  re = new RegExp("^35(2[89]|[3-8][0-9])");
  if (number.match(re) != null)
    return "JCB";

  // AMEX
  re = new RegExp("^3[47]");
  if (number.match(re) != null)
    return "AMEX";

  // Visa Electron
  re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
  if (number.match(re) != null)
    return "Visa Electron";

  // Visa
  var re = new RegExp("^4");
  if (number.match(re) != null)
    return "Visa";

  // Mastercard
  re = new RegExp("^5[1-5]");
  if (number.match(re) != null)
    return "Mastercard";

  // Discover
  re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
  if (number.match(re) != null)
    return "Discover";

  return "";
};





/**
 * Get the caret start position of the given element.
 *
 * @param element
 * @returns {*}
 */
CardJs.caretStartPosition = function(element) {
  if(typeof element.selectionStart == "number") {
    return element.selectionStart;
  }
  return false;
};


/**
 * Gte the caret end position of the given element.
 *
 * @param element
 * @returns {*}
 */
CardJs.caretEndPosition = function(element) {
  if(typeof element.selectionEnd == "number") {
    return element.selectionEnd;
  }
  return false;
};


/**
 * Set the caret position of the given element.
 *
 * @param element
 * @param caretPos
 */
CardJs.setCaretPosition = function(element, caretPos) {
  if(element != null) {
    if(element.createTextRange) {
      var range = element.createTextRange();
      range.move('character', caretPos);
      range.select();
    } else {
      if(element.selectionStart) {
        element.focus();
        element.setSelectionRange(caretPos, caretPos);
      } else {
        element.focus();
      }
    }
  }
};


/**
 * Normalise the caret position for the given mask.
 *
 * @param mask
 * @param caretPosition
 * @returns {number}
 */
CardJs.normaliseCaretPosition = function(mask, caretPosition) {
  var numberPos = 0;
  if(caretPosition < 0 || caretPosition > mask.length) { return 0; }
  for(var i = 0; i < mask.length; i++) {
    if(i == caretPosition) { return numberPos; }
    if(mask[i] == "X") { numberPos++; }
  }
  return numberPos;
};


/**
 * Denormalise the caret position for the given mask.
 *
 * @param mask
 * @param caretPosition
 * @returns {*}
 */
CardJs.denormaliseCaretPosition = function(mask, caretPosition) {
  var numberPos = 0;
  if(caretPosition < 0 || caretPosition > mask.length) { return 0; }
  for(var i = 0; i < mask.length; i++) {
    if(numberPos == caretPosition) { return i; }
    if(mask[i] == "X") { numberPos++; }
  }
  return mask.length;
};


/**
 *
 *
 * @param e
 */
CardJs.filterNumberOnlyKey = function(e) {
  var isNumber = CardJs.keyIsNumber(e);
  var isDeletion = CardJs.keyIsDeletion(e);
  var isArrow = CardJs.keyIsArrow(e);
  var isNavigation = CardJs.keyIsNavigation(e);
  var isKeyboardCommand = CardJs.keyIsKeyboardCommand(e);
  var isTab = CardJs.keyIsTab(e);

  if(!isNumber && !isDeletion && !isArrow && !isNavigation && !isKeyboardCommand && !isTab) {
    e.preventDefault();
  }
};


CardJs.digitFromKeyCode = function(keyCode) {

  if(keyCode >= CardJs.KEYS["0"] && keyCode <= CardJs.KEYS["9"]) {
    return keyCode - CardJs.KEYS["0"];
  }

  if(keyCode >= CardJs.KEYS["NUMPAD_0"] && keyCode <= CardJs.KEYS["NUMPAD_9"]) {
    return keyCode - CardJs.KEYS["NUMPAD_0"];
  }

  return null;
};


CardJs.handleMaskedNumberInputKey = function(e, mask) {
  CardJs.filterNumberOnlyKey(e);

  var keyCode = e.which || e.keyCode;

  var element = e.target;

  var caretStart = CardJs.caretStartPosition(element);
  var caretEnd = CardJs.caretEndPosition(element);


  // Calculate normalised caret position
  var normalisedStartCaretPosition = CardJs.normaliseCaretPosition(mask, caretStart);
  var normalisedEndCaretPosition = CardJs.normaliseCaretPosition(mask, caretEnd);


  var newCaretPosition = caretStart;

  var isNumber = CardJs.keyIsNumber(e);
  var isDelete = CardJs.keyIsDelete(e);
  var isBackspace = CardJs.keyIsBackspace(e);

  if(isNumber || isDelete || isBackspace) {
    e.preventDefault();
    var rawText = $(element).val();
    var numbersOnly = CardJs.numbersOnlyString(rawText);

    var digit = CardJs.digitFromKeyCode(keyCode);

    var rangeHighlighted = normalisedEndCaretPosition > normalisedStartCaretPosition;

    // Remove values highlighted (if highlighted)
    if(rangeHighlighted) {
      numbersOnly = (numbersOnly.slice(0, normalisedStartCaretPosition) + numbersOnly.slice(normalisedEndCaretPosition));
    }

    // Forward Action
    if(caretStart != mask.length) {

      // Insert number digit
      if(isNumber && rawText.length <= mask.length) {
        numbersOnly = (numbersOnly.slice(0, normalisedStartCaretPosition) + digit + numbersOnly.slice(normalisedStartCaretPosition));
        newCaretPosition = Math.max(
          CardJs.denormaliseCaretPosition(mask, normalisedStartCaretPosition + 1),
          CardJs.denormaliseCaretPosition(mask, normalisedStartCaretPosition + 2) - 1
        );
      }

      // Delete
      if(isDelete) {
        numbersOnly = (numbersOnly.slice(0, normalisedStartCaretPosition) + numbersOnly.slice(normalisedStartCaretPosition + 1));
      }

    }

    // Backward Action
    if(caretStart != 0) {

      // Backspace
      if(isBackspace && !rangeHighlighted) {
        numbersOnly = (numbersOnly.slice(0, normalisedStartCaretPosition - 1) + numbersOnly.slice(normalisedStartCaretPosition));
        newCaretPosition = CardJs.denormaliseCaretPosition(mask, normalisedStartCaretPosition - 1);
      }
    }


    $(element).val(CardJs.applyFormatMask(numbersOnly, mask));

    CardJs.setCaretPosition(element, newCaretPosition);
  }
};


CardJs.handleCreditCardNumberKey = function(e, cardMask) {
  CardJs.handleMaskedNumberInputKey(e, cardMask);
};


CardJs.handleCreditCardNumberChange = function(e) {

};


CardJs.handleExpiryKey = function(e) {
  CardJs.handleMaskedNumberInputKey(e, CardJs.EXPIRY_MASK);
};


/**
 * Dispatch beacon ~ for future feature.
 */
//CardJs.dispatchBeacon = function() {
//  $.ajax({
//    type: "POST",
//    url: "https://cardjs.co.uk/beacon",
//    data: {
//      uri: window.location.href
//    },
//    crossDomain : true,
//    dataType: 'json'
//  });
//};

//window.onload = function() {
  //CardJs.dispatchBeacon();
//};


/**
 * Get the card number inputted.
 *
 * @returns {string}
 */
CardJs.prototype.getCardNumber = function() {
  return this.cardNumberInput.val();
};


/**
 * Get the type of the card number inputted.
 *
 * @returns {string}
 */
CardJs.prototype.getCardType = function() {
  return CardJs.cardTypeFromNumber(this.getCardNumber());
};


/**
 * Get the name inputted.
 *
 * @returns {string}
 */
CardJs.prototype.getName = function() {
  return this.nameInput.val();
};


/**
 * Get the expiry month inputted.
 *
 * @returns {string}
 */
CardJs.prototype.getExpiryMonth = function() {
  return this.expiryMonthInput.val();
};


/**
 * Get the expiry year inputted.
 *
 * @returns {string}
 */
CardJs.prototype.getExpiryYear = function() {
  return this.expiryYearInput.val();
};


/**
 * Get the CVC number inputted.
 *
 * @returns {number}
 */
CardJs.prototype.getCvc = function() {
  return this.cvcInput.val();
};


// --- --- --- --- --- --- --- --- --- --- ---


/**
 * Set the icon colour.
 *
 * @param colour
 */
CardJs.prototype.setIconColour = function(colour) {
  this.elem.find(".icon .svg").css({"fill": colour});
};


/**
 * Set the icon colour.
 *
 * @param colour
 */
CardJs.prototype.setIconColour = function(colour) {
  this.elem.find(".icon .svg").css({"fill": colour});
};


/**
 *
 */
CardJs.prototype.refreshCreditCardTypeIcon = function() {
  this.setCardTypeIconFromNumber(CardJs.numbersOnlyString(this.cardNumberInput.val()));
};


/**
 *
 */
CardJs.prototype.clearCardTypeIcon = function() {
  this.elem.find(".card-number-wrapper .card-type-icon").removeClass("show");
};

CardJs.prototype.setCardTypeIconAsVisa = function() {
  this.elem.find(".card-number-wrapper .card-type-icon").attr("class", "card-type-icon show visa");
};

CardJs.prototype.setCardTypeIconAsMasterCard = function() {
  this.elem.find(".card-number-wrapper .card-type-icon").attr("class", "card-type-icon show master-card");
};

CardJs.prototype.setCardTypeIconAsAmericanExpress = function() {
  this.elem.find(".card-number-wrapper .card-type-icon").attr("class", "card-type-icon show american-express");
};

CardJs.prototype.setCardTypeIconAsDiscover = function() {
  this.elem.find(".card-number-wrapper .card-type-icon").attr("class", "card-type-icon show discover");
};

CardJs.prototype.setCardTypeIconAsDiners = function() {
  this.elem.find(".card-number-wrapper .card-type-icon").attr("class", "card-type-icon show diners");
};

CardJs.prototype.setCardTypeIconAsJcb = function() {
  this.elem.find(".card-number-wrapper .card-type-icon").attr("class", "card-type-icon show jcb");
};




/**
 * Update the display to set the card type from the current number.
 *
 * @param number
 */
CardJs.prototype.setCardTypeIconFromNumber = function(number) {
  switch(CardJs.cardTypeFromNumber(number)) {
    case "Visa Electron":
    case "Visa":
      this.setCardTypeAsVisa();
      break;
    case "Mastercard":
      this.setCardTypeAsMasterCard();
      break;
    case "AMEX":
      this.setCardTypeAsAmericanExpress();
      break;
    case "Discover":
      this.setCardTypeAsDiscover();
      break;
    case "Diners - Carte Blanche":
    case "Diners":
      this.setCardTypeAsDiners();
      break;
    case "JCB":
      this.setCardTypeAsJcb();
      break;
    default:
      this.clearCardType();
  }
};


CardJs.prototype.setCardMask = function(cardMask) {
  this.creditCardNumberMask = cardMask;
  this.cardNumberInput.attr("maxlength", cardMask.length);
};

CardJs.prototype.setCvc3 = function() {
  this.cvcInput.attr("maxlength", CardJs.CVC_MASK_3.length);
};

CardJs.prototype.setCvc4 = function() {
  this.cvcInput.attr("maxlength", CardJs.CVC_MASK_4.length);
};


// --- --- ---


CardJs.prototype.clearCardType = function() {
  this.clearCardTypeIcon();
  this.setCardMask(CardJs.CREDIT_CARD_NUMBER_DEFAULT_MASK);
  this.setCvc3();
};

CardJs.prototype.setCardTypeAsVisa = function() {
  this.setCardTypeIconAsVisa();
  this.setCardMask(CardJs.CREDIT_CARD_NUMBER_VISA_MASK);
  this.setCvc3();
};

CardJs.prototype.setCardTypeAsMasterCard = function() {
  this.setCardTypeIconAsMasterCard();
  this.setCardMask(CardJs.CREDIT_CARD_NUMBER_MASTERCARD_MASK);
  this.setCvc3();
};

CardJs.prototype.setCardTypeAsAmericanExpress = function() {
  this.setCardTypeIconAsAmericanExpress();
  this.setCardMask(CardJs.CREDIT_CARD_NUMBER_AMEX_MASK);
  this.setCvc4();
};

CardJs.prototype.setCardTypeAsDiscover = function() {
  this.setCardTypeIconAsDiscover();
  this.setCardMask(CardJs.CREDIT_CARD_NUMBER_DISCOVER_MASK);
  this.setCvc3();
};

CardJs.prototype.setCardTypeAsDiners = function() {
  this.setCardTypeIconAsDiners();
  this.setCardMask(CardJs.CREDIT_CARD_NUMBER_DINERS_MASK);
  this.setCvc3();
};

CardJs.prototype.setCardTypeAsJcb = function() {
  this.setCardTypeIconAsJcb();
  this.setCardMask(CardJs.CREDIT_CARD_NUMBER_JCB_MASK);
  this.setCvc3();
};







CardJs.prototype.initCardNumberInput = function() {
  var $this = this;

  this.cardNumberInput = this.elem.find(".card-number");
  if(this.cardNumberInput[0]) {
    this.cardNumberInput.detach();
  } else {
    this.cardNumberInput = $("<input class='card-number' />");
  }

  this.cardNumberInput.attr("type", "tel");
  if(!this.cardNumberInput.attr("placeholder")) {
    this.cardNumberInput.attr("placeholder", CardJs.CREDIT_CARD_NUMBER_PLACEHOLDER);
  }
  this.cardNumberInput.attr("maxlength", this.creditCardNumberMask.length);
  this.cardNumberInput.attr("x-autocompletetype", "cc-number");
  this.cardNumberInput.attr("autocompletetype", "cc-number");
  this.cardNumberInput.attr("autocorrect", "off");
  this.cardNumberInput.attr("spellcheck", "off");
  this.cardNumberInput.attr("autocapitalize", "off");

  this.cardNumberInput.keydown(function(e) {
    CardJs.handleCreditCardNumberKey(e, $this.creditCardNumberMask);
  });
  this.cardNumberInput.keyup(function(e) {
    $this.refreshCreditCardTypeIcon();
  });
  this.cardNumberInput.change(CardJs.handleCreditCardNumberChange);
};



CardJs.prototype.initNameInput = function() {
  this.nameInput = this.elem.find(".name");
  if(this.nameInput[0]) {
    this.captureName = true;
    this.nameInput.detach();
  } else {
    this.nameInput = $("<input class='name' />");
  }

  if(!this.nameInput.attr("placeholder")) {
    this.nameInput.attr("placeholder", CardJs.NAME_PLACEHOLDER);
  }
};


CardJs.prototype.initExpiryMonthInput = function() {
  this.expiryMonthInput = this.elem.find(".expiry-month");
  if(this.expiryMonthInput[0]) {
    this.expiryMonthInput.detach();
  } else {
    this.expiryMonthInput = $("<input class='expiry-month' />");
  }
};


CardJs.prototype.initExpiryYearInput = function() {
  this.expiryYearInput = this.elem.find(".expiry-year");
  if(this.expiryYearInput[0]) {
    this.expiryYearInput.detach();
  } else {
    this.expiryYearInput = $("<input class='expiry-year' />");
  }
};


CardJs.prototype.initCvcInput = function() {
  this.cvcInput = this.elem.find(".cvc");
  if(this.cvcInput[0]) {
    this.cvcInput.detach();
  } else {
    this.cvcInput = $("<input class='cvc' />");
  }

  this.cvcInput.attr("type", "tel");
  if(!this.cvcInput.attr("placeholder")) {
    this.cvcInput.attr("placeholder", CardJs.CVC_PLACEHOLDER);
  }
  this.cvcInput.attr("maxlength", CardJs.CVC_MASK_3.length);
  this.cvcInput.attr("x-autocompletetype", "cc-csc");
  this.cvcInput.attr("autocompletetype", "cc-csc");
  this.cvcInput.attr("autocorrect", "off");
  this.cvcInput.attr("spellcheck", "off");
  this.cvcInput.attr("autocapitalize", "off");

  this.cvcInput.keydown(CardJs.filterNumberOnlyKey);
};






CardJs.prototype.setupCardNumberInput = function() {
  if(this.stripe) { this.cardNumberInput.attr("data-stripe", "number"); }
  this.elem.append("<div class='card-number-wrapper'></div>");
  var wrapper = this.elem.find(".card-number-wrapper");
  wrapper.append(this.cardNumberInput);
  wrapper.append("<div class='card-type-icon'></div>");
  wrapper.append("<div class='icon'></div>");
  wrapper.find(".icon").append(CardJs.CREDIT_CARD_SVG);
};


CardJs.prototype.setupNameInput = function() {
  if(this.captureName) {
    this.elem.append("<div class='name-wrapper'></div>");
    var wrapper = this.elem.find(".name-wrapper");
    wrapper.append(this.nameInput);
    wrapper.append("<div class='icon'></div>");
    wrapper.find(".icon").append(CardJs.USER_SVG);
  }
};



CardJs.prototype.setupExpiryInput = function() {
  this.elem.append("<div class='expiry-container'><div class='expiry-wrapper'></div></div>");
  var wrapper = this.elem.find(".expiry-wrapper");

  var expiryInput;

  if(this.EXPIRY_USE_DROPDOWNS) {
    expiryInput = $("<div></div>");

    var expiryMonthNew = $(
      "<select>" +
        "<option value='any' selected='' hidden=''>MM</option>" +
        "<option value='1'>01</option>" +
        "<option value='2'>02</option>" +
        "<option value='3'>03</option>" +
        "<option value='4'>04</option>" +
        "<option value='5'>05</option>" +
        "<option value='6'>06</option>" +
        "<option value='7'>07</option>" +
        "<option value='8'>08</option>" +
        "<option value='9'>09</option>" +
        "<option value='10'>10</option>" +
        "<option value='11'>11</option>" +
        "<option value='12'>12</option>" +
        "</select>"
    );
    var expiryMonthOld = this.expiryMonthInput;
    CardJs.copyAllElementAttributes(expiryMonthOld, expiryMonthNew);
    this.expiryMonthInput.remove();
    this.expiryMonthInput = expiryMonthNew;

    var expiryYearNew = $("<select><option value='any' selected='' hidden=''>YY</option></select>");
    var currentYear = parseInt(((new Date().getFullYear()).toString()).substring(2, 4));
    for(var i = 0; i < CardJs.EXPIRY_NUMBER_OF_YEARS; i++) {
      expiryYearNew.append("<option value='" + currentYear + "'>" + currentYear + "</option>");
      currentYear = (currentYear + 1) % 100;
    }
    var expiryYearOld = this.expiryYearInput;
    CardJs.copyAllElementAttributes(expiryYearOld, expiryYearNew);
    this.expiryYearInput.remove();
    this.expiryYearInput = expiryYearNew;


    expiryInput.append(this.expiryMonthInput);
    expiryInput.append(this.expiryYearInput);

  } else {

    expiryInput = $("<div></div>");
    this.expiryMonthInput = $("<input type='hidden' name='expiry-month' />");
    this.expiryYearInput = $("<input type='hidden' name='expiry-year' />");

    if(this.stripe) {
      this.expiryMonthInput.attr("data-stripe", "exp-month");
      this.expiryYearInput.attr("data-stripe", "exp-year");
    }

    this.expiryMonthYearInput = $("<input class='expiry' />");
    this.expiryMonthYearInput.attr("type", "tel");
    if(!this.expiryMonthYearInput.attr("placeholder")) {
      this.expiryMonthYearInput.attr("placeholder", CardJs.EXPIRY_PLACEHOLDER);
    }
    this.expiryMonthYearInput.attr("maxlength", CardJs.EXPIRY_MASK.length);
    this.expiryMonthYearInput.attr("x-autocompletetype", "cc-exp");
    this.expiryMonthYearInput.attr("autocompletetype", "cc-exp");
    this.expiryMonthYearInput.attr("autocorrect", "off");
    this.expiryMonthYearInput.attr("spellcheck", "off");
    this.expiryMonthYearInput.attr("autocapitalize", "off");

    var $this = this;
    this.expiryMonthYearInput.keydown(function(e) {
      CardJs.handleExpiryKey(e);

      var val = $this.expiryMonthYearInput.val();

      if(val.length == 1 && parseInt(val) > 1 && CardJs.keyIsNumber(e)) {
        $this.expiryMonthYearInput.val(CardJs.applyFormatMask("0" + val, CardJs.EXPIRY_MASK));
      }

      if(!$this.EXPIRY_USE_DROPDOWNS && $this.expiryMonthYearInput != null) {
        $this.expiryMonthInput.val($this.expiryMonth());


        $this.expiryYearInput.val(val.length == 7 ? val.substr(5,2) : null);
      }
    });
    
    // Try to catch when browsers/extensions autofill the expiry field, and
    // update the hidden fields accordingly. We need to spot the card number
    // blurring too because often this is the field that updates the expiry
    // field when autocompleted.
    this.expiryMonthYearInput.on('blur input', function(e) {
      $this.updateHiddenExpiryFields();
    });
    this.cardNumberInput.on('blur input', function(e) {
      $this.updateHiddenExpiryFields();
    });

    this.expiryMonthYearInput.blur(function(e) {
      $this.refreshExpiryMonthValidation();
    });


    expiryInput.append(this.expiryMonthYearInput);
    expiryInput.append(this.expiryMonthInput);
    expiryInput.append(this.expiryYearInput);
  }


  wrapper.append(expiryInput);
  wrapper.append("<div class='icon'></div>");
  wrapper.find(".icon").append(CardJs.CALENDAR_SVG);
};


CardJs.prototype.setupCvcInput = function() {
  if(this.stripe) { this.cvcInput.attr("data-stripe", "cvc"); }
  this.elem.append("<div class='cvc-container'><div class='cvc-wrapper'></div></div>");
  var wrapper = this.elem.find(".cvc-wrapper");
  wrapper.append(this.cvcInput);
  wrapper.append("<div class='icon'></div>");
  wrapper.find(".icon").append(CardJs.LOCK_SVG);
  //wrapper.append("<div class='icon right popup'></div>");
  //wrapper.find(".icon.right").append(CardJs.INFORMATION_SVG);
};




CardJs.prototype.expiryMonth = function() {
  if(!this.EXPIRY_USE_DROPDOWNS && this.expiryMonthYearInput != null) {
    var val = this.expiryMonthYearInput.val();
    return val.length >= 2 ? parseInt(val.substr(0,2)) : null;
    //return (monthValue >= 1 && monthValue <= 12) ? monthValue : null;
  }
  return null;
};



CardJs.isValidMonth = function(expiryMonth) {
  return (expiryMonth >= 1 && expiryMonth <= 12);
};


CardJs.isExpiryValid = function(month, year) {
  var today = new Date();
  var currentMonth = (today.getMonth() + 1);
  var currentYear = "" + today.getFullYear();

  if(("" + year).length == 2) {
    year = currentYear.substring(0, 2) + "" + year;
  }

  currentMonth = parseInt(currentMonth);
  currentYear = parseInt(currentYear);
  month = parseInt(month);
  year = parseInt(year);

  return CardJs.isValidMonth(month)
    && ((year > currentYear) || (year == currentYear && month >= currentMonth));
};


/**
 * Refresh whether the expiry month is valid (update display to reflect)
 */
CardJs.prototype.refreshExpiryMonthValidation = function() {
   CardJs.isExpiryValid(this.getExpiryMonth(), this.getExpiryYear())
    ? this.setExpiryMonthAsValid() : this.setExpiryMonthAsInvalid();
};

/**
 * If the expirymonthyear contains something looking like a date, copy it
 * to the hidden fields.
 */
CardJs.prototype.updateHiddenExpiryFields = function () {
  var vals = this.expiryMonthYearInput.val().match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (vals != null) {
    var month = vals[1];
    var year = vals[2];
    this.expiryMonthInput.val(month);
    this.expiryYearInput.val(year);
    this.expiryMonthYearInput.val(month + " / " + year);
  }
}


/**
 * Update the display to highlight the expiry month as valid.
 */
CardJs.prototype.setExpiryMonthAsValid = function() {
  if(this.EXPIRY_USE_DROPDOWNS) {

  } else {
    this.expiryMonthYearInput.parent().removeClass("has-error");
  }
};


/**
 * Update the display to highlight the expiry month as invalid.
 */
CardJs.prototype.setExpiryMonthAsInvalid = function() {
  if(this.EXPIRY_USE_DROPDOWNS) {

  } else {
    this.expiryMonthYearInput.parent().addClass("has-error");
  }
};