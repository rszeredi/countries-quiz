<h1 align="left">
  Countries Quiz   

  <img src="https://raw.githubusercontent.com/rszeredi/countries-quiz/main/public/favicon_io/android-chrome-192x192.png" alt="countries quiz logo" width="40">
</h1>
<div style="margin: 200px;">
  
[🔗 Try out the app here!](https://rszeredi.github.io/countries-quiz)
  
## About this project
I love country trivia and wanted to build an app to allow users to both test their knowledge, as well as practise the lesser-known facts (eg. what's the official currency of Ecuador?). Inspiration is taken from apps that I love: Quizlet and Sporcle!

  ### About the app
  There are 4 categories of quizzes: capital cities, currencies, population, and flags. All have multi-choice style questions, and the first two also feature an option to type your answer.

  Users can choose from two modes:
  
    - Quiz mode: test your knowledge by completing a quiz and see your score at the end
    - Study mode: choose whether you want to study all questions, or focus on the ones you've gotten incorrect in the past
  
## Techonologies Used
This is my very first React app! It uses the following tools:
  - React
    - A mixture of Functional components and Class components (note: this was not a design decision, it was purely for learning)
    - React Hooks 
    - Routing (with react-router-dom)
  - HTML, CSS, Javascript
  - localStorage to store users' progress
  - Material UI for the pop-up dialogs

Data is retrieved from this awesome API: [restcountries](https://restcountries.com/)
  
## Demo
<img src="https://raw.githubusercontent.com/rszeredi/countries-quiz/main/public/app_screenshots/IMG_2145.jpg" width="220px" alt="quiz menu screenshot" />
<img src="https://raw.githubusercontent.com/rszeredi/countries-quiz/main/public/app_screenshots/IMG_2152.jpg" width="220px" alt="progress tracker screenshot" />
<img src="https://raw.githubusercontent.com/rszeredi/countries-quiz/main/public/app_screenshots/IMG_2153.jpg" width="220px" alt="multi-choice example" />
<img src="https://raw.githubusercontent.com/rszeredi/countries-quiz/main/public/app_screenshots/IMG_2149.jpg" width="220px" alt="type your answer example" />
  
## Setup / Installation
  - Download or clone the repository
  - Run `npm install`
  - Run `npm start`
 
