/*
    IT 3203 Milestone 3: External JavaScript for Quiz
    Author: Davin Johnson
    Description: Contains all functions for quiz grading, displaying results, and resetting the form.
*/

        // 1. Define Correct Answers 
        // We store the correct answers in an object for easy checking.
        const correctAnswers = {
            q1: 'client', // Answer for question 1
            q2: 'b',      // Answer for question 2 (CSS)
            q3: 'c',      // Answer for question 3 (Mosaic)
            q4: 'b',      // Answer for question 4 (HTML)
            q5: ['a', 'b', 'd'] // An array for the multi-select question 5 (Gecko, Trident, WebKit)
        };
        const totalQuestions = 5;

        // 2. Grade Quiz Function
        function gradeQuiz() {
            let score = 0;
            const form = document.getElementById('quiz-form');
            const detailedResults = document.getElementById('detailed-results');
            const scoreSummary = document.getElementById('score-summary');
            
            detailedResults.innerHTML = '';
            
            // Disable the submit button so the user can't resubmit
            form.querySelector('button[onclick="gradeQuiz()"]').disabled = true;

            //  Check Q1: Fill-in-the-Blank
            const q1UserAnswer = form.elements['q1'].value.trim().toLowerCase();
            let q1IsCorrect = (q1UserAnswer === correctAnswers.q1);
            if (q1IsCorrect) {
                score++;
            }
            displayResult('q1', q1IsCorrect, `Correct Answer: ${correctAnswers.q1}`);

            // Check Q2, Q3, Q4: Multiple Choice (Radio) 
            for (let i = 2; i <= 4; i++) {
                const qName = 'q' + i;
                const qUserAnswer = form.elements[qName].value; 
                
                let qIsCorrect = (qUserAnswer === correctAnswers[qName]);
                if (qIsCorrect) {
                    score++;
                }

                const correctOptionId = qName + correctAnswers[qName];
                const correctAnswerLabel = document.querySelector(`label[for="${correctOptionId}"]`).textContent;
                
                displayResult(qName, qIsCorrect, `Correct Answer: ${correctAnswerLabel}`);
            }

            // Check Q5: Multi-Selection (Checkbox) 
            const q5Checkboxes = form.elements['q5'];
            let q5UserAnswers = [];
            q5Checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    q5UserAnswers.push(checkbox.value);
                }
            });

            // Check if user answers match the correct answers array exactly
            let q5IsCorrect = (q5UserAnswers.length === correctAnswers.q5.length) &&
                                correctAnswers.q5.every(function(val) {
                                    return q5UserAnswers.includes(val);
                                });
            if (q5IsCorrect) {
                score++;
            }

            // Get the text of all correct answers to show the user
            const q5CorrectLabels = correctAnswers.q5.map(function(val) {
                return document.querySelector(`label[for="q5${val}"]`).textContent;
            }).join(', ');

            displayResult('q5', q5IsCorrect, `Correct Answers: ${q5CorrectLabels}`);

            // Display Final Summary
            const percentage = (score / totalQuestions) * 100;
            const passStatus = (percentage >= 60) ? 'PASS' : 'FAIL'; 
            const passFailClass = (percentage >= 60) ? 'pass' : 'fail';
            
            // REQUIRED: Show Pass/Fail and Total Score
            scoreSummary.innerHTML = `
                <div class="${passFailClass}">Overall Result: ${passStatus}</div>
                <p>Total Score: <b>${score} / ${totalQuestions}</b> (${percentage.toFixed(0)}%)</p>
            `;

            // Finally, make the results div visible
            document.getElementById('results').style.display = 'block';
        }

        // 3. Display Result Helper Function 
        function displayResult(qID, isCorrect, correctAnswerText) {
            const statusText = isCorrect ? 'Correct' : 'Incorrect';
            const statusClass = isCorrect ? 'correct' : 'incorrect';
            
            const feedbackElement = document.querySelector(`#${qID} .feedback`);
            const questionText = document.querySelector(`#${qID} > p`).textContent;

            // Show result (correct or incorrect) for each question (under the question)
            feedbackElement.innerHTML = `
                Status: <span class="${statusClass}">${statusText}</span>
            `;
            
            // Show result and answer for each question (in the results box)
            const detailedResults = document.getElementById('detailed-results');
            const detailedEntry = document.createElement('p');
            
            let entryText = `
                <b>Q${qID.slice(1)}:</b> ${questionText} <br>
                Result: <span class="${statusClass}">${statusText}</span> 
            `;
            
            if (!isCorrect) {
                entryText += ` | ${correctAnswerText}`;
            }

            detailedEntry.innerHTML = entryText;
            detailedResults.appendChild(detailedEntry);
        }

        // 4. Reset Quiz Function
        function resetQuiz() {
            // Clear all user inputs
            document.getElementById('quiz-form').reset();
            
            // Clear all results on the page
            document.getElementById('results').style.display = 'none';
            document.getElementById('detailed-results').innerHTML = '';
            document.getElementById('score-summary').innerHTML = '';
            
            // Re-enable the submit button
            document.getElementById('quiz-form').querySelector('button[onclick="gradeQuiz()"]').disabled = false;
            
            // Clear all the "Correct/Incorrect" feedback messages under each question
            const allFeedback = document.querySelectorAll('.feedback');
            allFeedback.forEach(function(feedbackBox) {
                feedbackBox.innerHTML = '';
            });
        }