let questionsIndex = 0;

const getQuestions = async (category, tags ='') => {
    
    console.log('getquestions')
    const apiKey = 'Yi10Tcq5s45Fu9LFkuSlfBEdEgHKk5Bm23h3S5fD';
    const limit = '10';
    const url = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=${limit}&category=${category}&tags=${tags}`
    const response = await fetch(url);
    
    if (response.status === 200) { // If status OK
        console.log(`received response ${response.status}`);
        console.log(response.length);
        printQuestion(response) // then print questions
    } else {
        console.log(`An error ${response.status} occured.`);
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = `<div>An error ${response.status} occured :(</div>`
    }
};

const printQuestion = (data) => {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = `
        <div>
            <h2>Question ${1} of ${10}</h2>
            <h3>${'question text'}}</h3>
        </div>
        <div>
            Questions
        </div>
        <div class="nav-buttons">
            <button class ="" id="prevButton">Prev</button>
            <button class ="" id="nextButton">Next</button>
        </div>
    `

    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    // var buttons = document.getElementsByTagName("button");
    
    prevButton.addEventListener('click', e => {
        questionsIndex --;
        console.log(questionsIndex)
        // e.target.textContent === 'Prev' ? questionsIndex -- : questionsIndex ++;
        // console.log(questionsIndex)
    });
    
    nextButton.addEventListener('click', e => {
        questionsIndex ++;
        console.log(questionsIndex);
    });



    // for (let i = 0; i < response.body.length; i ++) {
    //     const element = document.createElement('p'); // create element
    //     element.textContent = response.body[i]; // populate element with response data
    //     element.classList.add('question'); // add a class to the element
    //     element.style.color = 'orange';
    //     container.appendChild(element); // add element to class
    // }    
}

const initialiseCategoryButtons = () => {
    // Get category buttons
    const categoryButtons = document.getElementsByClassName('category-button');
    // add event listeners to the category buttons
    for (let categoryButton of categoryButtons) {
        categoryButton.addEventListener('click', e => {
            let data;
            
            // Display loading animation just before API CALL
            
            const category = e.target.textContent; // get the text of the button
            category === "JavaScript" // make the API call to get the questions
            ? data = getQuestions('Code', category) // JavaScript is a tag, so "Code" must be hardcoded as a category and JavaScript entered as a tag
            : data = getQuestions(category);
            // after the info is retrieved, print a new page
        })
    }
};

const printMainMenu = () => {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = `
        <!-- create an inner container for the menu text and questions and answers -->
        <!-- This will have its inner HTML replaced based on state of the game -->
        <div>
            <h1 class="title">Welcome to Quizify</h1>
            <h3>Choose your category</h3>
        </div>
        <div class="category-container">
            <button class="category-button">JavaScript</button>
            <button class="category-button">DevOps</button>
            <button class="category-button">Linux</button>
        </div>
    `
    initialiseCategoryButtons();
}

printMainMenu();







// add event listeners to next and previous buttons

// get the nav div
// add a single event listener to the buttons inside the nav based on their name with a for loop




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