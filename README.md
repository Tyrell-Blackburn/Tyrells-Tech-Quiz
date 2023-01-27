# Quizify

This quiz will test your own knowledge of Javascript, DevOps or Linux - the choice is yours!
Try the quiz out [here](https://tyrellblackburn.com/quiz)

I built this to demonstrate my knowledge of pure HTML, CSS and Typescript.
It leverages the [Quiz API](https://quizapi.io/) for the quiz questions and answers.

## Javascript features used

1. GET requests using using Fetch
2. API error checking - checks response codes and reports an error if an error is not 'ok'.
3. API data refecthing if incomplete - if the data is incomplete and the questions cannot be used, another rquest is automatically made.
4. Questions that contain HTML elements are reformatted with special entities so they display as text and interpreted as elements.
5. String manipulation methods replace and concat
6. for...of loops
7. for...in loops
8. Ternary operators
9. if else statements
10. Click listeners
11. ES6 features (const, let, arrow functions etc)
12. DOM manipulation using 'document' methods

## CSS features used

1. Flexbox
2. @import to import a font from Google Fonts
3. @font-face for use of a locally hosted font
4. Using SVG paths as background images for list items to get perfect alignment.

## Features to add

1. Let the player enter how many questions they want.
2. Add difficulty modes (Easy, Medium, Hard) as supported by Quiz API.
3. Survival mode offering unlimited questions, but each question has a time limit and players have a limited amount of wrong answers before they lose.
4. Survival mode leaderboard for players of survival mode - players who have the longest streak of correct answers can enter their name on the leaderboard. Leaderboard data will be stored on an external database.
5. Add a country flag next to the name of the player on the leaderboard denoting their country (use their IP address to find this out).
