// List of sample street names and building names
const streetNames = [
    "Main St",
    "Elm St",
    "Oak St",
    "Maple Ave",
    "Cedar Ln",
    "Pine Rd",
    "Birch Dr",
    "Willow Way",
    "Spruce Ct",
    "Cypress Blvd",
    "Sycamore Ln",
    "Magnolia Dr",
    "Chestnut St",
    "Juniper Rd",
    "Holly Ct",
    "Acacia Ave",
    "Redwood Rd",
    "Hickory Ln",
    "Palm Blvd",
    "Beech Ave",
  ];
  
  const buildingNames = [
    "Sunrise Apartments",
    "Pinecrest House",
    "Meadow View Residences",
    "Parkside Suites",
    "Lakeview Tower",
    "City Center Condos",
    "Harborview Place",
    "Hillside Manor",
    "Riverfront Lofts",
    "Mountainview Estates",
  ];
  
  // Function to generate a random element from an array
  function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  
  // Function to generate a random street address
  function generateRandomStreetAddress() {
    const streetName = getRandomElement(streetNames);
    const buildingName = getRandomElement(buildingNames);
    const streetNumber = Math.floor(Math.random() * 1000) + 1; // Random street number between 1 and 1000
    const direction = ["North", "South", "East", "West"][Math.floor(Math.random() * 4)]; // Random direction
  
    const address = `${streetNumber} ${streetName}, ${direction}, ${buildingName}`;
    return address;
  }
  


  // List of sample first names
const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Emily",
    "David",
    "Sarah",
    "Robert",
    "Ava",
    "William",
    "Olivia",
    "James",
    "Emma",
    "Joseph",
    "Sophia",
    "Daniel",
    "Mia",
    "Matthew",
    "Isabella",
    "Ethan",
    "Grace",
    "Andrew",
    "Liam",
    "Chloe",
    "Nathan",
    "Ella",
    "Benjamin",
    "Lucas",
    "Avery",
    "Lily",
    "Jacob",
    "Charlotte",
    "Logan",
    "Zoe",
    "Samuel",
    "Madison",
  ];
  
  // List of sample last names
  const lastNames = [
    "Smith",
    "Johnson",
    "Brown",
    "Jones",
    "Davis",
    "Lee",
    "Wilson",
    "Evans",
    "Lopez",
    "Hall",
    "Clark",
    "Lewis",
    "Harris",
    "Young",
    "Walker",
    "Perez",
    "Lewis",
    "Turner",
    "White",
  ];
  
  // Function to generate a random element from an array
  function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  
  // Function to generate a random name with a possibility of a hyphen and last name
  function generateRandomName() {
    const firstName = getRandomElement(firstNames);
    const shouldHaveHyphen = Math.random() < 0.3; // Adjust the probability as needed
  
    let fullName;
    if (shouldHaveHyphen) {
      const lastName = getRandomElement(lastNames);
      fullName = `${firstName}-${lastName}`;
    } else {
      fullName = firstName;
    }
  
    return fullName;
  }
  
  // Generate and print a random name


  
  // Export the generateRandomStreetAddress function
  module.exports = {generateRandomStreetAddress, generateRandomName};
  