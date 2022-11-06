// API details
const API_KEY = 'Yi10Tcq5s45Fu9LFkuSlfBEdEgHKk5Bm23h3S5fD';
const TOTAL_QUESTIONS_TO_GET = '6'; // API supports 20 questions max at one time

// container div
let container;

// nav-buttons div
let navButtons;

// array to hold scores
let score;

// tracking index of current question
let currentQuestion;

// question data from server
let json;

const showScorePage = () => {

    // End score - start at full points and deduct for 'incorrect' or 'reveal' answers
    let totalScore = TOTAL_QUESTIONS_TO_GET;

    container.innerHTML = `
        <header>
            <h2>Results Breakdown</h2>
        </header>
        <div class="answers">

        </div>
        <footer class="nav-buttons">
            
        </footer>
    `
    
    // Build the question and answers list
    let questionSummary = '';

    for (i = 0; i < score.length; i ++) {

        // formatting the question text
        const questionText = formatQuestionText(json[i].question, json[i].multiple_correct_answers);

        // Add add the question to the page
        questionSummary = questionSummary.concat(`
            <h3 class='question-text-summary'>${questionText}</h3>
        `);

         // "The external JavaScript file must contain the <script> tag."

        let isIncorrectOrReveal = false;

        for (let answer in score[i]) {
            
            const choiceText = json[i].answers[answer]; // answers object
            const playerChoice = score[i][answer];
            const correctChoice = json[i].correct_answers[`${answer}_correct`];

            const answerElement = document.createElement('div'); // create answer list item
            answerElement.textContent = choiceText; // add answer text to it
            answerElement.classList.add('answer'); // add answer class to it
            
            // if true true (player chose correctly) - tick and green text
            if (playerChoice && correctChoice === 'true') {
                answerElement.classList.add('correct');
            } else if (playerChoice && correctChoice === 'false') { 
                // if true false (player chose incorrectly) = cross
                answerElement.classList.add('incorrect');
                isIncorrectOrReveal = true;
            } else if (!playerChoice && correctChoice === 'true') {
                // if false true (showing correct answer player didn't choose) = green text and blank box
                answerElement.classList.add('reveal');
                isIncorrectOrReveal = true;
            }

            questionSummary = questionSummary.concat(`
                ${answerElement.outerHTML}
            `);
        }
        
        // If an 'incorrect' or 'reveal' is detected a point is deducted.
        if(isIncorrectOrReveal) totalScore --;
    }

    console.log(questionSummary);

    // append list items to answers
    const answersList = document.getElementsByClassName('answers')[0]; // select the answers div to add to
    answersList.innerHTML = questionSummary; // add questions summary to answersList

    // Add results breakdown
    const header = document.getElementsByTagName('header')[0]; // select the answers div to add to
    resultsPercentage = document.createElement('h3')
    const percentage = Math.round(totalScore/TOTAL_QUESTIONS_TO_GET * 100);
    resultsPercentage.textContent = `You got ${totalScore} of ${TOTAL_QUESTIONS_TO_GET} questions correct (${percentage}%)`;
    header.appendChild(resultsPercentage);

    // Restart button to start a new quiz
    navButtons = document.getElementsByClassName('nav-buttons')[0];
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.classList.add('restart-btn');
    restartButton.addEventListener('click', () => start());
    navButtons.appendChild(restartButton);
};

// FOR NON-MULTIPLE CHOICE - add selected class to answer element
const setActiveAnswer = (answerElement, chosenAnswer) => {
    // console.log(answerElement, chosenAnswer)
    // select all answer elements
    const answersContainer = document.getElementsByClassName('answer');

    // remove 'selected' class from all answer elements
    for (let answer of answersContainer) { answer.classList.remove('selected') };

    // add selected class to clicked answer element
    answerElement.classList.add('selected');

    // update scores
    for (let answer in score[currentQuestion]) {
        // turn the chosen answer to true
        if (answer === chosenAnswer) score[currentQuestion][chosenAnswer] = true;
        // other answers will be false
        else score[currentQuestion][answer] = false;
    }
    console.log(score[currentQuestion]);
}

// FOR MULTIPLE CHOICE - toggle selected class on answer element
const toggleActiveAnswer = (answerElement, chosenAnswer) => {

    // toggle selected class on clicked answer element
    answerElement.classList.toggle('selected');

    // toggle answer values between true and false depending on what was clicked
    if (score[currentQuestion][chosenAnswer] === true) {
        console.log('turning true to false')
        score[currentQuestion][chosenAnswer] = false;
    } else {
        console.log('turning false to true')
        score[currentQuestion][chosenAnswer] = true;
    }
    console.log(score[currentQuestion]);
}

function formatQuestionText(questionText, isMultiple) {
    const leftAnglebracket = /</g;
    const rightAnglebracket = />/g;

    // This replaces special HTML characters < and > with literal text version.
    // Needed as some questions have HTML code that gets interpreted literally and messes up the code.
    questionText = questionText.replace(leftAnglebracket, '&lt;').replace(rightAnglebracket, '&gt;');

    // adds (Multiple Choice) to question if it is multiple choice
    if (isMultiple === 'true') {
        questionText = questionText.concat(' (Multiple Choice)');
    }
    return questionText;
}

