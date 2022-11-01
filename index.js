// API details
const API_KEY = 'Yi10Tcq5s45Fu9LFkuSlfBEdEgHKk5Bm23h3S5fD';
const TOTAL_QUESTIONS_TO_GET = '10';

// container to print elements to
let container;
// nav-buttons div
let navButtons;

// not used
// let state = {
//     currentQuestion: 0,
//     json: null,
// }

// array to hold scores
let score;

// tracking index of current question
let currentQuestion;

// question data from server
let json;

const showScorePage = () => {

    console.log(score[currentQuestion]);
    console.log(score.length);

    for (let i = 0; i < score.length; i ++) {
        console.log('score:', score[i]);
        console.log('json :', json[i].correct_answers);
    }



    // display the questions and the scores

    // add a restart button
    // clear the json object





    container.innerHTML = `
        <header>
            <h2>Results Breakdown</h2>
            <h3>You got X% correct</h3>
        </header>
        <ol class="answers">
            Question number
            Question
            answers
            add class "wrong"  to selected answer
            add class "corrrect" to correct answer
        </ol>
        <footer class="nav-buttons">
            
        </footer>
    `
    // keeping score
    // have a structure that keeps track of
        // how many questions
        // question number
        // question answer
        // if question is correct or not
        // then at end let the structure build a page and present
            // Total correct out of max questions
            // percentage correct
            // the question
            // the answer
            // if it was correct or not
            // Main Menu button


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
    
    // select all answer elements
    const answersElement = document.getElementsByClassName('answer');

    // remove 'selected' class from answer elements
    for (let answerElement of answersElement) {
        answerElement.classList.remove('selected');
    }

    // add selected class to clicked answer element
    answerElement.classList.add('selected');

    // update scores
    for (let possibleAnswer in score[currentQuestion]) {
        if (possibleAnswer === chosenAnswer) score[currentQuestion][possibleAnswer] = 'true';
        else score[currentQuestion][possibleAnswer] = 'false';
    }
}

// FOR MULTIPLE CHOICE - toggle selected class on answer element
const toggleActiveAnswer = (answerElement, chosenAnswer) => {

    // toggle selected class on clicked answer element
    answerElement.classList.toggle('selected');

    // update scores
    if (score[currentQuestion][chosenAnswer]) {
        score[currentQuestion][chosenAnswer] = 'false';
    } else {
        score[currentQuestion][chosenAnswer] = 'true';
    }
    
}

const printQuestion = () => {
    const numberOfQuestions = json.length; // total number of questions

    // turn off loading screen and display questions
    container.style.justifyContent = 'space-between';
    container.innerHTML = `
        <header>
            <h2>Question ${currentQuestion+1} of ${numberOfQuestions}</h2>
            <h3 class='question-text'>${json[currentQuestion].question}</h3>
        </header>
        <ol class="answers">
            
        </ol>
        <footer class="nav-buttons">

        </footer>
    `

    // Generate answer list items
    const answersList = document.getElementsByClassName('answers')[0]; // select the answers div to add to
    const allAnswers = json[currentQuestion].answers; // stores the answers object from the API (some may be null)

    for (let answer in allAnswers) {
        if (allAnswers[answer] !== null) { // if answer value exists (not null)

            // create answers object to later store player's answers
            if (score[currentQuestion] === undefined) {
                score[currentQuestion] = {[answer]: 'false' };
            } else {
                score[currentQuestion][answer] = 'false';
            }
            
            const answerElement = document.createElement('li'); // create answer list item
            answerElement.textContent = allAnswers[answer]; // add answer text to it
            answerElement.classList.add('answer'); // add answer class to it
            
            // add click listener to answer list item
            answerElement.addEventListener('click', e => {
                if (json[currentQuestion].multiple_correct_answers === 'true') {
                    toggleActiveAnswer(e.currentTarget, answer); // if multiple choice
                    console.log(score[currentQuestion]);
                } else {
                    setActiveAnswer(e.currentTarget, answer); // if not multiple choice
                    console.log(score[currentQuestion]);
                }
            })
            answersList.appendChild(answerElement); // add question to class
        }

    }

    // Adding nav buttons
    navButtons = document.getElementsByClassName('nav-buttons')[0];

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
    
    const url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&limit=${TOTAL_QUESTIONS_TO_GET}&${category}&${tags}`

    const response = await fetch(url);

    if (response.ok) { // if HTTP-status is 200-299
        console.log(`received response ${response.status}`);
        json = await response.json();
        console.log(json);
        console.log(json[currentQuestion].correct_answers);
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


// var button = document.querySelector('button');
// var paragraphs = document.querySelectorAll('p');
// var containerSelecter = document.querySelector('.container p:first-of-type');

// button.addEventListener('click', function () {
//     console.log('click');
//     containerSelecter.style.color = 'red'
//     // for (var p of paragraphs) {
//     //     p.style.color = 'red';
//     // }
// })