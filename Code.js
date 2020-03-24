function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
  .addItem('Guests from Calendar event', 'getGuests')
  .addToUi();
}

function getGuests() {
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService
    .createHtmlOutputFromFile('dialog')
    .setWidth(600)
    .setHeight(400), 'Select the calendar');
}

function getCalendars() {
  return CalendarApp
  .getAllCalendars()
  .map(function(calendar){
    return [calendar.getName(), calendar.getId()];
  });
}

function getEvents(data) {
  var jsonData = JSON.parse(data);
  return CalendarApp
  .getCalendarById(jsonData.calendarID)
  .getEventsForDay(new Date(jsonData.date))
  .map(function(event){
    return [event.getTitle(), event.getId()];
  });
}

function displayGuests(data) {
  var jsonData = JSON.parse(data);
  var s = SpreadsheetApp.getActiveSheet();
  var guests = CalendarApp.getCalendarById(jsonData.calendarID)
  .getEventById(jsonData.eventID)
  .getGuestList(true)
  .map(function(guest) {
    var name = guest.getName()
    return [(name ? name : 'N\A'),guest.getEmail(),guest.getGuestStatus()];
  });
  
  s.getRange('A1:C1').setValues([['NAME','EMAIL','STATUS']]);
  s.getRange('A2:C'+(guests.length + 1)).setValues(guests);
  return;
}