const printQuestion = () => {
    const numberOfQuestions = json.length; // total number of questions

    // style container for quiz
    container.style.justifyContent = 'space-between';
    
    // formatting the question text
    const questionText = formatQuestionText(json[currentQuestion].question, json[currentQuestion].multiple_correct_answers);

    // turn off loading screen and display questions
    container.innerHTML = `
        <header>
            <h2>Question ${currentQuestion+1} of ${numberOfQuestions}</h2>
            <h3 class='question-text'>${questionText}</h3>
            </header>
        <ol class="answers">
            
        </ol>
        <footer class="nav-buttons">

        </footer>
    `
    // Answers container div
    const answersContainer = document.getElementsByClassName('answers')[0]; // select the answers div to add to
    
    // stores the answers object from the API (some may be null)
    const jsonAnswers = json[currentQuestion].answers; 
    // {
    //     answer_a: "true",
    //     answer_b: "false",
    //     answer_c: null,
    //     answer_d: null,
    //     answer_e: null,
    //     answer_f: null
    // }

    // copy the answers object from the API data into score array at current question index
    // score[currentQuestion] = {...jsonAnswers};

    Object.keys(jsonAnswers).forEach(answer_x => {
        if (jsonAnswers[answer_x]) { // if an answer value exists

            // if score object not created
            if (!score[currentQuestion]) {
                // then create it
                score[currentQuestion] = { [answer_x]: false }
            } else if (!score[currentQuestion][answer_x]) {
                // else if answer and value not created, then add with false value
                Object.assign(score[currentQuestion], { [answer_x]: false });
            } // otherwise leave existing answers as is

            const answerElement = document.createElement('li'); // create a list item for it
            answerElement.textContent = jsonAnswers[answer_x]; // give it the value as text
            answerElement.classList.add('answer'); // add answer class to it

            // add selected class if previously selected
            if (score[currentQuestion][answer_x] === true) {
                answerElement.classList.add('selected');
            }
            
            // add click listener to it
            answerElement.addEventListener('click', e => {
                if (json[currentQuestion].multiple_correct_answers === 'true') { // if multiple choice
                    toggleActiveAnswer(e.currentTarget, answer_x); // toggle answers
                } else { // if not
                    setActiveAnswer(e.currentTarget, answer_x); // then select answer
                }
            })
            answersContainer.appendChild(answerElement); // add question to class
        } 
    });

    // Adding nav buttons
    const navButtons = document.getElementsByClassName('nav-buttons')[0];

    // create prev button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.classList.add('prev-btn');
    if (currentQuestion === 0) prevButton.style.visibility = 'hidden';
    navButtons.appendChild(prevButton);

    // create next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('next-btn');
    if (currentQuestion < numberOfQuestions - 1) navButtons.appendChild(nextButton);

    // Add nav button listeners
    for (const button of navButtons.children) {
        button.addEventListener('click', () => {
            button.className === 'prev-btn' ? currentQuestion -- : currentQuestion ++;
            printQuestion();
        })
    }

    // create finish button if at the end of quiz
    if (currentQuestion === numberOfQuestions - 1) {
        const finishButton = document.createElement('button');
        finishButton.textContent = 'Finish';
        finishButton.style.fontWeight = 'bold';
        finishButton.classList.add('finish-btn');
        finishButton.addEventListener('click', () => showScorePage());
        navButtons.appendChild(finishButton);
    }
}

const getQuestions = async (category, tags ='') => {
    
    const url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&limit=${TOTAL_QUESTIONS_TO_GET}&category=${category}&tags=${tags}`

    const response = await fetch(url);

    if (response.ok) { // if HTTP-status is 200-299
        console.log(`received response ${response.status}`);
        json = await response.json();
        console.log(json);
        printQuestion() // then print questions
    } else {
        console.log(`An error ${response.status} occured.`);
        container.innerHTML = `<div>An error ${response.status} occured :(</div>`
    }
};

const start = () => {

    score = new Array(parseInt(TOTAL_QUESTIONS_TO_GET));
    currentQuestion = 0;
    json = {};
    container = document.getElementsByClassName("container")[0];
    container.style.justifyContent = 'center';

    container.innerHTML = `
        <header>
            <h1 class="title">Welcome to Quizify</h1>
            <h3>Choose your category</h3>
        </header>
        <div class="category-container">
            <button class="category-button">JavaScript</button>
            <button class="category-button">DevOps</button>
            <button class="category-button">Linux</button>
        </div>
    `

    // Get all category buttons
    const categoryButtons = document.getElementsByClassName('category-button');
    
    // add event listeners to the category buttons
    for (let categoryButton of categoryButtons) {
        categoryButton.addEventListener('click', e => {        
            // Display loading screen just before API CALL
            container.innerHTML = `<div>Loading</div>`;

            // Get questions from API
            const category = e.target.textContent; // get the text of the button and assign it to category.
            category === "JavaScript" // if category is Javascript.
            ? getQuestions('Code', category) // Make the API call with JavaScript as a tag, so "Code" as the category.
            : getQuestions(category); // otherwise make the call with the button text as the category.
        })
    }
};

start();