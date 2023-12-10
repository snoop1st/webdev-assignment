// Function to show subcategories based on the selected advertisement type
function showSubcategories() {
    var adType = document.getElementById("adType");
    var subcategoryDropdown = document.getElementById("subcategoryDropdown");
    var subcategory = document.getElementById("subcategory");

    // Clear previous options in the subcategory dropdown
    subcategory.innerHTML = "";

    // Check if the selected advertisement type is "Ακίνητα" (Properties)
    if (adType.value === "Ακίνητα") {
        // If yes, display the subcategory dropdown
        subcategoryDropdown.style.display = "block";

        // Define options for property subcategories
        var options = ["Ενοικιάσεις κατοικιών", "Ενοικιάσεις επαγγελματικών χώρων", "Ενοικιάσεις parking"];

        // Add the elements of options to the subcategory dropdown
        for (var i = 0; i < options.length; i++) {
            var option = document.createElement("option");
            option.text = options[i];
            subcategory.add(option);
        }
    } else if (adType.value === "Οχήματα") {
        // If the selected type is "Οχήματα" (Vehicles), display the subcategory dropdown
        subcategoryDropdown.style.display = "block";

        // Define options for vehicle subcategories
        var options = ["Ενοικιάσεις αυτοκινήτων", "Ενοικιάσεις σκαφών", "Ενοικιάσεις επαγγελματικών οχημάτων"];

        // Add the elements of options to the subcategory dropdown
        for (var i = 0; i < options.length; i++) {
            var option = document.createElement("option");
            option.text = options[i];
            subcategory.add(option);
        }
    } else {
        // If the selected type is neither "Ακίνητα" nor "Οχήματα", hide the subcategory dropdown
        subcategoryDropdown.style.display = "none";
    }
}
