// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in minutes.
// 5. Calculate minutes away

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAcSvdaXZJxNuS7kYVpPa2krS9dGkjz5-Y",
    authDomain: "train-965f5.firebaseapp.com",
    databaseURL: "https://train-965f5.firebaseio.com",
    projectId: "train-965f5",
    storageBucket: "train-965f5.appspot.com",
    messagingSenderId: "606620128598"
  };
  firebase.initializeApp(config);
  var database = firebase.database();


  $("#addTrain").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = $("#firstTrainInput").val().trim()
    var frequency = $("#frequencyInput").val().trim();
    
    var newTrain = {
        name: trainName,
        destination: destination,
        first: firstTrain,
        freq: frequency
      };

    var trainRef = database.ref("/trains");
    database.ref().push(newTrain);


     // Empty input boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");


  });

database.ref().on("child_added", function(snapshot, prevChildKey){
    var data = snapshot.val();

    // Assumptions
    var tFrequency = data.freq;

    // Time is 3:30 AM
    var firstTime = data.first;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


    
    $("#importantTable").append("<tr><td>"+data.name+"</td><td>"+data.destination+"</td><td>"
    +data.freq+"</td><td>"+ moment(nextTrain).format("hh:mm")+"</td><td>"+tMinutesTillTrain+"</td><td>");
})