Handlebars.registerHelper('pluralize', function(n, thing) {
  // fairly stupid pluralizer
  if (n === 1) {
    return '1 ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }
});
Handlebars.registerHelper('trimString', function(passedString) {
    if(passedString){
    var theString = passedString.substring(0,150);
    return new Handlebars.SafeString(theString);
	}
	else{
		return passedString;
	}

});