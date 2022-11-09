// Color pallete used
// https://paletton.com/#uid=33H0L0k7UUa3cZA5wXlaiQ5cFL3

// JSON example from API
// https://quizapi.io/api/v1/questions?apiKey=Yi10Tcq5s45Fu9LFkuSlfBEdEgHKk5Bm23h3S5fD&limit=15&category=linux

// API details
const API_KEY = 'Yi10Tcq5s45Fu9LFkuSlfBEdEgHKk5Bm23h3S5fD';
const TOTAL_QUESTIONS_TO_GET = '10'; // API supports 20 questions max at one time

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
            <div class="results-title">Results Breakdown</div>
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
    // console.log(score[currentQuestion]);
}

// FOR MULTIPLE CHOICE - toggle selected class on answer element
const toggleActiveAnswer = (answerElement, chosenAnswer) => {

    // toggle selected class on clicked answer element
    answerElement.classList.toggle('selected');

    // toggle answer values between true and false depending on what was clicked
    if (score[currentQuestion][chosenAnswer] === true) {
        score[currentQuestion][chosenAnswer] = false;
    } else {
        score[currentQuestion][chosenAnswer] = true;
    }
    // console.log(score[currentQuestion]);
}

// formats the question so it can display HTML tags without being interpreted and adds (Multiple Choice) to the end of the question if it's a multiple choice question.
const formatQuestionText = (questionText, isMultiple) => {
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
    const isMultipleChoice = json[currentQuestion].multiple_correct_answers; // stores if it's a multiple choice question or not

    // style container for quiz
    container.style.justifyContent = 'space-between';
    
    // formatting the question text
    const questionText = formatQuestionText(json[currentQuestion].question, json[currentQuestion].multiple_correct_answers);

    // turn off loading screen and display questions
    container.innerHTML = `
        <header>
            <h2 class="question-counter">Question ${currentQuestion+1} of ${numberOfQuestions}</h2>
            <h3 class='question-text'>${questionText}</h3>
        </header>
        <ol class="answers">
            
        </ol>
        <footer class="nav-buttons">

        </footer>
    `
    // Get the answers container
    const answersContainer = document.getElementsByClassName('answers')[0];
    
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

    Object.keys(jsonAnswers).forEach(answer_x => {
        if (jsonAnswers[answer_x]) { // if an answer value exists - ignores null value keys from API response

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
            answerElement.classList.add('selectable'); // add answer class to it

            // add selected class if previously selected
            if (score[currentQuestion][answer_x] === true) {
                answerElement.classList.add('selected');
            }
            
            // add click listener to it
            answerElement.addEventListener('click', e => {
                if (isMultipleChoice === 'true') { // if multiple choice
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
    // only add next button if player has not reached the last question
    if (currentQuestion < numberOfQuestions - 1) navButtons.appendChild(nextButton); 

    // Add nav button listeners
    for (const button of navButtons.children) {

        // if prev button 
        if (button.className === 'prev-btn') {
            button.addEventListener('click', () => {
                currentQuestion --;
                printQuestion(); // then go back
            });
        }

        if (button.className === 'next-btn') {
            button.addEventListener('click', () => {
                const isEnough = isEnoughAnswersSelected(isMultipleChoice);
                if (isEnough) {
                    currentQuestion ++;
                    printQuestion(); // then go back
                } else alert('Select more answers before continuing');
            });
        }
    }

    // create finish button if at the end of quiz
    if (currentQuestion === numberOfQuestions - 1) {
        const finishButton = document.createElement('button');
        finishButton.textContent = 'Finish';
        finishButton.style.fontWeight = 'bold';
        finishButton.classList.add('finish-btn');
        finishButton.addEventListener('click', () => {
            const isEnough = isEnoughAnswersSelected(isMultipleChoice);
            if (isEnough) showScorePage(); // then go back
            else alert('Select more answers before continuing');
        });
        navButtons.appendChild(finishButton);
    }
}

// decides if enough answers are selected to continue to the next page
const isEnoughAnswersSelected = isMultipleChoice => {

    // counter for number of selected answers
    let selectedAnswers = 0;

    // count selected answers
    for (let selected in score[currentQuestion]) {
        if (score[currentQuestion][selected]) selectedAnswers ++;
    }

    if (isMultipleChoice === 'true') { // multiple choice
        if (selectedAnswers >= 2)  { // if at least two answers are selected
            return true; // then enough answers selected
        } else {
            return false; // otherwise not enough answers selected
        }
    } else { // single choice
        if (selectedAnswers === 1)  { // if an answer is selected
            return true; // then that's enough
        } else {
            return false; // otherwise no answers are selected and not enough
        }
    }
}

const getQuestions = async (category, tags ='') => {
    
    const url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&limit=${TOTAL_QUESTIONS_TO_GET}&category=${category}&tags=${tags}`

    // Display loading screen just before API CALL
    container.innerHTML = `<div>Loading</div>`;
    container.style.justifyContent = 'center';
    
    const response = await fetch(url);

    if (response.ok) { // if HTTP-status is 200-299
        
        console.log(`received response ${response.status}`);
        json = await response.json();
        // console.log(json);

        // FILTERING QUESTIONS - checking to see if any are bugged and if so, requesting new ones.
        let questionsBugged = false; // flags if a question is bugged

        for (let i = 0; i < json.length; i++) {
            let answers = 0; // counts the amount of possible 'true' answers
            // checking multiple-choice questions
            if (json[i].multiple_correct_answers === 'true') {

                // counts how many 'true' answers are in the multiple-choice question
                for (let answer in json[i].correct_answers) {
                    if (json[i].correct_answers[answer] === 'true') answers ++;
                }
                // if a multiple-choice question has less than 2 'true' answers, then it is bugged and a new set of questions will be fetched.
                if (answers < 2) {
                    questionsBugged = true;
                    console.log(`multiple-choice question ${i} is bugged with ${answers} 'true' answers`)
                    break;
                }
            } else {
                // checking single-choice questions.
                // must have only one choice in 'correct_answers'
                // counts how many 'true' answers are in the single-choice question
                for (let answer in json[i].correct_answers) {
                    if (json[i].correct_answers[answer] === 'true') answers ++;
                }
                // if a single-choice question has more or less than 1 'true' answer, then it is bugged and a new set of questions will be fetched.
                if (answers !== 1) {
                    questionsBugged = true;
                    console.log(`single-choice question ${i} is bugged with ${answers} 'true' answers`);
                    break;
                }
                // if not, then must have a single choice in 'correct_answer'
            }
            answers = 0; // reset answers variable for next question
        }
        
        if (questionsBugged) {
            console.log('fetching another set of questions');
            getQuestions(category, tags);
        } 

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
    container.style.justifyContent = 'space-between';

    container.innerHTML = `
        <header class="main-page-header">
            <div class="title">
                <span style="color:#FF0000">Q</span>
                <span style="color:#66CC66">u</span>
                <span style="color:#FF0066">i</span>
                <span style="color:#FF99CC">z</span>
                <span style="color:#FF9966">i</span>
                <span style="color:#66CC66">f</span>
                <span style="color:#FF0000">y</span>
            </div>
            <h2 class="sub-title">Test your tech prowess</h2>
        </header>
        <div class="category-container">
            <h3 class="choose-category">Choose a category</h3>
            <button class="category-button">JavaScript</button>
            <button class="category-button">DevOps</button>
            <button class="category-button">Linux</button>
        </div>
        <footer class="credits">
            <div>Created by <a href="https://tyrellblackburn.com" target="_blank" rel="noopener noreferrer">Tyrell Blackburn</a></div>
            <div>Powered by <a href="https://quizapi.io" target="_blank" rel="noopener noreferrer">Quiz API</a></div>
        </footer>
    `

    // Get all category buttons
    const categoryButtons = document.getElementsByClassName('category-button');
    
    // add event listeners to the category buttons
    for (let categoryButton of categoryButtons) {
        categoryButton.addEventListener('click', e => {        
            // Get questions from API
            const category = e.target.textContent; // get the text of the button and assign it to category.
            category === "JavaScript" // if category is Javascript.
            ? getQuestions('Code', category) // Make the API call with JavaScript as a tag, so "Code" as the category.
            : getQuestions(category); // otherwise make the call with the button text as the category.
        })
    }
};

start();