# Quizify

Try the quiz out [here](https://tyrellblackburn.com/quiz)

I built this to demonstrate my knowledge of raw HTML, CSS and Javascript.

You can use it to test your own knowledge of Javascript, DevOps or Linux.
It leverage the [Quiz API](https://quizapi.io/) for the quiz question and answer content.

## Javascript features used

1. GET requests made to an external API using Fetch
2. API error checking - checks response codes and reports an error if a not 'ok' response is returned.
3. API data filtering - if bugged questions are received, another API request is made.
4. Question text filtering so HTML elements in question texts are literally displayed and not interpreted as HTML.
5. String manipulation methods replace and concat
6. for...of loops
7. for...in loops
8. Ternary operators
9. if else statements
10. click listeners
11. ES6 functions
12. DOM manipulation of existing elements using 'document' get methods
13. Creation of DOM elements using createElement

## CSS features used

1. Flexbox
2. @import to import a font from Google Fonts
3. @font-face for use of a locally hosted font
4. SVG paths as background images for list items to get perfect alignment with list items.

## Features to add

1. Let the player enter how many questions they want.
2. Add difficulty modes (Easy, Medium, Hard) for the difficulty of questions (Quiz API supports this).
3. Survival mode offering unlimited questions, but each question has a time limit and player has limited amount of wrong answers before they lose.
4. Survival mode leaderboard for survival players with the most correct answers Leaderboard data will be stored on an external database (POST API calls).
5. Add a country flag next to the name of the player on the leaderboard denoting their country (use their IP address).