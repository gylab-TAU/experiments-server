# experiments-server
This is a nodejs service that saves data from our expeirments

## Technology

- Nodejs
- Express
- Ecmascript 6

## Location of the data
- The data is saved as json files to our server's filesystem
- Each experimenter has his/her own directory within the main directory of the data
- Each experiment has its own directory within the experimenter's folder
- The main directory of the data is the variable basePath in server.js

## API

### Save data request
- url /
- method POST
body must include:
- participant_info with participant_id
- non empty trials array
- experiment_info with experimenter_name and experiment_name

- request body example:
requrst body example: {
  "data":{
  {
	"participant_info": {
		"participant_id": "12345",
		"gender": "male",
		"handness": "left"
	},
	"time": "11/8/2020 14:34:00",
	"headers": ["image_name", "time_in_ms", "condition", "participant_answer"],
	"trials": [
		{
			"image_name": "image1.jpg",
			"time_in_ms": "200",
			"condition": "old",
			"participant_answer": "yes"
		},
		{
			"image_name": "image2.jpg",
			"time_in_ms": "460",
			"condition": "new",
			"participant_answer": "yes"
		},
		{
			"image_name": "image3.jpg",
			"time_in_ms": "780",
			"condition": "old",
			"participant_answer": "no"
		}
	],
	"experiment_info": {
		"experimenter_name": "Israel Israeli",
		"experiment_name": "Recognition_TestStage",
	}
}}
}

