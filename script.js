window.addEventListener("load", function () {

    // Needed to get color variables from css
    const root = document.documentElement;

    // Array to hold body part names
    let bodyParts = ['head', 'neck', 'pecs', 'delts', 'biceps', 'triceps', 'forearms', 'hands', 'abs', 'obliques', 'quads', 'adductor', 'shins', 'calves', 'feet'];
    // Global object to store the information of the stretch that is clicked
    let selectedStretch = {};

    let currentTimeRemaining;
    let countdownOn = false;

    // Cycles through each body part for hover and click interactions. 
    for (let i = 0; i < bodyParts.length; i++) {
        interaction(i);
    }

    // When countdown button is clicked, start countdown, and change button to say "restart"
    const countdownButtonElement = document.getElementById('countdown-button');
    const countdownElement = document.getElementById('countdown');
    countdownButtonElement.addEventListener('click', function () {
        countdownOn = true;
        startCountdown(selectedStretch.stretchDuration, countdownElement);
        countdownButtonElement.innerHTML = "restart";
    });

    function interaction(index) {
        let hoveredBodyPart = bodyParts[index];
        // Get color variable from css file
        let hoverColor = getComputedStyle(root).getPropertyValue('--' + hoveredBodyPart + '-color').trim();

        // Uses body part name to get the id tag from the svg. 
        let bodyPartElementId = 'bendi-' + hoveredBodyPart;
        let bodyPartElement = document.getElementById(bodyPartElementId);

        // Getting elements...
        let informationDiv = document.getElementById('information');
        let commonNameElement = document.getElementById('common-name');
        let muscleGroupElement = document.getElementById('muscle-group');
        let stretchNameElement = document.getElementById('stretch-name');
        let stretchDescriptionElement = document.getElementById('stretch-description');
        let stretchDurationElement = document.getElementById('stretch-duration');
        let countdownContainerElement = document.getElementById('countdown-container');


        if (bodyPartElement) {

            // Set fill of all parts to white first. 
            bodyPartElement.style.fill = "white";

            // When the mouse is hovered, gets the common name from the json file, 
            //and changes color of the body part and the text highlight
            bodyPartElement.addEventListener('mouseover', function () {
                fetch('./stretches.json')
                    .then(response => response.json())
                    .then(data => {
                        let bodyPart = data.bodyParts[index];
                        commonName = bodyPart.commonName;
                        commonNameElement.innerHTML = commonName;
                    });
                bodyPartElement.style.fill = hoverColor;
                commonNameElement.style.backgroundColor = hoverColor;
            });

            // Goes back to default when mouse leaves the body part. 
            bodyPartElement.addEventListener('mouseout', function () {
                bodyPartElement.style.fill = "white";
                commonNameElement.innerHTML = "";
                commonNameElement.style.backgroundColor = "white";
            });

            // When the body part is clicked, updates the global selectedStretch object to match the clicked body part. 
            bodyPartElement.addEventListener('click', function () {
                console.log(bodyPartElementId + " clicked");

                fetch('./stretches.json')
                    .then(response => response.json())
                    .then(data => {
                        let bodyPart = data.bodyParts[index];
                        let stretchIndex = Math.floor(Math.random() * bodyPart.stretches.length);
                        let stretch = bodyPart.stretches[stretchIndex];

                        selectedStretch = {
                            name: bodyPart.name,
                            commonName: bodyPart.commonName,
                            muscleGroup: bodyPart.muscleGroup,
                            stretchName: stretch.stretchName,
                            stretchDescription: stretch.instructions,
                            stretchDuration: stretch.duration
                        };

                        // Changes style of information section to be visible and match body part color
                        informationDiv.style.visibility = 'visible';
                        muscleGroupElement.style.backgroundColor = hoverColor;
                        countdownContainerElement.style.backgroundColor = hoverColor;
                        stretchNameElement.style.border = '2px solid ' + hoverColor;

                        // Updates information to match selected body part.
                        muscleGroupElement.innerHTML = selectedStretch.muscleGroup;
                        stretchNameElement.innerHTML = selectedStretch.stretchName;
                        stretchDescriptionElement.innerHTML = selectedStretch.stretchDescription;
                        stretchDurationElement.innerHTML = selectedStretch.stretchDuration;


                        // When a new body part is selected, the countdown resets. 
                        countdownElement.innerHTML = selectedStretch.stretchDuration;
                        countdownOn = false;
                    });
            });



        } else {
            console.error("Element with ID " + bodyPartElementId + " not found!");
        }
    }

    function startCountdown(duration, element) {
        element.innerHTML = "Ready?"

        // reset current time
        currentTimeRemaining = duration;

        // Created with help from chatGPT
        const countdownInterval = setInterval(() => {
            element.innerHTML = currentTimeRemaining;
            currentTimeRemaining--;
            if (currentTimeRemaining < 0) {
                clearInterval(countdownInterval);
                element.innerHTML = "Finished!"
            }

            // Stop timer and reset text if countdown is stopped.
            if (!countdownOn) {
                clearInterval(countdownInterval);
                element.innerHTML = selectedStretch.stretchDuration;
                countdownButtonElement.innerHTML = "start";
            }
            // Starts over if restart button is clicked. 
            countdownButtonElement.addEventListener('click', function () {
                clearInterval(countdownInterval);
            })


        }, 1000);  // 1 second intervals
    }

});
