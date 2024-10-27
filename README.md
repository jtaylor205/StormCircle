![Alt text](relative%20path/to/stormCircle.png?raw=true "Title")

## Inspiration
When hurricanes approach, generic preparation guides are helpful, but navigating through countless websites to find all the necessary information can be time-consuming and overwhelming. We wanted to create a more streamlined experience by integrating AI to develop personalized action plans that guide users to nearby essential resources. Additionally, navigating to evacuation shelters can be life-saving if your home is at risk. Our goal was to design a solution that consolidates all this critical information in one place, making it accessible and actionable in real time.
## What it does
Storm Circle is an interactive, AI-powered platform that provides users with personalized supply preparation plans using IBM’s Watsonx AI. It offers a real-time map featuring evacuation shelters, local stores with essential supplies, and customizable search features, so users can find what they need quickly and efficiently. The platform helps ensure you’re prepared and have access to safe locations during hurricanes.
## How we built it
We built Storm Circle using React for the web interface, with Mapbox powering the dynamic map features. By integrating geocoding and tilequery from Mapbox APIs, we enhanced user interactivity, allowing them to search for nearby shelters and suppliers with ease. Watsonx Flan-UL2 serves as the AI engine, generating personalized supply plans tailored to each user’s needs, based on their location and the storm's severity.
## Challenges we ran into
One of our biggest challenges was integrating turn-by-turn navigation directly into the Mapbox visual interface, ensuring the user experience remained intuitive. Additionally, querying and verifying the availability of essential supplies at nearby stores was more complex than anticipated.
## Accomplishments that we're proud of
We’re proud of successfully querying real-time data on essential supplies and seamlessly integrating the Watsonx AI model to generate accurate, personalized preparation plans. We also created a smooth and user-friendly UI that makes critical hurricane information accessible with just a few clicks.
## What we learned
Throughout the project, we deepened our understanding of working with Mapbox APIs to handle real-time data and geospatial queries. We also learned how to integrate external AI models and leverage them for user recommendations.
## What's next for Storm Circle!
We plan to expand our coverage of evacuation shelters across Florida and introduce an evacuation zone feature that will visually display whether users are in mandatory evacuation areas based on incoming storm data.

## Instructions

Clone this repository and install necessary packages with:

### `npm i`

Create a .env file in the root and add your IBM Watsonx.ai API token and mapbox API key

In the project directory, run:

### `node server.js` 

### `npm start`

This starts the server to run IBM Watsonx and runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.