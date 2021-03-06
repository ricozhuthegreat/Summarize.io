
var markovjs = (function() {

  var MarkovModel = function (inputText) {
  }

  MarkovModel.prototype = {

    prep: function (inputText, capLength) {

      inputText = this.parseWord(inputText);

      this.inputText = inputText;
      this.capLength = capLength;

      let followers = new Array(inputText.length);

      for (i=0; i<inputText.length; i++) {
        // Create a new array of length 4 (key word + 3 following words)
        followers[i] = new Array(4);
      }

      // Fill the follower array
      for (i=0; i<inputText.length; i++) {

        let currWord = inputText[i];

        // Set the key
        let wordArr = followers[i];
        wordArr[0] = currWord;

        // Check for duplicates; copy over if exists
        for (j=0; j<i; j++) {
          if (followers[j][0] === currWord) {
            followers[i] = followers[j];
          }
        }

        // This trakcs how many followers have been added and the index of teh current array value
        let count = 1;

        // Add following words for each given word
       for (j=0; j<inputText.length-1; j++) {
         if (inputText[j] === currWord  && count < 4) {
           let found = false;
           let next = inputText[j+1];
           for (k=0; k<wordArr.length; k++) {
             if (wordArr[k] === currWord) {
               found = true;
               break;
             }
           }
           if (!found) {
             wordArr[count] = next;
           }
         }
       }
      }

      this.followers = followers;

    },

    summarize: function (inputText, capLength) {

      // Create an empty summary
      let summary = "Summary updated!";

      let initWord = Math.random() * inputText.length;

      return summary;

    },

    parseWord: function (word) {
      let newWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      newWord = newWord.replace(/\s{2,}/g," ");
      return newWord;
    }

  }

  function getRand (seed) {
    return Math.random() * seed;
  }

  // Exported elements: markov model with highlighted text data prepped for summarization
  let exports = {};
  exports.MarkovModel = MarkovModel;
  return exports;

})();

// Get summarization cue from content.js

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("background listener loaded");
    if (request.sender == "content" && request.selText == "disabled") {
      // Disabled for webpage - No action
    } else if (request.sender == "content" && request.selText !== "disabled") {
      // User has selected text that is not "disabled", summarize input text (selText) and send back response
      let summary = "This is a summary";

      // Create and pass global parameters for trainer
      let inputText = request.selText;
      let capLength = inputText.length * 0.4;

      // Instantiate Markov Summarizer Model
      let summarizer = new markovjs.MarkovModel();

      // Prep and train summarizer
      summarizer.prep(inputText, capLength);

      // Get the summary from the summarizer model
      summary = summarizer.summarize(inputText, capLength);

      // Send a response message to the content script
      sendResponse({summary: summary});
    }
});
