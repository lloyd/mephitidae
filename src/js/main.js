
var misc = require("misc");
// in memory browser history, an array of urls
var gHistory = [];
// our current point in history
var gCurrent = 0;

// capture events when the a child iframe changes and update the location bar
window.addEventListener("experimental-dom-load", function(e) {
  $("#urlinput").val(e.url);
  // very rudimentary history management, if the url that has been loaded
  // is not what is currently in history, let's append it, and reset
  // the history pointer
  if (e.url !== gHistory[gCurrent]) {
    gHistory.push(e.url);
    gCurrent = gHistory.length - 1; 
  }
}, false, true);

// the ready handler would run once the browser process was initialized?
$(document).ready(function() {
    function navigate() {
        // invoked when the user hits the go button or hits enter in url box
        var url = $.trim($("#urlinput").val());
        // if there's no protocol, let's add the likely one
        if (url.indexOf("://") < 0) url = "http://" + url;
        // trigger navigation
         
        // As an alternative, one could also use the CommonJS-based, require("misc") 
        // module that has a misc.fixupuri(url) method which is based in the nsIURIFixup
        $("#contentFrame").attr("src", url);
    }

    // both enter in the urlbox and clicking the go button do the same thing,
    // navigate to the url specified
    $("#urlbox > form").submit(function() { navigate(); return false; });
    $("#go").click(function() { navigate(); });
    // reload and go are equivalent.  desired?
    $("#reload").click(function() { navigate(); });
    $("#back").click(function() {
      if (gCurrent == 0) return;
      $("#contentFrame").attr("src", gHistory[--gCurrent]);
    });
    $("#forward").click(function() {
      if (!gHistory.length || gCurrent == gHistory.length - 1) return;
      $("#contentFrame").attr("src", gHistory[++gCurrent]);
    });
});

