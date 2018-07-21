	//Iinitializes Firebase
	var config = {
		apiKey: "AIzaSyA0XCjdAeV9yefZPaJDgYZ-ebAc6ns7lR8",
		authDomain: "class-activity-2018.firebaseapp.com",
		databaseURL: "https://class-activity-2018.firebaseio.com",
		projectId: "class-activity-2018",
		storageBucket: "class-activity-2018.appspot.com",
		messagingSenderId: "240110526899"
	};
	firebase.initializeApp(config);

	var database = firebase.database();

	/*=======================================================================================================*/

	//Submit train input data on click to firebase database
	$('#submitButton').on('click', function (event) {
		// prevent default
		event.preventDefault();
		//gets user input
		var trainName = $('#trainNameInput').val().trim();
		var destination = $('#destinationInput').val().trim();
		var firstTime = moment($('#timeInput').val().trim(), "HH:mm").format("");
		var frequency = $('#frequencyInput').val().trim();

		//dec var as string for train data
		var newTrains = {
			name: trainName,
			tdestination: destination,
			tFirst: firstTime,
			tfreq: frequency,
		}

		//upload user input to firebase
		database.ref().push(newTrains);

		//alert
		alert("Train successfully added!");

		//clears text values form input tag
		$('#trainNameInput').val("");
		$('#destinationInput').val("");
		$('#timeInput').val("");
		$('#frequencyInput').val("");
		return false;
	});

	/*==============================================================================================================*/

	//New child added function calculates & converts time with moment js
	database.ref().on("child_added", function (childSnapshot, prevChildKey) {

		//store everything into a variable
		var trainName = childSnapshot.val().name;
		var destination = childSnapshot.val().tdestination;
		var firstTime = childSnapshot.val().tFirst;
		var frequency = childSnapshot.val().tfreq;

		//convert first time (push back 1 year to make sure it comes before current time)
		var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
		console.log(firstTimeConverted);

		//current time
		var currentTime = moment();

		//difference between the times
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

		//time apart (remainder)
		var tRemainder = diffTime % frequency;

		//minute until train
		var tMinutesTillTrain = frequency - tRemainder;

		//next train
		var nextTrain = moment().add(tMinutesTillTrain, "minutes");
		var nextTrainConverted = moment(nextTrain).format("HH:mm");

		//add each trains data into the table
		$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + "Every " + frequency + " minutes" + "</td><td>" + nextTrainConverted + "</td><td>" + tMinutesTillTrain + "</td></tr>");
	});