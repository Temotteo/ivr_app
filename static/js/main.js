// Initialize question count to ensure each new question has a unique ID
let questionCount = 1;

// Event listener for adding new questions dynamically
document.getElementById('add-question').addEventListener('click', function() {
    questionCount++; // Increment question count for the new question
    const newQuestion = document.createElement('div');
    newQuestion.className = 'form-group';
    newQuestion.id = `question${questionCount}-container`;
    newQuestion.innerHTML = `
        <label for="question${questionCount}">Question ${questionCount}</label>
        <input type="text" class="form-control" id="question${questionCount}" name="questions[]" placeholder="Enter your question">
        <div class="multiple-choice-options" id="options${questionCount}">
            <div class="form-group">
                <label for="option1">Option 1</label>
                <input type="text" class="form-control" name="options${questionCount}[]" placeholder="Enter option 1">
            </div>
        </div>
        <button type="button" class="btn btn-link" onclick="addOption(${questionCount})">Add Option</button>
    `;
    document.getElementById('questions-container').appendChild(newQuestion);
});

// Function to add additional multiple-choice options dynamically for each question
function addOption(questionNumber) {
    const optionsDiv = document.getElementById(`options${questionNumber}`);
    const optionCount = optionsDiv.getElementsByClassName('form-group').length + 1;
    const newOption = document.createElement('div');
    newOption.className = 'form-group';
    newOption.innerHTML = `
        <label for="option${optionCount}">Option ${optionCount}</label>
        <input type="text" class="form-control" name="options${questionNumber}[]" placeholder="Enter option ${optionCount}">
    `;
    optionsDiv.appendChild(newOption);
}

// Event listener for form submission
document.getElementById('survey-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const questions = formData.getAll('questions[]');
    const allOptions = [];
    const organizationId = "your-organization-id"; // Replace with actual organization ID
    const projectId = "your-project-id"; // Replace with actual project ID
    const createdAt = new Date().toISOString(); // Current date and time for created_at

    // Collect options for each question
    questions.forEach((question, index) => {
        const options = formData.getAll(`options${index + 1}[]`);
        allOptions.push(options);
    });

    // Generate the JSON structure for Questions and Options tables
    const questionsTable = questions.map((question, index) => {
        return {
            id: index + 1,
            org_id: organizationId,
            project_id: projectId,
            question_text: question,
            audio_file_url: null,
            created_at: createdAt
        };
    });

    const optionsTable = allOptions.flat().map((option, index) => {
        return {
            id: index + 1,
            question_id: Math.floor(index / allOptions[0].length) + 1,
            option_text: option,
            audio_file_url: null,
            created_at: createdAt
        };
    });

    // Display the JSON data in a preformatted text block
    const surveyData = {
        questions: questionsTable,
        options: optionsTable
    };
    document.getElementById('json-output').textContent = JSON.stringify(surveyData, null, 2);

    // Clear the questions after submission
    document.getElementById('questions-container').innerHTML = '';
    alert('Survey submitted!');
});
