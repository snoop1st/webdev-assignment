function validateForm() {
    // Get form element
    var form = document.getElementById("registrationForm");

    // Check if the form is valid based on HTML5 constraints
    if (!form.checkValidity()) {
        // If not valid, trigger browser's built-in validation messages
        form.reportValidity();
        return false;
    }

    // Perform additional custom validations
    if (!checkCommunicationOptions()) {
        // If communication options check fails, return false to stay on the same page
        return false;
    }

    // If all validations pass, no need to return false here

    // Redirect to the homepage
    window.location.href = "index.html";

    // Allow the default form submission behavior
    return true;
}

function checkCommunicationOptions() {
    var communicationMethods = document.getElementsByName("communicationMethod");
    var selectedMethods = false;

    for (var i = 0; i < communicationMethods.length; i++) {
        if (communicationMethods[i].checked) {
            selectedMethods = true;
            break;
        }
    }

    if (!selectedMethods) {
        alert("Επιλέξτε τουλάχιστον έναν τρόπο επικοινωνίας.");
        return false;
    }

    return true;
}
