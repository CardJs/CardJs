(function($) {

  var KEY_0 = 48;
  var KEY_9 = 57;
  var KEY_DELETE = 46;
  var KEY_BACKSPACE = 8;
  var KEY_ARROW_LEFT = 37;
  var KEY_ARROW_RIGHT = 39;
  var KEY_ARROW_UP = 38;
  var KEY_ARROW_DOWN = 40;
  var KEY_HOME = 36;
  var KEY_END = 35;
  var KEY_A = 65;
  var KEY_X = 88;
  var KEY_C = 67;
  var KEY_V = 86;




  var settings;

  var displayElement;

  var cardNumberInput;
  var expiryMonthInput;
  var expiryYearInput;
  var cvcInput;


  var methods = {
    init : function(options) {

      settings = $.extend({

        creditCardNumberMask: "XXXX XXXX XXXX XXXX",
        creditCardNumberPlaceholder: "Card number"

      }, options);


      displayElement = this;

      // --- --- --- --- --- --- --- --- --- ---

      // Initialise
      initCardNumberInput();

      // Clean up anything added by user
      cardNumberInput.detach();
      this.empty();


      // Setup display
      setupCardNumberInput();


      return this;
    }
  };


  /**
   * jQuery function.
   *
   * @param methodOrOptions
   * @returns {*}
   */
  $.fn.CardJs = function(methodOrOptions) {

    if(methods[methodOrOptions]) {
      return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if(typeof methodOrOptions === "object" || !methodOrOptions) {
      return methods.init.apply( this, arguments );
    } else {
      $.error("Method " +  methodOrOptions + " does not exist on jQuery.CardJs");
    }
  };






  function initCardNumberInput() {
    cardNumberInput = displayElement.find(".card-number");

    cardNumberInput.attr("type", "tel");
    if(!cardNumberInput.attr("placeholder")) { cardNumberInput.attr("placeholder", settings.creditCardNumberPlaceholder) }
    cardNumberInput.attr("maxlength", settings.creditCardNumberMask.length);
    cardNumberInput.attr("x-autocompletetype", "cc-number");
    cardNumberInput.attr("autocompletetype", "cc-number");
    cardNumberInput.attr("autocorrect", "off");
    cardNumberInput.attr("spellcheck", "off");
    cardNumberInput.attr("autocapitalize", "off");

    cardNumberInput.keydown(handleCreditCardNumberKey);
    cardNumberInput.keyup(refreshCreditCardTypeIcon);
    cardNumberInput.change(handleCreditCardNumberChange);
  }




  function initExpiryMonthInput() {
    expiryMonthInput = this.find(".expiry-month");
  }


  function initExpiryYearInput() {
    expiryYearInput = this.find(".expiry-year");
  }


  function initCvcInput() {
    cvcInput = this.find(".cvc");
  }









  function setupCardNumberInput() {
    displayElement.append("<div class='card-number-wrapper'></div>");
    var wrapper = displayElement.find(".card-number-wrapper");
    wrapper.append(cardNumberInput);
    wrapper.append("<div class='card-type-icon'></div>")
    wrapper.append("<div class='icon'></div>")
    wrapper.find(".icon").append(
      '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
      'x="0px" y="0px" width="23px" height="17px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve">' +
      '<g><path class="svg" d="M182.385,14.258c-2.553-2.553-5.621-3.829-9.205-3.829H42.821c-3.585,0-6.653,1.276-9.207,3.829' +
      'c-2.553,2.553-3.829,5.621-3.829,9.206v99.071c0,3.585,1.276,6.654,3.829,9.207c2.554,2.553,5.622,3.829,9.207,3.829H173.18' +
		  'c3.584,0,6.652-1.276,9.205-3.829s3.83-5.622,3.83-9.207V23.464C186.215,19.879,184.938,16.811,182.385,14.258z M175.785,122.536' +
		  'c0,0.707-0.258,1.317-0.773,1.834c-0.516,0.515-1.127,0.772-1.832,0.772H42.821c-0.706,0-1.317-0.258-1.833-0.773' +
		  'c-0.516-0.518-0.774-1.127-0.774-1.834V73h135.571V122.536z M175.785,41.713H40.214v-18.25c0-0.706,0.257-1.316,0.774-1.833' +
		  'c0.516-0.515,1.127-0.773,1.833-0.773H173.18c0.705,0,1.316,0.257,1.832,0.773c0.516,0.517,0.773,1.127,0.773,1.833V41.713z"/>' +
      '<rect class="svg" x="50.643" y="104.285" width="20.857" height="10.429"/>' +
      '<rect class="svg" x="81.929" y="104.285" width="31.286" height="10.429"/>'+
      '</g></svg>'
    );
  }





  function clearCardTypeIcon() {
    displayElement.find(".card-number-wrapper .card-type-icon").attr("class", "card-type-icon");
  }

  function setCardTypeIconAsVisa() {
    var cardTypeIcon = displayElement.find(".card-number-wrapper .card-type-icon");
    cardTypeIcon.attr("class", "card-type-icon visa");
  }

  function setCardTypeIconAsMasterCard() {
    var cardTypeIcon = displayElement.find(".card-number-wrapper .card-type-icon");
    cardTypeIcon.attr("class", "card-type-icon master-card");
  }

  function setCardTypeIconAsAmericanExpress() {
    var cardTypeIcon = displayElement.find(".card-number-wrapper .card-type-icon");
    cardTypeIcon.attr("class", "card-type-icon american-express");
  }

  function setCardTypeIconAsDiscover() {
    var cardTypeIcon = displayElement.find(".card-number-wrapper .card-type-icon");
    cardTypeIcon.attr("class", "card-type-icon discover");
  }

  function setCardTypeIconAsDiners() {
    var cardTypeIcon = displayElement.find(".card-number-wrapper .card-type-icon");
    cardTypeIcon.attr("class", "card-type-icon diners");
  }

  function setCardTypeIconAsJcb() {
    var cardTypeIcon = displayElement.find(".card-number-wrapper .card-type-icon");
    cardTypeIcon.attr("class", "card-type-icon jcb");
  }







  function handleNumberOnlyKey(e) {
    var keyCode = e.which || e.keyCode;

    var isNumber = keyCode >= KEY_0 && keyCode <= KEY_9;
    var isDeletion = keyCode == KEY_BACKSPACE || keyCode == KEY_DELETE;
    var isArrow = keyCode >= KEY_ARROW_LEFT && keyCode <= KEY_ARROW_DOWN;
    var isNavigation = keyCode == KEY_HOME || keyCode == KEY_END;
    var isKeyboardCommand = e.ctrlKey && (keyCode == KEY_A || keyCode == KEY_X || keyCode == KEY_C || keyCode == KEY_V);

    if(!isNumber && !isDeletion && !isArrow && !isNavigation && !isKeyboardCommand) {
      e.preventDefault();
    }
  }


  /**
   * Strip all characters that are not in the range 0-9
   *
   * @param string
   * @returns {string}
   */
  function numbersOnlyString(string) {
    var numbersOnlyString = "";
    for(var i = 0; i < string.length; i++) {
      var currentChar = string.charAt(i);
      var isValid = !isNaN(parseInt(currentChar));
      if(isValid) { numbersOnlyString += currentChar; }
    }
    return numbersOnlyString;
  }


  /**
   * Apply a format mask to the given string
   *
   * @param string
   * @param mask
   * @returns {string}
   */
  function applyFormatMask(string, mask) {
    var formattedString = "";
    var numberPos = 0;
    for(var j = 0; j < mask.length; j++) {
      var currentMaskChar = mask[j];
      if(currentMaskChar == "X") {
        formattedString += string.charAt(numberPos);
        numberPos++;
      } else {
        formattedString += currentMaskChar;
      }
      if(numberPos >= string.length) { break; }
    }
    return formattedString;
  }



  function refreshCreditCardTypeIcon() {
    setCardTypeIconFromNumber(numbersOnlyString(cardNumberInput.val()));
  }



  function handleCreditCardNumberKey(e) {
    handleNumberOnlyKey(e);
    var keyCode = e.which || e.keyCode;
    var char = String.fromCharCode(keyCode);


    // Handle Number
    if(!isNaN(parseInt(char))) {
      e.preventDefault();
      var numbersOnly = numbersOnlyString(cardNumberInput.val()) + char;
      var formatted = applyFormatMask(numbersOnly, settings.creditCardNumberMask);
      $(e.target).val(formatted);
    }

    // Handle Backspace
    //if(keyCode == KEY_BACKSPACE)
  }



  function handleCreditCardNumberChange(e) {
    //cardNumberInput.val(formatCreditCardNumber(cardNumberInput.val()));
  }








  /**
   *
   *
   * @param number
   * @returns {string}
   */
  function cardTypeFromNumber(number) {

    // Visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
      return "Visa";

    // Mastercard
    re = new RegExp("^5[1-5]");
    if (number.match(re) != null)
      return "Mastercard";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
      return "AMEX";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
      return "Discover";

    // Diners
    re = new RegExp("^36");
    if (number.match(re) != null)
      return "Diners";

    // Diners - Carte Blanche
    re = new RegExp("^30[0-5]");
    if (number.match(re) != null)
      return "Diners - Carte Blanche";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
      return "JCB";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
      return "Visa Electron";

    return "";
  }


  /**
   * Update the display to set the card type from the current number.
   *
   * @param number
   */
  function setCardTypeIconFromNumber(number) {
    switch(cardTypeFromNumber(number)) {
      case "Visa Electron":
      case "Visa":
        setCardTypeIconAsVisa();
        break;
      case "Mastercard":
        setCardTypeIconAsMasterCard();
        break;
      case "AMEX":
        setCardTypeIconAsAmericanExpress();
        break;
      case "Discover":
        setCardTypeIconAsDiscover();
        break;
      case "Diners - Carte Blanche":
      case "Diners":
        setCardTypeIconAsDiners();
        break;
      case "JCB":
        setCardTypeIconAsJcb();
        break;
      default:
        clearCardTypeIcon();
    }
  }




}(jQuery));


//
// Initialise for all elements with cardjs class.
//
$(function() {
  $(".cardjs").CardJs();
});
