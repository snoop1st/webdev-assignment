// Function to toggle the visibility of job field when status is set to "Εργαζόμενος"
function toggleJobField() {
    // Get the status dropdown element
    var status = document.getElementById("status");
    
    // Get the label for the job field
    var jobLabel = document.getElementById("jobLabel");
    
    // Get the job input field
    var job = document.getElementById("job");

    // Check if the selected status is "Εργαζόμενος"
    if (status.value === "Εργαζόμενος") {
        // If yes, display the job label and job input field
        jobLabel.style.display = "block";
        job.style.display = "block";
    } else {
        // If not, hide the job label and job input field
        jobLabel.style.display = "none";
        job.style.display = "none";
    }
}
